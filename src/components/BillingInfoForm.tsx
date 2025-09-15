'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, User, MapPin, Hash, FileText } from 'lucide-react'

export interface BillingInfo {
  tipo: 'azienda' | 'privato'
  // Dati azienda
  ragioneSociale?: string
  partitaIva?: string
  // Dati privato
  nome?: string
  cognome?: string
  codiceFiscale?: string
  // Indirizzo (comune)
  via: string
  numeroCivico: string
  cap: string
  provincia: string
  stato: string
}

interface BillingInfoFormProps {
  onSubmit: (billingInfo: BillingInfo) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: Partial<BillingInfo>
}

export default function BillingInfoForm({ onSubmit, onCancel, isLoading = false, initialData }: BillingInfoFormProps) {
  const [tipo, setTipo] = useState<'azienda' | 'privato'>(initialData?.tipo || 'privato')
  const [formData, setFormData] = useState<Partial<BillingInfo>>({
    tipo: initialData?.tipo || 'privato',
    nome: initialData?.nome || '',
    cognome: initialData?.cognome || '',
    ragioneSociale: initialData?.ragioneSociale || '',
    codiceFiscale: initialData?.codiceFiscale || '',
    partitaIva: initialData?.partitaIva || '',
    via: initialData?.via || '',
    numeroCivico: initialData?.numeroCivico || '',
    cap: initialData?.cap || '',
    provincia: initialData?.provincia || '',
    stato: initialData?.stato || 'Italia',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof BillingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTipoChange = (newTipo: 'azienda' | 'privato') => {
    setTipo(newTipo)
    setFormData(prev => ({ 
      ...prev, 
      tipo: newTipo,
      // Reset campi specifici quando si cambia tipo
      ...(newTipo === 'azienda' ? {
        nome: '',
        cognome: '',
        codiceFiscale: ''
      } : {
        ragioneSociale: '',
        partitaIva: ''
      })
    }))
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validazione comune
    if (!formData.via?.trim()) newErrors.via = 'Via obbligatoria'
    if (!formData.numeroCivico?.trim()) newErrors.numeroCivico = 'Numero civico obbligatorio'
    if (!formData.cap?.trim()) newErrors.cap = 'CAP obbligatorio'
    if (!formData.provincia?.trim()) newErrors.provincia = 'Provincia obbligatoria'
    if (!formData.stato?.trim()) newErrors.stato = 'Stato obbligatorio'

    // Validazione CAP italiano
    if (formData.cap && !/^\d{5}$/.test(formData.cap)) {
      newErrors.cap = 'CAP deve essere di 5 cifre'
    }

    if (tipo === 'azienda') {
      if (!formData.ragioneSociale?.trim()) newErrors.ragioneSociale = 'Ragione sociale obbligatoria'
      if (!formData.partitaIva?.trim()) newErrors.partitaIva = 'Partita IVA obbligatoria'
    } else {
      if (!formData.nome?.trim()) newErrors.nome = 'Nome obbligatorio'
      if (!formData.cognome?.trim()) newErrors.cognome = 'Cognome obbligatorio'
      if (!formData.codiceFiscale?.trim()) newErrors.codiceFiscale = 'Codice fiscale obbligatorio'
      if (formData.codiceFiscale && !/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(formData.codiceFiscale.toUpperCase())) {
        newErrors.codiceFiscale = 'Formato codice fiscale non valido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData as BillingInfo)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Dati di Fatturazione</h3>
        
        {/* Tipo soggetto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Tipo di soggetto
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTipoChange('privato')}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                tipo === 'privato'
                  ? 'border-[#00D9AA] bg-[#00D9AA]/10'
                  : 'border-gray-700 hover:border-gray-600'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={20} />
                <span className="font-medium">Privato</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('azienda')}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                tipo === 'azienda'
                  ? 'border-[#00D9AA] bg-[#00D9AA]/10'
                  : 'border-gray-700 hover:border-gray-600'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-center gap-2">
                <Building size={20} />
                <span className="font-medium">Azienda</span>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dati specifici per tipo */}
          {tipo === 'azienda' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Ragione Sociale *
                </label>
                <input
                  type="text"
                  value={formData.ragioneSociale || ''}
                  onChange={(e) => handleInputChange('ragioneSociale', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.ragioneSociale ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                {errors.ragioneSociale && (
                  <p className="text-red-400 text-sm mt-1">{errors.ragioneSociale}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Partita IVA *
                </label>
                <input
                  type="text"
                  value={formData.partitaIva || ''}
                  onChange={(e) => handleInputChange('partitaIva', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.partitaIva ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="IT12345678901"
                />
                {errors.partitaIva && (
                  <p className="text-red-400 text-sm mt-1">{errors.partitaIva}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome || ''}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    disabled={isLoading}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                      errors.nome ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.nome && (
                    <p className="text-red-400 text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    value={formData.cognome || ''}
                    onChange={(e) => handleInputChange('cognome', e.target.value)}
                    disabled={isLoading}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                      errors.cognome ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.cognome && (
                    <p className="text-red-400 text-sm mt-1">{errors.cognome}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Codice Fiscale *
                </label>
                <input
                  type="text"
                  value={formData.codiceFiscale || ''}
                  onChange={(e) => handleInputChange('codiceFiscale', e.target.value.toUpperCase())}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.codiceFiscale ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="RSSMRA80A01H501Z"
                />
                {errors.codiceFiscale && (
                  <p className="text-red-400 text-sm mt-1">{errors.codiceFiscale}</p>
                )}
              </div>
            </>
          )}

          {/* Indirizzo */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-md font-medium text-white mb-4 flex items-center gap-2">
              <MapPin size={16} />
              Indirizzo {tipo === 'azienda' ? 'della sede' : 'di residenza'}
            </h4>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Via *
                </label>
                <input
                  type="text"
                  value={formData.via || ''}
                  onChange={(e) => handleInputChange('via', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.via ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Via Roma"
                />
                {errors.via && (
                  <p className="text-red-400 text-sm mt-1">{errors.via}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  N. Civico *
                </label>
                <input
                  type="text"
                  value={formData.numeroCivico || ''}
                  onChange={(e) => handleInputChange('numeroCivico', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.numeroCivico ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="123"
                />
                {errors.numeroCivico && (
                  <p className="text-red-400 text-sm mt-1">{errors.numeroCivico}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  CAP *
                </label>
                <input
                  type="text"
                  value={formData.cap || ''}
                  onChange={(e) => handleInputChange('cap', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.cap ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="00100"
                />
                {errors.cap && (
                  <p className="text-red-400 text-sm mt-1">{errors.cap}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Provincia *
                </label>
                <input
                  type="text"
                  value={formData.provincia || ''}
                  onChange={(e) => handleInputChange('provincia', e.target.value.toUpperCase())}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.provincia ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="RM"
                />
                {errors.provincia && (
                  <p className="text-red-400 text-sm mt-1">{errors.provincia}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Stato *
                </label>
                <input
                  type="text"
                  value={formData.stato || ''}
                  onChange={(e) => handleInputChange('stato', e.target.value)}
                  disabled={isLoading}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA] disabled:opacity-50 ${
                    errors.stato ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Italia"
                />
                {errors.stato && (
                  <p className="text-red-400 text-sm mt-1">{errors.stato}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pulsanti */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#00D9AA] text-black font-semibold rounded-lg hover:bg-[#00B890] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Elaborazione...' : 'Procedi al Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
