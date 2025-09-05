'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, CheckCircle, AlertCircle, Mail } from 'lucide-react'

interface SettingsClientProps {
  initialConnected: boolean
  initialAccount: string | null
}

export default function SettingsClient({ initialConnected, initialAccount }: SettingsClientProps) {
  const [selectedProvider, setSelectedProvider] = useState('Gmail')
  const [isConnected, setIsConnected] = useState(initialConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccount, setConnectedAccount] = useState<string | null>(initialAccount)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    // Controlla i parametri URL per messaggi di stato
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')

    if (success === 'connected') {
      setMessage('Account Google connesso con successo!')
      setMessageType('success')
      setIsConnected(true)
    } else if (error) {
      const errorMessages = {
        oauth_cancelled: 'Autorizzazione annullata',
        no_code: 'Codice di autorizzazione mancante',
        no_tokens: 'Token non ricevuti da Google',
        no_email: 'Email non disponibile dal profilo Google',
        database_error: 'Errore nel salvataggio dei dati',
        callback_failed: 'Errore durante l\'autorizzazione'
      }
      setMessage(errorMessages[error as keyof typeof errorMessages] || 'Errore sconosciuto')
      setMessageType('error')
    }

    // Pulisci i parametri URL
    if (success || error) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const handleConnect = async () => {
    if (selectedProvider === 'Gmail') {
      setIsConnecting(true)
      try {
        // Reindirizza all'endpoint OAuth2
        window.location.href = '/api/auth/google'
      } catch (error) {
        console.error('Error starting OAuth:', error)
        setMessage('Errore durante l\'avvio dell\'autorizzazione')
        setMessageType('error')
        setIsConnecting(false)
      }
    } else {
      setMessage('Solo Gmail è supportato al momento')
      setMessageType('error')
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/auth/google/disconnect', {
        method: 'POST',
      })

      if (response.ok) {
        setIsConnected(false)
        setConnectedAccount(null)
        setMessage('Account disconnesso con successo')
        setMessageType('success')
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
      setMessage('Errore durante la disconnessione')
      setMessageType('error')
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Impostazioni</h1>
          <p className="text-gray-400">
            Configura le impostazioni generali del sistema MailAI
          </p>
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-400/10 border-green-400/30 text-green-400' 
              : 'bg-red-400/10 border-red-400/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {messageType === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}

      {/* Email Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail className="text-blue-400" size={24} />
          <h2 className="text-lg font-semibold text-white">Integrazione Email</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-white font-medium mb-2">Provider Email</p>
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-fit bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
              disabled={isConnected}
            >
              <option value="Gmail">Gmail</option>
              <option value="Outlook" disabled>Outlook (Prossimamente)</option>
              <option value="Exchange" disabled>Exchange (Prossimamente)</option>
            </select>
            <p className="text-sm text-gray-400 mt-1">
              Al momento è supportato solo Gmail. Altri provider saranno aggiunti presto.
            </p>
          </div>
          
          <div>
            <p className="text-white font-medium mb-3">Autenticazione</p>
            
            {isConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
                  <CheckCircle size={20} className="text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Connesso a {selectedProvider}</p>
                    <p className="text-sm text-gray-400">
                      {connectedAccount ? `Account: ${connectedAccount}` : 'Account configurato e pronto all\'uso'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDisconnect}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Disconnetti Account
                  </button>
                  <button
                    onClick={() => window.open('/manage/emails', '_blank')}
                    className="bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Visualizza Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                  <AlertCircle size={20} className="text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Account non connesso</p>
                    <p className="text-sm text-gray-400">Connetti il tuo account {selectedProvider} per iniziare</p>
                  </div>
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || selectedProvider !== 'Gmail'}
                  className="w-fit bg-[#00D9AA] hover:bg-[#00D9AA]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  {isConnecting ? 'Reindirizzamento a Google...' : `Connetti con ${selectedProvider}`}
                </button>
                {selectedProvider !== 'Gmail' && (
                  <p className="text-sm text-gray-400">
                    Seleziona Gmail per procedere con la connessione.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
