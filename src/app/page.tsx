import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import ContactSection from "@/components/ContactSection";
import AnimatedText from "@/components/AnimatedText";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con Logo e CTA */}
      <header className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            Larin<span className="text-[#00D9AA]">AI</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-[#00D9AA] text-black px-6 py-2 font-semibold hover:bg-[#00D9AA]/90 transition-colors"
          >
            accedi o registrati
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center max-w-4xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h2 className="text-5xl font-bold mb-6">
            Il collettore di <span className="text-[#00D9AA]">funzioni AI</span>
          </h2>
          <div className="gradient-border mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Una piattaforma completa che raccoglie strumenti di intelligenza artificiale 
            per <AnimatedText /> i processi di lavoro.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-[#00D9AA] text-black px-8 py-4 font-semibold hover:bg-[#00D9AA]/90 transition-colors text-lg"
          >
            inizia subito
          </Link>
        </div>

        {/* Funzioni Principali */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-white">Funzioni Disponibili</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Funzione 1 - Archiviazione Automatica */}
            <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4">
                <div className="w-12 h-12 bg-[#00D9AA]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#00D9AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#00D9AA]">Archiviazione Automatica Documenti da email</h4>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                L&apos;AI analizza automaticamente gli allegati delle tue email Gmail, li classifica 
                intelligentemente e li archivia nel tuo Google Drive con una struttura organizzata.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Gmail</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Google Drive</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Classificazione AI</span>
              </div>
            </div>

            {/* Funzione 2 - Generazione Bozze */}
            <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="mb-4">
                <div className="w-12 h-12 bg-[#00D9AA]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#00D9AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-[#00D9AA]">Generazione intelligente di  bozze di risposta alle email</h4>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Genera bozze di risposta personalizzate basate sulla tua documentazione aziendale 
                utilizzando tecnologia RAG e AI avanzata. Compatibile con Gmail e Outlook.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Gmail</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">Outlook</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">RAG AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Come Funziona */}
        <HowItWorks className="mt-16" delay={0.2} />

        {/* Sezione Contatto */}
        <ContactSection 
          className="mt-16" 
          delay={0.3}
          title="Raccontaci le tue necessità"
          description="Ogni azienda ha esigenze di automazione uniche. Inserisci la tua email e descrivi quali processi vorresti automatizzare - ti ricontatteremo con una soluzione personalizzata."
          buttonText="Invia Richiesta"
        />

        {/* Tech Stack */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">Sviluppato con</p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="text-sm">Next.js</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="text-sm">Vercel</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="text-sm">Supabase</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="text-sm">Anthropic</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="text-sm">GPTs</div>
          </div>
        </div>
      </main>
    </div>
  );
}
