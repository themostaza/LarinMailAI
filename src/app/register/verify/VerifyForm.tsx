'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { verifyOtpAction, resendOtpAction } from '../actions'

export default function VerifyForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Recupera l'email dal localStorage
    const savedEmail = localStorage.getItem('registerEmail')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  useEffect(() => {
    // Countdown per il resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await verifyOtpAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('Errore durante la verifica')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || countdown > 0) return

    setResendLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('email', email)

    try {
      const result = await resendOtpAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.message || 'Codice inviato nuovamente!')
        setCountdown(60) // 60 secondi di attesa
      }
    } catch {
      setError('Errore durante il reinvio')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 flex items-center gap-2"
        >
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-400/10 border border-green-400/30 rounded-lg text-green-400 flex items-center gap-2"
        >
          <CheckCircle size={16} />
          <span className="text-sm">{success}</span>
        </motion.div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors"
              placeholder="inserisci@tuaemail.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
            Codice di verifica
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="token"
              name="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors text-center text-lg tracking-widest"
              placeholder="123456"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inserisci il codice a 6 cifre ricevuto via email
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={loading || token.length !== 6}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#00D9AA] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00D9AA]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              Verifica in corso...
            </>
          ) : (
            <>
              <Shield size={18} />
              Verifica codice
            </>
          )}
        </motion.button>
      </form>

      {/* Resend button */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || countdown > 0 || !email}
          className="text-[#00D9AA] hover:text-[#00D9AA]/80 text-sm transition-colors disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
        >
          {resendLoading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#00D9AA]"></div>
              Invio in corso...
            </>
          ) : countdown > 0 ? (
            <>
              <RefreshCw size={14} />
              Reinvia codice tra {countdown}s
            </>
          ) : (
            <>
              <RefreshCw size={14} />
              Non hai ricevuto il codice? Reinvia
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
