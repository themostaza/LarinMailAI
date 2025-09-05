'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  CheckCircle,
  Plus,
  Lock,
  X,
  Info
} from 'lucide-react'
import { IconWithBackground } from '@/components/ui/DynamicIcon'
import ContactSection from '@/components/ContactSection'
import { useAuth } from '@/contexts/AuthContext'
import { processIconFromDatabase } from '@/lib/database/icon-utils'
import { extractFunctionData } from '@/lib/database/body-parser'
import { getUserFunctions, getUserActiveFunctionsAction } from './actions'

// Importo i tipi dal file server
import type { FunctionWithPermissions, ActiveFunctionWithDetails } from '@/lib/database/functions'

export default function ManagePage() {
  const { user } = useAuth()
  const [availableFunctions, setAvailableFunctions] = useState<FunctionWithPermissions[]>([])
  const [activeFunctions, setActiveFunctions] = useState<ActiveFunctionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  
  // Carica le funzioni dal database usando Server Action
  useEffect(() => {
    async function loadFunctions() {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        // Carica sia le funzioni disponibili che quelle attive in parallelo
        const [functionsResult, activeFunctionsResult] = await Promise.all([
          getUserFunctions(),
          getUserActiveFunctionsAction()
        ])
        
        if (functionsResult.success) {
          setAvailableFunctions(functionsResult.data)
        } else {
          console.error('Errore nel caricare le funzioni:', functionsResult.error)
        }
        
        if (activeFunctionsResult.success) {
          setActiveFunctions(activeFunctionsResult.data)
        } else {
          console.error('Errore nel caricare le funzioni attive:', activeFunctionsResult.error)
        }
      } catch (error) {
        console.error('Errore nel caricare le funzioni:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFunctions()
  }, [user])


  const [selectedFunction, setSelectedFunction] = useState<FunctionWithPermissions | null>(null)

  const openDialog = (func: FunctionWithPermissions) => {
    setSelectedFunction(func)
  }

  const closeDialog = () => {
    setSelectedFunction(null)
  }

  // Gestione chiusura dialog con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFunction) {
        closeDialog()
      }
    }

    if (selectedFunction) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedFunction])

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestione <span className="text-[#00D9AA]">Funzionalità</span>
          </h1>
          <p className="text-gray-400">
            Attiva e configura le funzionalità AI disponibili per automatizzare i tuoi processi
          </p>
        </motion.div>
      </div>

      <div className="p-6">
        {/* Le Tue Funzionalità Attive */}
        {activeFunctions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Le tue funzionalità attive</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeFunctions.map((activeFunction, index) => {
                const iconName = processIconFromDatabase(activeFunction.lucide_react_icon)
                
                // Formatta la data di attivazione
                const activationDate = new Date(activeFunction.created_at).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
                
                return (
                  <motion.div
                    key={activeFunction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-[#00D9AA]/5 border border-[#00D9AA]/30 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconWithBackground 
                          iconName={iconName}
                          containerSize="md"
                          variant="primary"
                        />
                        <div>
                          <h3 className="font-semibold text-white">
                            {activeFunction.given_name || activeFunction.function_name || 'Funzione senza nome'}
                          </h3>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">
                              {activeFunction.function_name || 'Funzione non trovata'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Attivata il {activationDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button 
                          className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
                          onClick={() => {
                            // Qui puoi aggiungere la logica per entrare nella funzione specifica
                            // Per esempio: router.push(`/larin_functions/${activeFunction.function_slug}/${activeFunction.unique_public_code}`)
                            console.log('Entrando nella funzione:', activeFunction)
                          }}
                        >
                          Entra
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Funzionalità Disponibili */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Funzionalità disponibili</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableFunctions.map((func, index) => {
                const iconName = processIconFromDatabase(func.lucide_react_icon)
                
                // Estrazione dati dal body usando la funzione helper
                const { platforms } = extractFunctionData(func.body)
                
                return (
                  <motion.div
                    key={func.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-gray-900/30 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => openDialog(func)}
                  >
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <IconWithBackground 
                          iconName={iconName}
                          containerSize="lg"
                          variant="default"
                        />
                        {!func.available && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
                            <Lock size={12} className="text-orange-400" />
                            <span className="text-xs text-orange-400">Richiesto</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{func.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {platforms.slice(0, 2).map((platform: string) => (
                            <span 
                              key={platform}
                              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                            >
                              {platform}
                            </span>
                          ))}
                          {platforms.length > 2 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                              +{platforms.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            openDialog(func)
                          }}
                          className="flex items-center gap-2 text-[#00D9AA] hover:text-[#00D9AA]/80 transition-colors text-sm font-medium"
                        >
                          <Info size={16} />
                          Dettagli
                        </button>
                        {func.available ? (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors text-sm"
                          >
                            Attiva
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg font-medium hover:bg-orange-500/30 transition-colors text-sm"
                          >
                            Richiedi
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              {availableFunctions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Nessuna funzionalità disponibile al momento</p>
                  <p className="text-sm text-gray-500">Contatta il supporto per maggiori informazioni</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Sezione Richiesta Funzionalità */}
        <ContactSection className="mt-12" delay={0.3} />
      </div>

      {/* Dialog per i dettagli della funzione */}
      {selectedFunction && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeDialog}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const iconName = processIconFromDatabase(selectedFunction.lucide_react_icon)
              const { platforms, features, setupRequired, description } = extractFunctionData(selectedFunction.body)
              
              return (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                      <IconWithBackground 
                        iconName={iconName}
                        containerSize="lg"
                        variant="default"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-white">{selectedFunction.name}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {platforms.map((platform: string) => (
                            <span 
                              key={platform}
                              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeDialog}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {description}
                    </p>

                    {/* Setup Required */}
                    {setupRequired.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Setup richiesto:</h4>
                        <div className="space-y-2">
                          {setupRequired.map((requirement: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-3.5 h-3.5 border-2 border-gray-600 rounded-full flex-shrink-0" />
                              <span className="text-sm text-gray-400">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Cosa include:</h4>
                        <div className="space-y-2">
                          {features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-[#00D9AA] flex-shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-6 border-t border-gray-700">
                    <button
                      onClick={closeDialog}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Chiudi
                    </button>
                    {selectedFunction.available ? (
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors">
                        <Plus size={16} />
                        Attiva nuova funzionalità
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 px-6 py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg font-medium hover:bg-orange-500/30 transition-colors">
                        <Lock size={16} />
                        Richiedi attivazione
                      </button>
                    )}
                  </div>
                </>
              )
            })()}
          </motion.div>
        </div>
      )}
    </div>
  )
}