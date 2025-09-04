'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Zap, 
  History, 
  TrendingUp, 
  Mail,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function ManagePage() {
  const quickStats = [
    {
      title: 'Actions Attive',
      value: '3',
      change: '+1 questa settimana',
      color: 'text-[#00D9AA]',
      icon: Zap
    },
    {
      title: 'Email Elaborate',
      value: '847',
      change: '+12% vs mese scorso',
      color: 'text-blue-400',
      icon: Mail
    },
    {
      title: 'Tempo Medio',
      value: '2.3s',
      change: '-0.4s vs media',
      color: 'text-purple-400',
      icon: Clock
    },
    {
      title: 'Successo Rate',
      value: '94.2%',
      change: '+2.1% miglioramento',
      color: 'text-green-400',
      icon: TrendingUp
    }
  ]

  const quickActions = [
    {
      title: 'Gestisci Actions AI',
      description: 'Configura e monitora le azioni automatiche che l\'AI può eseguire',
      href: '/manage/actions',
      icon: Zap,
      color: 'bg-[#00D9AA]/10 border-[#00D9AA] text-[#00D9AA]'
    },
    {
      title: 'Storico Analisi',
      description: 'Visualizza tutti i processi di elaborazione email e i relativi risultati',
      href: '/manage/history',
      icon: History,
      color: 'bg-blue-400/10 border-blue-400 text-blue-400'
    }
  ]

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard <span className="text-[#00D9AA]">Management</span>
          </h1>
          <p className="text-gray-400">
            Gestisci e monitora il sistema MailAI - Controllo completo delle automazioni
          </p>
        </motion.div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Panoramica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={24} className={stat.color} />
                    <span className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-gray-400">{stat.change}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Azioni Rapide</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={action.href}>
                    <div className={`p-6 rounded-xl border-2 border-dashed transition-all hover:bg-opacity-5 ${action.color} group cursor-pointer`}>
                      <div className="flex items-start justify-between mb-4">
                        <Icon size={32} className="group-hover:scale-110 transition-transform" />
                        <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Attività Recente</h2>
            <Link href="/manage/history" className="text-sm text-[#00D9AA] hover:text-[#00D9AA]/80 transition-colors">
              Vedi tutto →
            </Link>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 bg-[#00D9AA] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    Nuova bozza generata per email da <strong>cliente@esempio.com</strong>
                  </p>
                  <p className="text-xs text-gray-400">2 minuti fa</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    Email automaticamente inoltrata all&apos;ufficio tecnico
                  </p>
                  <p className="text-xs text-gray-400">15 minuti fa</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    Action <strong>&quot;Classificazione Email&quot;</strong> attivata con successo
                  </p>
                  <p className="text-xs text-gray-400">1 ora fa</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Stato Sistema</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#00D9AA] rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-white">AI Service</p>
                  <p className="text-xs text-gray-400">Operativo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#00D9AA] rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-white">Email Integration</p>
                  <p className="text-xs text-gray-400">Connesso</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#00D9AA] rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-white">Database</p>
                  <p className="text-xs text-gray-400">Sincronizzato</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}