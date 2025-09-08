'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ContactSectionProps {
  className?: string
  delay?: number
  title?: string
  description?: string
  buttonText?: string
}

export default function ContactSection({ 
  className = '', 
  delay = 0.4,
  title = "Hai bisogno di altre automazioni?",
  description = "Ogni azienda ha esigenze uniche. Raccontaci quali altri processi vorresti automatizzare e creeremo una soluzione personalizzata per te.",
  buttonText = "Richiedi Automazione Personalizzata"
}: ContactSectionProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'invio')
      }

      setSuccess(true)
      setEmail('')
      setMessage('')
      
      // Reset success message dopo 5 secondi
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'invio')
    } finally {
      setLoading(false)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-8 bg-gray-900/50 border border-gray-700 rounded-xl ${className}`}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* Messaggi di stato */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-400/10 border border-green-400/30 rounded-lg text-green-400 text-center"
          >
            ✓ Richiesta inviata con successo! Ti ricontatteremo presto.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 text-center"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="La tua email aziendale"
          />
          
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Descrivi le tue necessità di automazione (es. gestione clienti, reportistica automatica, integrazione CRM...)"
          />
          
          <button
            type="submit"
            disabled={loading || !email || !message}
            className="w-full bg-[#00D9AA] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00D9AA]"
          >
            {loading ? 'Invio in corso...' : buttonText}
          </button>
        </form>
        
        {/* Alternative di Contatto */}
        <div className="pt-6 border-t border-gray-600">
          <p className="text-gray-400 text-sm text-center mb-4">Oppure</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            
            <a 
              href="mailto:info@larin.it"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Scrivici a info@larin.it
            </a>
            
            <a 
              href="https://calendar.app.google/G7g4swEcpMZ4xidF9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
              </svg>
              Prenota una call
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
