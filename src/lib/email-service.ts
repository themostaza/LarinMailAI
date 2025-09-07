import { 
  createVerificationEmailTemplate, 
  createPasswordResetEmailTemplate, 
  createWelcomeEmailTemplate,
  createEmailTemplate 
} from './email-templates'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    // Determina l'URL base per le chiamate server-side
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://larin-mail-ai.vercel.app' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, from }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Funzioni helper per tipi specifici di email
export async function sendVerificationEmail(to: string, verificationUrl: string) {
  const html = createVerificationEmailTemplate(verificationUrl)
  
  return sendEmail({
    to,
    subject: 'Verifica il tuo account LarinAI',
    html
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = createPasswordResetEmailTemplate(resetUrl)
  
  return sendEmail({
    to,
    subject: 'Reimposta la password - LarinAI',
    html
  })
}

export async function sendWelcomeEmail(to: string) {
  const html = createWelcomeEmailTemplate()
  
  return sendEmail({
    to,
    subject: 'Benvenuto in LarinAI!',
    html
  })
}

// Funzione per inviare email personalizzate
export async function sendCustomEmail(
  to: string | string[], 
  subject: string, 
  title: string, 
  content: string, 
  buttonText?: string, 
  buttonUrl?: string
) {
  const html = createEmailTemplate({ title, content, buttonText, buttonUrl })
  
  return sendEmail({
    to,
    subject,
    html
  })
}
