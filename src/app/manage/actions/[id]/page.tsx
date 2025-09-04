'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Settings,
  Zap,
  Mail,
  FileText,
  Bot,
  Workflow,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Users,
  Activity
} from 'lucide-react'
import type { AIAction, ActionParameter } from '@/types'

// Mock data - da sostituire con chiamate API reali
const mockActions: AIAction[] = [
  {
    id: '1',
    name: 'Generazione Bozza Email',
    description: 'Genera automaticamente bozze di risposta basate sulla documentazione aziendale',
    category: 'content_generation',
    parameters: [
      { name: 'template', type: 'string', description: 'Template di base da utilizzare', required: true },
      { name: 'tone', type: 'string', description: 'Tono della risposta (formale, amichevole, tecnico)', required: false, defaultValue: 'formale' },
      { name: 'maxLength', type: 'number', description: 'Lunghezza massima della risposta', required: false, defaultValue: 500 },
      { name: 'apiEndpoint', type: 'string', description: 'Endpoint API per Anthropic', required: true, defaultValue: 'https://api.anthropic.com/v1/messages' },
      { name: 'prompt', type: 'string', description: 'Prompt system per Anthropic Sonnet 4.0', required: true, defaultValue: 'Sei un assistente professionale che genera bozze email basate sui documenti aziendali.' }
    ],
    enabled: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Classificazione Email',
    description: 'Classifica automaticamente le email in base al contenuto e alle regole definite',
    category: 'email_processing',
    parameters: [
      { name: 'categories', type: 'array', description: 'Categorie disponibili per la classificazione', required: true },
      { name: 'confidence_threshold', type: 'number', description: 'Soglia di confidenza minima', required: false, defaultValue: 0.8 },
      { name: 'apiEndpoint', type: 'string', description: 'Endpoint API per Anthropic', required: true, defaultValue: 'https://api.anthropic.com/v1/messages' },
      { name: 'prompt', type: 'string', description: 'Prompt system per classificazione', required: true, defaultValue: 'Classifica questa email nelle categorie: {categories}. Rispondi solo con la categoria più appropriata.' }
    ],
    enabled: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  }
]

const categoryIcons = {
  email_processing: Mail,
  content_generation: FileText,
  workflow_automation: Workflow,
  rag_query: Bot
}

const categoryColors = {
  email_processing: 'text-blue-400 bg-blue-400/10',
  content_generation: 'text-green-400 bg-green-400/10',
  workflow_automation: 'text-purple-400 bg-purple-400/10',
  rag_query: 'text-orange-400 bg-orange-400/10'
}

const parameterTypes = ['string', 'number', 'boolean', 'array', 'object'] as const

// Mock data per le metriche delle actions
const mockActionMetrics = {
  '1': {
    totalExecutions: 147,
    successRate: 96.6,
    averageProcessingTime: 2.3,
    last30Days: {
      executions: [2, 4, 3, 7, 5, 8, 6, 9, 4, 7, 8, 5, 6, 9, 7, 8, 5, 4, 6, 8, 9, 7, 5, 6, 8, 7, 4, 5, 6, 8],
      errors: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    },
    sectorUsage: {
      'grafico-editoriale': 58,
      'carta_cartone': 42,
      'comunicazione_spettacolo': 28,
      'sport_tempo_libero': 19
    },
    commonTopics: [
      { topic: 'adesione', count: 45 },
      { topic: 'vantaggi_fiscali', count: 38 },
      { topic: 'comparti_investimento', count: 35 },
      { topic: 'contributi_datore', count: 29 }
    ],
    errorTypes: {
      'low_confidence': 3,
      'timeout': 1,
      'invalid_template': 1
    },
    averageWordCount: 298,
    responseTime: {
      min: 1.2,
      max: 4.1,
      avg: 2.3
    }
  },
  '2': {
    totalExecutions: 89,
    successRate: 94.4,
    averageProcessingTime: 2.8,
    last30Days: {
      executions: [1, 2, 1, 3, 2, 4, 3, 5, 2, 3, 4, 2, 3, 5, 3, 4, 2, 1, 3, 4, 5, 3, 2, 3, 4, 3, 1, 2, 3, 4],
      errors: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    },
    sectorUsage: {
      'carta_cartone': 34,
      'grafico-editoriale': 28,
      'comunicazione_spettacolo': 15,
      'sport_tempo_libero': 12
    },
    commonTopics: [
      { topic: 'RITA', count: 28 },
      { topic: 'simulazione', count: 24 },
      { topic: 'area_riservata', count: 22 },
      { topic: 'calcolo_pensione', count: 15 }
    ],
    errorTypes: {
      'calculation_error': 2,
      'missing_data': 2,
      'timeout': 1
    },
    averageWordCount: 276,
    responseTime: {
      min: 1.8,
      max: 5.2,
      avg: 2.8
    }
  }
}

