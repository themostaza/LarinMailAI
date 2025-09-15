'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Settings, Filter, Database, FileText, Upload, Type, HelpCircle, X, Plus, Trash2 } from 'lucide-react'

type ConfigTabType = 'parametri' | 'filtro email' | 'filtro AI' | 'rag' | 'istruzioni'

export default function ConfiguraSection() {
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTabType>('parametri')
  
  // Stati per i dialogs RAG
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showFaqDialog, setShowFaqDialog] = useState(false)
  const [textTitle, setTextTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [faqTitle, setFaqTitle] = useState('')
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([{ question: '', answer: '' }])
  // Stato Istruzioni
  const [instructionModel, setInstructionModel] = useState('gpt-4')
  const [instructionText, setInstructionText] = useState('')

  // Stato Filtro Email
  const [emailFilterEnabled, setEmailFilterEnabled] = useState(true)
  const [selectedFolders, setSelectedFolders] = useState<string[]>(['INBOX'])
  const [newFolderInput, setNewFolderInput] = useState('')
  const [allowAddresses, setAllowAddresses] = useState('')
  const [allowDomains, setAllowDomains] = useState('')
  const [blockAddresses, setBlockAddresses] = useState('')
  const [blockDomains, setBlockDomains] = useState('')
  const [subjectInclude, setSubjectInclude] = useState('')
  const [subjectExclude, setSubjectExclude] = useState('')
  const [hasAttachments, setHasAttachments] = useState(false)
  const [directOnly, setDirectOnly] = useState(false)
  const [ignoreAutomations, setIgnoreAutomations] = useState(true)
  const [timeFrom, setTimeFrom] = useState('09:00')
  const [timeTo, setTimeTo] = useState('18:00')

  const handleSaveEmailFilter = () => {
    const config = {
      enabled: emailFilterEnabled,
      folders: { mode: 'include', list: (selectedFolders.length ? selectedFolders : ['INBOX']).map(f => f.trim()).filter(Boolean) },
      allowlist: {
        addresses: allowAddresses.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
        domains: allowDomains.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
      },
      blocklist: {
        addresses: blockAddresses.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
        domains: blockDomains.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
      },
      criteria: {
        subjectContains: subjectInclude.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
        subjectExcludes: subjectExclude.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
        hasAttachments,
        timeWindow: { from: timeFrom, to: timeTo },
        directOnly,
        ignoreAutomations,
      },
    }
    console.log('EmailFilterConfig:', config)
  }

  // Funzioni helper per FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }])
  }

  const removeFaq = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index))
    }
  }

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    )
    setFaqs(updatedFaqs)
  }

  // Funzione per gestire upload documento
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File caricato:', file.name)
      // TODO: Implementare logica di upload
    }
  }

  const configTabs = [
    { id: 'parametri' as ConfigTabType, label: 'parametri base', icon: Settings },
    { id: 'filtro email' as ConfigTabType, label: 'filtro email', icon: Filter },
    { id: 'filtro AI' as ConfigTabType, label: 'filtro AI', icon: Filter },
    { id: 'rag' as ConfigTabType, label: 'RAG', icon: Database },
    { id: 'istruzioni' as ConfigTabType, label: 'istruzioni', icon: FileText },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sub-tabs for Configura */}
      <div className="border-b border-gray-800">
        <div className="flex space-x-1">
          {configTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveConfigTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                  activeConfigTab === tab.id
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

      {/* Content based on active config tab */}
      <div className="min-h-[400px]">
        {activeConfigTab === 'parametri' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">parametri base</h3>
            
            {/* Connessione Email Provider */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Connessione Email</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Provider Email</label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent">
                    <option value="gmail">Gmail</option>
                    <option value="outlook" disabled>Outlook (Prossimamente)</option>
                  </select>
                </div>
                
                {/* Status di Connessione */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Non Connesso</p>
                      <p className="text-xs text-gray-400">Nessun account Gmail collegato</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors">
                    Connetti Gmail
                  </button>
                </div>
                
                {/* Esempio di stato connesso (commentato per ora) */}
                {/* 
                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Connesso</p>
                      <p className="text-xs text-gray-400">mario.rossi@gmail.com</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
                    Disconnetti
                  </button>
                </div>
                */}
              </div>
            </div>


          </div>
        )}

        {activeConfigTab === 'filtro email' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">filtro email</h3>

            {/* Toggle per attivare/disattivare il filtro email */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Filtro Email</h4>
                  <p className="text-sm text-gray-400">Processa solo le email che rispettano questi criteri</p>
                </div>
                <button
                  onClick={() => setEmailFilterEnabled(v => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:ring-offset-2 focus:ring-offset-gray-900 ${emailFilterEnabled ? 'bg-[#00D9AA]' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailFilterEnabled ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </button>
              </div>
            </div>

            {/* Selezione Cartelle (multi) */}
            <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-6 ${!emailFilterEnabled ? 'opacity-60' : ''}`}>
              <h4 className="text-lg font-medium text-white mb-4">Cartelle incluse</h4>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedFolders.map((folder, idx) => (
                    <span key={`${folder}-${idx}`} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200">
                      {folder}
                      <button
                        onClick={() => setSelectedFolders(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-gray-700 rounded"
                        disabled={!emailFilterEnabled}
                        aria-label={`Rimuovi ${folder}`}
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </span>
                  ))}
                  {selectedFolders.length === 0 && (
                    <span className="text-sm text-gray-500">Nessuna cartella selezionata</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFolderInput}
                    onChange={e => setNewFolderInput(e.target.value)}
                    placeholder="Es. INBOX, label:Clienti, Progetti/2025"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    disabled={!emailFilterEnabled}
                  />
                  <button
                    onClick={() => {
                      const f = newFolderInput.trim()
                      if (!f) return
                      setSelectedFolders(prev => (prev.includes(f) ? prev : [...prev, f]))
                      setNewFolderInput('')
                    }}
                    className="px-3 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
                    disabled={!emailFilterEnabled}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Gmail usa etichette (es. INBOX), Outlook usa cartelle. Puoi aggiungerne più di una.</p>
              </div>
            </div>

            {/* Allowlist / Blocklist */}
            <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-6 ${!emailFilterEnabled ? 'opacity-60' : ''}`}>
              <h4 className="text-lg font-medium text-white mb-4">Allowlist e Blocklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Indirizzi consentiti</label>
                  <textarea
                    value={allowAddresses}
                    onChange={e => setAllowAddresses(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={4}
                    placeholder={"uno per riga\nanna@partner.com\n*@azienda.it"}
                    disabled={!emailFilterEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Supporta wildcard: *@dominio.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domini consentiti</label>
                  <textarea
                    value={allowDomains}
                    onChange={e => setAllowDomains(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={4}
                    placeholder={"uno per riga\npartner.com\nazienza.it"}
                    disabled={!emailFilterEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Indirizzi bloccati</label>
                  <textarea
                    value={blockAddresses}
                    onChange={e => setBlockAddresses(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={4}
                    placeholder={"uno per riga\nspam@example.com\n*@bad.com"}
                    disabled={!emailFilterEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domini bloccati</label>
                  <textarea
                    value={blockDomains}
                    onChange={e => setBlockDomains(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={4}
                    placeholder={"uno per riga\nbad-domain.com\nspam.org"}
                    disabled={!emailFilterEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Criteri di Filtraggio */}
            <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-6 ${!emailFilterEnabled ? 'opacity-60' : ''}`}>
              <h4 className="text-lg font-medium text-white mb-4">Criteri di Filtraggio</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Parole chiave nell&apos;oggetto (include)</label>
                  <textarea
                    value={subjectInclude}
                    onChange={e => setSubjectInclude(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={3}
                    placeholder={"una per riga\nordine\nfattura"}
                    disabled={!emailFilterEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Escludi se oggetto contiene</label>
                  <textarea
                    value={subjectExclude}
                    onChange={e => setSubjectExclude(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={3}
                    placeholder={"una per riga\nnewsletter\npromozione"}
                    disabled={!emailFilterEnabled}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <label className="text-sm font-medium text-white">Solo con allegati</label>
                  <p className="text-xs text-gray-400">Se attivo, considera solo email con allegati</p>
                </div>
                <button
                  onClick={() => setHasAttachments(v => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:ring-offset-2 focus:ring-offset-gray-900 ${hasAttachments ? 'bg-[#00D9AA]' : 'bg-gray-600'}`}
                  disabled={!emailFilterEnabled}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasAttachments ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </button>
              </div>
            </div>

            {/* Filtri Avanzati */}
            <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-6 ${!emailFilterEnabled ? 'opacity-60' : ''}`}>
              <h4 className="text-lg font-medium text-white mb-4">Filtri Avanzati</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Solo email dirette (non CC/BCC)</label>
                    <p className="text-xs text-gray-400">Processa solo le email dove sei il destinatario principale</p>
                  </div>
                  <button
                    onClick={() => setDirectOnly(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:ring-offset-2 focus:ring-offset-gray-900 ${directOnly ? 'bg-[#00D9AA]' : 'bg-gray-600'}`}
                    disabled={!emailFilterEnabled}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${directOnly ? 'translate-x-6' : 'translate-x-1'}`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Ignora email automatiche</label>
                    <p className="text-xs text-gray-400">Escludi notifiche automatiche e email di sistema</p>
                  </div>
                  <button
                    onClick={() => setIgnoreAutomations(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:ring-offset-2 focus:ring-offset-gray-900 ${ignoreAutomations ? 'bg-[#00D9AA]' : 'bg-gray-600'}`}
                    disabled={!emailFilterEnabled}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ignoreAutomations ? 'translate-x-6' : 'translate-x-1'}`}></span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Orario di Attivazione</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Dalle</label>
                      <input
                        type="time"
                        value={timeFrom}
                        onChange={e => setTimeFrom(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                        disabled={!emailFilterEnabled}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Alle</label>
                      <input
                        type="time"
                        value={timeTo}
                        onChange={e => setTimeTo(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                        disabled={!emailFilterEnabled}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Le email ricevute fuori da questo orario verranno ignorate</p>
                </div>
              </div>
            </div>

            {/* Azioni */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveEmailFilter}
                className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
              >
                Salva filtro
              </button>
              <button
                onClick={() => {
                  setEmailFilterEnabled(true)
                  setSelectedFolders(['INBOX'])
                  setNewFolderInput('')
                  setAllowAddresses('')
                  setAllowDomains('')
                  setBlockAddresses('')
                  setBlockDomains('')
                  setSubjectInclude('')
                  setSubjectExclude('')
                  setHasAttachments(false)
                  setDirectOnly(false)
                  setIgnoreAutomations(true)
                  setTimeFrom('09:00')
                  setTimeTo('18:00')
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Reimposta
              </button>
            </div>
          </div>
        )}

        {activeConfigTab === 'filtro AI' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">filtro</h3>
            
            {/* Toggle per attivare/disattivare il filtro */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white mb-1">Filtro AI</h4>
                  <p className="text-sm text-gray-400">Attiva il filtro intelligente per discriminare le email</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                </button>
              </div>
            </div>

            {/* Configurazione Modello AI */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Modello AI</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Seleziona Modello</label>
                  <select className="w-fit px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>
                
                {/* Costi Token */}
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-white mb-3">Costi Token (per 1K token)</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Input:</span>
                      <span className="text-white ml-2 font-mono">$0.03</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Output:</span>
                      <span className="text-white ml-2 font-mono">$0.06</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Prezzi per GPT-4. I costi variano in base al modello selezionato.
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt di Discriminazione */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Prompt di Discriminazione</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Definisci come l&apos;AI deve discriminare tra email da processare e da filtrare.
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent font-mono text-sm h-fit min-h-[400px]"
                  rows={8}
                  placeholder={`Analizza questa email e determina se deve essere processata o filtrata.

CRITERI PER PROCESSARE:
- Email da clienti o prospect
- Richieste di informazioni
- Email urgenti o importanti
- Comunicazioni di lavoro

CRITERI PER FILTRARE:
- Spam o email promozionali
- Newsletter
- Notifiche automatiche
- Email non pertinenti

Rispondi solo con "PROCESSA" o "FILTRA" seguito da una breve motivazione.`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Il prompt verrà utilizzato per istruire l&apos;AI su come distinguere le email rilevanti da quelle da ignorare.
                </p>
              </div>
            </div>


          </div>
        )}

        {activeConfigTab === 'rag' && (
          <div className="space-y-6">
            {/* Header con Pulsanti di Azione */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">RAG - Knowledge Base</h3>
              <div className="flex items-center gap-2">
                {/* Aggiungi Documento */}
                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Documento
                </label>

                {/* Aggiungi Testo */}
                <button
                  onClick={() => setShowTextDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                >
                  <Type size={16} />
                  Testo
                </button>

                {/* Aggiungi FAQ */}
                <button
                  onClick={() => setShowFaqDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                >
                  <HelpCircle size={16} />
                  FAQ
                </button>
              </div>
            </div>

            {/* Lista Documenti Caricati */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Risorse Caricate</h4>
              <div className="space-y-3">
                {/* Esempio di risorsa caricata */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Catalogo Prodotti 2024</p>
                      <p className="text-gray-400 text-sm">Documento • 2.3 MB</p>
                    </div>
                  </div>
                  <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Messaggio quando non ci sono risorse */}
                <div className="text-center py-8 text-gray-400">
                  <Database size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nessuna risorsa caricata</p>
                  <p className="text-sm">Aggiungi documenti, testi o FAQ per iniziare</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'istruzioni' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Istruzioni</h3>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Modello AI</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Seleziona modello</label>
                  <select
                    value={instructionModel}
                    onChange={(e) => setInstructionModel(e.target.value)}
                    className="w-fit px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-white mb-3">Costi Token (per 1K token)</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Input:</span>
                      <span className="text-white ml-2 font-mono">$0.03</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Output:</span>
                      <span className="text-white ml-2 font-mono">$0.06</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Prezzi per GPT-4. I costi variano in base al modello selezionato.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Istruzioni per l&apos;AI</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campo testo</label>
                <textarea
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent font-mono text-sm h-fit min-h-[300px]"
                  rows={10}
                  placeholder={`Spiega all'AI come comportarsi, ad esempio:\n- Rispondi in italiano formale\n- Riassumi in 3 bullet\n- Estrai i campi richiesti`}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => console.log('Salva istruzioni:', { model: instructionModel, text: instructionText })}
                    className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => { setInstructionModel('gpt-4'); setInstructionText('') }}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Reimposta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog Aggiungi Testo */}
      {showTextDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl min-w-[60vw] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Aggiungi Testo</h3>
              <button
                onClick={() => setShowTextDialog(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Titolo</label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                  placeholder="Inserisci il titolo del contenuto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contenuto</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                  rows={10}
                  placeholder="Inserisci il contenuto testuale..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowTextDialog(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  // TODO: Salvare il testo
                  console.log('Salva testo:', { title: textTitle, content: textContent })
                  setShowTextDialog(false)
                  setTextTitle('')
                  setTextContent('')
                }}
                disabled={!textTitle.trim() || !textContent.trim()}
                className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Aggiungi FAQ */}
      {showFaqDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Aggiungi FAQ</h3>
              <button
                onClick={() => setShowFaqDialog(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Titolo FAQ</label>
                <input
                  type="text"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                  placeholder="Inserisci il titolo delle FAQ"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Domande e Risposte</label>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 px-3 py-1 bg-[#00D9AA] text-black rounded-lg text-sm font-medium hover:bg-[#00D9AA]/90 transition-colors"
                  >
                    <Plus size={16} />
                    Aggiungi FAQ
                  </button>
                </div>
                
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">FAQ #{index + 1}</span>
                      {faqs.length > 1 && (
                        <button
                          onClick={() => removeFaq(index)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Domanda</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent text-sm"
                          placeholder="Inserisci la domanda"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Risposta</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent text-sm"
                          rows={3}
                          placeholder="Inserisci la risposta"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowFaqDialog(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  // TODO: Salvare le FAQ
                  console.log('Salva FAQ:', { title: faqTitle, faqs })
                  setShowFaqDialog(false)
                  setFaqTitle('')
                  setFaqs([{ question: '', answer: '' }])
                }}
                disabled={!faqTitle.trim() || faqs.some(faq => !faq.question.trim() || !faq.answer.trim())}
                className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salva FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
