import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

// Configura Stripe in base all'ambiente
const isStaging = process.env.STAGING === 'true'
const stripeSecretKey = isStaging 
  ? process.env.STRIPE_SECRET_KEY_TEST 
  : process.env.STRIPE_SECRET_KEY_LIVE

if (!stripeSecretKey) {
  throw new Error(`Missing Stripe secret key for ${isStaging ? 'test' : 'live'} environment`)
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    // Ottieni webhook secret in base all'ambiente
    const webhookSecret = isStaging
      ? process.env.STRIPE_WEBHOOK_SECRET_TEST
      : process.env.STRIPE_WEBHOOK_SECRET_LIVE

    let event: Stripe.Event

    try {
      if (!webhookSecret) {
        console.error('❌ Webhook secret not configured')
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        )
      }
      
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    console.log('✅ Stripe webhook event received:', {
      type: event.type,
      id: event.id,
      created: event.created
    })

    const supabase = await createSupabaseServerClientMutable()

    // Gestisci gli eventi
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break
      
      default:
        console.log(`🔄 Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient
) {
  try {
    console.log('🔄 Processing checkout.session.completed:', session.id)

    const userId = session.metadata?.user_id
    const paymentType = session.metadata?.payment_type
    const credits = session.metadata?.credits

    if (!userId) {
      console.error('❌ Missing user_id in session metadata')
      return
    }

    if (!paymentType || !credits) {
      console.error('❌ Missing payment_type or credits in session metadata')
      return
    }

    const amount = parseFloat(credits)

    if (paymentType === 'one-time') {
      // Pagamento una tantum - crea solo pay_transactions
      await createPaymentTransaction({
        supabase,
        userId,
        amount,
        stripeId: session.id,
        paymentIntentId: session.payment_intent as string,
        sessionMetadata: session.metadata,
        subscriptionId: null,
        specificLfunctionId: null
      })

      console.log('✅ One-time payment processed successfully')

    } else if (paymentType === 'subscription') {
      // Abbonamento - gestisci subscription e transaction
      const subscriptionId = session.subscription as string
      
      if (!subscriptionId) {
        console.error('❌ Missing subscription ID for subscription payment')
        return
      }

      // Verifica se la subscription esiste già
      const { data: existingSubscription } = await supabase
        .from('pay_subscription')
        .select('id')
        .eq('stripe_id', subscriptionId)
        .single()

      let subscriptionDbId: string

      if (!existingSubscription) {
        // Crea nuova subscription
        const { data: newSubscription, error: subscriptionError } = await supabase
          .from('pay_subscription')
          .insert({
            user_id: userId,
            stripe_id: subscriptionId,
            status: 'active',
            body: {
              session_id: session.id,
              customer_id: session.customer,
              amount: amount,
              currency: 'eur',
              metadata: session.metadata
            }
          })
          .select('id')
          .single()

        if (subscriptionError) {
          console.error('❌ Error creating subscription:', subscriptionError)
          throw subscriptionError
        }

        subscriptionDbId = newSubscription.id
        console.log('✅ New subscription created:', subscriptionDbId)
      } else {
        subscriptionDbId = existingSubscription.id
        console.log('✅ Using existing subscription:', subscriptionDbId)
      }

      // Crea sempre una transaction collegata alla subscription
      await createPaymentTransaction({
        supabase,
        userId,
        amount,
        stripeId: session.id,
        paymentIntentId: session.payment_intent as string,
        sessionMetadata: session.metadata,
        subscriptionId: subscriptionDbId,
        specificLfunctionId: null
      })

      console.log('✅ Subscription payment processed successfully')
    }

  } catch (error) {
    console.error('❌ Error handling checkout.session.completed:', error)
    throw error
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: SupabaseClient
) {
  try {
    console.log('🔄 Processing invoice.payment_succeeded:', invoice.id)

    // Accesso sicuro alla proprietà subscription
    const invoiceData = invoice as Stripe.Invoice & { subscription?: string; payment_intent?: string }
    const subscriptionId = invoiceData.subscription || null
    
    if (!subscriptionId) {
      console.log('⚠️ No subscription ID in invoice, skipping')
      return
    }

    // Trova la subscription nel database
    const { data: subscription, error: subscriptionError } = await supabase
      .from('pay_subscription')
      .select('id, user_id')
      .eq('stripe_id', subscriptionId)
      .single()

    if (subscriptionError || !subscription) {
      console.error('❌ Subscription not found:', subscriptionId)
      return
    }

    if (!subscription.user_id) {
      console.error('❌ Missing user_id in subscription:', subscriptionId)
      return
    }

    // Calcola l'importo dall'invoice
    const amount = invoice.amount_paid / 100 // Converti da centesimi a euro

    // Crea transaction per il pagamento ricorrente
    await createPaymentTransaction({
      supabase,
      userId: subscription.user_id as string,
      amount,
      stripeId: invoice.id!,
      paymentIntentId: invoiceData.payment_intent || null,
      sessionMetadata: null,
      subscriptionId: subscription.id,
      specificLfunctionId: null
    })

    console.log('✅ Recurring payment processed successfully')

  } catch (error) {
    console.error('❌ Error handling invoice.payment_succeeded:', error)
    throw error
  }
}

interface CreatePaymentTransactionParams {
  supabase: SupabaseClient
  userId: string
  amount: number
  stripeId: string
  paymentIntentId: string | null
  sessionMetadata: Record<string, string> | null
  subscriptionId: string | null
  specificLfunctionId: number | null
}

async function createPaymentTransaction({
  supabase,
  userId,
  amount,
  stripeId,
  paymentIntentId,
  sessionMetadata,
  subscriptionId,
  specificLfunctionId
}: CreatePaymentTransactionParams) {
  try {
    const transactionData = {
      user_id: userId,
      amount_in_eur: amount,
      stripe_id: stripeId,
      subscription_id: subscriptionId,
      specific_lfunction_id: specificLfunctionId,
      body: {
        payment_intent_id: paymentIntentId,
        processed_at: new Date().toISOString(),
        metadata: sessionMetadata
      }
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('pay_transactions')
      .insert(transactionData)
      .select('id')
      .single()

    if (transactionError) {
      console.error('❌ Error creating transaction:', transactionError)
      throw transactionError
    }

    console.log('✅ Transaction created:', transaction.id)
    return transaction

  } catch (error) {
    console.error('❌ Error in createPaymentTransaction:', error)
    throw error
  }
}
