import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <main className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">
            Mail<span className="text-[#00D9AA]">AI</span>
          </h1>
          <div className="gradient-border mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Un software che esegue una cosa semplice quanto rivoluzionaria: 
            un modulo per la gestione delle email con l`&apos;AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-[#00D9AA]">Gmail & Outlook</h3>
            <p className="text-gray-400 text-sm">
              Integrazione con i principali provider email per iniziare subito
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-[#00D9AA]">Sistema Basato su Regole</h3>
            <p className="text-gray-400 text-sm">
              Non real-time ma attraverso regole personalizzabili dall&apos;utente
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-[#00D9AA]">Generazione Bozze</h3>
            <p className="text-gray-400 text-sm">
              L&apos;AI genera bozze di risposta basate sulla documentazione aziendale
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#00D9AA]/30 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-[#00D9AA]">Workflow Automation</h3>
            <p className="text-gray-400 text-sm">
              Automazione di azioni come instradamento e classificazione email
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
          <Link
            href="/instructions"
            className="rounded-lg bg-[#00D9AA] text-black px-8 py-4 font-semibold hover:bg-[#00D9AA]/90 transition-colors"
          >
            Vedi Demo Funzionamento
          </Link>
          <Link
            href="/manage"
            className="rounded-lg border border-[#00D9AA] text-[#00D9AA] px-8 py-4 font-medium hover:bg-[#00D9AA]/10 transition-colors"
          >
            Dashboard Management
          </Link>
          <a
            href="https://github.com/yourusername/mailai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 px-8 py-4 font-medium hover:bg-gray-900/50 transition-colors"
          >
            Vai su GitHub
          </a>
        </div>

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
          </div>
        </div>
      </main>
    </div>
  );
}
