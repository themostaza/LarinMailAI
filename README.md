# MailAI

Un software che esegue una cosa semplice quanto rivoluzionaria: un modulo per la gestione delle email con l'AI.

## Descrizione

MailAI funziona con Gmail e Outlook inizialmente. Non funziona real-time ma impostando delle regole per l'AI nella manipolazione delle mail. Il sistema è scalabile nelle funzionalità nel senso che potranno essere aggiunte azioni da richiedere all'AI.

## Casi d'uso

**Scenario 1:**
Arriva mail all'azienda e in funzione della documentazione aziendale, l'AI genera una bozza di risposta verificabile da un operatore.

**Scenario 2:**
Sulla base di regole definite dall'utente l'AI performa l'azione di segnare la mail come letta e/o reindirizzarla alla mail dell'ufficio competente.

## Stack Tecnologico

- Next.js
- Vercel
- Supabase  
- Anthropic

## Design System

- **Tema**: Vercel Dark Theme
- **Colore Primario**: Verde Supabase (#00D9AA) come colore contrastante
- **Stile**: Moderno, minimalista, interfaccia figa per mostrare i flussi

## Getting Started

1. Installa le dipendenze:
```bash
npm install
```

2. Avvia il server di sviluppo:
```bash
npm run dev
```

3. Apri [http://localhost:3000](http://localhost:3000) nel browser.
