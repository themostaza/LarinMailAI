'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPageClient() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Mail<span className="text-[#00D9AA]">AI</span>
            </h1>
            <p className="text-gray-400">
              Accedi al tuo account per gestire le email con l&apos;AI
            </p>
          </motion.div>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Non hai un account?{' '}
            <span className="text-gray-500">
              Contatta l&apos;amministratore per ottenere l&apos;accesso.
            </span>
          </p>
          <div className="mt-4">
            <Link 
              href="/instructions"
              className="text-[#00D9AA] hover:text-[#00D9AA]/80 text-sm transition-colors"
            >
              Scopri come funziona MailAI
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
