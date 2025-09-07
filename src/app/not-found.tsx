'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="relative">
            <AlertTriangle 
              size={80} 
              className="text-[#00D9AA] mx-auto mb-4" 
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-[#00D9AA]/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Pagina non trovata
          </h2>
          <p className="text-gray-400 text-lg mb-2">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
          <p className="text-gray-500 text-sm">
            Torna alla homepage e continua a gestire le tue email con{' '}
            <span className="text-[#00D9AA] font-semibold">MailAI</span>
          </p>
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0, 217, 170, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00D9AA] text-black font-semibold py-3 px-8 rounded-lg hover:bg-[#00D9AA]/90 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <Home size={20} />
              Torna alla Homepage
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-[#00D9AA] rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
