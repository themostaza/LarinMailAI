'use client'

import { motion } from 'framer-motion'
import { Bot, CheckCircle, FileText, Settings } from 'lucide-react'

interface IntroSectionProps {
  givenName: string
  functionName: string
  specificId: string
  loading: boolean
}

export default function IntroSection({ 
  givenName, 
  functionName, 
  specificId, 
  loading 
}: IntroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bot size={32} className="text-[#00D9AA]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {loading ? 'Caricamento...' : givenName}
        </h2>
        {functionName && (
          <p className="text-sm text-gray-400 mb-4">
            {functionName} <span className="text-[#00D9AA]">• ID: {specificId}</span>
          </p>
        )}
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Genera automaticamente risposte personalizzate alle email utilizzando l&apos;intelligenza artificiale. 
          Analizza il contenuto e crea risposte coerenti e professionali.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cosa Include */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Cosa include:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Analisi automatica del contenuto email</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Generazione di risposte contestuali</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Personalizzazione del tono e stile</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Integrazione diretta con Gmail</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Filtri intelligenti per email rilevanti</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={16} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">Knowledge base personalizzabile</span>
            </div>
          </div>
        </div>

        {/* Setup Richiesto */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Setup richiesto:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Collegamento account Gmail</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Configurazione filtri email</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Personalizzazione template risposte</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-gray-400">Configurazione knowledge base (opzionale)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Come Funziona */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Come Funziona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA] flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Riceve Email</h4>
              <p className="text-gray-400 text-sm">Monitora la tua casella Gmail per nuove email in arrivo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA] flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Analizza Contesto</h4>
              <p className="text-gray-400 text-sm">Comprende l&apos;intento e il contesto dell&apos;email ricevuta</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA] flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Genera Risposta</h4>
              <p className="text-gray-400 text-sm">Crea una risposta personalizzata e appropriata</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Bot size={48} className="text-blue-400" />
          </div>
          <h4 className="text-white font-medium mb-2">AI Analysis</h4>
          <p className="text-gray-400 text-sm">Analisi intelligente del contenuto e del contesto delle email</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mb-4 flex items-center justify-center">
            <FileText size={48} className="text-green-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Response Generation</h4>
          <p className="text-gray-400 text-sm">Creazione di risposte personalizzate e professionali</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Settings size={48} className="text-purple-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Smart Integration</h4>
          <p className="text-gray-400 text-sm">Integrazione seamless con Gmail e altri client email</p>
        </div>
      </div>
    </motion.div>
  )
}
