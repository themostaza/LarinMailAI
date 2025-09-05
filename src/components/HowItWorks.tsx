'use client'

import { motion } from 'framer-motion'
import { Play, Settings, CheckCircle } from 'lucide-react'

interface HowItWorksProps {
  className?: string
  delay?: number
}

export default function HowItWorks({ className = '', delay = 0.3 }: HowItWorksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-8 bg-gray-900/30 border border-gray-700 rounded-xl ${className}`}
    >
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">Come funziona la tua automazione</h3>
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Step 1 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={24} className="text-[#00D9AA]" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">1. Attiva</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Scegli quali funzionalità vuoi utilizzare e attivale con un semplice click. 
            Ogni funzione è indipendente e può essere gestita separatamente.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={24} className="text-[#00D9AA]" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">2. Configura</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Personalizza ogni funzione secondo le tue esigenze: scegli cartelle, 
            imposta regole, carica la tua documentazione aziendale.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={24} className="text-[#00D9AA]" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">3. Automatizza</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Le funzioni lavorano in automatico: archiviano documenti, generano bozze, 
            classificano email. Tu ti occupi solo di quello che conta davvero.
          </p>
        </div>
      </div>

      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600">
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="text-white font-medium mb-2">🔒 Sicurezza e Privacy</h5>
            <p className="text-gray-400 mb-3">
              Tutte le tue impostazioni sono salvate in modo sicuro. Tenere al sicuro i tuoi dati è la nostra priorità.
            </p>
            <h5 className="text-white font-medium mb-2">⚡ Velocità e Affidabilità</h5>
            <p className="text-gray-400">
              Le funzioni sono monitorate 24/7. In caso di problemi ricevi notifiche 
              immediate e supporto tecnico.
            </p>
          </div>
          <div>
            <h5 className="text-white font-medium mb-2">🎯 Personalizzazione Completa</h5>
            <p className="text-gray-400 mb-3">
              Ogni automazione si adatta al tuo modo di lavorare. Puoi modificare 
              le impostazioni in qualsiasi momento.
            </p>
            <h5 className="text-white font-medium mb-2">📊 Monitoraggio Trasparente</h5>
            <p className="text-gray-400">
              Vedi sempre cosa sta succedendo: quante email elaborate, 
              documenti archiviati, tempo risparmiato.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
