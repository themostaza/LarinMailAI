'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MailOpen, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw,
  BarChart3,
  Inbox,
  Archive,
  Trash2,
  LucideIcon
} from 'lucide-react'

interface DashboardClientProps {
  isConnected: boolean
  connectedAccount: string | null
}

interface ProfileData {
  emailAddress: string
  messagesTotal: number
  threadsTotal: number
  historyId: string
}

// Rimosso MetricsData: usiamo solo conteggi massivi da labels/profile

interface TemporalData {
  period: string
  summary: {
    received: number
    sent: number
    unread: number
    activityRate: number
    unreadRate: number
    attachmentRate: number
    totalActivity: number
  }
  metrics: Array<{ key: string; description: string; count: number }>
}

interface LabelData {
  labels: Array<{
    id: string
    name: string
    type?: string
    messagesTotal: number
    messagesUnread: number
    threadsTotal: number
    threadsUnread: number
  }>
  importantLabels: Array<{
    id: string
    name: string
    type?: string
    messagesTotal: number
    messagesUnread: number
    threadsTotal: number
    threadsUnread: number
  }>
  totalLabels: number
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'text-[#00D9AA]',
  bgColor = 'bg-[#00D9AA]/10',
  borderColor = 'border-[#00D9AA]/30'
}: {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  color?: string
  bgColor?: string
  borderColor?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} border ${borderColor} rounded-xl p-6`}
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className={`${color}`} size={24} />
      {trend && (
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </motion.div>
)

export default function DashboardClient({ isConnected, connectedAccount }: DashboardClientProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [temporalData, setTemporalData] = useState<TemporalData | null>(null)
  const [labelData, setLabelData] = useState<LabelData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = async () => {
    if (!isConnected) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch data in parallel: profilo, temporale, etichette (niente /metrics)
      const [profileResponse, temporalResponse, labelsResponse] = await Promise.all([
        fetch('/api/gmail/profile'),
        fetch('/api/gmail/temporal'),
        fetch('/api/gmail/labels')
      ])

      // Check for errors
      const responses = [profileResponse, temporalResponse, labelsResponse]
      const errorResponse = responses.find(r => !r.ok)
      
      if (errorResponse) {
        const errorData = await errorResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${errorResponse.status}: Failed to fetch data`)
      }

      // Parse all responses
      const [profile, temporal, labels] = await Promise.all([
        profileResponse.json(),
        temporalResponse.json(),
        labelsResponse.json()
      ])

      // Update state with new data
      setProfileData(profile)
      setTemporalData(temporal)
      setLabelData(labels)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Errore nel caricamento delle statistiche email'
      
      if (errorMessage.includes('Token expired and refresh failed')) {
        setError('Token scaduto. Vai alle Impostazioni per riconnettere il tuo account Gmail.')
      } else if (errorMessage.includes('Account not found')) {
        setError('Account Gmail non trovato. Vai alle Impostazioni per connettere il tuo account.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchDashboardData()
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <div className="h-full overflow-auto">
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Panoramica delle tue email e statistiche Gmail
            </p>
          </motion.div>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-8 text-center"
          >
            <AlertCircle className="text-yellow-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">
              Account Gmail non connesso
            </h3>
            <p className="text-gray-400 mb-4">
              Per visualizzare la dashboard delle tue email, devi prima connettere il tuo account Gmail.
            </p>
            <button
              onClick={() => window.location.href = '/manage/settings'}
              className="bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Vai alle Impostazioni
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Panoramica delle tue email Gmail • {connectedAccount}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={16} />
              Aggiorna
            </button>
          </div>
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-400/10 border border-red-400/30 text-red-400 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {isLoading && !labelData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-6 h-6 bg-gray-700 rounded"></div>
                </div>
                <div className="w-12 h-8 bg-gray-700 rounded mb-2"></div>
                <div className="w-20 h-4 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {labelData && profileData && temporalData && (
          <>
            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#00D9AA]/10 to-blue-500/10 border border-[#00D9AA]/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00D9AA] rounded-full flex items-center justify-center">
                  <Mail className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{profileData.emailAddress}</h3>
                  <p className="text-sm text-gray-400">
                    {profileData.messagesTotal.toLocaleString()} messaggi totali • {profileData.threadsTotal.toLocaleString()} conversazioni
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Stats - SOLO DATI MASSIVI STATICI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Totali dal profilo */}
              <StatCard
                title="Totale Email"
                value={profileData.messagesTotal.toLocaleString()}
                icon={Mail}
                trend="Tutti i tempi"
              />
              {(() => {
                const findLabel = (name: string) => labelData.labels.find(l => l.name === name)
                const unreadGlobal = findLabel('UNREAD')?.messagesUnread || 0
                const inboxUnread = findLabel('INBOX')?.messagesUnread || 0
                const starredTotal = findLabel('STARRED')?.messagesTotal || 0
                const importantTotal = findLabel('IMPORTANT')?.messagesTotal || 0
                const sentTotal = findLabel('SENT')?.messagesTotal || 0
                const draftsTotal = findLabel('DRAFT')?.messagesTotal || 0
                const spamUnread = findLabel('SPAM')?.messagesUnread || 0
                const trashTotal = findLabel('TRASH')?.messagesTotal || 0

                return (
                  <>
                    <StatCard
                      title="Non Lette (Globali)"
                      value={unreadGlobal.toLocaleString()}
                      icon={MailOpen}
                      trend="Tutti i tempi"
                      color="text-orange-400"
                      bgColor="bg-orange-400/10"
                      borderColor="border-orange-400/30"
                    />
                    <StatCard
                      title="Inbox Non Lette"
                      value={inboxUnread.toLocaleString()}
                      icon={Inbox}
                      trend="INBOX"
                      color="text-green-400"
                      bgColor="bg-green-400/10"
                      borderColor="border-green-400/30"
                    />
                    <StatCard
                      title="Stellate (Totali)"
                      value={starredTotal.toLocaleString()}
                      icon={Clock}
                      trend="STARRED"
                      color="text-yellow-400"
                      bgColor="bg-yellow-400/10"
                      borderColor="border-yellow-400/30"
                    />
                    <StatCard
                      title="Importanti (Totali)"
                      value={importantTotal.toLocaleString()}
                      icon={BarChart3}
                      trend="IMPORTANT"
                      color="text-[#00D9AA]"
                      bgColor="bg-[#00D9AA]/10"
                      borderColor="border-[#00D9AA]/30"
                    />
                    <StatCard
                      title="Inviate (Totali)"
                      value={sentTotal.toLocaleString()}
                      icon={Mail}
                      trend="SENT"
                      color="text-blue-400"
                      bgColor="bg-blue-400/10"
                      borderColor="border-blue-400/30"
                    />
                    <StatCard
                      title="Bozze (Totali)"
                      value={draftsTotal.toLocaleString()}
                      icon={Archive}
                      trend="DRAFT"
                      color="text-purple-400"
                      bgColor="bg-purple-400/10"
                      borderColor="border-purple-400/30"
                    />
                    <StatCard
                      title="Spam Non Lette"
                      value={spamUnread.toLocaleString()}
                      icon={AlertCircle}
                      trend="SPAM"
                      color="text-orange-400"
                      bgColor="bg-orange-400/10"
                      borderColor="border-orange-400/30"
                    />
                    <StatCard
                      title="Cestino (Totali)"
                      value={trashTotal.toLocaleString()}
                      icon={Trash2}
                      trend="TRASH"
                      color="text-red-400"
                      bgColor="bg-red-400/10"
                      borderColor="border-red-400/30"
                    />
                  </>
                )
              })()}
            </div>

            {/* Categories Distribution da labels CATEGORY_* */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-[#00D9AA]" size={24} />
                <h2 className="text-lg font-semibold text-white">Distribuzione per Categoria</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const findLabel = (name: string) => labelData.labels.find(l => l.name === name)
                  const categories = [
                    { key: 'CATEGORY_PERSONAL', name: 'Personali' },
                    { key: 'CATEGORY_SOCIAL', name: 'Social' },
                    { key: 'CATEGORY_PROMOTIONS', name: 'Promozioni' },
                    { key: 'CATEGORY_UPDATES', name: 'Aggiornamenti' },
                    { key: 'CATEGORY_FORUMS', name: 'Forum' },
                  ]
                  return categories.map((c) => {
                    const label = findLabel(c.key)
                    const total = label?.messagesTotal || 0
                    const unread = label?.messagesUnread || 0
                    return (
                      <div key={c.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="text-blue-400" size={16} />
                          <span className="text-white text-sm">{c.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm font-medium">{total.toLocaleString()} totali • {unread.toLocaleString()} non lette</span>
                      </div>
                    )
                  })
                })()}
              </div>
            </motion.div>

            {/* Panoramica etichette */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Archive className="text-blue-400" size={24} />
                <h2 className="text-lg font-semibold text-white">Etichette: panoramica</h2>
              </div>
              <div className="text-sm text-gray-400 mb-4">Totale etichette: {labelData.totalLabels}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {labelData.importantLabels.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={16} />
                      <span className="text-white text-sm">{l.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">{l.messagesTotal.toLocaleString()} totali • {l.messagesUnread.toLocaleString()} non lette</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Last Updated */}
            {lastUpdated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-gray-500"
              >
                Ultimo aggiornamento: {lastUpdated.toLocaleString('it-IT')}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
