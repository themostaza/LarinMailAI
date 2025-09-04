// Tipi per il sistema MailAI

// Tipi per le Actions Anthropic
export interface ActionParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required: boolean
  defaultValue?: unknown
}

export interface AIAction {
  id: string
  name: string
  description: string
  category: 'email_processing' | 'content_generation' | 'workflow_automation' | 'rag_query'
  parameters: ActionParameter[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

// Tipi per lo storico delle analisi
export interface EmailAnalysis {
  id: string
  emailId: string
  emailSubject: string
  emailFrom: string
  emailTo: string[]
  analysisType: 'draft_generation' | 'rule_processing' | 'forwarding' | 'classification'
  actionTaken: string
  aiDecision: string
  confidence: number
  processingTime: number
  result: 'success' | 'error' | 'pending'
  errorMessage?: string
  timestamp: Date
  metadata?: EmailAnalysisMetadata
}

// Metadata specifica per le diverse tipologie di analisi
export interface EmailAnalysisMetadata {
  // Campi comuni alla generazione bozze
  template_used?: string
  tone?: string
  word_count?: number
  sector?: string
  topics_covered?: string[]
  original_email?: string
  generated_draft?: string
  processing_notes?: string

  // Campi per classificazione/elaborazione regole
  classification?: string
  priority?: string
  urgency_level?: string
  required_docs?: string[]
  rule_applied?: string

  // Campi per errori/flag di sicurezza
  reason?: string
  manual_review?: boolean
  security_flags?: string[]

  // Altri campi usati negli esempi
  current_comparto?: string
  requested_change?: string
}

// Tipi per le regole di gestione email
export interface EmailRule {
  id: string
  name: string
  description: string
  conditions: RuleCondition[]
  actions: RuleAction[]
  priority: number
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RuleCondition {
  field: 'from' | 'to' | 'subject' | 'content' | 'attachment'
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex'
  value: string
  caseSensitive: boolean
}

export interface RuleAction {
  type: 'mark_as_read' | 'forward' | 'reply' | 'label' | 'archive' | 'custom_ai_action'
  parameters: Record<string, unknown>
}

// Tipi per i componenti UI
export interface SidebarItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: number
  external?: boolean
}

export interface DashboardStats {
  totalEmails: number
  processedEmails: number
  pendingEmails: number
  errorEmails: number
  averageProcessingTime: number
}