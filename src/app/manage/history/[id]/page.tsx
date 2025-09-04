'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  Bot,
  Mail,
  FileText,
  TrendingUp,
  Settings,
  Send,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import type { EmailAnalysis } from '@/types'

// Mock data completo con email originali e bozze generate
const mockHistoryDetailed: EmailAnalysis[] = [
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
      topics_covered: ['adesione', 'vantaggi_fiscali', 'comparti_investimento'],
      original_email: `Gentili signori,
      
sono un lavoratore del settore grafico e vorrei avere informazioni sull'adesione al Fondo Pensione Byblos. Lavoro presso una tipografia che ha firmato il CCNL del settore grafico-editoriale.

Potrebbero gentilmente inviarmi informazioni sui vantaggi dell'adesione e sui comparti di investimento disponibili?

Cordiali saluti,
Marco Rossi
Grafica SRL`,
      generated_draft: `Gentile Sig. Rossi,

la ringraziamo per l'interesse mostrato verso il Fondo Pensione Byblos.

Come lavoratore del settore grafico-editoriale, Lei ha diritto ad aderire al nostro Fondo pensione complementare, che Le permetterà di costruire una pensione integrativa a quella pubblica obbligatoria.

**I principali vantaggi dell'adesione sono:**

• **Vantaggi fiscali**: I contributi versati sono deducibili dal reddito fino a 5.164,57 euro annui
• **Contributo del datore di lavoro**: La sua azienda verserà un contributo aggiuntivo secondo quanto previsto dal CCNL
• **Flessibilità**: Possibilità di scegliere tra diversi comparti di investimento in base al Suo profilo di rischio
• **Costi contenuti**: I fondi pensione negoziali come Byblos hanno commissioni significativamente più basse rispetto ai prodotti bancari

**I comparti di investimento disponibili sono:**

• **Comparto Garantito**: Per chi privilegia la sicurezza del capitale
• **Comparto Bilanciato**: Equilibrio tra sicurezza e crescita
• **Comparto Dinamico**: Per chi ha un orizzonte temporale lungo e cerca maggiori opportunità di rendimento
• **Life-Cycle**: Strategia automatica che adatta gli investimenti alla Sua età

Per procedere con l'adesione può:
1. Accedere al nostro sito www.fondobyblos.it nella sezione "Adesioni"
2. Compilare il modulo online
3. Contattare il nostro servizio assistenza al numero 06-XXXXXXX

Rimaniamo a disposizione per ulteriori chiarimenti.

Cordiali saluti,
Il Team Fondo Pensione Byblos`
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
      topics_covered: ['RITA', 'simulazione', 'area_riservata'],
      original_email: `Buongiorno,

sono iscritta al Fondo Byblos da 15 anni e tra 3 anni andrò in pensione. Vorrei sapere se posso richiedere la RITA e come calcolare l'importo della mia pensione integrativa.

Potete aiutarmi con una simulazione?

Grazie,
Giulia Bianchi`,
      generated_draft: `Gentile Sig.ra Bianchi,

la ringraziamo per averci contattato.

Per quanto riguarda la RITA (Rendita Integrativa Temporanea Anticipata), può richiederla se:
• Ha almeno 5 anni di contribuzione nel Fondo
• Cessa l'attività lavorativa
• Non ha maturato i requisiti per la pensione di vecchiaia

**Per la simulazione della Sua pensione integrativa:**

Può utilizzare gli strumenti disponibili nella Sua Area Riservata:
1. Acceda con SPID o le credenziali Byblos
2. Sezione "La mia pensione futura"
3. Inserisca i parametri richiesti per ottenere una proiezione personalizzata

**Per la RITA:**
Nella stessa area trova il simulatore RITA che Le permetterà di:
• Calcolare l'importo mensile della rendita
• Verificare i requisiti
• Avviare la procedura di richiesta

Se ha difficoltà nell'accesso all'area riservata, può contattarci al numero dedicato 06-XXXXXXX (orari: 9:00-13:00 / 14:00-16:00).

Cordiali saluti,
Servizio Assistenza Fondo Byblos`
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
      required_docs: ['certificato_medico', 'fatture'],
      original_email: `URGENTE - Anticipazione spese mediche

Gentili signori,

devo sostenere delle spese mediche urgenti per un intervento chirurgico e vorrei richiedere un'anticipazione sul mio fondo pensione.

Importo necessario: €15.000

Ho già i preventivi medici. Potete indicarmi la procedura?

Grazie,
Laura Neri
Matricola: BY123456`,
      processing_notes: `Email classificata come URGENTE per anticipazione medica.
      
• Rilevata richiesta anticipazione: €15.000
• Settore: Sport e tempo libero 
• Matricola identificata: BY123456
• Urgenza: ALTA
• Docs menzionati: preventivi medici

AZIONE: Inoltro immediato a ufficio anticipazioni con flag PRIORITÀ ALTA`
    }
  }
]

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

