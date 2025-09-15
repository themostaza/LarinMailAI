'use client'

import { motion } from 'framer-motion'
import { 
  FileText,
  File,
  Calendar,
  Download
} from 'lucide-react'
interface PdfCompilationRow {
  id: string
  title: string | null
  pdf_file_url: string | null
  pdf_file_size: number | null
  created_at: string
  edited_at: string | null
  user_id: string
  specific_lfunction_id: number
  form_data: Record<string, unknown>
  status: string | null
}

interface EsecuzioniSectionProps {
  compilations: PdfCompilationRow[]
  onOpenCompilation: (compilationId: string) => void
}

export default function EsecuzioniSection({ 
  compilations, 
  onOpenCompilation 
}: EsecuzioniSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">PDF Compilati</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">PDF Generati</p>
              <p className="text-2xl font-bold text-white">{compilations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">MB Generati</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(compilations.reduce((acc, c) => acc + (c.pdf_file_size || 0), 0) * 100) / 100} MB
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
              <File size={24} className="text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-2">
            Media {compilations.length > 0 ? `${Math.round((compilations.reduce((acc, c) => acc + (c.pdf_file_size || 0), 0) / compilations.length) * 100) / 100} MB` : '0 MB'} per PDF
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completati</p>
              <p className="text-2xl font-bold text-white">
                {compilations.filter(c => c.status === 'completato').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
              <Download size={24} className="text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">In Elaborazione</p>
              <p className="text-2xl font-bold text-white">
                {compilations.filter(c => c.status === 'elaborazione').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Compilations Table */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-4">PDF Recenti</h4>
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
              {compilations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                    Nessun PDF compilato trovato. Clicca su &quot;compila nuovo PDF&quot; per iniziare.
                  </td>
                </tr>
              ) : (
                compilations.map((compilation) => {
                  const statusMap = {
                    'completato': { label: 'Completato', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
                    'elaborazione': { label: 'In elaborazione', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
                    'errore': { label: 'Errore', color: 'bg-red-500/20 text-red-400 border border-red-500/30' }
                  }
                  
                  const statusInfo = statusMap[compilation.status as keyof typeof statusMap] || 
                    { label: compilation.status || 'Sconosciuto', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' }

                  return (
                    <tr key={compilation.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3 px-4 text-white font-medium">
                        {compilation.title || 'PDF senza titolo'}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(compilation.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <File size={14} />
                          {compilation.pdf_file_size 
                            ? `${Math.round(compilation.pdf_file_size * 100) / 100} MB`
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
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onOpenCompilation(compilation.id)}
                            disabled={compilation.status === 'elaborazione'}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              compilation.status === 'elaborazione'
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-[#00D9AA] text-black hover:bg-[#00D9AA]/90'
                            }`}
                          >
                            {compilation.status === 'elaborazione' ? 'Elaborazione...' : 'Visualizza'}
                          </button>
                          
                          {compilation.status === 'completato' && compilation.pdf_file_url && (
                            <a
                              href={compilation.pdf_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-[#00D9AA] transition-colors rounded-lg hover:bg-gray-800/50"
                              title="Scarica PDF"
                            >
                              <Download size={16} />
                            </a>
                          )}
                        </div>
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

