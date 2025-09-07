interface EmailTemplateProps {
  title: string
  content: string
  buttonText?: string
  buttonUrl?: string
}

export function createEmailTemplate({ title, content, buttonText, buttonUrl }: EmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background-color: #000000;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000000;
      padding: 0;
    }
    
    .header {
      text-align: center;
      padding: 40px 20px 20px;
      border-bottom: 1px solid #1f2937;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10px;
    }
    
    .logo .accent {
      color: #00D9AA;
    }
    
    .content {
      padding: 40px 20px;
      text-align: center;
    }
    
    .content h1 {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 20px;
    }
    
    .content p {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .button {
      display: inline-block;
      background-color: #00D9AA;
      color: #000000;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.2s;
    }
    
    .button:hover {
      background-color: #00c497;
    }
    
    .divider {
      height: 1px;
      background-color: #1f2937;
      margin: 40px 0;
    }
    
    .footer {
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #1f2937;
      background-color: #111111;
    }
    
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .footer-brand {
      font-size: 12px;
      color: #4b5563;
      font-weight: 500;
    }
    
    .footer-brand .brand-name {
      color: #00D9AA;
      font-weight: 600;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .header, .content, .footer {
        padding-left: 15px !important;
        padding-right: 15px !important;
      }
      
      .logo {
        font-size: 24px;
      }
      
      .content h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        Larin<span class="accent">AI</span>
      </div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h1>${title}</h1>
      <div>${content}</div>
      
      ${buttonText && buttonUrl ? `
        <a href="${buttonUrl}" class="button" style="color: #000000; text-decoration: none;">
          ${buttonText}
        </a>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        Grazie per aver scelto LarinAI
      </div>
      <div class="footer-brand">
        <span class="brand-name">LarinAI</span> è un brand di © Larin Srl – P.iva 01144900253
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Template specifico per la verifica email
export function createVerificationEmailTemplate(verificationUrl: string): string {
  return createEmailTemplate({
    title: 'Verifica il tuo account',
    content: `
      <p>Benvenuto in LarinAI!</p>
      <p>Per completare la registrazione e iniziare a utilizzare i nostri strumenti di intelligenza artificiale, clicca sul pulsante qui sotto per verificare il tuo indirizzo email.</p>
      <p>Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
    `,
    buttonText: 'Verifica Account',
    buttonUrl: verificationUrl
  })
}

// Template per reset password
export function createPasswordResetEmailTemplate(resetUrl: string): string {
  return createEmailTemplate({
    title: 'Reimposta la tua password',
    content: `
      <p>Hai richiesto di reimpostare la password del tuo account LarinAI.</p>
      <p>Clicca sul pulsante qui sotto per creare una nuova password. Questo link è valido per 24 ore.</p>
      <p>Se non hai richiesto questa operazione, puoi ignorare questa email.</p>
    `,
    buttonText: 'Reimposta Password',
    buttonUrl: resetUrl
  })
}

// Template generico di benvenuto
export function createWelcomeEmailTemplate(): string {
  return createEmailTemplate({
    title: 'Benvenuto in LarinAI!',
    content: `
      <p>Il tuo account è stato verificato con successo!</p>
      <p>Ora puoi accedere alla piattaforma e iniziare a utilizzare i nostri strumenti di intelligenza artificiale per automatizzare i tuoi processi di lavoro.</p>
      <p>Esplora le funzionalità disponibili e scopri come LarinAI può migliorare la tua produttività.</p>
    `,
    buttonText: 'Accedi alla Piattaforma',
    buttonUrl: process.env.NEXT_PUBLIC_APP_URL + '/login'
  })
}
