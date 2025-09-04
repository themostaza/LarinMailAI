'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Zap, 
  Settings,
  Trash2,
  FileText,
  Bot,
  Mail,
  Workflow,
  ExternalLink
} from 'lucide-react'
import type { AIAction } from '@/types'

// Mock data per le actions - da sostituire con chiamate API reali
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
      { name: 'prompt', type: 'string', description: 'Prompt system per Anthropic Sonnet 4.0', required: true, defaultValue: 'Sei un assistente professionale che genera bozze email.' }
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
      { name: 'prompt', type: 'string', description: 'Prompt system per classificazione', required: true, defaultValue: 'Classifica questa email nelle categorie fornite.' }
    ],
    enabled: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Ricerca RAG Documenti',
    description: 'Utilizza RAG per recuperare informazioni dalla knowledge base aziendale',
    category: 'rag_query',
    parameters: [
      { name: 'query', type: 'string', description: 'Query di ricerca', required: true },
      { name: 'max_results', type: 'number', description: 'Numero massimo di risultati', required: false, defaultValue: 5 },
      { name: 'collection', type: 'string', description: 'Collezione da cui cercare', required: false },
      { name: 'apiEndpoint', type: 'string', description: 'Endpoint API per Anthropic', required: true, defaultValue: 'https://api.anthropic.com/v1/messages' },
      { name: 'prompt', type: 'string', description: 'Prompt system per RAG query', required: true, defaultValue: 'Cerca nella knowledge base aziendale e rispondi basandoti sui documenti trovati.' }
    ],
    enabled: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08')
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

export default function ActionsPage() {
  const router = useRouter()
  const [actions] = useState<AIAction[]>(mockActions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || action.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const ActionCard = ({ action }: { action: AIAction }) => {
    const CategoryIcon = categoryIcons[action.category]
    const categoryStyle = categoryColors[action.category]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer group"
        onClick={() => router.push(`/manage/actions/${action.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryStyle}`}>
              <CategoryIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-[#00D9AA] transition-colors">
                {action.name}
              </h3>
              <span className="text-xs text-gray-400 capitalize">
                {action.category.replace('_', ' ')} • Anthropic Sonnet 4.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/manage/actions/${action.id}`)
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-[#00D9AA] hover:bg-[#00D9AA]/10 transition-colors"
              title="Configura Action"
            >
              <Settings size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                // Logica per eliminare l'azione
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Elimina Action"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {action.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Parametri configurabili:</span>
            <span className="text-gray-400">{action.parameters.length}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {action.parameters.slice(0, 3).map((param) => (
              <span
                key={param.name}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
              >
                {param.name}
                {param.required && <span className="text-red-400 ml-1">*</span>}
              </span>
            ))}
            {action.parameters.length > 3 && (
              <span className="text-xs text-gray-500">
                +{action.parameters.length - 3} altri
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Creata: {action.createdAt.toLocaleDateString()}</span>
            <span>Aggiornata: {action.updatedAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs ${
              action.enabled ? 'text-[#00D9AA]' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                action.enabled ? 'bg-[#00D9AA]' : 'bg-gray-500'
              }`} />
              {action.enabled ? 'Attiva' : 'Disattiva'}
            </div>
            <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Actions AI</h1>
            <p className="text-gray-400">
              Gestisci e configura le azioni che l&apos;AI può eseguire sulle email
            </p>
          </div>
          {/* <button className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors">
            <Plus size={16} />
            Nuova Action
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
          >
            <option value="all">Tutte le categorie</option>
            <option value="email_processing">Elaborazione Email</option>
            <option value="content_generation">Generazione Contenuti</option>
            <option value="workflow_automation">Automazione Workflow</option>
            <option value="rag_query">Query RAG</option>
          </select>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>

        {filteredActions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Zap size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Nessuna action trovata
            </h3>
            <p className="text-gray-500">
              Prova a modificare i filtri di ricerca o crea una nuova action
            </p>
          </div>
        )}
      </div>
    </div>
  )
}