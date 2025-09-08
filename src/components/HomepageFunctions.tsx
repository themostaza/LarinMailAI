'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Info,
  X,
  CheckCircle
} from 'lucide-react'
import { IconWithBackground } from '@/components/ui/DynamicIcon'
import { processIconFromDatabase } from '@/lib/database/icon-utils'
import { extractFunctionData } from '@/lib/database/body-parser'
import { useRouter } from 'next/navigation'

// Importo i tipi dal file server
import type { FunctionWithPermissions } from '@/lib/database/functions'

interface HomepageFunctionsProps {
  className?: string
}

export default function HomepageFunctions({ className = '' }: HomepageFunctionsProps) {
  const router = useRouter()
  const [availableFunctions, setAvailableFunctions] = useState<FunctionWithPermissions[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFunction, setSelectedFunction] = useState<FunctionWithPermissions | null>(null)

  // Carica le funzioni dal database usando una chiamata API pubblica
  useEffect(() => {
    async function loadFunctions() {
      try {
        const response = await fetch('/api/functions/public')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setAvailableFunctions(data.data)
          } else {
            console.error('Errore nel caricare le funzioni:', data.error)
          }
        } else {
          console.error('Errore nella richiesta delle funzioni')
        }
      } catch (error) {
        console.error('Errore nel caricare le funzioni:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFunctions()
  }, [])

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

  // Gestione click sui pulsanti "Richiedi" - reindirizza al login
  const handleRequestAccess = () => {
    router.push('/login')
  }

  return (
    <>
      <div className={className}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold mb-8 text-white">Funzioni Disponibili</h3>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                    className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                    onClick={() => openDialog(func)}
                  >
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex justify-center mb-4">
                        <IconWithBackground 
                          iconName={iconName}
                          containerSize="lg"
                          variant="default"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-[#00D9AA] mb-3">{func.name}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {platforms.slice(0, 3).map((platform: string) => (
                            <span 
                              key={platform}
                              className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                            >
                              {platform}
                            </span>
                          ))}
                          {platforms.length > 3 && (
                            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                              +{platforms.length - 3}
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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRequestAccess()
                          }}
                          className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors text-sm"
                        >
                          Richiedi
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              {availableFunctions.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 mb-4">Nessuna funzionalità disponibile al momento</p>
                  <p className="text-sm text-gray-500">Contatta il supporto per maggiori informazioni</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
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
            className="bg-gray-900 border border-gray-700 rounded-xl w-full min-w-[60vw] max-w-4xl max-h-[95vh] overflow-y-auto"
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
                    <p className="text-gray-400 leading-relaxed mb-6 text-left">
                      {description}
                    </p>

                    {/* Setup Required */}
                    {setupRequired.length > 0 && (
                      <div className="mb-6 text-left">
                        <h4 className="text-sm font-medium text-gray-400 mb-3 text-left">Setup richiesto:</h4>
                        <div className="space-y-2">
                          {setupRequired.map((requirement: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 justify-start">
                              <div className="w-3.5 h-3.5 border-2 border-gray-600 rounded-full flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-400 text-left">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="mb-6 text-left">
                        <h4 className="text-sm font-medium text-gray-400 mb-3 text-left">Cosa include:</h4>
                        <div className="space-y-2">
                          {features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 justify-start">
                              <CheckCircle size={14} className="text-[#00D9AA] flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300 text-left">{feature}</span>
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
                    <button 
                      onClick={handleRequestAccess}
                      className="flex items-center gap-2 px-6 py-3 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
                    >
                      Richiedi
                    </button>
                  </div>
                </>
              )
            })()}
          </motion.div>
        </div>
      )}
    </>
  )
}
