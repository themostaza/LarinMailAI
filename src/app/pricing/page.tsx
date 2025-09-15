import Link from "next/link";
import ContactSection from "@/components/ContactSection";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con Logo */}
      <header className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              Larin<span className="text-[#00D9AA]">AI</span>
            </h1>
          </Link>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Sezione Abbonamento */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-8">
            Un <span className="text-[#00D9AA]">abbonamento</span>, tutti gli strumenti
          </h2>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="text-4xl font-bold text-[#00D9AA] mb-2">15+ strumenti AI</div>
              <p className="text-gray-400 text-lg">
                Accesso completo a tutti gli strumenti di intelligenza artificiale della piattaforma
              </p>
            </div>
            
            <div className="bg-black/50 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold mb-4">
                <span className="text-[#00D9AA]">€10</span>
                <span className="text-lg text-gray-400">/mese</span>
                <span className="text-xs text-gray-500 ml-2">+ IVA</span>
              </div>
              <div className="text-left space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00D9AA] rounded-full"></div>
                  <span>10 crediti al mese inclusi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00D9AA] rounded-full"></div>
                  <span>Accesso a tutti gli strumenti AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00D9AA] rounded-full"></div>
                  <span>Supporto clienti dedicato</span>
                </div>
              </div>
            </div>
            
            {/* Politica Crediti */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
              <div className="text-left">
                <div className="font-semibold text-gray-200 mb-2">Politica di utilizzo crediti</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong>Utilizzo minimo richiesto:</strong> 6 crediti al mese.<br/>
                  Se utilizzi meno di 6 crediti, la piattaforma trattiene la differenza tra i crediti non utilizzati e il minimo richiesto.
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  <strong>Esempio:</strong> Se utilizzi solo 3 crediti, verranno trattenuti 3 crediti aggiuntivi (6 - 3 = 3).
                </div>
              </div>
            </div>
            
            {/* Opzioni Aggiuntive */}
            <div className="text-center text-sm text-gray-400 space-y-1 mb-4">
              <p>Puoi sottoscrivere abbonamenti di importo superiore per più crediti mensili</p>
              <p>Oppure acquistare crediti aggiuntivi una tantum quando necessario</p>
            </div>
            
            <Link
              href="/login"
              className="w-full inline-block rounded-lg bg-[#00D9AA] text-black px-8 py-4 font-semibold hover:bg-[#00D9AA]/90 transition-colors text-lg"
            >
              Inizia ora
            </Link>
          </div>
        </div>

        {/* Sezione Funzionalità Custom */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-6">
            Funzionalità <span className="text-[#00D9AA]">personalizzate</span>
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Hai esigenze specifiche? Sviluppiamo funzionalità su misura per la tua azienda, 
            integrate perfettamente con la piattaforma LarinAI.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Soluzioni Mirate</h4>
              <p className="text-gray-400 text-sm">
                Strumenti AI sviluppati specificamente per i tuoi processi aziendali
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Integrazione Completa</h4>
              <p className="text-gray-400 text-sm">
                Perfetta integrazione con i tuoi sistemi e workflow esistenti
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Sviluppo Rapido</h4>
              <p className="text-gray-400 text-sm">
                Dalla progettazione al deploy in tempi ottimizzati
              </p>
            </div>
          </div>
        </div>

        {/* Sezione Contatto per Custom */}
        <ContactSection 
          title="Richiedi una funzionalità personalizzata"
          description="Raccontaci le tue esigenze specifiche e svilupperemo una soluzione AI su misura per la tua azienda. Ogni progetto viene valutato individualmente per offrirti il massimo valore."
          buttonText="Richiedi Preventivo Custom"
          delay={0.2}
        />

        {/* Tech Stack */}
        <div className="mt-16 pt-12 border-t border-gray-800 text-center">
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
