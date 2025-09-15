'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Euro } from 'lucide-react'
import BillingInfoForm, { BillingInfo } from './BillingInfoForm'
import { getUserLatestBillingData } from '@/app/manage/actions'

interface RechargeDialogProps {
  isOpen: boolean
  onClose: () => void
  currentCredits: number
}

export default function RechargeDialog({ isOpen, onClose, currentCredits }: RechargeDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription')
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [savedBillingData, setSavedBillingData] = useState<Partial<BillingInfo> | null>(null)
  const [loadingBillingData, setLoadingBillingData] = useState(false)

  const presetAmounts = [10, 15, 25, 50]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 10) {
      setSelectedAmount(numValue)
      setCustomAmount(value)
    } else {
      setCustomAmount(value)
    }
  }

  const handleProceedToBilling = async () => {
    if (selectedAmount < 10) {
      return
    }
    
    // Carica i dati di fatturazione salvati se non sono già stati caricati
    if (!savedBillingData && !loadingBillingData) {
      setLoadingBillingData(true)
      try {
        const result = await getUserLatestBillingData()
        if (result.success && result.data) {
          setSavedBillingData(result.data)
        }
      } catch (error) {
        console.error('Errore nel caricare i dati di fatturazione:', error)
      } finally {
        setLoadingBillingData(false)
      }
    }
    
    setShowBillingForm(true)
  }

  const handleBillingSubmit = async (billing: BillingInfo) => {
    setBillingInfo(billing)
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          paymentType: paymentType,
          billingInfo: billing,
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Reindirizza a Stripe Checkout
        window.location.href = data.url
      } else {
        console.error('Errore nella creazione della sessione:', data.error)
        alert('Errore nel processare il pagamento. Riprova più tardi.')
      }
    } catch (error) {
      console.error('Errore nella ricarica:', error)
      alert('Errore di connessione. Riprova più tardi.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToAmount = () => {
    setShowBillingForm(false)
    setBillingInfo(null)
  }

  // Carica i dati di fatturazione quando il dialog si apre
  useEffect(() => {
    if (isOpen && !savedBillingData && !loadingBillingData) {
      const loadBillingData = async () => {
        setLoadingBillingData(true)
        try {
          const result = await getUserLatestBillingData()
          if (result.success && result.data) {
            setSavedBillingData(result.data)
          }
        } catch (error) {
          console.error('Errore nel caricare i dati di fatturazione:', error)
        } finally {
          setLoadingBillingData(false)
        }
      }
      loadBillingData()
    }
  }, [isOpen, savedBillingData, loadingBillingData])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
            style={{ height: '95vh', minWidth: '60vw' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00D9AA] rounded-full flex items-center justify-center">
                  <CreditCard size={20} className="text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Ricarica Crediti</h2>
                  <p className="text-sm text-gray-400">Aggiungi crediti al tuo account</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!showBillingForm ? (
                <div className="space-y-8">
                  {/* Crediti Attuali */}
                  <div className="bg-gradient-to-r from-[#00D9AA]/10 to-[#00B890]/10 border border-[#00D9AA]/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Crediti disponibili</span>
                      <span className="text-2xl font-bold text-[#00D9AA]">
                        {currentCredits.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Tipo di Pagamento */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Tipo di pagamento</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <button
                        onClick={() => setPaymentType('subscription')}
                        disabled={isProcessing}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          paymentType === 'subscription'
                            ? 'border-[#00D9AA] bg-[#00D9AA]/10'
                            : 'border-gray-700 hover:border-gray-600'
                        } disabled:opacity-50`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold text-white mb-1">Abbonamento Mensile</div>
                          <div className="text-xs text-gray-400">Rinnovo automatico</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentType('one-time')}
                        disabled={isProcessing}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          paymentType === 'one-time'
                            ? 'border-[#00D9AA] bg-[#00D9AA]/10'
                            : 'border-gray-700 hover:border-gray-600'
                        } disabled:opacity-50`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold text-white mb-1">Una Tantum</div>
                          <div className="text-xs text-gray-400">Pagamento singolo</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Selezione Importo */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Seleziona importo {paymentType === 'subscription' ? 'abbonamento mensile' : 'ricarica'}
                    </h3>
                    
                    {/* Preset Amounts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          disabled={isProcessing}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedAmount === amount && !customAmount
                              ? 'border-[#00D9AA] bg-[#00D9AA]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          } disabled:opacity-50`}
                        >
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">€{amount}</div>
                            <div className="text-xs text-gray-400">
                              {paymentType === 'subscription' ? `${amount} crediti/mese` : `+${amount} crediti`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Importo personalizzato (min. €10){paymentType === 'subscription' ? ' mensile' : ''}
                      </label>
                      <div className="relative">
                        <Euro size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min="10"
                          step="0.01"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          disabled={isProcessing}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50"
                          placeholder="Inserisci importo"
                        />
                      </div>
                      {customAmount && parseFloat(customAmount) < 10 && (
                        <p className="text-red-400 text-sm mt-1">L&apos;importo minimo è €10</p>
                      )}
                    </div>
                  </div>

                  {/* Informativa Crediti */}
                  <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                    <div className="text-left">
                      <div className="font-semibold text-gray-200 mb-2">Politica di utilizzo crediti</div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <strong>Utilizzo minimo richiesto:</strong> 6 crediti al mese.<br/>
                        Se utilizzi meno di 6 crediti, la piattaforma trattiene la differenza tra i crediti non utilizzati e il minimo richiesto.
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        <strong>Esempio:</strong> Se utilizzi solo 3 crediti, verranno trattenuti 3 crediti aggiuntivi (6 - 3 = 3).
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <BillingInfoForm 
                  onSubmit={handleBillingSubmit}
                  onCancel={handleBackToAmount}
                  isLoading={isProcessing}
                  initialData={savedBillingData || undefined}
                />
              )}
            </div>

            {/* Footer */}
            {!showBillingForm && (
              <div className="border-t border-gray-800 p-6 flex-shrink-0">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleProceedToBilling}
                    disabled={selectedAmount < 10 || isProcessing || loadingBillingData}
                    className="flex-1 px-6 py-3 bg-[#00D9AA] text-black font-semibold rounded-lg hover:bg-[#00B890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingBillingData ? 'Caricamento...' : (
                      paymentType === 'subscription' 
                        ? `Continua - €${selectedAmount.toFixed(2)}/mese`
                        : `Continua - €${selectedAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}