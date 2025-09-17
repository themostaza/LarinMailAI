'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { 
  BookOpen,
  Activity,
  Mic,
  Edit2,
  ArrowLeft,
  FileText,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getFunctionBySpecificId, 
  updateFunctionGivenName,
  uploadAudioFile,
  processTranscriptionWithAssemblyAI,
  getTranscriptions,
  getTranscription,
  updateTranscriptionTitle
} from './actions'
import { Tables } from '@/types/database.types'
import IntroSection from './IntroSection'
import EsecuzioniSection from './EsecuzioniSection'
import NuovaEsecuzioneSection from './NuovaEsecuzioneSection'
import VisualizzaEsecuzioneSection from './VisualizzaEsecuzioneSection'

type TranscriptionRow = Tables<'_lf_transcriptions'>

// Tipo per i dati AssemblyAI
interface AssemblyAIWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

interface AssemblyAIData {
  id?: string;
  text?: string;
  words?: AssemblyAIWord[];
  audio_duration?: number;
  language_confidence?: number;
  acoustic_model?: string;
  speaker_labels?: boolean;
  sentiment_analysis?: boolean;
  auto_highlights?: boolean;
  language_code?: string;
  [key: string]: unknown; // Per altri campi non tipizzati
}

type TabType = 'intro' | 'esecuzioni'
type ViewType = 'main' | 'nuova-esecuzione' | 'visualizza-esecuzione'
type TranscriptionTabType = 'trascrizione' | 'dati'

interface PageProps {
  params: Promise<{
    specific_id: string
  }>
}

