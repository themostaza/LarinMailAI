import Link from "next/link";
import ContactSection from "@/components/ContactSection";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con Logo */}
      <header className="flex justify-between items-center p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              Larin<span className="text-[#00D9AA]">AI</span>
            </h1>
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center">
          <Link
            href="/login"
            className="rounded-lg bg-[#00D9AA] text-black px-2 py-1 font-semibold hover:bg-[#00D9AA]/90 transition-colors text-sm"
          >
            accedi
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Sezione Abbonamento */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold mb-8">
            <span className="text-[#00D9AA]">1 abbonamento</span>, 15+ strumenti AI
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed font-medium">
                Carica crediti una-tantum o in abbonamento, paga <span className="font-bold text-[#00D9AA]">€6</span> ogni mese.
              </p>
            </div>
            
            {/* Politica Crediti */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 sm:p-4 mb-6">
              <div className="text-left">
                <div className="font-medium text-gray-200 mb-3 text-sm sm:text-base">Usa al massimo i tuoi crediti! Ecco cosa sapere:</div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                  Ogni strumento nella piattaforma ha il proprio tariffario e i crediti vengono scalati in base all&apos;utilizzo.
                </p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                  Se alla fine del mese di pagamento non sono stati utilizzati almeno 6 crediti, il sistema trattiene la differenza per arrivare a 6 crediti.
                </p>
                <div className="bg-gray-700/30 rounded-md p-2 sm:p-3">
                  <div className="font-medium text-gray-200 mb-2 text-xs sm:text-sm">💡 Esempio pratico:</div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-1">
                    • <strong>Scenario A:</strong> Usi 8 crediti nel mese → nessuna trattenuta: hai già usato almeno 6 crediti.
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-1">
                    • <strong>Scenario B:</strong> Usi solo 3 crediti → Il sistema trattiene altri 3 crediti (6-3=3) per raggiungere il minimo di 6.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Opzioni Aggiuntive */}
            
            <div className="text-center">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-[#00D9AA] text-black px-6 sm:px-8 py-3 sm:py-4 font-semibold hover:bg-[#00D9AA]/90 transition-colors text-base sm:text-lg"
              >
                Inizia ora
              </Link>
            </div>
          </div>
        </div>

        {/* Sezione Funzionalità Custom */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Funzionalità <span className="text-[#00D9AA]">personalizzate</span>
          </h3>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12">
            Hai esigenze specifiche? Sviluppiamo funzionalità su misura per la tua azienda, 
            integrate perfettamente con la piattaforma LarinAI.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Soluzioni Mirate</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Strumenti AI sviluppati specificamente per i tuoi processi aziendali
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Integrazione Completa</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Perfetta integrazione con i tuoi sistemi e workflow esistenti
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Sviluppo Rapido</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
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
