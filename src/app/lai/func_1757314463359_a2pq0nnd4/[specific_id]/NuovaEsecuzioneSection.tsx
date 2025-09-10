'use client'

import { motion } from 'framer-motion'
import { 
  Upload,
  File,
  Play
} from 'lucide-react'

interface NuovaEsecuzioneSectionProps {
  transcriptionTitle: string
  setTranscriptionTitle: (title: string) => void
  uploadedFile: File | null
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  startTranscription: () => void
  isTranscribing: boolean
  processingProgress: string
}

export default function NuovaEsecuzioneSection({ 
  transcriptionTitle,
  setTranscriptionTitle,
  uploadedFile,
  handleFileUpload,
  startTranscription,
  isTranscribing,
  processingProgress
}: NuovaEsecuzioneSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Upload File Section */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6">Carica File Audio</h3>
        
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-[#00D9AA]/50 transition-colors">
          <input
            type="file"
            accept=".mp3,.wav,.m4a,.flac,.ogg,.wma,.aac,.webm"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={32} className="text-[#00D9AA]" />
            </div>
            <p className="text-lg font-medium text-white mb-2">
              {uploadedFile ? uploadedFile.name : 'Clicca per caricare un file audio'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Formati supportati: MP3, WAV, M4A, FLAC, OGG, WMA, AAC, WebM
            </p>
            {uploadedFile && (
              <div className="flex items-center justify-center gap-2 text-[#00D9AA]">
                <File size={16} />
                <span className="text-sm font-medium">File caricato: {uploadedFile.name}</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Start Transcription Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={startTranscription}
          disabled={!uploadedFile || isTranscribing}
          className={`relative px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg text-lg overflow-hidden ${
            !uploadedFile ? 'opacity-50 cursor-not-allowed bg-gray-700' : ''
          }`}
          whileHover={uploadedFile ? { scale: 1.05 } : {}}
          whileTap={uploadedFile ? { scale: 0.95 } : {}}
        >
          {uploadedFile && (
            <>
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00D9AA] via-blue-500 to-purple-500 opacity-90"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </>
          )}
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 text-black">
            {isTranscribing ? (
              <>
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Trascrizione in corso...
              </>
            ) : (
              <>
                <Play size={20} />
                Avvia Trascrizione
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Results Placeholder durante trascrizione */}
      {isTranscribing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 border-2 border-[#00D9AA] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-medium">Elaborazione in corso...</span>
          </div>
          {processingProgress && (
            <div className="mb-4">
              <p className="text-[#00D9AA] text-sm font-medium">{processingProgress}</p>
            </div>
          )}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Non chiudere questa pagina durante l&apos;elaborazione. Il processo può richiedere alcuni minuti.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
