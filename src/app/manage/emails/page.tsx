'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, Search, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Email {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  date: string
  snippet: string
  labelIds: string[]
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async (query = '') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/gmail/emails?maxResults=20&query=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch emails')
      }

      const data = await response.json()
      setEmails(data.emails || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEmails(searchQuery)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="h-full overflow-auto">
      <div className="border-b border-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link 
              href="/manage/settings"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Torna alle impostazioni</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-blue-400" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Email</h1>
              <p className="text-gray-400">Gestisci le tue email Gmail</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca nelle email..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00D9AA] hover:bg-[#00D9AA]/90 disabled:bg-gray-600 text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Search size={16} />
              Cerca
            </button>
            <button
              type="button"
              onClick={() => fetchEmails(searchQuery)}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400"
          >
            <p className="font-medium">Errore: {error}</p>
            {error.includes('Token expired') && (
              <p className="text-sm mt-1">Torna alle impostazioni e riconnetti il tuo account Google.</p>
            )}
          </motion.div>
        )}

        {/* Emails List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
              <p className="text-gray-400 mt-4">Caricamento email...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">
                {searchQuery ? 'Nessuna email trovata per la ricerca.' : 'Nessuna email disponibile.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {emails.map((email) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white truncate">
                          {truncateText(email.subject || '(Nessun oggetto)', 60)}
                        </h3>
                        {email.labelIds.includes('UNREAD') && (
                          <span className="w-2 h-2 bg-[#00D9AA] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        Da: {truncateText(email.from, 50)}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {email.snippet}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(email.date)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Qui implementeresti la funzionalità di risposta
                          alert('Funzionalità di risposta in sviluppo')
                        }}
                        className="text-xs bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black px-2 py-1 rounded transition-colors"
                      >
                        Rispondi
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Email Count */}
        {emails.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Visualizzate {emails.length} email
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="border-b border-gray-800 p-4 flex items-center justify-between">
              <h3 className="font-medium text-white">
                {selectedEmail.subject || '(Nessun oggetto)'}
              </h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm text-gray-400">Da: </span>
                  <span className="text-white">{selectedEmail.from}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">A: </span>
                  <span className="text-white">{selectedEmail.to}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Data: </span>
                  <span className="text-white">{formatDate(selectedEmail.date)}</span>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {selectedEmail.snippet}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
