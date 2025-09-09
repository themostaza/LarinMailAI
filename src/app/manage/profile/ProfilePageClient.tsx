'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ProfilePageClientProps {
  user: SupabaseUser
  profile: { role?: string | null } | null
}

export default function ProfilePageClient({ user, profile }: ProfilePageClientProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isAdminRole = profile?.role === 'admin' || profile?.role === 'superadmin'

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tutti i campi sono obbligatori')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }

    if (newPassword.length < 8) {
      setError('La nuova password deve essere di almeno 8 caratteri')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password cambiata con successo!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setShowPasswordModal(false)
          setSuccess(null)
        }, 2000)
      } else {
        setError(data.error || 'Errore durante il cambio password')
      }
    } catch {
      setError('Errore di connessione. Riprova più tardi.')
    } finally {
      setIsLoading(false)
    }
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(null)
  }

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">Profilo Utente</h1>
            <p className="text-gray-400">
              Gestisci le tue informazioni personali e preferenze
            </p>
          </motion.div>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#00D9AA] rounded-full flex items-center justify-center">
                <User size={32} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user.user_metadata?.full_name || 'Utente'}
                </h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              {isAdminRole && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Ruolo
                  </label>
                  <input
                    type="text"
                    value={profile?.role === 'superadmin' ? 'Super Amministratore' : 'Amministratore'}
                    disabled
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 bg-[#00D9AA] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#00B890] transition-colors duration-200"
                >
                  <Lock size={20} />
                  Cambia Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Cambia Password</h3>
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-2 rounded-lg mb-4">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password Attuale
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#00D9AA]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nuova Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#00D9AA]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Conferma Nuova Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#00D9AA]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="flex-1 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00B890] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cambiando...' : 'Cambia Password'}
              </button>
              <button
                onClick={closePasswordModal}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Annulla
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
