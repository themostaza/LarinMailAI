'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { 
  BookOpen,
  Settings,
  Activity,
  Edit2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getFunctionBySpecificId, updateFunctionGivenName } from './actions'
import IntroSection from './IntroSection'
import ConfiguraSection from './ConfiguraSection'
import EsecuzioniSection from './EsecuzioniSection'

type TabType = 'intro' | 'configura' | 'esecuzioni'

interface PageProps {
  params: Promise<{
    specific_id: string
  }>
}

export default function AutomationPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState<TabType>('intro')
  const [givenName, setGivenName] = useState<string>('Automazione AI')
  const [functionName, setFunctionName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [tempTitle, setTempTitle] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
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
        setGivenName(result.data.given_name || 'Automazione AI')
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

  const tabs = [
    { id: 'intro' as TabType, label: 'Intro', icon: BookOpen },
    { id: 'configura' as TabType, label: 'Configura', icon: Settings },
    { id: 'esecuzioni' as TabType, label: 'Esecuzioni', icon: Activity },
  ]





  return (
    <div className="flex-1 flex flex-col">
        {/* Header with tabs */}
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 group">
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
              
              {/* Main Navigation Tabs - sulla stessa linea del titolo */}
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
            </div>
          </motion.div>
        </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'intro' && (
          <IntroSection 
            givenName={givenName}
            functionName={functionName}
            specificId={resolvedParams.specific_id}
            loading={loading}
          />
        )}
        {activeTab === 'configura' && <ConfiguraSection />}
        {activeTab === 'esecuzioni' && <EsecuzioniSection />}
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
                disabled={isSaving}
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
  )
}
