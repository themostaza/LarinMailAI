'use client'

import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Edit2,
  Play,
  Pause,
  Copy,
  FileDown,
  FileText,
  BarChart3
} from 'lucide-react'
import { Tables } from '@/types/database.types'

type TranscriptionRow = Tables<'_lf_transcriptions'>

// Tipo per i dati AssemblyAI
interface AssemblyAIWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

interface AssemblyAIData {
  id?: string;
  text?: string;
  words?: AssemblyAIWord[];
  audio_duration?: number;
  language_confidence?: number;
  acoustic_model?: string;
  speaker_labels?: boolean;
  sentiment_analysis?: boolean;
  auto_highlights?: boolean;
  language_code?: string;
  [key: string]: unknown;
}

type TranscriptionTabType = 'trascrizione' | 'dati'

interface VisualizzaEsecuzioneSectionProps {
  transcriptionTitle: string
  setTranscriptionTitle: (title: string) => void
  isEditingTranscriptionTitle: boolean
  setIsEditingTranscriptionTitle: (editing: boolean) => void
  isSavingTranscriptionTitle: boolean
  saveTranscriptionTitle: (title: string) => Promise<void>
  currentTranscriptionData: TranscriptionRow | null
  audioUrl: string
  isPlaying: boolean
  currentTime: number
  duration: number
  activeTranscriptionTab: TranscriptionTabType
  setActiveTranscriptionTab: (tab: TranscriptionTabType) => void
  isCopied: boolean
  onBackToMain: () => void
  togglePlay: () => void
  handleTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void
  handleLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => void
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatTime: (seconds: number) => string
  copyTranscription: () => void
  downloadTranscription: () => void
  getTranscriptionText: () => string
}

