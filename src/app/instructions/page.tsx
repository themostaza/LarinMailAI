'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Brain, 
  FileText, 
  User, 
  CheckCircle, 
  Settings, 
  Eye,
  Forward,
  Sparkles,
  Building,
  Clock
} from 'lucide-react'

const FlowStep = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0, 
  isActive = false,
  children 
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  delay?: number
  isActive?: boolean
  children?: React.ReactNode
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`relative p-6 rounded-xl border transition-all duration-300 ${
      isActive 
        ? 'bg-[#00D9AA]/10 border-[#00D9AA] shadow-lg shadow-[#00D9AA]/20' 
        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${isActive ? 'bg-[#00D9AA] text-black' : 'bg-gray-800 text-gray-400'}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  </motion.div>
)

const EmailDemo = ({ type }: { type: 'incoming' | 'draft' | 'forwarded' }) => {
  const configs = {
    incoming: {
      from: "cliente@esempio.com",
      subject: "Richiesta informazioni prodotto XYZ",
      preview: "Salve, vorrei avere maggiori informazioni sul vostro prodotto XYZ per un ordine di 500 unità...",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    draft: {
      from: "Bozza generata dall'AI",
      subject: "Re: Richiesta informazioni prodotto XYZ",
      preview: "Gentile Cliente, grazie per il suo interesse. Il prodotto XYZ è disponibile con le seguenti specifiche tecniche...",
      bgColor: "bg-[#00D9AA]/10",
      borderColor: "border-[#00D9AA]"
    },
    forwarded: {
      from: "Sistema automatico",
      subject: "Fwd: Richiesta informazioni prodotto XYZ",
      preview: "Email automaticamente inoltrata all'ufficio tecnico per competenza...",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    }
  }

  const config = configs[type]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-3">
        <Mail size={16} className="text-gray-400 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white">{config.from}</div>
          <div className="text-sm text-gray-300 truncate">{config.subject}</div>
          <div className="text-xs text-gray-400 mt-1 line-clamp-2">{config.preview}</div>
        </div>
      </div>
    </motion.div>
  )
}



export default function InstructionsPage() {
  const [activeScenario, setActiveScenario] = useState<1 | 2>(1)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              Mail<span className="text-[#00D9AA]">AI</span> Flow
            </h1>
            <p className="text-xl text-gray-400 mx-auto">
              Gestione intelligente delle email con AI - Sistema scalabile che assegna azioni all&apos;AI
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveScenario(1)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeScenario === 1
                ? 'bg-[#00D9AA] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Scenario 1: Generazione Bozze
          </button>
          <button
            onClick={() => setActiveScenario(2)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeScenario === 2
                ? 'bg-[#00D9AA] text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Scenario 2: Automazione Workflow
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeScenario === 1 && (
            <motion.div
              key="scenario1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Step 1: Incoming Email */}
                             <FlowStep
                 icon={Mail}
                 title="Email in Arrivo"
                 description="Arriva una nuova email all'azienda da un cliente"
                 isActive={currentStep === 0}
                 delay={0}
               >
                 <EmailDemo type="incoming" />
               </FlowStep>

               {/* Step 2: AI Analysis */}
               <FlowStep
                 icon={Brain}
                 title="Analisi AI"
                 description="L'AI analizza il contenuto della email utilizzando la documentazione aziendale"
                 isActive={currentStep === 1}
                 delay={0.4}
               >
                 <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                   <Sparkles className="text-[#00D9AA]" size={16} />
                   <div className="flex-1">
                     <div className="text-sm text-gray-300">Analizzando contenuto...</div>
                     <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                       <motion.div
                         className="bg-[#00D9AA] h-2 rounded-full"
                         initial={{ width: 0 }}
                         animate={{ width: currentStep >= 1 ? '100%' : '0%' }}
                         transition={{ duration: 1 }}
                       />
                     </div>
                   </div>
                 </div>
               </FlowStep>

               {/* Step 3: Draft Generation */}
               <FlowStep
                 icon={FileText}
                 title="Generazione Bozza"
                 description="L'AI genera una bozza di risposta basata sulla documentazione aziendale"
                 isActive={currentStep === 2}
                 delay={0.8}
               >
                 <EmailDemo type="draft" />
               </FlowStep>

               {/* Step 4: Human Review */}
               <FlowStep
                 icon={User}
                 title="Verifica Operatore"
                 description="Un operatore umano verifica e può modificare la bozza prima dell'invio"
                 isActive={currentStep === 3}
                 delay={1.2}
               >
                 <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                   <CheckCircle className="text-[#00D9AA]" size={16} />
                   <span className="text-sm text-gray-300">Bozza approvata e pronta per l&apos;invio</span>
                 </div>
               </FlowStep>
            </motion.div>
          )}

          {activeScenario === 2 && (
            <motion.div
              key="scenario2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Step 1: Incoming Email */}
                             <FlowStep
                 icon={Mail}
                 title="Email in Arrivo"
                 description="Arriva una nuova email che deve essere processata automaticamente"
                 isActive={currentStep === 0}
                 delay={0}
               >
                 <EmailDemo type="incoming" />
               </FlowStep>

               {/* Step 2: Rules Analysis */}
               <FlowStep
                 icon={Settings}
                 title="Analisi Regole"
                 description="L'AI verifica le regole definite dall'utente per determinare l'azione da eseguire"
                 isActive={currentStep === 1}
                 delay={0.4}
               >
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                     <div className="w-2 h-2 bg-[#00D9AA] rounded-full"></div>
                     <span className="text-sm text-gray-300">Regola: Email da clienti → Ufficio Commerciale</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                     <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                     <span className="text-sm text-gray-300">Regola: Contenuto tecnico → Ufficio Tecnico</span>
                   </div>
                 </div>
               </FlowStep>

               {/* Step 3: Automated Actions */}
               <FlowStep
                 icon={Clock}
                 title="Azioni Automatiche"
                 description="L'AI esegue le azioni definite: segna come letta e/o inoltra all'ufficio competente"
                 isActive={currentStep === 2}
                 delay={0.8}
               >
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                     <Eye className="text-[#00D9AA]" size={16} />
                     <span className="text-sm text-gray-300">Segnata come letta</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                     <Forward className="text-[#00D9AA]" size={16} />
                     <span className="text-sm text-gray-300">Inoltrata</span>
                   </div>
                 </div>
               </FlowStep>

               {/* Step 4: Office Assignment */}
               <FlowStep
                 icon={Building}
                 title="Assegnazione Ufficio"
                 description="L'email viene automaticamente inoltrata all'ufficio competente"
                 isActive={currentStep === 3}
                 delay={1.2}
               >
                 <EmailDemo type="forwarded" />
               </FlowStep>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  )
}