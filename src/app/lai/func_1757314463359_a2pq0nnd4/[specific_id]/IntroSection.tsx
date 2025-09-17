'use client'

import { motion } from 'framer-motion'
import { 
  Mic,
  FileText,
  Users,
  CheckCircle
} from 'lucide-react'

interface IntroSectionProps {
  givenName: string
  functionName: string
  specificId: string
  loading: boolean
  onNewTranscription?: () => void
}

export default function IntroSection({ 
  givenName, 
  functionName, 
  specificId, 
  loading,
  onNewTranscription 
}: IntroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mic size={32} className="text-[#00D9AA]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Trascrivi audio con l&apos;AI
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6">
          Trasforma automaticamente le registrazioni audio delle tue riunioni in trascrizioni testuali accurate, 
          poi genera riassunti strutturati con punti chiave, decisioni prese e action item assegnati.
        </p>
        
        <div className="max-w-3xl mx-auto space-y-3 text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            GDPR compliant - Archiviazione dati sicura in EU tramite Supabase
          </p>
          <p className="flex items-center justify-center gap-2">
            Powered by <a href="https://assemblyai.com" target="_blank" rel="noopener noreferrer" className="text-[#00D9AA] hover:underline">AssemblyAI</a> - 
            <a href="https://www.assemblyai.com/security" target="_blank" rel="noopener noreferrer" className="text-[#00D9AA] hover:underline">Informazioni di sicurezza</a>
          </p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
        <h3 className="text-2xl font-semibold text-white mb-8 text-center">Come funziona</h3>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-lg font-bold text-[#00D9AA] flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-white">Carica il tuo audio</h4>
                <button 
                  onClick={onNewTranscription}
                  className="px-3 py-1 bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span className="text-lg leading-none">+</span>
                  Nuova trascrizione
                </button>
              </div>
              <p className="text-gray-400 mb-1">Carica la registrazione audio della riunione in qualsiasi formato supportato</p>
              <p className="text-gray-500 text-sm">Formati supportati: MP3, WAV, M4A, FLAC, OGG, WMA, AAC, WebM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-lg font-bold text-[#00D9AA] flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Trascrizione intelligente</h4>
              <p className="text-gray-400">L&apos;AI trascrive e analizza automaticamente il contenuto con alta precisione e identifica gli interlocutori assegnando le frasi a diversi speaker anonimi</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-lg font-bold text-[#00D9AA] flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Personalizza il risultato</h4>
              <p className="text-gray-400 mb-3">Definisci cosa elaborare e personalizza il risultato finale con l&apos;AI utilizzando prompt personalizzati per ottenere esattamente il formato che desideri</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Verbale della riunione
                </span>
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Riassunto
                </span>
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Punti salienti
                </span>
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Todo list
                </span>
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Appunti
                </span>
                <span className="px-3 py-1 bg-transparent border border-[#00D9AA] text-[#00D9AA]/70 rounded-lg text-sm font-medium">
                  Analisi decisioni
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-r from-[#00D9AA]/5 to-blue-500/5 border border-[#00D9AA]/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Prezzi</h3>
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          
          {/* Trascrizione AI */}
          <div>
            <h4 className="text-xl font-semibold text-white">Trascrizione AI <span className="text-2xl font-bold text-[#00D9AA]">€0,37</span> <span className="text-gray-400">per ora trascritta</span></h4>
          </div>
          
          {/* Elaborazione AI */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6">Elaborazione AI</h4>
            <div className="space-y-6">
              
              {/* Claude Sonnet 4.0 */}
              <div className="border-b border-gray-700 pb-4">
                <h5 className="text-lg font-medium text-white mb-3">Claude Sonnet 4.0</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Input:</span>
                    <span className="text-[#00D9AA] font-semibold ml-2">€0,004 per 1000 token</span>
                    <span className="text-gray-500 block text-xs">(circa 750 parole)</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Output:</span>
                    <span className="text-[#00D9AA] font-semibold ml-2">€0,020 per 1000 token</span>
                  </div>
                </div>
              </div>
              
              {/* GPT-5 */}
              <div className="border-b border-gray-700 pb-4">
                <h5 className="text-lg font-medium text-white mb-3">GPT-5</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Input:</span>
                    <span className="text-blue-400 font-semibold ml-2">€0,0017 per 1000 token</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Output:</span>
                    <span className="text-blue-400 font-semibold ml-2">€0,013 per 1000 token</span>
                  </div>
                </div>
              </div>
              
              {/* GPT-4.1 */}
              <div>
                <h5 className="text-lg font-medium text-white mb-3">GPT-4.1</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Input:</span>
                    <span className="text-blue-400 font-semibold ml-2">€0,0026 per 1000 token</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Output:</span>
                    <span className="text-blue-400 font-semibold ml-2">€0,0105 per 1000 token</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
