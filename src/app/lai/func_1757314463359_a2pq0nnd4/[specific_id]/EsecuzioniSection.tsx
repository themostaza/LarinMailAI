'use client'

import { motion } from 'framer-motion'
import { 
  FileText,
  File,
  Calendar
} from 'lucide-react'
import { Tables } from '@/types/database.types'

type TranscriptionRow = Tables<'_lf_transcriptions'>

interface EsecuzioniSectionProps {
  transcriptions: TranscriptionRow[]
  onOpenTranscription: (transcriptionId: string) => void
}

export default function EsecuzioniSection({ 
  transcriptions, 
  onOpenTranscription 
}: EsecuzioniSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">Trascrizioni Elaborate</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Trascrizioni</p>
              <p className="text-2xl font-bold text-white">{transcriptions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">MB Elaborati</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(transcriptions.reduce((acc, t) => acc + (t.audio_file_length || 0), 0) * 100) / 100} MB
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
              <File size={24} className="text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-2">
            Media {transcriptions.length > 0 ? `${Math.round((transcriptions.reduce((acc, t) => acc + (t.audio_file_length || 0), 0) / transcriptions.length) * 100) / 100} MB` : '0 MB'} per trascrizione
          </p>
        </div>
      </div>

      {/* Transcriptions Table */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-4">Trascrizioni Recenti</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Titolo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Dimensione</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Stato</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {transcriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                    Nessuna trascrizione trovata. Clicca su &quot;+ nuova trascrizione&quot; per iniziare.
                  </td>
                </tr>
              ) : (
                transcriptions.map((transcription) => {
                  const statusMap = {
                    'elaborato': { label: 'Completata', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
                    'elaborazione': { label: 'In elaborazione', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
                    'errore': { label: 'Errore', color: 'bg-red-500/20 text-red-400 border border-red-500/30' }
                  }
                  
                  const statusInfo = statusMap[transcription.status as keyof typeof statusMap] || 
                    { label: transcription.status || 'Sconosciuto', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' }

                  return (
                    <tr key={transcription.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3 px-4 text-white font-medium">
                        {transcription.title || 'Trascrizione senza titolo'}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(transcription.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <File size={14} />
                          {transcription.audio_file_length 
                            ? `${Math.round(transcription.audio_file_length * 100) / 100} MB`
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => onOpenTranscription(transcription.id)}
                          disabled={transcription.status === 'elaborazione'}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            transcription.status === 'elaborazione'
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-[#00D9AA] text-black hover:bg-[#00D9AA]/90'
                          }`}
                        >
                          {transcription.status === 'elaborazione' ? 'Elaborazione...' : 'Visualizza'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