export default function HistoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const analysisId = params.id as string

  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'original' | 'draft' | 'processing'>('overview')

  useEffect(() => {
    // Simula il caricamento dell'analisi
    const foundAnalysis = mockHistoryDetailed.find(a => a.id === analysisId)
    if (foundAnalysis) {
      setAnalysis({ ...foundAnalysis })
    }
    setIsLoading(false)
  }, [analysisId])

  const handleSendResponse = async () => {
    if (!analysis || analysis.analysisType !== 'draft_generation') return
    
    setIsSending(true)
    try {
      // Simula invio email
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSent(true)
      console.log('Email sent to:', analysis.emailFrom)
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsSending(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Bot size={48} className="text-gray-600 mb-4 mx-auto animate-pulse" />
          <p className="text-gray-400">Caricamento dettagli...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-white mb-2">Analisi non trovata</h2>
          <p className="text-gray-400 mb-4">L&apos;analisi richiesta non esiste o è stata eliminata.</p>
          <button
            onClick={() => router.push('/manage/history')}
            className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors mx-auto"
          >
            <ArrowLeft size={16} />
            Torna allo Storico
          </button>
        </div>
      </div>
    )
  }

  const ResultIcon = resultIcons[analysis.result]
  const resultColor = resultColors[analysis.result]
  const typeColor = analysisTypeColors[analysis.analysisType]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/manage/history')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ResultIcon size={24} className={resultColor} />
                <span className={`text-sm px-3 py-1 rounded-full ${typeColor}`}>
                  {analysisTypeLabels[analysis.analysisType]}
                </span>
                <span className="text-xs text-gray-500">
                  {analysis.timestamp.toLocaleString()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{analysis.emailSubject}</h1>
              <p className="text-gray-400">
                Da: {analysis.emailFrom} • Anthropic Sonnet 4.0 • {analysis.processingTime.toFixed(1)}s
              </p>
            </div>
          </div>
          
          {analysis.analysisType === 'draft_generation' && analysis.result === 'success' && !isSent && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendResponse}
                disabled={isSending}
                className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Accetta e Invia Risposta
                  </>
                )}
              </button>
            </div>
          )}
          
          {isSent && (
            <div className="flex items-center gap-2 text-green-400">
              <Check size={16} />
              <span className="text-sm font-medium">Risposta inviata</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'overview', label: 'Panoramica', icon: TrendingUp },
            { id: 'original', label: 'Email Originale', icon: Mail },
            ...(analysis.analysisType === 'draft_generation' ? [{ id: 'draft', label: 'Bozza Generata', icon: FileText }] : []),
            { id: 'processing', label: 'Elaborazione AI', icon: Bot }
          ].map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'original' | 'draft' | 'processing')}
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
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <TrendingUp size={20} className="text-[#00D9AA]" />
                    <span className="text-xl font-bold text-white">
                      {(analysis.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Confidenza</p>
                </div>
                
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <Clock size={20} className="text-blue-400" />
                    <span className="text-xl font-bold text-white">
                      {analysis.processingTime.toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Tempo Elaborazione</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <FileText size={20} className="text-green-400" />
                    <span className="text-xl font-bold text-white">
                      {analysis.metadata?.word_count || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Parole Generate</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <Settings size={20} className="text-orange-400" />
                    <span className="text-xl font-bold text-white">
                      {analysis.metadata?.template_used ? 'Sì' : 'No'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Template Usato</p>
                </div>
              </div>

              {/* Action Summary */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Riepilogo Azione</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-300">Azione Eseguita:</span>
                    <p className="text-gray-400 mt-1">{analysis.actionTaken}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Decisione AI:</span>
                    <p className="text-gray-400 mt-1">{analysis.aiDecision}</p>
                  </div>
                  {analysis.errorMessage && (
                    <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-red-400" />
                        <span className="text-sm font-medium text-red-400">Errore</span>
                      </div>
                      <p className="text-red-400 text-sm">{analysis.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Dettagli Tecnici</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ID Analisi:</span>
                    <p className="text-gray-300 font-mono">{analysis.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Email:</span>
                    <p className="text-gray-300 font-mono">{analysis.emailId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Settore:</span>
                    <p className="text-gray-300">{analysis.metadata?.sector || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Template:</span>
                    <p className="text-gray-300">{analysis.metadata?.template_used || 'Nessuno'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Original Email Tab */}
          {activeTab === 'original' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Email Originale</h3>
                <button
                  onClick={() => copyToClipboard(analysis.metadata?.original_email as string || '')}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy size={16} />
                  Copia
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b border-gray-800 pb-4">
                  <div>
                    <span className="text-gray-500">Da:</span>
                    <p className="text-gray-300">{analysis.emailFrom}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">A:</span>
                    <p className="text-gray-300">{analysis.emailTo.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Oggetto:</span>
                    <p className="text-gray-300">{analysis.emailSubject}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Data:</span>
                    <p className="text-gray-300">{analysis.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {analysis.metadata?.original_email || 'Contenuto email non disponibile'}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* Generated Draft Tab */}
          {activeTab === 'draft' && analysis.analysisType === 'draft_generation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Bozza Generata da AI</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(analysis.metadata?.generated_draft as string || '')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy size={16} />
                    Copia
                  </button>
                  {!isSent && (
                    <button
                      onClick={handleSendResponse}
                      disabled={isSending}
                      className="flex items-center gap-2 bg-[#00D9AA] text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50"
                    >
                      {isSending ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {isSending ? 'Invio...' : 'Invia'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-b border-gray-800 pb-4">
                  <div>
                    <span className="text-gray-500">Parole:</span>
                    <p className="text-gray-300">{analysis.metadata?.word_count}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tono:</span>
                    <p className="text-gray-300">{analysis.metadata?.tone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Template:</span>
                    <p className="text-gray-300">{analysis.metadata?.template_used}</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {analysis.metadata?.generated_draft || 'Bozza non disponibile'}
                  </pre>
                </div>
                
                {isSent && (
                  <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-400" />
                      <span className="text-sm font-medium text-green-400">
                        Risposta inviata con successo a {analysis.emailFrom}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* AI Processing Tab */}
          {activeTab === 'processing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Log Elaborazione AI</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Email ricevuta e analizzata</span>
                    <span className="text-gray-500 ml-auto">
                      {analysis.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Classificazione tipo richiesta in corso...</span>
                    <span className="text-gray-500 ml-auto">+0.3s</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Richiesta classificata: {analysis.analysisType}</span>
                    <span className="text-gray-500 ml-auto">+0.8s</span>
                  </div>
                  {analysis.analysisType === 'draft_generation' && (
                    <>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Template selezionato: {analysis.metadata?.template_used}</span>
                        <span className="text-gray-500 ml-auto">+1.2s</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Generazione bozza con Anthropic Sonnet 4.0...</span>
                        <span className="text-gray-500 ml-auto">+1.5s</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-3 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Elaborazione completata con successo</span>
                    <span className="text-gray-500 ml-auto">
                      +{analysis.processingTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>

              {analysis.metadata?.processing_notes && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Note di Elaborazione</h3>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-gray-800 rounded-lg p-4">
                    {analysis.metadata.processing_notes}
                  </pre>
                </div>
              )}

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Parametri AI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Modello:</span>
                    <p className="text-gray-300">Anthropic Sonnet 4.0</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Confidenza:</span>
                    <p className="text-gray-300">{(analysis.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tempo Elaborazione:</span>
                    <p className="text-gray-300">{analysis.processingTime.toFixed(2)} secondi</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Endpoint:</span>
                    <p className="text-gray-300 font-mono">api.anthropic.com/v1/messages</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}