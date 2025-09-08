import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createEmailTemplate } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND)

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json()

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email e messaggio sono obbligatori' },
        { status: 400 }
      )
    }

    // Valida formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      )
    }

    // Crea il template email per la richiesta
    const emailHtml = createEmailTemplate({
      title: 'Nuova richiesta da LarinAI',
      content: `
        <div style="text-align: left; background-color: #1f2937; border: 2px solid #00D9AA; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #00D9AA; margin-bottom: 15px;">Dettagli della richiesta:</h3>
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffffff;">Email mittente:</strong>
            <div style="color: #ffffff; margin-top: 5px;">${email}</div>
          </div>
          <div>
            <strong style="color: #ffffff;">Messaggio:</strong>
            <div style="color: #ffffff; margin-top: 5px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
          Questa richiesta è stata inviata tramite il form di contatto su larinai.it
        </p>
      `
    })

    // Invia l'email a paolo@larin.it
    const data = await resend.emails.send({
      from: 'LarinAI <noreply@larinai.it>',
      to: ['paolo@larin.it'],
      subject: `LarinAI - nuova richiesta da ${email}`,
      html: emailHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Richiesta inviata con successo!' 
    })
  } catch (error) {
    console.error('Errore invio richiesta:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'invio della richiesta. Riprova più tardi.' },
      { status: 500 }
    )
  }
}
