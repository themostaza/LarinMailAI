'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import RegisterForm from './RegisterForm'

export default function RegisterPageClient() {
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
              Larin<span className="text-[#00D9AA]">AI</span>
            </h1>
            <p className="text-gray-400">
              Crea il tuo account
            </p>
          </motion.div>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Hai già un account?{' '}
            <Link 
              href="/login"
              className="text-[#00D9AA] hover:text-[#00D9AA]/80 transition-colors"
            >
              Accedi qui
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
