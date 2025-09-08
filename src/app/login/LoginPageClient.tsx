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
            <Link href="/" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold text-white mb-2">
                Larin<span className="text-[#00D9AA]">AI</span>
              </h1>
            </Link>
            <p className="text-gray-400">
              Accedi al tuo account
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
            <Link 
              href="/register"
              className="text-[#00D9AA] hover:text-[#00D9AA]/80 transition-colors"
            >
              Registrati qui
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
