'use client'

import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Edit2,
  Download,
  FileText,
  BarChart3,
  Eye,
  Share2,
  User,
  MapPin,
  Building,
  Calendar
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

type PdfTabType = 'pdf' | 'dati'

interface VisualizzaEsecuzioneSectionProps {
  compilationTitle: string
  setCompilationTitle: (title: string) => void
  isEditingCompilationTitle: boolean
  setIsEditingCompilationTitle: (editing: boolean) => void
  isSavingCompilationTitle: boolean
  saveCompilationTitle: (title: string) => Promise<void>
  currentCompilationData: PdfCompilationRow | null
  pdfUrl: string
  activePdfTab: PdfTabType
  setActivePdfTab: (tab: PdfTabType) => void
  onBackToMain: () => void
}

// Helper function per ottenere valori sicuri dal form data
const getFormValue = (data: Record<string, unknown>, key: string): string => {
  const value = data[key]
  return typeof value === 'string' ? value : 'N/A'
}

const getFormDate = (data: Record<string, unknown>, key: string): string => {
  const value = data[key]
  if (typeof value === 'string' || typeof value === 'number') {
    try {
      return new Date(value).toLocaleDateString('it-IT')
    } catch {
      return 'N/A'
    }
  }
  return 'N/A'
}

export default function VisualizzaEsecuzioneSection({
  compilationTitle,
  setCompilationTitle,
  isEditingCompilationTitle,
  setIsEditingCompilationTitle,
  isSavingCompilationTitle,
  saveCompilationTitle,
  currentCompilationData,
  pdfUrl,
  activePdfTab,
  setActivePdfTab,
  onBackToMain
}: VisualizzaEsecuzioneSectionProps) {
  
  const pdfTabs = [
    { id: 'pdf' as PdfTabType, label: 'Anteprima PDF', icon: FileText },
    { id: 'dati' as PdfTabType, label: 'Dati Compilazione', icon: BarChart3 },
  ]

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${compilationTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const openPdfInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  const sharePdf = async () => {
    if (navigator.share && pdfUrl) {
      try {
        await navigator.share({
          title: compilationTitle,
          text: `Guarda questo documento PDF: ${compilationTitle}`,
          url: pdfUrl
        })
      } catch {
        console.log('Condivisione annullata o non supportata')
        // Fallback: copia URL negli appunti
        navigator.clipboard.writeText(pdfUrl)
      }
    } else if (pdfUrl) {
      // Fallback: copia URL negli appunti
      navigator.clipboard.writeText(pdfUrl)
    }
  }

  // Parsing dei dati del form dalla compilazione
  const getFormData = () => {
    try {
      return currentCompilationData?.form_data || {}
    } catch {
      return {}
    }
  }

  const formData = getFormData()

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header della compilazione PDF */}
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToMain}
              className="p-2 text-gray-400 hover:text-[#00D9AA] transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 group">
                {isEditingCompilationTitle ? (
                  <input
                    type="text"
                    value={compilationTitle}
                    onChange={(e) => setCompilationTitle(e.target.value)}
                    onBlur={async () => {
                      setIsEditingCompilationTitle(false)
                      await saveCompilationTitle(compilationTitle)
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        setIsEditingCompilationTitle(false)
                        await saveCompilationTitle(compilationTitle)
                      }
                    }}
                    disabled={isSavingCompilationTitle}
                    className="text-3xl font-bold bg-transparent border-b-2 border-[#00D9AA] text-white focus:outline-none disabled:opacity-50"
                    autoFocus
                  />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                      {compilationTitle}
                      {isSavingCompilationTitle && (
                        <div className="w-4 h-4 border-2 border-[#00D9AA] border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </h1>
                    <button
                      onClick={() => setIsEditingCompilationTitle(true)}
                      disabled={isSavingCompilationTitle}
                      className="p-1 text-gray-400 hover:text-[#00D9AA] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-25"
                      title="Modifica titolo"
                    >
                      <Edit2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={openPdfInNewTab}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
              title="Apri in nuova scheda"
            >
              <Eye size={16} />
              Apri
            </button>
            <button
              onClick={sharePdf}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="Condividi PDF"
            >
              <Share2 size={16} />
              Condividi
            </button>
            <button
              onClick={downloadPdf}
              className="flex items-center gap-2 px-3 py-2 bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black rounded-lg transition-colors text-sm font-medium"
              title="Scarica PDF"
            >
              <Download size={16} />
              Scarica PDF
            </button>
          </div>
        </motion.div>
      </div>

      {/* Contenuto principale */}
      <div className="flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* PDF Info Section */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">Documento PDF Generato</p>
                <p className="text-gray-400 text-sm mt-1">
                  {currentCompilationData?.pdf_file_size 
                    ? `Dimensione: ${Math.round(currentCompilationData.pdf_file_size * 100) / 100} MB`
                    : 'Dimensione: N/A'
                  } • Data: {currentCompilationData?.created_at 
                    ? new Date(currentCompilationData.created_at).toLocaleDateString('it-IT')
                    : new Date().toLocaleDateString('it-IT')
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-medium">Completato</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <div className="flex space-x-1">
              {pdfTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePdfTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                      activePdfTab === tab.id
                        ? 'bg-[#00D9AA]/10 border-b-2 border-[#00D9AA] text-[#00D9AA]'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activePdfTab === 'pdf' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Anteprima Documento</h3>
                  </div>
                  
                  {pdfUrl ? (
                    <div className="bg-gray-800/30 border border-gray-600 rounded-lg overflow-hidden">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-[600px]"
                        title="Anteprima PDF"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-12 text-center">
                      <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">PDF non disponibile per l&apos;anteprima</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activePdfTab === 'dati' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Dati Personali */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <User size={20} className="text-[#00D9AA]" />
                      Dati Personali
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nome:</span>
                        <span className="text-white">{getFormValue(formData, 'nome')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cognome:</span>
                        <span className="text-white">{getFormValue(formData, 'cognome')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{getFormValue(formData, 'email')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Telefono:</span>
                        <span className="text-white">{getFormValue(formData, 'telefono')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data di Nascita:</span>
                        <span className="text-white">{getFormDate(formData, 'dataNascita')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Codice Fiscale:</span>
                        <span className="text-white font-mono">{getFormValue(formData, 'codiceFiscale')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dati Indirizzo */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-[#00D9AA]" />
                      Indirizzo
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Via:</span>
                        <span className="text-white">{getFormValue(formData, 'indirizzo')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Città:</span>
                        <span className="text-white">{getFormValue(formData, 'citta')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CAP:</span>
                        <span className="text-white">{getFormValue(formData, 'cap')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Provincia:</span>
                        <span className="text-white">{getFormValue(formData, 'provincia')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dati Professionali */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Building size={20} className="text-[#00D9AA]" />
                      Dati Professionali
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Azienda:</span>
                        <span className="text-white">{getFormValue(formData, 'azienda')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ruolo:</span>
                        <span className="text-white">{getFormValue(formData, 'ruolo')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Partita IVA:</span>
                        <span className="text-white font-mono">{getFormValue(formData, 'partitaIva')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Settore:</span>
                        <span className="text-white capitalize">{getFormValue(formData, 'settore')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadati Compilazione */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-[#00D9AA]" />
                      Metadati
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data creazione:</span>
                        <span className="text-white">
                          {currentCompilationData?.created_at 
                            ? new Date(currentCompilationData.created_at).toLocaleDateString('it-IT')
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensione PDF:</span>
                        <span className="text-white">
                          {currentCompilationData?.pdf_file_size 
                            ? `${Math.round(currentCompilationData.pdf_file_size * 100) / 100} MB`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stato:</span>
                        <span className="text-white">{currentCompilationData?.status || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ultima modifica:</span>
                        <span className="text-white">
                          {currentCompilationData?.edited_at 
                            ? new Date(currentCompilationData.edited_at).toLocaleDateString('it-IT')
                            : 'Mai'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note Aggiuntive */}
                {getFormValue(formData, 'note') !== 'N/A' && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Note Aggiuntive</h3>
                    <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{getFormValue(formData, 'note')}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

