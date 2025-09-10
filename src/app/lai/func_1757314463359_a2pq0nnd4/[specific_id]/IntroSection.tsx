'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen,
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
      <div className="text-center">
        <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mic size={32} className="text-[#00D9AA]" />
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
          Trasforma automaticamente le registrazioni audio delle tue riunioni in trascrizioni testuali accurate, 
          poi genera riassunti strutturati con punti chiave, decisioni prese e action item assegnati.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Caratteristiche Principali</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Trascrizione automatica ad alta precisione</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Riassunti strutturati con punti chiave</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Identificazione automatica di decisioni e action item</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Salvataggio automatico su Google Drive</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Condivisione automatica con i partecipanti</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Come Funziona</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                1
              </div>
              <span className="text-gray-300">Carica la registrazione audio della riunione</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                2
              </div>
              <span className="text-gray-300">L&apos;AI trascrive e analizza il contenuto</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                3
              </div>
              <span className="text-gray-300">Genera verbali strutturati e li condivide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Mic size={48} className="text-blue-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Registrazione Audio</h4>
          <p className="text-gray-400 text-sm">Carica file audio delle riunioni in qualsiasi formato supportato</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
            <FileText size={48} className="text-purple-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Elaborazione AI</h4>
          <p className="text-gray-400 text-sm">Trascrizione automatica e analisi intelligente del contenuto</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Users size={48} className="text-green-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Condivisione</h4>
          <p className="text-gray-400 text-sm">Verbali salvati su Drive e condivisi automaticamente</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-[#00D9AA]/5 to-blue-500/5 border border-[#00D9AA]/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Vantaggi della Trascrizione AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Elimina la faticosa presa di appunti manuale</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Garantisce che nessun dettaglio importante vada perso</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Risparmia ore di lavoro post-riunione</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Migliora il follow-up delle decisioni prese</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Facilita la condivisione con team distribuiti</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Crea un archivio consultabile delle riunioni</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
