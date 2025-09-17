import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import AnimatedText from "@/components/AnimatedText";
import HomepageFunctions from "@/components/HomepageFunctions";
import IntegrationsCarousel from "@/components/IntegrationsCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con Logo e CTA */}
      <header className="flex justify-between items-center p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            Larin<span className="text-[#00D9AA]">AI</span>
          </h1>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center">
          <Link
            href="/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#00D9AA] transition-colors text-sm sm:text-base"
          >
            prezzi
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-[#00D9AA] text-black px-2 py-1 font-semibold hover:bg-[#00D9AA]/90 transition-colors text-sm"
          >
            accedi
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center max-w-4xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h2 className="text-5xl font-bold mb-6">
            Il collettore di <span className="text-[#00D9AA]">strumenti AI</span>
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

        {/* Sezione Integrazioni */}
        <IntegrationsCarousel className="mb-16" />

        {/* Funzioni Dinamiche dal Database */}
        <HomepageFunctions className="mb-16" />

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
