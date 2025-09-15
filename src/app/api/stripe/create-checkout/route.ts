import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import Stripe from 'stripe'

// Configura Stripe in base all'ambiente
// Usa STAGING=true per ambiente di test, altrimenti produzione
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
    // Debug log per verificare l'ambiente
    console.log('🔍 Stripe Environment Check:', {
      NODE_ENV: process.env.NODE_ENV,
      STAGING: process.env.STAGING,
      isStaging: isStaging,
      usingTestKeys: isStaging
    })

    const { amount, paymentType, billingInfo } = await request.json()

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Importo minimo €10' },
        { status: 400 }
      )
    }

    if (!paymentType || !['subscription', 'one-time'].includes(paymentType)) {
      return NextResponse.json(
        { error: 'Tipo di pagamento non valido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()

    // Verifica l'utente corrente
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utente non autenticato' },
        { status: 401 }
      )
    }

    // URL di successo e cancellazione
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/manage/profile?payment=success`
    const cancelUrl = `${baseUrl}/manage/profile?payment=cancelled`

    let sessionConfig: Stripe.Checkout.SessionCreateParams

    if (paymentType === 'subscription') {
      // Crea o recupera un prodotto per l'abbonamento
      const product = await stripe.products.create({
        name: `LarinAI - Abbonamento ${amount}€/mese`,
        description: `Abbonamento mensile LarinAI con ${amount} crediti al mese`,
        metadata: {
          type: 'subscription',
          credits: amount.toString(),
        }
      })

      // Crea il prezzo per l'abbonamento
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(amount * 100), // Converti in centesimi
        currency: 'eur',
        recurring: {
          interval: 'month',
        },
        metadata: {
          credits: amount.toString(),
        }
      })

      sessionConfig = {
        mode: 'subscription',
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        customer_email: user.email || undefined,
        metadata: {
          user_id: user.id,
          payment_type: 'subscription',
          credits: amount.toString(),
          // Dati di fatturazione dal form
          billing_tipo: billingInfo?.tipo || '',
          billing_nome: billingInfo?.nome || '',
          billing_cognome: billingInfo?.cognome || '',
          billing_ragione_sociale: billingInfo?.ragioneSociale || '',
          billing_codice_fiscale: billingInfo?.codiceFiscale || '',
          billing_partita_iva: billingInfo?.partitaIva || '',
          billing_via: billingInfo?.via || '',
          billing_numero_civico: billingInfo?.numeroCivico || '',
          billing_cap: billingInfo?.cap || '',
          billing_provincia: billingInfo?.provincia || '',
          billing_stato: billingInfo?.stato || '',
        },
        subscription_data: {
          metadata: {
            user_id: user.id,
            credits: amount.toString(),
          },
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      }
    } else {
      // Pagamento una tantum
      sessionConfig = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `LarinAI - Ricarica Crediti`,
                description: `Ricarica di ${amount} crediti LarinAI`,
                metadata: {
                  type: 'one-time',
                  credits: amount.toString(),
                }
              },
              unit_amount: Math.round(amount * 100), // Converti in centesimi
            },
            quantity: 1,
          },
        ],
        customer_creation: 'always',
        customer_email: user.email || undefined,
        metadata: {
          user_id: user.id,
          payment_type: 'one-time',
          credits: amount.toString(),
          // Dati di fatturazione dal form
          billing_tipo: billingInfo?.tipo || '',
          billing_nome: billingInfo?.nome || '',
          billing_cognome: billingInfo?.cognome || '',
          billing_ragione_sociale: billingInfo?.ragioneSociale || '',
          billing_codice_fiscale: billingInfo?.codiceFiscale || '',
          billing_partita_iva: billingInfo?.partitaIva || '',
          billing_via: billingInfo?.via || '',
          billing_numero_civico: billingInfo?.numeroCivico || '',
          billing_cap: billingInfo?.cap || '',
          billing_provincia: billingInfo?.provincia || '',
          billing_stato: billingInfo?.stato || '',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      }
    }

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Errore nella creazione della sessione Stripe:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}