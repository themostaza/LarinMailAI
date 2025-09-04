'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, LogIn, CheckCircle, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState('Outlook')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simula chiamata OAuth
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
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

      <div className="p-6">
        {/* Email Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-blue-400" size={24} />
            <h2 className="text-lg font-semibold text-white">Integrazione Email</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2">Provider Email</p>
              <select 
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-fit bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
              >
                <option value="Gmail">Gmail</option>
                <option value="Outlook">Outlook</option>
                <option value="Exchange">Exchange</option>
              </select>
            </div>
            
            <div>
              <p className="text-white font-medium mb-3">Autenticazione</p>
              
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
                    <CheckCircle size={20} className="text-green-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">Connesso a {selectedProvider}</p>
                      <p className="text-sm text-gray-400">Account configurato e pronto all&apos;uso</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Disconnetti Account
                  </button>
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
                    disabled={isConnecting}
                    className="w-fit bg-[#00D9AA] hover:bg-[#00D9AA]/90 disabled:bg-[#00D9AA]/50 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} />
                    {isConnecting ? `Connessione a ${selectedProvider}...` : `Connetti con ${selectedProvider}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  )
}