export default function ActionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const actionId = params.id as string

  const [action, setAction] = useState<AIAction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'metrics'>('config')

  useEffect(() => {
    // Simula il caricamento dell'azione
    const foundAction = mockActions.find(a => a.id === actionId)
    if (foundAction) {
      setAction({ ...foundAction })
    }
    setIsLoading(false)
  }, [actionId])

  const handleSave = async () => {
    if (!action) return
    
    setIsSaving(true)
    try {
      // Qui andrà la chiamata API per salvare
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula API call
      setHasChanges(false)
      console.log('Action saved:', action)
    } catch (error) {
      console.error('Error saving action:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateAction = (updates: Partial<AIAction>) => {
    if (!action) return
    setAction({ ...action, ...updates })
    setHasChanges(true)
  }

  const addParameter = () => {
    if (!action) return
    const newParameter: ActionParameter = {
      name: '',
      type: 'string',
      description: '',
      required: false
    }
    updateAction({
      parameters: [...action.parameters, newParameter]
    })
  }

  const updateParameter = (index: number, updates: Partial<ActionParameter>) => {
    if (!action) return
    const newParameters = [...action.parameters]
    newParameters[index] = { ...newParameters[index], ...updates }
    updateAction({ parameters: newParameters })
  }

  const removeParameter = (index: number) => {
    if (!action) return
    const newParameters = action.parameters.filter((_, i) => i !== index)
    updateAction({ parameters: newParameters })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Zap size={48} className="text-gray-600 mb-4 mx-auto animate-pulse" />
          <p className="text-gray-400">Caricamento azione...</p>
        </div>
      </div>
    )
  }

  if (!action) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-white mb-2">Azione non trovata</h2>
          <p className="text-gray-400 mb-4">L&apos;azione richiesta non esiste o è stata eliminata.</p>
          <button
            onClick={() => router.push('/manage/actions')}
            className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors mx-auto"
          >
            <ArrowLeft size={16} />
            Torna alle Actions
          </button>
        </div>
      </div>
    )
  }

  const CategoryIcon = categoryIcons[action.category]
  const actionMetrics = mockActionMetrics[actionId as keyof typeof mockActionMetrics]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/manage/actions')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${categoryColors[action.category]}`}>
                <CategoryIcon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{action.name}</h1>
                <span className="text-sm text-gray-400 capitalize">
                  {action.category.replace('_', ' ')} • Anthropic Sonnet 4.0
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && activeTab === 'config' && (
              <span className="text-xs text-orange-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Modifiche non salvate
              </span>
            )}
            {activeTab === 'config' && (
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? 'Salvando...' : 'Salva Modifiche'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'config', label: 'Configurazione', icon: Settings },
            { id: 'metrics', label: 'Metriche & Dashboard', icon: BarChart3 }
          ].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'config' | 'metrics')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#00D9AA] text-[#00D9AA]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <TabIcon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-8">
              {/* Informazioni Generali */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Settings size={20} />
              Informazioni Generali
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Action
                </label>
                <input
                  type="text"
                  value={action.name}
                  onChange={(e) => updateAction({ name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={action.category}
                  onChange={(e) => updateAction({ category: e.target.value as AIAction['category'] })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
                >
                  <option value="email_processing">Elaborazione Email</option>
                  <option value="content_generation">Generazione Contenuti</option>
                  <option value="workflow_automation">Automazione Workflow</option>
                  <option value="rag_query">Query RAG</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrizione
              </label>
              <textarea
                value={action.description}
                onChange={(e) => updateAction({ description: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] resize-none"
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">Stato Action</span>
                <button
                  onClick={() => updateAction({ enabled: !action.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    action.enabled ? 'bg-[#00D9AA]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      action.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${action.enabled ? 'text-[#00D9AA]' : 'text-gray-400'}`}>
                  {action.enabled ? 'Attiva' : 'Disattiva'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Parametri Configurabili */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={20} />
                Parametri Anthropic
              </h2>
              <button
                onClick={addParameter}
                className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <Plus size={16} />
                Aggiungi Parametro
              </button>
            </div>

            <div className="space-y-4">
              {action.parameters.map((param, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={param.name}
                        onChange={(e) => updateParameter(index, { name: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D9AA]"
                        placeholder="es. prompt, apiKey..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Tipo
                      </label>
                      <select
                        value={param.type}
                        onChange={(e) => updateParameter(index, { type: e.target.value as ActionParameter['type'] })}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D9AA]"
                      >
                        {parameterTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={param.required}
                          onChange={(e) => updateParameter(index, { required: e.target.checked })}
                          className="rounded border-gray-600 text-[#00D9AA] focus:ring-[#00D9AA] focus:ring-offset-0"
                        />
                        <label htmlFor={`required-${index}`} className="text-xs text-gray-400">
                          Obbligatorio
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => removeParameter(index)}
                        className="p-2 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Descrizione
                      </label>
                      <input
                        type="text"
                        value={param.description}
                        onChange={(e) => updateParameter(index, { description: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D9AA]"
                        placeholder="Descrizione del parametro..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Valore Predefinito
                      </label>
                      <input
                        type="text"
                        value={param.defaultValue as string || ''}
                        onChange={(e) => updateParameter(index, { 
                          defaultValue: param.type === 'number' ? Number(e.target.value) || undefined : e.target.value || undefined 
                        })}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00D9AA]"
                        placeholder="Valore predefinito..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {action.parameters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Zap size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Nessun parametro configurato</p>
                  <p className="text-sm">Aggiungi parametri per personalizzare l&apos;azione Anthropic</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Aggiuntive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-sm font-medium text-gray-300 mb-4">Informazioni Sistema</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID:</span>
                <p className="text-gray-300 font-mono">{action.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Creata:</span>
                <p className="text-gray-300">{action.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Aggiornata:</span>
                <p className="text-gray-300">{action.updatedAt.toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Modello AI:</span>
                <p className="text-[#00D9AA]">Anthropic Sonnet 4.0</p>
              </div>
            </div>
              </motion.div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && actionMetrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity size={24} className="text-[#00D9AA]" />
                    <span className="text-2xl font-bold text-white">
                      {actionMetrics.totalExecutions}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Esecuzioni Totali</h3>
                  <p className="text-xs text-gray-400">Da creazione action</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target size={24} className="text-green-400" />
                    <span className="text-2xl font-bold text-white">
                      {actionMetrics.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Tasso di Successo</h3>
                  <p className="text-xs text-gray-400">
                    {Math.round((actionMetrics.totalExecutions * actionMetrics.successRate) / 100)} successi
                  </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={24} className="text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {actionMetrics.averageProcessingTime.toFixed(1)}s
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Tempo Medio</h3>
                  <p className="text-xs text-gray-400">Elaborazione AI</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FileText size={24} className="text-purple-400" />
                    <span className="text-2xl font-bold text-white">
                      {actionMetrics.averageWordCount}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">Parole Medie</h3>
                  <p className="text-xs text-gray-400">Per risposta generata</p>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp size={20} />
                    Attività Ultimi 30 Giorni
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Esecuzioni giornaliere</span>
                    <span className="text-gray-300">
                      Totale: {actionMetrics.last30Days.executions.reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                  
                  {/* Simple Chart */}
                  <div className="flex items-end gap-1 h-32">
                    {actionMetrics.last30Days.executions.map((count, index) => (
                      <div
                        key={index}
                        className="bg-[#00D9AA] rounded-t flex-1 min-w-0 transition-all hover:bg-[#00D9AA]/80"
                        style={{
                          height: `${Math.max((count / Math.max(...actionMetrics.last30Days.executions)) * 100, 5)}%`
                        }}
                        title={`Giorno ${index + 1}: ${count} esecuzioni`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>30 giorni fa</span>
                    <span>Oggi</span>
                  </div>
                </div>
              </div>

              {/* Usage by Sector */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Users size={20} />
                    Utilizzo per Settore
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(actionMetrics.sectorUsage)
                      .sort(([,a], [,b]) => b - a)
                      .map(([sector, count]) => (
                        <div key={sector} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300 capitalize">
                              {sector.replace('_', ' ')}
                            </span>
                            <span className="text-gray-400">{count}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-[#00D9AA] h-2 rounded-full transition-all"
                              style={{
                                width: `${(count / Math.max(...Object.values(actionMetrics.sectorUsage))) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Zap size={20} />
                    Topic Più Richiesti
                  </h3>
                  
                  <div className="space-y-3">
                    {actionMetrics.commonTopics.map((item, index) => (
                      <div key={item.topic} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#00D9AA]/10 rounded-lg flex items-center justify-center">
                            <span className="text-[#00D9AA] text-sm font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-gray-300 capitalize">
                            {item.topic.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance & Errors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Performance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tempo Minimo:</span>
                      <span className="text-green-400 font-medium">
                        {actionMetrics.responseTime.min.toFixed(1)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tempo Medio:</span>
                      <span className="text-[#00D9AA] font-medium">
                        {actionMetrics.responseTime.avg.toFixed(1)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tempo Massimo:</span>
                      <span className="text-orange-400 font-medium">
                        {actionMetrics.responseTime.max.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Errori</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(actionMetrics.errorTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize text-sm">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="text-red-400 text-sm">{count}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">Totale Errori:</span>
                        <span className="text-red-400 font-medium">
                          {Object.values(actionMetrics.errorTypes).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* No metrics message */}
          {activeTab === 'metrics' && !actionMetrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <BarChart3 size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                Nessuna metrica disponibile
              </h3>
              <p className="text-gray-500">
                Le metriche verranno mostrate dopo le prime esecuzioni dell&apos;action
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}