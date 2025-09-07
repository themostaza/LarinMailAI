import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND)

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from = 'LarinAI <noreply@larinai.it>' } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
