'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { 
  BookOpen,
  Activity,
  FileText,
  Edit2,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getFunctionBySpecificId, 
  updateFunctionGivenName,
  createPdfCompilation,
  processPdfCompilation,
  getPdfCompilations,
  getPdfCompilation,
  updatePdfCompilationTitle
} from './actions'
import IntroSection from './IntroSection'
import EsecuzioniSection from './EsecuzioniSection'
import NuovaEsecuzioneSection from './NuovaEsecuzioneSection'
import VisualizzaEsecuzioneSection from './VisualizzaEsecuzioneSection'

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

type TabType = 'intro' | 'esecuzioni'
type ViewType = 'main' | 'nuova-esecuzione' | 'visualizza-esecuzione'
type PdfTabType = 'pdf' | 'dati'

interface PageProps {
  params: Promise<{
    specific_id: string
  }>
}

export default function PdfCompilationPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState<TabType>('intro')
  const [currentView, setCurrentView] = useState<ViewType>('main')
  const [activePdfTab, setActivePdfTab] = useState<PdfTabType>('pdf')
  const [givenName, setGivenName] = useState<string>('Compilazione PDF')
  const [functionName, setFunctionName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [tempTitle, setTempTitle] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
  // Stati per la compilazione PDF
  const [compilationTitle, setCompilationTitle] = useState<string>('')
  const [isEditingCompilationTitle, setIsEditingCompilationTitle] = useState<boolean>(false)
  const [isSavingCompilationTitle, setIsSavingCompilationTitle] = useState<boolean>(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [isCompiling, setIsCompiling] = useState<boolean>(false)
  const [currentCompilationId, setCurrentCompilationId] = useState<string | null>(null)
  const [compilations, setCompilations] = useState<PdfCompilationRow[]>([])
  const [currentCompilationData, setCurrentCompilationData] = useState<PdfCompilationRow | null>(null)
  const [processingProgress, setProcessingProgress] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string>('')

  const { user } = useAuth()

  // Recupera i dati della funzione usando specific_id
  useEffect(() => {
    const fetchFunctionData = async () => {
      if (!user?.id || !resolvedParams.specific_id) {
        setLoading(false)
        return
      }
      
      const result = await getFunctionBySpecificId(resolvedParams.specific_id, user.id)
      
      if (result.success && result.data) {
        setGivenName(result.data.given_name)
        setFunctionName(result.data.function_name)
      }
      
      setLoading(false)
    }

    fetchFunctionData()
  }, [user, resolvedParams.specific_id])

  // Carica le compilazioni PDF esistenti
  useEffect(() => {
    const fetchCompilations = async () => {
      if (!user?.id || !resolvedParams.specific_id) return

      const result = await getPdfCompilations(user.id, resolvedParams.specific_id)
      if (result.success && result.data) {
        setCompilations(result.data as PdfCompilationRow[])
      }
    }

    fetchCompilations()
  }, [user, resolvedParams.specific_id])

  // Apre il dialog per modificare il titolo
  const openTitleDialog = () => {
    setTempTitle(givenName)
    setIsDialogOpen(true)
  }

  // Salva il titolo
  const saveTitleChange = async () => {
    if (!user?.id || !resolvedParams.specific_id || tempTitle.trim() === givenName) {
      setIsDialogOpen(false)
      return
    }

    setIsSaving(true)
    
    try {
      const result = await updateFunctionGivenName(resolvedParams.specific_id, user.id, tempTitle.trim())
      
      if (result.success && result.data) {
        setGivenName(result.data.given_name || 'Compilazione PDF')
        setIsDialogOpen(false)
      } else {
        console.error('Errore nel salvare il titolo:', result.error)
      }
    } catch (error) {
      console.error('Errore nel salvare il titolo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Cancella le modifiche al titolo
  const cancelTitleChange = () => {
    setTempTitle(givenName)
    setIsDialogOpen(false)
  }

  // Salva il titolo della compilazione PDF
  const saveCompilationTitle = async (newTitle: string) => {
    if (!user?.id || !currentCompilationId || newTitle.trim() === (currentCompilationData?.title || '')) {
      return
    }

    setIsSavingCompilationTitle(true)
    
    try {
        const result = await updatePdfCompilationTitle(currentCompilationId, user.id, newTitle.trim())
      
      if (result.success && result.data) {
        // Aggiorna il titolo nello stato locale
        const updatedData = result.data as PdfCompilationRow
        setCompilationTitle(updatedData.title || 'PDF senza titolo')
        
        // Aggiorna anche i dati della compilazione corrente
        if (currentCompilationData) {
          setCurrentCompilationData({
            ...currentCompilationData,
            title: updatedData.title
          })
        }
        
        // Ricarica la lista delle compilazioni per mantenere tutto sincronizzato
        const updatedCompilations = await getPdfCompilations(user.id, resolvedParams.specific_id)
        if (updatedCompilations.success && updatedCompilations.data) {
          setCompilations(updatedCompilations.data as PdfCompilationRow[])
        }
      } else {
        console.error('Errore nel salvare il titolo della compilazione PDF:', result.error)
        // Ripristina il titolo precedente in caso di errore
        setCompilationTitle(currentCompilationData?.title || 'PDF senza titolo')
      }
    } catch (error) {
      console.error('Errore nel salvare il titolo della compilazione PDF:', error)
      // Ripristina il titolo precedente in caso di errore
      setCompilationTitle(currentCompilationData?.title || 'PDF senza titolo')
    } finally {
      setIsSavingCompilationTitle(false)
    }
  }

  // Funzioni per la vista compilazione PDF
  const openNewCompilation = () => {
    const today = new Date().toLocaleDateString('it-IT')
    setCompilationTitle(`Nuovo documento del ${today}`)
    setCurrentView('nuova-esecuzione')
    setFormData({})
    setIsCompiling(false)
  }

  const openExistingCompilation = async (compilationId: string) => {
    if (!user?.id) return

    const result = await getPdfCompilation(compilationId, user.id)
    if (result.success && result.data) {
      const compilation = result.data as PdfCompilationRow
      setCurrentCompilationData(compilation)
      setCompilationTitle(compilation.title || 'PDF senza titolo')
      setCurrentCompilationId(compilationId)
      setCurrentView('visualizza-esecuzione')
      setIsCompiling(false)
      setFormData({})
      setPdfUrl(compilation.pdf_file_url || '')
    }
  }

  const backToMain = () => {
    setCurrentView('main')
    setActivePdfTab('pdf')
  }

  const startCompilation = async () => {
    if (!user?.id) return

    setIsCompiling(true)
    setProcessingProgress('Inizializzazione compilazione PDF...')

    try {
      // Step 1: Crea la compilazione PDF tramite API
      const createResult = await createPdfCompilation(
        formData,
        compilationTitle,
        user.id,
        resolvedParams.specific_id
      )

      if (!createResult.success || !createResult.data) {
        throw new Error(createResult.error || 'Errore nella creazione del PDF')
      }

      const compilationId = createResult.data.id
      const pdfUrl = createResult.data.pdfUrl
      
      setCurrentCompilationId(compilationId)
      setProcessingProgress('Elaborazione dati e generazione PDF...')

      // Step 2: Processa la compilazione
      const processResult = await processPdfCompilation(
        compilationId,
        formData,
        user.id
      )

      if (processResult.success) {
        setProcessingProgress('Compilazione PDF completata!')
        
        // Reload compilations list
        const updatedCompilations = await getPdfCompilations(user.id, resolvedParams.specific_id)
        if (updatedCompilations.success && updatedCompilations.data) {
          setCompilations(updatedCompilations.data as PdfCompilationRow[])
        }

        // Load the completed compilation
        const completedCompilation = await getPdfCompilation(compilationId, user.id)
        if (completedCompilation.success && completedCompilation.data) {
          const completedData = completedCompilation.data as PdfCompilationRow
          setCurrentCompilationData(completedData)
          setPdfUrl(completedData.pdf_file_url || pdfUrl)
          setCurrentView('visualizza-esecuzione')
        }

        setTimeout(() => {
          setIsCompiling(false)
          setProcessingProgress('')
        }, 2000)
      } else {
        throw new Error(processResult.error || 'Errore nella compilazione PDF')
      }
    } catch (error) {
      console.error('Errore nella compilazione PDF:', error)
      setProcessingProgress(`Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
      
      setTimeout(() => {
        setIsCompiling(false)
        setProcessingProgress('')
      }, 3000)
    }
  }

  const tabs = [
    { id: 'intro' as TabType, label: 'Intro', icon: BookOpen },
    { id: 'esecuzioni' as TabType, label: 'Esecuzioni', icon: Activity },
  ]

  // Render intro section using component
  const renderIntroSection = () => (
    <IntroSection 
      givenName={givenName}
      functionName={functionName}
      specificId={resolvedParams.specific_id}
      loading={loading}
    />
  )

  // Render esecuzioni section using component
  const renderEsecuzioniSection = () => (
    <EsecuzioniSection 
      compilations={compilations}
      onOpenCompilation={openExistingCompilation}
    />
  )

  // Render nuova esecuzione section using component
  const renderNuovaEsecuzioneView = () => (
    <div className="flex-1 flex flex-col h-full">
      {/* Header della nuova compilazione */}
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={backToMain}
              className="p-2 text-gray-400 hover:text-[#00D9AA] transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {compilationTitle}
              </h1>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contenuto principale */}
      <div className="flex-1 p-6 overflow-auto">
        <NuovaEsecuzioneSection
          compilationTitle={compilationTitle}
          setCompilationTitle={setCompilationTitle}
          formData={formData}
          setFormData={setFormData}
          startCompilation={startCompilation}
          isCompiling={isCompiling}
          processingProgress={processingProgress}
        />
      </div>
    </div>
  )

  // Render visualizza esecuzione section using component
  const renderVisualizzaEsecuzioneView = () => (
    <VisualizzaEsecuzioneSection
      compilationTitle={compilationTitle}
      setCompilationTitle={setCompilationTitle}
      isEditingCompilationTitle={isEditingCompilationTitle}
      setIsEditingCompilationTitle={setIsEditingCompilationTitle}
      isSavingCompilationTitle={isSavingCompilationTitle}
      saveCompilationTitle={saveCompilationTitle}
      currentCompilationData={currentCompilationData}
      pdfUrl={pdfUrl}
      activePdfTab={activePdfTab}
      setActivePdfTab={setActivePdfTab}
      onBackToMain={backToMain}
    />
  )

  // Renderizza la vista corrente
  if (currentView === 'nuova-esecuzione') {
    return renderNuovaEsecuzioneView()
  }
  
  if (currentView === 'visualizza-esecuzione') {
    return renderVisualizzaEsecuzioneView()
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Header with tabs */}
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 group">
                  <h1 className="text-3xl font-bold text-white">
                    {loading ? 'Caricamento...' : givenName}
                  </h1>
                  {!loading && (
                    <button
                      onClick={openTitleDialog}
                      className="p-1 text-gray-400 hover:text-[#00D9AA] transition-colors opacity-0 group-hover:opacity-100"
                      title="Modifica titolo"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                </div>
                {functionName && (
                  <p className="text-sm text-gray-400 mt-1">
                    {functionName}
                  </p>
                )}
              </div>
              
              {/* Navigation Tabs and CTA */}
              <div className="flex items-center gap-4">
                {/* Main Navigation Tabs */}
                <div className="flex space-x-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                          activeTab === tab.id
                            ? 'bg-[#00D9AA] text-black'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <Icon size={14} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                
                {/* CTA Button with Animation */}
                <motion.button 
                  onClick={openNewCompilation}
                  className="relative px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00D9AA] via-blue-500 to-purple-500 opacity-90"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      backgroundSize: '200% 100%'
                    }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2 text-black">
                    <FileText size={16} />
                    compila nuovo PDF
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'intro' && renderIntroSection()}
        {activeTab === 'esecuzioni' && renderEsecuzioniSection()}
      </div>

      {/* Dialog per modificare il titolo */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 min-w-[60vw] max-w-[80vw]">
            <h3 className="text-xl font-semibold text-white mb-4">Modifica Titolo</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nuovo titolo
              </label>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSaving) {
                    saveTitleChange()
                  } else if (e.key === 'Escape' && !isSaving) {
                    cancelTitleChange()
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                placeholder="Inserisci il nuovo titolo..."
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelTitleChange}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </button>
              <button
                onClick={saveTitleChange}
                disabled={isSaving || tempTitle.trim() === ''}
                className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  'Salva'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