export default function VisualizzaEsecuzioneSection({
  transcriptionTitle,
  setTranscriptionTitle,
  isEditingTranscriptionTitle,
  setIsEditingTranscriptionTitle,
  isSavingTranscriptionTitle,
  saveTranscriptionTitle,
  currentTranscriptionData,
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  activeTranscriptionTab,
  setActiveTranscriptionTab,
  isCopied,
  onBackToMain,
  togglePlay,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleSeek,
  formatTime,
  copyTranscription,
  downloadTranscription,
  getTranscriptionText
}: VisualizzaEsecuzioneSectionProps) {
  
  const transcriptionTabs = [
    { id: 'trascrizione' as TranscriptionTabType, label: 'Trascrizione', icon: FileText },
    { id: 'dati' as TranscriptionTabType, label: 'Dati di trascrizione', icon: BarChart3 },
  ]

  const transcriptionText = getTranscriptionText()

  return (
    <>
      {/* CSS Styles per il player */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00D9AA;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00D9AA;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
      <div className="flex-1 flex flex-col h-full">
        {/* Header della trascrizione */}
        <div className="border-b border-gray-800 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToMain}
                className="p-2 text-gray-400 hover:text-[#00D9AA] transition-colors rounded-lg hover:bg-gray-800/50"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 group">
                  {isEditingTranscriptionTitle ? (
                    <input
                      type="text"
                      value={transcriptionTitle}
                      onChange={(e) => setTranscriptionTitle(e.target.value)}
                      onBlur={async () => {
                        setIsEditingTranscriptionTitle(false)
                        await saveTranscriptionTitle(transcriptionTitle)
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          setIsEditingTranscriptionTitle(false)
                          await saveTranscriptionTitle(transcriptionTitle)
                        }
                      }}
                      disabled={isSavingTranscriptionTitle}
                      className="text-3xl font-bold bg-transparent border-b-2 border-[#00D9AA] text-white focus:outline-none disabled:opacity-50"
                      autoFocus
                    />
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {transcriptionTitle}
                        {isSavingTranscriptionTitle && (
                          <div className="w-4 h-4 border-2 border-[#00D9AA] border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </h1>
                      <button
                        onClick={() => setIsEditingTranscriptionTitle(true)}
                        disabled={isSavingTranscriptionTitle}
                        className="p-1 text-gray-400 hover:text-[#00D9AA] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-25"
                        title="Modifica titolo"
                      >
                        <Edit2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contenuto principale */}
        <div className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Audio Player Section */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
              {/* Hidden Audio Element */}
              <audio
                id="audio-player"
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {}} // Handled by parent
                preload="metadata"
              />

              {/* File Info */}
              <div className="mb-4">
                <p className="text-white font-medium">Registrazione Riunione • 2h 15min • 45.2 MB • MP3</p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-[#00D9AA] hover:bg-[#00D9AA]/90 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-black" />
                  ) : (
                    <Play size={20} className="text-black ml-1" />
                  )}
                </button>

                {/* Time Display */}
                <span className="text-sm text-gray-400 font-mono min-w-[50px]">
                  {formatTime(currentTime)}
                </span>

                {/* Progress Bar */}
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #00D9AA 0%, #00D9AA ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                    }}
                  />
                </div>

                {/* Duration */}
                <span className="text-sm text-gray-400 font-mono min-w-[50px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <div className="flex space-x-1">
                {transcriptionTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTranscriptionTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                        activeTranscriptionTab === tab.id
                          ? 'bg-[#00D9AA]/10 border-b-2 border-[#00D9AA] text-[#00D9AA]'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTranscriptionTab === 'trascrizione' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white"></h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={copyTranscription}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            isCopied 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-gray-700 hover:bg-gray-600 text-white'
                          }`}
                          title="Copia trascrizione"
                        >
                          <Copy size={16} />
                          {isCopied ? 'Copiato!' : 'Copia'}
                        </button>
                        <button
                          onClick={downloadTranscription}
                          className="flex items-center gap-2 px-3 py-2 bg-[#00D9AA] hover:bg-[#00D9AA]/90 text-black rounded-lg transition-colors text-sm font-medium"
                          title="Scarica come TXT"
                        >
                          <FileDown size={16} />
                          Scarica TXT
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-6">
                      <div className="prose prose-invert max-w-none">
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                          <div className="border-b border-gray-600 pb-4 mb-4">
                            <p className="text-white font-semibold">{transcriptionTitle}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {currentTranscriptionData?.audio_file_length 
                                ? `Dimensione: ${Math.round(currentTranscriptionData.audio_file_length * 100) / 100} MB`
                                : 'Dimensione: N/A'
                              } • Data: {currentTranscriptionData?.created_at 
                                ? new Date(currentTranscriptionData.created_at).toLocaleDateString('it-IT')
                                : new Date().toLocaleDateString('it-IT')
                              }
                            </p>
                          </div>
                          
                          <div className="whitespace-pre-wrap text-sm">
                            {transcriptionText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTranscriptionTab === 'dati' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Metadati</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Dimensione file:</span>
                          <span className="text-white">
                            {currentTranscriptionData?.audio_file_length 
                              ? `${Math.round(currentTranscriptionData.audio_file_length * 100) / 100} MB`
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Data creazione:</span>
                          <span className="text-white">
                            {currentTranscriptionData?.created_at 
                              ? new Date(currentTranscriptionData.created_at).toLocaleDateString('it-IT')
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stato:</span>
                          <span className="text-white">{currentTranscriptionData?.status || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidenza lingua:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.language_confidence 
                                ? `${Math.round(data.language_confidence * 100)}%`
                                : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Modello acustico:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.acoustic_model?.replace('assemblyai_', 'AssemblyAI ') || 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Speaker labels:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.speaker_labels !== undefined
                                ? (data.speaker_labels ? '✅ Attivo' : '❌ Disattivo')
                                : 'N/A';
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Statistiche</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Parole totali:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.words && Array.isArray(data.words)
                                ? data.words.length
                                : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Durata audio:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              if (data?.audio_duration) {
                                const totalSeconds = data.audio_duration;
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                const seconds = Math.floor(totalSeconds % 60);
                                return hours > 0 
                                  ? `${hours}h ${minutes}min ${seconds}s`
                                  : `${minutes}min ${seconds}s`;
                              }
                              return 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lingue rilevate:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.language_code?.toUpperCase() || 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sentiment analysis:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.sentiment_analysis !== undefined
                                ? (data.sentiment_analysis ? '✅ Attivo' : '❌ Disattivo')
                                : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Auto highlights:</span>
                          <span className="text-white">
                            {(() => {
                              const data = currentTranscriptionData?.data as AssemblyAIData | null;
                              return data?.auto_highlights !== undefined
                                ? (data.auto_highlights ? '✅ Attivo' : '❌ Disattivo')
                                : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Ultima modifica:</span>
                          <span className="text-white">
                            {currentTranscriptionData?.edited_at 
                              ? new Date(currentTranscriptionData.edited_at).toLocaleDateString('it-IT')
                              : 'Mai'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
