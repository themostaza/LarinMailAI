'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { loginAction } from './actions'

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('Errore durante il login')
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

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] transition-colors"
              placeholder="inserisci@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00D9AA] hover:bg-[#00D9AA]/90 disabled:bg-[#00D9AA]/50 text-black font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              Accesso in corso...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Accedi
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
