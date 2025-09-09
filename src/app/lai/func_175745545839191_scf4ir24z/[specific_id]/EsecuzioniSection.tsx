'use client'

import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function EsecuzioniSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">Dashboard Risposte AI</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Risposte Generate</p>
              <p className="text-2xl font-bold text-white">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <Bot size={24} className="text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">+89 questo mese</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tasso di Accuratezza</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">✓</span>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">+2.1% rispetto al mese scorso</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tempo Medio</p>
              <p className="text-2xl font-bold text-white">0.8s</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xl">⏱</span>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">-0.3s più veloce</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Soddisfazione</p>
              <p className="text-2xl font-bold text-white">4.7/5</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
              <span className="text-purple-400 text-xl">★</span>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">Basato su 156 feedback</p>
        </div>
      </div>

      {/* Recent Responses Table */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-4">Risposte Recenti</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Mittente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Oggetto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Tipo Risposta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sender: 'marco.rossi@cliente.com', subject: 'Richiesta informazioni prodotto', type: 'Informativa', date: '2024-01-15 14:30', status: 'Inviata' },
                { sender: 'anna.verdi@partner.com', subject: 'Supporto tecnico urgente', type: 'Supporto', date: '2024-01-15 13:15', status: 'Bozza' },
                { sender: 'giulia.bianchi@azienda.com', subject: 'Preventivo servizi', type: 'Commerciale', date: '2024-01-15 12:45', status: 'Inviata' },
                { sender: 'luca.neri@startup.com', subject: 'Collaborazione', type: 'Partnership', date: '2024-01-15 11:20', status: 'Inviata' },
                { sender: 'sofia.russo@media.com', subject: 'Intervista', type: 'Media', date: '2024-01-15 10:10', status: 'Bozza' },
              ].map((response, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{response.sender}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{response.subject}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                      {response.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">{response.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      response.status === 'Inviata' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {response.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
