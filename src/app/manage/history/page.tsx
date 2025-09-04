'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  TrendingUp,
  Download,
  ExternalLink
} from 'lucide-react'
import type { EmailAnalysis } from '@/types'

// Mock data per lo storico - da sostituire con chiamate API reali
const mockHistory: EmailAnalysis[] = [
  {
    id: '1',
    emailId: 'email_001',
    emailSubject: 'Informazioni adesione Fondo Pensione Byblos',
    emailFrom: 'marco.rossi@graficasrl.it',
    emailTo: ['info@fondobyblos.it'],
    analysisType: 'draft_generation',
    actionTaken: 'Generata bozza di risposta informativa',
    aiDecision: 'Identificata richiesta di informazioni base su adesione al fondo pensione. Utilizzato template "Informazioni Adesione" con contenuti su vantaggi previdenza complementare.',
    confidence: 0.96,
    processingTime: 2.1,
    result: 'success',
    timestamp: new Date('2024-01-20T10:30:00'),
    metadata: {
      template_used: 'info_adesione',
      tone: 'professionale',
      word_count: 312,
      sector: 'grafico-editoriale',
      topics_covered: ['adesione', 'vantaggi_fiscali', 'comparti_investimento']
    }
  },
  {
    id: '2',
    emailId: 'email_002',
    emailSubject: 'Richiesta calcolo pensione integrativa e RITA',
    emailFrom: 'giulia.bianchi@cartificio.com',
    emailTo: ['assistenza@fondobyblos.it'],
    analysisType: 'draft_generation',
    actionTaken: 'Generata risposta con informazioni su simulazione pensione',
    aiDecision: 'Richiesta di simulazione RITA (Rendita Integrativa Temporanea Anticipata). Fornite informazioni su accesso area riservata e strumenti di calcolo.',
    confidence: 0.93,
    processingTime: 2.8,
    result: 'success',
    timestamp: new Date('2024-01-20T09:15:00'),
    metadata: {
      template_used: 'calcolo_pensione',
      tone: 'tecnico-professionale',
      word_count: 284,
      sector: 'carta_cartone',
      topics_covered: ['RITA', 'simulazione', 'area_riservata']
    }
  },
  {
    id: '3',
    emailId: 'email_003',
    emailSubject: 'Cambio comparto investimento - Life Cycle',
    emailFrom: 'alessandro.verdi@mediacompany.it',
    emailTo: ['gestione@fondobyblos.it'],
    analysisType: 'classification',
    actionTaken: 'Classificata come "Richiesta Gestione Finanziaria"',
    aiDecision: 'Richiesta di modifica strategia investimento. Classificata per inoltro ufficio gestione con priorità standard.',
    confidence: 0.89,
    processingTime: 1.9,
    result: 'success',
    timestamp: new Date('2024-01-19T16:45:00'),
    metadata: {
      classification: 'gestione_finanziaria',
      priority: 'standard',
      sector: 'comunicazione_spettacolo',
      current_comparto: 'bilanciato',
      requested_change: 'life_cycle'
    }
  },
  {
    id: '4',
    emailId: 'email_004',
    emailSubject: 'Anticipazione spese mediche urgenti',
    emailFrom: 'laura.neri@sportime.it',
    emailTo: ['anticipazioni@fondobyblos.it'],
    analysisType: 'rule_processing',
    actionTaken: 'Inoltrata all\'ufficio anticipazioni con priorità alta',
    aiDecision: 'Rilevata richiesta di anticipazione per spese sanitarie. Applicata regola di instradamento urgente.',
    confidence: 0.91,
    processingTime: 1.4,
    result: 'success',
    timestamp: new Date('2024-01-19T14:20:00'),
    metadata: {
      rule_applied: 'anticipazione_medica',
      priority: 'alta',
      sector: 'sport_tempo_libero',
      urgency_level: 'high',
      required_docs: ['certificato_medico', 'fatture']
    }
  },
  {
    id: '5',
    emailId: 'email_005',
    emailSubject: 'Designazione beneficiari e soggetti designati',
    emailFrom: 'roberto.blu@tipografia.net',
    emailTo: ['servizi@fondobyblos.it'],
    analysisType: 'draft_generation',
    actionTaken: 'Generata bozza con procedure designazione',
    aiDecision: 'Richiesta informazioni su designazione beneficiari. Fornita guida step-by-step per accesso area riservata.',
    confidence: 0.94,
    processingTime: 2.2,
    result: 'success',
    timestamp: new Date('2024-01-18T11:30:00'),
    metadata: {
      template_used: 'designazione_beneficiari',
      tone: 'professionale',
      word_count: 276,
      sector: 'grafico-editoriale',
      topics_covered: ['designazione', 'area_riservata', 'procedure']
    }
  },
  {
    id: '6',
    emailId: 'email_006',
    emailSubject: 'Messaggio confuso su TFR',
    emailFrom: 'spam.bot@suspicious.com',
    emailTo: ['info@fondobyblos.it'],
    analysisType: 'draft_generation',
    actionTaken: 'Nessuna azione - richiesta revisione manuale',
    aiDecision: 'Contenuto sospetto e incoerente. Possibile spam o phishing. Confidenza sotto soglia di sicurezza.',
    confidence: 0.28,
    processingTime: 3.8,
    result: 'error',
    errorMessage: 'Confidenza sotto soglia minima (0.5) - contenuto potenzialmente dannoso',
    timestamp: new Date('2024-01-18T08:45:00'),
    metadata: {
      reason: 'suspicious_content',
      manual_review: true,
      security_flags: ['unknown_sender', 'incoherent_text']
    }
  }
]

