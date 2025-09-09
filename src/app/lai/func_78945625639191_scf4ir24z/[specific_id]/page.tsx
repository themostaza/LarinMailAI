'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { 
  BookOpen,
  Settings,
  Activity,
  Filter,
  Database,
  FileText,
  Mail,
  HardDrive,
  Download
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getFunctionBySpecificId } from './actions'

type TabType = 'intro' | 'configura' | 'esecuzioni'
type ConfigTabType = 'parametri' | 'filtro' | 'rag' | 'bozza'

interface PageProps {
  params: Promise<{
    specific_id: string
  }>
}

export default function AutomationPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState<TabType>('intro')
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTabType>('parametri')
  const [givenName, setGivenName] = useState<string>('Automazione AI')
  const [functionName, setFunctionName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  
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

  const tabs = [
    { id: 'intro' as TabType, label: 'Intro', icon: BookOpen },
    { id: 'configura' as TabType, label: 'Configura', icon: Settings },
    { id: 'esecuzioni' as TabType, label: 'Esecuzioni', icon: Activity },
  ]

  const configTabs = [
    { id: 'parametri' as ConfigTabType, label: 'Parametri Base', icon: Settings },
    { id: 'filtro' as ConfigTabType, label: 'Filtro AI', icon: Filter },
    { id: 'rag' as ConfigTabType, label: 'RAG', icon: Database },
    { id: 'bozza' as ConfigTabType, label: 'Bozza', icon: FileText },
  ]

  const renderIntroSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <HardDrive size={32} className="text-[#00D9AA]" />
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
          Automatizza l&apos;archiviazione degli allegati email direttamente su Google Drive. 
          Organizza, categorizza e salva automaticamente tutti i documenti ricevuti via Gmail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Caratteristiche Principali</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Scansione automatica degli allegati Gmail</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Organizzazione intelligente per tipologia di file</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Creazione automatica di cartelle su Google Drive</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00D9AA] rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300">Backup sicuro e accessibile ovunque</span>
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
              <span className="text-gray-300">Monitora automaticamente le nuove email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                2
              </div>
              <span className="text-gray-300">Identifica e scarica gli allegati</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9AA]">
                3
              </div>
              <span className="text-gray-300">Organizza e carica su Google Drive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Mail size={48} className="text-red-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Gmail Integration</h4>
          <p className="text-gray-400 text-sm">Connessione sicura con il tuo account Gmail per il monitoraggio automatico</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
            <Download size={48} className="text-blue-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Elaborazione AI</h4>
          <p className="text-gray-400 text-sm">Analisi intelligente degli allegati per categorizzazione automatica</p>
        </div>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mb-4 flex items-center justify-center">
            <HardDrive size={48} className="text-green-400" />
          </div>
          <h4 className="text-white font-medium mb-2">Google Drive</h4>
          <p className="text-gray-400 text-sm">Archiviazione organizzata e sicura su Google Drive</p>
        </div>
      </div>
    </motion.div>
  )

  const renderConfiguraSection = () => (
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
            <h3 className="text-xl font-semibold text-white">Configurazione Gmail & Drive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-medium text-white mb-4">Impostazioni Gmail</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Etichette da Monitorare</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                      placeholder="INBOX, Importante, Lavoro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mittenti da Escludere</label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                      rows={3}
                      placeholder="spam@example.com, newsletter@..."
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-medium text-white mb-4">Impostazioni Google Drive</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cartella di Destinazione</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                      placeholder="/Gmail Attachments"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Dimensione Massima File (MB)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'filtro' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Filtri Intelligenti</h3>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Filtri per Tipo di File</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: 'PDF', enabled: true, folder: 'Documenti' },
                    { type: 'Immagini', enabled: true, folder: 'Foto' },
                    { type: 'Excel', enabled: false, folder: 'Fogli di Calcolo' },
                    { type: 'Word', enabled: true, folder: 'Documenti' },
                  ].map((filter, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3">
                      <label className="flex items-center gap-2 mb-2">
                        <input 
                          type="checkbox" 
                          defaultChecked={filter.enabled}
                          className="rounded border-gray-600 bg-gray-800 text-[#00D9AA] focus:ring-[#00D9AA]" 
                        />
                        <span className="text-white font-medium">{filter.type}</span>
                      </label>
                      <input
                        type="text"
                        defaultValue={filter.folder}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        placeholder="Nome cartella"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'rag' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Organizzazione Intelligente</h3>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Regole di Categorizzazione</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Parole Chiave per Fatture</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={2}
                    placeholder="fattura, invoice, pagamento, ricevuta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Parole Chiave per Contratti</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    rows={2}
                    placeholder="contratto, accordo, firma, clausole"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'bozza' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Notifiche e Report</h3>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-medium text-white mb-4">Template Notifiche</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notifica di Archiviazione</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent font-mono"
                    rows={4}
                    placeholder="File {{filename}} archiviato con successo in {{folder}} da {{sender}}"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors">
                    Salva Template
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Test Notifica
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )

  const renderEsecuzioniSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">Dashboard Archiviazione</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">File Archiviati</p>
              <p className="text-2xl font-bold text-white">2,847</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
              <HardDrive size={24} className="text-green-400" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">+156 questo mese</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Spazio Utilizzato</p>
              <p className="text-2xl font-bold text-white">12.4 GB</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <Database size={24} className="text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-2">82% di 15 GB disponibili</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Email Elaborate</p>
              <p className="text-2xl font-bold text-white">8,392</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-red-400" />
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">98.2% tasso di successo</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tempo Medio</p>
              <p className="text-2xl font-bold text-white">1.8s</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xl">⏱</span>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">-0.2s rispetto al mese scorso</p>
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-4">File Archiviati di Recente</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Mittente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Cartella</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Dimensione</th>
              </tr>
            </thead>
            <tbody>
              {[
                { file: 'fattura_gennaio_2024.pdf', sender: 'contabilita@azienda.com', folder: 'Fatture/2024', date: '2024-01-15 14:30', size: '245 KB' },
                { file: 'contratto_servizi.docx', sender: 'legale@partner.com', folder: 'Contratti', date: '2024-01-15 13:15', size: '1.2 MB' },
                { file: 'presentazione_Q1.pptx', sender: 'marketing@company.com', folder: 'Presentazioni', date: '2024-01-15 12:45', size: '3.8 MB' },
                { file: 'report_vendite.xlsx', sender: 'vendite@azienda.com', folder: 'Reports/Vendite', date: '2024-01-15 11:20', size: '892 KB' },
                { file: 'foto_evento.jpg', sender: 'eventi@company.com', folder: 'Foto/Eventi', date: '2024-01-15 10:10', size: '2.1 MB' },
              ].map((file, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{file.file}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{file.sender}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{file.folder}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">{file.date}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{file.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex-1 flex flex-col">
        {/* Header with tabs */}
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {loading ? 'Caricamento...' : givenName}
                </h1>
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
        {activeTab === 'intro' && renderIntroSection()}
        {activeTab === 'configura' && renderConfiguraSection()}
        {activeTab === 'esecuzioni' && renderEsecuzioniSection()}
      </div>
    </div>
  )
}
