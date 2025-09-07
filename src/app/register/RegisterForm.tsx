'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Mail, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'
import { registerAction } from './actions'

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validazione password
  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    }
  }

  const passwordValidation = validatePassword(password)
  const passwordsMatch = password === confirmPassword

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    // Validazione lato client
    if (!passwordValidation.isValid) {
      setError('La password non rispetta i requisiti di sicurezza')
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError('Le password non coincidono')
      setLoading(false)
      return
    }

    try {
      const result = await registerAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        // Salva l'email per la pagina di verifica
        localStorage.setItem('registerEmail', email)
        // Redirect diretto alla verifica
        window.location.href = '/register/verify'
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Indicatori validazione password */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className={`text-xs flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-red-400'}`} />
                Almeno 8 caratteri
              </div>
              <div className={`text-xs flex items-center gap-2 ${passwordValidation.hasUpper ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpper ? 'bg-green-400' : 'bg-red-400'}`} />
                Una lettera maiuscola
              </div>
              <div className={`text-xs flex items-center gap-2 ${passwordValidation.hasLower ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLower ? 'bg-green-400' : 'bg-red-400'}`} />
                Una lettera minuscola
              </div>
              <div className={`text-xs flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-red-400'}`} />
                Un numero
              </div>
              <div className={`text-xs flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecial ? 'bg-green-400' : 'bg-red-400'}`} />
                Un carattere speciale
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Conferma Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Indicatore corrispondenza password */}
          {confirmPassword && (
            <div className={`mt-2 text-xs flex items-center gap-2 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-green-400' : 'bg-red-400'}`} />
              {passwordsMatch ? 'Le password coincidono' : 'Le password non coincidono'}
            </div>
          )}
        </div>

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
      </form>
    </motion.div>
  )
}
