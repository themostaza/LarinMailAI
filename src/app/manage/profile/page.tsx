'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
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
              <h2 className="text-xl font-semibold text-white">Admin User</h2>
              <p className="text-gray-400">admin@mailai.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value="Admin User"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value="admin@mailai.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Ruolo
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]">
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Ultimo Accesso
                </label>
                <input
                  type="text"
                  value="30 Luglio 2025, 10:30"
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400"
                />
              </div>
            </div>
          </div>


        </motion.div>
      </div>
    </div>
  )
}