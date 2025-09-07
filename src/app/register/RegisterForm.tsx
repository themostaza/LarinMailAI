'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { registerAction } from './actions'

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await registerAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.message || 'Registrazione completata con successo!')
        // Salva l'email per la pagina di verifica
        localStorage.setItem('registerEmail', email)
      }
    } catch {
      setError('Errore durante la registrazione')
    } finally {
      setLoading(false)
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
              disabled={loading || !!success}
            />
          </div>
        </div>

        {!success && (
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#00D9AA] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00D9AA]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Registrazione in corso...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Registrati
              </>
            )}
          </motion.button>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.a
              href="/register/verify"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block w-full bg-[#00D9AA] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00D9AA]/90 transition-all duration-200"
            >
              Procedi alla verifica
            </motion.a>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}
