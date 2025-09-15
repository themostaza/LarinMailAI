'use client'

import { motion } from 'framer-motion'
import { 
  FileText,
  Edit3,
  Share2,
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
          <FileText size={32} className="text-[#00D9AA]" />
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
          Compila automaticamente documenti PDF personalizzati inserendo semplicemente i dati richiesti. 
          Il sistema genera documenti professionali pronti per la condivisione e l&apos;archiviazione.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Caratteristiche Principali</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Compilazione automatica di documenti PDF</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Template personalizzabili per ogni esigenza</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Inserimento dati tramite form intuitivi</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Download immediato del documento generato</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Archiviazione automatica e condivisione</span>
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
              <span className="text-gray-300">Compila i campi del form con i tuoi dati</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                2
              </div>
              <span className="text-gray-300">Il sistema genera automaticamente il PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                3
              </div>
              <span className="text-gray-300">Scarica, condividi o archivia il documento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Edit3 size={48} className="text-blue-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Compilazione Form</h4>
          <p className="text-gray-400 text-sm">Inserisci i dati richiesti tramite form guidati e intuitivi</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
            <FileText size={48} className="text-purple-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Generazione PDF</h4>
          <p className="text-gray-400 text-sm">Il sistema compila automaticamente il documento PDF personalizzato</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Share2 size={48} className="text-green-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Download & Condivisione</h4>
          <p className="text-gray-400 text-sm">Scarica immediatamente o condividi il documento generato</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-[#00D9AA]/5 to-blue-500/5 border border-[#00D9AA]/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Vantaggi della Compilazione Automatica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Elimina la compilazione manuale di documenti</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Garantisce coerenza e professionalità</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Risparmia tempo prezioso nella documentazione</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Riduce gli errori di compilazione</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Facilita l&apos;archiviazione digitale</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#00D9AA] flex-shrink-0" />
              <span className="text-gray-300">Permette condivisione immediata</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

