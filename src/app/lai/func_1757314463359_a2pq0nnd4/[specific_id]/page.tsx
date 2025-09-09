'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { 
  BookOpen,
  Activity,
  Mic,
  FileText,
  Users,
  Clock,
  Play,
  CheckCircle,
  Calendar,
  Edit2,
  ArrowLeft,
  Upload,
  File,
  BarChart3,
  Pause,
  Copy,
  FileDown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getFunctionBySpecificId, updateFunctionGivenName } from './actions'

type TabType = 'intro' | 'esecuzioni'
type ViewType = 'main' | 'transcription'
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [isExistingTranscription, setIsExistingTranscription] = useState<boolean>(false)
  
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

  // Funzioni per la vista trascrizione
  const openNewTranscription = () => {
    const today = new Date().toLocaleDateString('it-IT')
    setTranscriptionTitle(`Nuova trascrizione del ${today}`)
    setCurrentView('transcription')
    setUploadedFile(null)
    setIsTranscribing(false)
    setIsExistingTranscription(false)
  }

  const openExistingTranscription = (title: string) => {
    setTranscriptionTitle(title)
    setCurrentView('transcription')
    setIsTranscribing(false) // Trascrizione già completata
    setUploadedFile(null) // Non mostriamo l'upload per trascrizioni esistenti
    setIsExistingTranscription(true) // È una trascrizione esistente
    // Simulo un file audio per demo - in futuro verrà caricato dal database
    setAudioUrl('/demo-audio.mp3') // URL placeholder
    // Qui in futuro caricheremo i dati esistenti
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

  const startTranscription = () => {
    if (!uploadedFile) return
    setIsTranscribing(true)
    // Qui implementeremo la logica di trascrizione
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
  const transcriptionText = `Trascrizione della riunione - ${transcriptionTitle}

Durata: 2h 15min
Data: ${new Date().toLocaleDateString('it-IT')}

---

Partecipanti: Marco Rossi, Laura Bianchi, Giuseppe Verdi

[00:00:15] Marco: Buongiorno a tutti, iniziamo con il primo punto all'ordine del giorno.

[00:01:30] Laura: Perfetto, per quanto riguarda il progetto Alpha, abbiamo completato la fase di analisi e siamo pronti per passare allo sviluppo.

[00:02:45] Giuseppe: Ottimo lavoro Laura. Vorrei aggiungere che abbiamo identificato alcune criticità che dovremmo affrontare prima di procedere.

[00:04:20] Marco: Puoi essere più specifico Giuseppe?

[00:05:10] Giuseppe: Certamente. Il primo problema riguarda l'integrazione con il sistema legacy, il secondo è relativo alle performance durante i picchi di carico.

[00:07:30] Laura: Per l'integrazione, propongo di creare un layer di astrazione che ci permetta di interfacciarci con il sistema esistente senza modificarlo drasticamente.

[00:09:15] Marco: Mi sembra una soluzione sensata. E per le performance?

[00:10:45] Giuseppe: Dovremmo implementare un sistema di caching distribuito e ottimizzare le query del database.

---

DECISIONI PRESE:
- Implementare layer di astrazione per integrazione legacy
- Sviluppare sistema di caching distribuito
- Ottimizzare query database prima del rilascio

ACTION ITEMS:
- Laura: Progettare architettura layer di astrazione (Scadenza: 20/01/2024)
- Giuseppe: Implementare sistema di caching (Scadenza: 25/01/2024)
- Marco: Coordinare ottimizzazione database (Scadenza: 22/01/2024)

PROSSIMA RIUNIONE: 30/01/2024 ore 14:00`

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

  const renderIntroSection = () => (
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
            {functionName} <span className="text-[#00D9AA]">• ID: {resolvedParams.specific_id}</span>
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

  const renderEsecuzioniSection = () => (
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
              <p className="text-2xl font-bold text-white">127</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ore Trascritte</p>
              <p className="text-2xl font-bold text-white">284h</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-2">Media 2.2h per trascrizione</p>
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
                <th className="text-left py-3 px-4 font-medium text-gray-300">Minutaggio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Stato</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Riunione Strategica Q1 2024', date: '2024-01-15', duration: '2h 15min', status: 'Completata' },
                { title: 'Review Progetto Alpha', date: '2024-01-14', duration: '1h 45min', status: 'Completata' },
                { title: 'Standup Team Development', date: '2024-01-14', duration: '30min', status: 'Completata' },
                { title: 'Presentazione Cliente Beta', date: '2024-01-13', duration: '1h 20min', status: 'Completata' },
                { title: 'All-Hands Meeting', date: '2024-01-12', duration: '3h 10min', status: 'Completata' },
                { title: 'Brainstorming Marketing', date: '2024-01-11', duration: '1h 50min', status: 'In elaborazione' },
              ].map((transcription, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{transcription.title}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {transcription.date}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {transcription.duration}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transcription.status === 'Completata' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {transcription.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => openExistingTranscription(transcription.title)}
                      className="px-3 py-1 bg-[#00D9AA] text-black rounded-lg text-sm font-medium hover:bg-[#00D9AA]/90 transition-colors"
                    >
                      Visualizza
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )

  const renderTranscriptionView = () => (
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
      
      <div className="flex-1 flex flex-col h-full">
      {/* Header della trascrizione */}
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
              <div className="flex items-center gap-2 group">
                {isEditingTranscriptionTitle ? (
                  <input
                    type="text"
                    value={transcriptionTitle}
                    onChange={(e) => setTranscriptionTitle(e.target.value)}
                    onBlur={() => setIsEditingTranscriptionTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingTranscriptionTitle(false)
                    }}
                    className="text-3xl font-bold bg-transparent border-b-2 border-[#00D9AA] text-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white">
                      {transcriptionTitle}
                    </h1>
                    <button
                      onClick={() => setIsEditingTranscriptionTitle(true)}
                      className="p-1 text-gray-400 hover:text-[#00D9AA] transition-colors opacity-0 group-hover:opacity-100"
                      title="Modifica titolo"
                    >
                      <Edit2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
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
          {/* Upload File Section - Solo per nuove trascrizioni */}
          {!isExistingTranscription && (
            <>
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Carica File Audio</h3>
                
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-[#00D9AA]/50 transition-colors">
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,.flac,.ogg,.wma,.aac,.webm"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} className="text-[#00D9AA]" />
                    </div>
                    <p className="text-lg font-medium text-white mb-2">
                      {uploadedFile ? uploadedFile.name : 'Clicca per caricare un file audio'}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Formati supportati: MP3, WAV, M4A, FLAC, OGG, WMA, AAC, WebM
                    </p>
                    {uploadedFile && (
                      <div className="flex items-center justify-center gap-2 text-[#00D9AA]">
                        <File size={16} />
                        <span className="text-sm font-medium">File caricato: {uploadedFile.name}</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Start Transcription Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={startTranscription}
                  disabled={!uploadedFile || isTranscribing}
                  className={`relative px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg text-lg overflow-hidden ${
                    !uploadedFile ? 'opacity-50 cursor-not-allowed bg-gray-700' : ''
                  }`}
                  whileHover={uploadedFile ? { scale: 1.05 } : {}}
                  whileTap={uploadedFile ? { scale: 0.95 } : {}}
                >
                  {uploadedFile && (
                    <>
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
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3 text-black">
                    {isTranscribing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Trascrizione in corso...
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Avvia Trascrizione
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Results Placeholder durante trascrizione */}
              {isTranscribing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 border-2 border-[#00D9AA] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white font-medium">Elaborazione in corso...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Tab per trascrizioni completate */}
          {isExistingTranscription && (
            <>
              {/* Audio Player Section */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
                {/* Hidden Audio Element */}
                <audio
                  id="audio-player"
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                />

                {/* File Info */}
                <div className="mb-4">
                  <p className="text-white font-medium">Registrazione Riunione • 2h 15min • 45.2 MB • MP3</p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-[#00D9AA] hover:bg-[#00D9AA]/90 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-black" />
                    ) : (
                      <Play size={20} className="text-black ml-1" />
                    )}
                  </button>

                  {/* Time Display */}
                  <span className="text-sm text-gray-400 font-mono min-w-[50px]">
                    {formatTime(currentTime)}
                  </span>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #00D9AA 0%, #00D9AA ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                      }}
                    />
                  </div>

                  {/* Duration */}
                  <span className="text-sm text-gray-400 font-mono min-w-[50px]">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-700">
                <div className="flex space-x-1">
                  {transcriptionTabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTranscriptionTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                          activeTranscriptionTab === tab.id
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
              <div className="min-h-[400px]">
                {activeTranscriptionTab === 'trascrizione' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white"></h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={copyTranscription}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              isCopied 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                            title="Copia trascrizione"
                          >
                            <Copy size={16} />
                            {isCopied ? 'Copiato!' : 'Copia'}
                          </button>
                          <button
                            onClick={downloadTranscription}
                            className="flex items-center gap-2 px-3 py-2 bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black rounded-lg transition-colors text-sm font-medium"
                            title="Scarica come TXT"
                          >
                            <FileDown size={16} />
                            Scarica TXT
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-6">
                        <div className="prose prose-invert max-w-none">
                          <div className="space-y-4 text-gray-300 leading-relaxed font-mono text-sm">
                            <div className="border-b border-gray-600 pb-4 mb-4">
                              <p className="text-white font-semibold">{transcriptionTitle}</p>
                              <p className="text-gray-400 text-xs mt-1">Durata: 2h 15min • Data: {new Date().toLocaleDateString('it-IT')}</p>
                            </div>
                            
                            <div className="space-y-3">
                              <p><span className="text-gray-400">Partecipanti:</span> Marco Rossi, Laura Bianchi, Giuseppe Verdi</p>
                              
                              <div className="space-y-3 mt-6">
                                <p><span className="text-[#00D9AA] font-medium">[00:00:15]</span> <span className="text-blue-400">Marco:</span> Buongiorno a tutti, iniziamo con il primo punto all ordine del giorno.</p>
                                
                                <p><span className="text-[#00D9AA] font-medium">[00:01:30]</span> <span className="text-purple-400">Laura:</span> Perfetto, per quanto riguarda il progetto Alpha, abbiamo completato la fase di analisi e siamo pronti per passare allo sviluppo.</p>
                                
                                <p><span className="text-[#00D9AA] font-medium">[00:02:45]</span> <span className="text-yellow-400">Giuseppe:</span> Ottimo lavoro Laura. Vorrei aggiungere che abbiamo identificato alcune criticità che dovremmo affrontare prima di procedere.</p>
                                
                                <p><span className="text-[#00D9AA] font-medium">[00:04:20]</span> <span className="text-blue-400">Marco:</span> Puoi essere più specifico Giuseppe?</p>
                                
                                <p><span className="text-[#00D9AA] font-medium">[00:05:10]</span> <span className="text-yellow-400">Giuseppe:</span> Certamente. Il primo problema riguarda l integrazione con il sistema legacy, il secondo è relativo alle performance durante i picchi di carico.</p>
                                
                                <p><span className="text-[#00D9AA] font-medium">[00:07:30]</span> <span className="text-purple-400">Laura:</span> Per l integrazione, propongo di creare un layer di astrazione che ci permetta di interfacciarci con il sistema esistente senza modificarlo drasticamente.</p>
                              </div>
                              
                              <div className="border-t border-gray-600 pt-4 mt-6">
                                <p className="text-white font-semibold mb-3">DECISIONI PRESE:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                  <li>Implementare layer di astrazione per integrazione legacy</li>
                                  <li>Sviluppare sistema di caching distribuito</li>
                                  <li>Ottimizzare query database prima del rilascio</li>
                                </ul>
                              </div>
                              
                              <div className="border-t border-gray-600 pt-4 mt-4">
                                <p className="text-white font-semibold mb-3">ACTION ITEMS:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                  <li><span className="text-purple-400">Laura:</span> Progettare architettura layer di astrazione (Scadenza: 20/01/2024)</li>
                                  <li><span className="text-yellow-400">Giuseppe:</span> Implementare sistema di caching (Scadenza: 25/01/2024)</li>
                                  <li><span className="text-blue-400">Marco:</span> Coordinare ottimizzazione database (Scadenza: 22/01/2024)</li>
                                </ul>
                              </div>
                              
                              <div className="border-t border-gray-600 pt-4 mt-4">
                                <p className="text-white font-semibold">PROSSIMA RIUNIONE:</p>
                                <p className="text-[#00D9AA]">30/01/2024 ore 14:00</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTranscriptionTab === 'dati' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Metadati</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Durata:</span>
                            <span className="text-white">2h 15min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Formato:</span>
                            <span className="text-white">MP3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Dimensione:</span>
                            <span className="text-white">45.2 MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Precisione:</span>
                            <span className="text-white">97.8%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Statistiche</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Parole totali:</span>
                            <span className="text-white">1,847</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Parlatori:</span>
                            <span className="text-white">3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Pause:</span>
                            <span className="text-white">42</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Velocità media:</span>
                            <span className="text-white">145 wpm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
      </div>
    </>
  )

  // Renderizza la vista corrente
  if (currentView === 'transcription') {
    return renderTranscriptionView()
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
