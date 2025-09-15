'use client'

import { motion } from 'framer-motion'
import { 
  FileText,
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Building,
  Hash
} from 'lucide-react'

interface NuovaEsecuzioneSectionProps {
  compilationTitle: string
  setCompilationTitle: (title: string) => void
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  startCompilation: () => void
  isCompiling: boolean
  processingProgress: string
}

// Helper functions per gestire i valori del form in modo type-safe
const getFormValue = (data: Record<string, unknown>, key: string): string => {
  const value = data[key]
  return typeof value === 'string' ? value : ''
}

const updateFormValue = (
  data: Record<string, unknown>, 
  key: string, 
  value: string
): Record<string, unknown> => {
  return { ...data, [key]: value }
}

export default function NuovaEsecuzioneSection({ 
  compilationTitle,
  setCompilationTitle,
  formData,
  setFormData,
  startCompilation,
  isCompiling,
  processingProgress
}: NuovaEsecuzioneSectionProps) {

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const isFormValid = () => {
    const requiredFields = ['nome', 'cognome', 'email', 'telefono', 'indirizzo', 'citta', 'cap', 'azienda']
    return requiredFields.every(field => getFormValue(formData, field).trim() !== '')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Titolo Sezione */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Titolo Documento</h3>
        <input
          type="text"
          value={compilationTitle}
          onChange={(e) => setCompilationTitle(e.target.value)}
          placeholder="Inserisci il titolo del documento..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
        />
      </div>

      {/* Form Dati Personali */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <User size={20} className="text-[#00D9AA]" />
          Dati Personali
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'nome')}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Inserisci il nome..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cognome *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'cognome')}
              onChange={(e) => handleInputChange('cognome', e.target.value)}
              placeholder="Inserisci il cognome..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 items-center gap-2">
              <Mail size={16} />
              Email *
            </label>
            <input
              type="email"
              value={getFormValue(formData, 'email')}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="esempio@email.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 items-center gap-2">
              <Phone size={16} />
              Telefono *
            </label>
            <input
              type="tel"
              value={getFormValue(formData, 'telefono')}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="+39 123 456 7890"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 items-center gap-2">
              <Calendar size={16} />
              Data di Nascita
            </label>
            <input
              type="date"
              value={getFormValue(formData, 'dataNascita')}
              onChange={(e) => handleInputChange('dataNascita', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 items-center gap-2">
              <Hash size={16} />
              Codice Fiscale
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'codiceFiscale')}
              onChange={(e) => handleInputChange('codiceFiscale', e.target.value.toUpperCase())}
              placeholder="RSSMRA80A01H501Z"
              maxLength={16}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent uppercase"
            />
          </div>
        </div>
      </div>

      {/* Form Indirizzo */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <MapPin size={20} className="text-[#00D9AA]" />
          Indirizzo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Via/Indirizzo *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'indirizzo')}
              onChange={(e) => handleInputChange('indirizzo', e.target.value)}
              placeholder="Via Roma 123"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CAP *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'cap')}
              onChange={(e) => handleInputChange('cap', e.target.value)}
              placeholder="00100"
              maxLength={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Città *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'citta')}
              onChange={(e) => handleInputChange('citta', e.target.value)}
              placeholder="Roma"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Provincia
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'provincia')}
              onChange={(e) => handleInputChange('provincia', e.target.value.toUpperCase())}
              placeholder="RM"
              maxLength={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent uppercase"
            />
          </div>
        </div>
      </div>

      {/* Form Dati Professionali */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Building size={20} className="text-[#00D9AA]" />
          Dati Professionali
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Azienda *
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'azienda')}
              onChange={(e) => handleInputChange('azienda', e.target.value)}
              placeholder="Nome Azienda S.r.l."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ruolo/Posizione
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'ruolo')}
              onChange={(e) => handleInputChange('ruolo', e.target.value)}
              placeholder="Manager, Sviluppatore, ecc."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Partita IVA
            </label>
            <input
              type="text"
              value={getFormValue(formData, 'partitaIva')}
              onChange={(e) => handleInputChange('partitaIva', e.target.value)}
              placeholder="12345678901"
              maxLength={11}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Settore
            </label>
            <select
              value={getFormValue(formData, 'settore')}
              onChange={(e) => handleInputChange('settore', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
            >
              <option value="">Seleziona settore...</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="finanza">Finanza</option>
              <option value="sanita">Sanità</option>
              <option value="educazione">Educazione</option>
              <option value="retail">Retail</option>
              <option value="manifatturiero">Manifatturiero</option>
              <option value="servizi">Servizi</option>
              <option value="altro">Altro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Note Aggiuntive */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Note Aggiuntive</h3>
        <textarea
            value={getFormValue(formData, 'note')}
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="Inserisci eventuali note o informazioni aggiuntive..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent resize-none"
        />
      </div>

      {/* Compila PDF Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={startCompilation}
          disabled={!isFormValid() || isCompiling}
          className={`relative px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg text-lg overflow-hidden ${
            !isFormValid() ? 'opacity-50 cursor-not-allowed bg-gray-700' : ''
          }`}
          whileHover={isFormValid() ? { scale: 1.05 } : {}}
          whileTap={isFormValid() ? { scale: 0.95 } : {}}
        >
          {isFormValid() && (
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
            {isCompiling ? (
              <>
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Compilazione in corso...
              </>
            ) : (
              <>
                <FileText size={20} />
                Compila PDF
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Results Placeholder durante compilazione */}
      {isCompiling && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 border-2 border-[#00D9AA] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-medium">Compilazione PDF in corso...</span>
          </div>
          {processingProgress && (
            <div className="mb-4">
              <p className="text-[#00D9AA] text-sm font-medium">{processingProgress}</p>
            </div>
          )}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ Il documento PDF verrà generato automaticamente. Non chiudere questa pagina.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