export default function TranscriptionPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState<TabType>('intro')
  const [currentView, setCurrentView] = useState<ViewType>('main')
  const [activeTranscriptionTab, setActiveTranscriptionTab] = useState<TranscriptionTabType>('trascrizione')
  const [givenName, setGivenName] = useState<string>('Trascrizione AI')
  const [functionName, setFunctionName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [tempTitle, setTempTitle] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
  // Stati per la trascrizione
  const [transcriptionTitle, setTranscriptionTitle] = useState<string>('')
  const [isEditingTranscriptionTitle, setIsEditingTranscriptionTitle] = useState<boolean>(false)
  const [isSavingTranscriptionTitle, setIsSavingTranscriptionTitle] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [isExistingTranscription, setIsExistingTranscription] = useState<boolean>(false)
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState<string | null>(null)
  const [transcriptions, setTranscriptions] = useState<TranscriptionRow[]>([])
  const [currentTranscriptionData, setCurrentTranscriptionData] = useState<TranscriptionRow | null>(null)
  const [processingProgress, setProcessingProgress] = useState<string>('')
  
  // Stati per il player audio
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [audioUrl, setAudioUrl] = useState<string>('')
  
  // Stato per feedback copia
  const [isCopied, setIsCopied] = useState<boolean>(false)
  
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

  // Carica le trascrizioni esistenti
  useEffect(() => {
    const fetchTranscriptions = async () => {
      if (!user?.id || !resolvedParams.specific_id) return

      const result = await getTranscriptions(user.id, resolvedParams.specific_id)
      if (result.success && result.data) {
        setTranscriptions(result.data)
      }
    }

    fetchTranscriptions()
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
        setGivenName(result.data.given_name || 'Trascrizione AI')
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

  // Salva il titolo della trascrizione
  const saveTranscriptionTitle = async (newTitle: string) => {
    if (!user?.id || !currentTranscriptionId || newTitle.trim() === (currentTranscriptionData?.title || '')) {
      return
    }

    setIsSavingTranscriptionTitle(true)
    
    try {
      const result = await updateTranscriptionTitle(currentTranscriptionId, user.id, newTitle.trim())
      
      if (result.success && result.data) {
        // Aggiorna il titolo nello stato locale
        setTranscriptionTitle(result.data.title)
        
        // Aggiorna anche i dati della trascrizione corrente
        if (currentTranscriptionData) {
          setCurrentTranscriptionData({
            ...currentTranscriptionData,
            title: result.data.title
          })
        }
        
        // Ricarica la lista delle trascrizioni per mantenere tutto sincronizzato
        const updatedTranscriptions = await getTranscriptions(user.id, resolvedParams.specific_id)
        if (updatedTranscriptions.success && updatedTranscriptions.data) {
          setTranscriptions(updatedTranscriptions.data)
        }
      } else {
        console.error('Errore nel salvare il titolo della trascrizione:', result.error)
        // Ripristina il titolo precedente in caso di errore
        setTranscriptionTitle(currentTranscriptionData?.title || 'Trascrizione senza titolo')
      }
    } catch (error) {
      console.error('Errore nel salvare il titolo della trascrizione:', error)
      // Ripristina il titolo precedente in caso di errore
      setTranscriptionTitle(currentTranscriptionData?.title || 'Trascrizione senza titolo')
    } finally {
      setIsSavingTranscriptionTitle(false)
    }
  }

  // Funzioni per la vista trascrizione
  const openNewTranscription = () => {
    const today = new Date().toLocaleDateString('it-IT')
    setTranscriptionTitle(`Nuova trascrizione del ${today}`)
    setCurrentView('nuova-esecuzione')
    setUploadedFile(null)
    setIsTranscribing(false)
    setIsExistingTranscription(false)
  }

  const openExistingTranscription = async (transcriptionId: string) => {
    if (!user?.id) return

    const result = await getTranscription(transcriptionId, user.id)
    if (result.success && result.data) {
      const transcription = result.data
      setCurrentTranscriptionData(transcription)
      setTranscriptionTitle(transcription.title || 'Trascrizione senza titolo')
      setCurrentTranscriptionId(transcriptionId)
      setCurrentView('visualizza-esecuzione')
      setIsTranscribing(false)
      setUploadedFile(null)
      setIsExistingTranscription(true)
      setAudioUrl(transcription.audio_file_url || '')
    }
  }

  const backToMain = () => {
    setCurrentView('main')
    setActiveTranscriptionTab('trascrizione')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const startTranscription = async () => {
    if (!uploadedFile || !user?.id) return

    setIsTranscribing(true)
    setProcessingProgress('Caricamento file audio e creazione trascrizione...')

    try {
      // Step 1: Carica il file audio e crea record trascrizione tramite API
      const uploadResult = await uploadAudioFile(
        uploadedFile,
        transcriptionTitle,
        user.id,
        resolvedParams.specific_id
      )

      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || 'Errore nel caricamento del file')
      }

      const transcriptionId = uploadResult.data.id
      const audioUrl = uploadResult.data.audioUrl
      
      setCurrentTranscriptionId(transcriptionId)
      setProcessingProgress('Avvio trascrizione AI...')

      // Step 2: Processa con AssemblyAI
      const processResult = await processTranscriptionWithAssemblyAI(
        transcriptionId,
        audioUrl,
        user.id
      )

      if (processResult.success) {
        setProcessingProgress('Trascrizione completata!')
        
        // Reload transcriptions list
        const updatedTranscriptions = await getTranscriptions(user.id, resolvedParams.specific_id)
        if (updatedTranscriptions.success && updatedTranscriptions.data) {
          setTranscriptions(updatedTranscriptions.data)
        }

        // Load the completed transcription
        const completedTranscription = await getTranscription(transcriptionId, user.id)
        if (completedTranscription.success && completedTranscription.data) {
          setCurrentTranscriptionData(completedTranscription.data)
          setIsExistingTranscription(true)
          setAudioUrl(completedTranscription.data.audio_file_url || '')
          setCurrentView('visualizza-esecuzione')
        }

        setTimeout(() => {
          setIsTranscribing(false)
          setProcessingProgress('')
        }, 2000)
      } else {
        throw new Error(processResult.error || 'Errore nella trascrizione')
      }
    } catch (error) {
      console.error('Errore nella trascrizione:', error)
      setProcessingProgress(`Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
      
      setTimeout(() => {
        setIsTranscribing(false)
        setProcessingProgress('')
      }, 3000)
    }
  }

  // Funzioni per il player audio
  const togglePlay = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget
    setCurrentTime(audio.currentTime)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget
    setDuration(audio.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    const newTime = parseFloat(e.target.value)
    if (audio) {
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Funzioni per gestire la trascrizione
  const getTranscriptionText = () => {
    if (!currentTranscriptionData?.data) {
      return `Trascrizione di ${transcriptionTitle}

Nessun dato di trascrizione disponibile.`
    }

    const data = currentTranscriptionData.data as AssemblyAIData
    
    // Se c'è il testo completo da AssemblyAI
    if (data.text) {
      return data.text
    }

    // Altrimenti mostra un messaggio di fallback
    return `Trascrizione di ${transcriptionTitle}

Elaborazione completata ma dati non disponibili.`
  }

  const transcriptionText = getTranscriptionText()

  const copyTranscription = async () => {
    try {
      await navigator.clipboard.writeText(transcriptionText)
      setIsCopied(true)
      // Ripristina il testo dopo 2 secondi
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Errore nella copia:', err)
      // In caso di errore, non mostriamo alcun feedback visivo
    }
  }

  const downloadTranscription = () => {
    const blob = new Blob([transcriptionText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${transcriptionTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'intro' as TabType, label: 'Intro', icon: BookOpen },
    { id: 'esecuzioni' as TabType, label: 'Esecuzioni', icon: Activity },
  ]

  const transcriptionTabs = [
    { id: 'trascrizione' as TranscriptionTabType, label: 'Trascrizione', icon: FileText },
    { id: 'dati' as TranscriptionTabType, label: 'Dati di trascrizione', icon: BarChart3 },
  ]

  // Render intro section using component
  const renderIntroSection = () => (
    <IntroSection 
      givenName={givenName}
      functionName={functionName}
      specificId={resolvedParams.specific_id}
      loading={loading}
      onNewTranscription={openNewTranscription}
    />
  )

  // Render esecuzioni section using component
  const renderEsecuzioniSection = () => (
    <EsecuzioniSection 
      transcriptions={transcriptions}
      onOpenTranscription={openExistingTranscription}
    />
  )

  // Render nuova esecuzione section using component
  const renderNuovaEsecuzioneView = () => (
    <div className="flex-1 flex flex-col h-full">
      {/* Header della nuova trascrizione */}
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
                {transcriptionTitle}
              </h1>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contenuto principale */}
      <div className="flex-1 p-6 overflow-auto">
        <NuovaEsecuzioneSection
          transcriptionTitle={transcriptionTitle}
          setTranscriptionTitle={setTranscriptionTitle}
          uploadedFile={uploadedFile}
          handleFileUpload={handleFileUpload}
          startTranscription={startTranscription}
          isTranscribing={isTranscribing}
          processingProgress={processingProgress}
        />
      </div>
    </div>
  )

  // Render visualizza esecuzione section using component
  const renderVisualizzaEsecuzioneView = () => (
    <VisualizzaEsecuzioneSection
      transcriptionTitle={transcriptionTitle}
      setTranscriptionTitle={setTranscriptionTitle}
      isEditingTranscriptionTitle={isEditingTranscriptionTitle}
      setIsEditingTranscriptionTitle={setIsEditingTranscriptionTitle}
      isSavingTranscriptionTitle={isSavingTranscriptionTitle}
      saveTranscriptionTitle={saveTranscriptionTitle}
      currentTranscriptionData={currentTranscriptionData}
      audioUrl={audioUrl}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      activeTranscriptionTab={activeTranscriptionTab}
      setActiveTranscriptionTab={setActiveTranscriptionTab}
      isCopied={isCopied}
      onBackToMain={backToMain}
      togglePlay={togglePlay}
      handleTimeUpdate={handleTimeUpdate}
      handleLoadedMetadata={handleLoadedMetadata}
      handleSeek={handleSeek}
      formatTime={formatTime}
      copyTranscription={copyTranscription}
      downloadTranscription={downloadTranscription}
      getTranscriptionText={getTranscriptionText}
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
      {/* CSS Styles per il player */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00D9AA;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00D9AA;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
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
                  onClick={openNewTranscription}
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
                    <Mic size={16} />
                    + nuova trascrizione
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