const analysisTypeLabels = {
  draft_generation: 'Generazione Bozza',
  rule_processing: 'Elaborazione Regole',
  forwarding: 'Inoltro',
  classification: 'Classificazione'
}

const analysisTypeColors = {
  draft_generation: 'text-blue-400 bg-blue-400/10',
  rule_processing: 'text-green-400 bg-green-400/10',
  forwarding: 'text-purple-400 bg-purple-400/10',
  classification: 'text-orange-400 bg-orange-400/10'
}

const resultIcons = {
  success: CheckCircle,
  error: XCircle,
  pending: AlertCircle
}

const resultColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  pending: 'text-yellow-400'
}

export default function HistoryPage() {
  const router = useRouter()
  const [history] = useState<EmailAnalysis[]>(mockHistory)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterResult, setFilterResult] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredHistory = history.filter(analysis => {
    const matchesSearch = analysis.emailSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.emailFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.aiDecision.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResult = filterResult === 'all' || analysis.result === filterResult
    const matchesType = filterType === 'all' || analysis.analysisType === filterType
    return matchesSearch && matchesResult && matchesType
  })

  const stats = {
    total: history.length,
    success: history.filter(h => h.result === 'success').length,
    error: history.filter(h => h.result === 'error').length,
    avgProcessingTime: history.reduce((acc, h) => acc + h.processingTime, 0) / history.length
  }

  const AnalysisCard = ({ analysis }: { analysis: EmailAnalysis }) => {
    const ResultIcon = resultIcons[analysis.result]
    const resultColor = resultColors[analysis.result]
    const typeColor = analysisTypeColors[analysis.analysisType]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer group"
        onClick={() => router.push(`/manage/history/${analysis.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-[#00D9AA] transition-colors">
                {analysis.emailSubject}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${typeColor}`}>
                {analysisTypeLabels[analysis.analysisType]}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">
              Da: {analysis.emailFrom}
            </p>
            <p className="text-xs text-gray-500">
              {analysis.timestamp.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ResultIcon size={20} className={resultColor} />
            <span className="text-xs text-gray-400">
              {analysis.processingTime.toFixed(1)}s
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Azione:</strong> {analysis.actionTaken}
          </p>
          <p className="text-xs text-gray-400 line-clamp-2">
            {analysis.aiDecision}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                Confidenza: {(analysis.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#00D9AA] group-hover:text-[#00D9AA]/80 transition-colors">
              Dettagli →
            </span>
            <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </div>

        {analysis.result === 'error' && analysis.errorMessage && (
          <div className="mt-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
            <p className="text-xs text-red-400">
              <strong>Errore:</strong> {analysis.errorMessage}
            </p>
          </div>
        )}
      </motion.div>
    )
  }

  const StatsCard = ({ title, value, subtitle, icon: Icon }: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ComponentType<{ size?: number; className?: string }>
  }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon size={24} className="text-[#00D9AA]" />
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  )

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Storico Analisi</h1>
            <p className="text-gray-400">
              Monitora tutte le elaborazioni AI delle email e i relativi risultati
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
            <Download size={16} />
            Esporta
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Totale Analisi"
            value={stats.total}
            icon={Bot}
          />
          <StatsCard
            title="Successo"
            value={stats.success}
            subtitle={`${((stats.success / stats.total) * 100).toFixed(1)}%`}
            icon={CheckCircle}
          />
          <StatsCard
            title="Errori"
            value={stats.error}
            subtitle={`${((stats.error / stats.total) * 100).toFixed(1)}%`}
            icon={XCircle}
          />
          <StatsCard
            title="Tempo Medio"
            value={`${stats.avgProcessingTime.toFixed(1)}s`}
            subtitle="Elaborazione"
            icon={Clock}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca nelle analisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA]"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
          >
            <option value="all">Tutti i tipi</option>
            <option value="draft_generation">Generazione Bozza</option>
            <option value="rule_processing">Elaborazione Regole</option>
            <option value="forwarding">Inoltro</option>
            <option value="classification">Classificazione</option>
          </select>
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00D9AA]"
          >
            <option value="all">Tutti i risultati</option>
            <option value="success">Successo</option>
            <option value="error">Errore</option>
            <option value="pending">In elaborazione</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredHistory.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Bot size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Nessuna analisi trovata
            </h3>
            <p className="text-gray-500">
              Prova a modificare i filtri di ricerca
            </p>
          </div>
        )}
      </div>


    </div>
  )
}