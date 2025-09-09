'use client'

import { motion } from 'framer-motion'
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiAnthropicLine } from "react-icons/ri";
import { SiGoogledocs } from "react-icons/si";
import { FaCcStripe } from "react-icons/fa";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { SiElevenlabs } from "react-icons/si";
import { FaHubspot } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { BsMicrosoft } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { FaGoogleDrive } from "react-icons/fa6";
import { GrOnedrive } from "react-icons/gr";
import { SiGooglecalendar } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { FaFileExcel } from "react-icons/fa";
import { SiAirtable } from "react-icons/si";
import { SiZapier } from "react-icons/si";
import { SiAsana } from "react-icons/si";
import { FaTrello } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaAws } from "react-icons/fa";
import { RiSupabaseFill } from "react-icons/ri";
import { IoLogoVercel } from "react-icons/io5";
import { RiNextjsFill } from "react-icons/ri";

interface IntegrationItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  url: string;
}

const integrations: IntegrationItem[] = [
  { icon: AiOutlineOpenAI, name: "OpenAI", url: "https://openai.com" },
  { icon: RiAnthropicLine, name: "Anthropic", url: "https://anthropic.com" },
  { icon: SiGoogledocs, name: "Google Docs", url: "https://docs.google.com" },
  { icon: FaCcStripe, name: "Stripe", url: "https://stripe.com" },
  { icon: PiMicrosoftOutlookLogo, name: "Outlook", url: "https://outlook.com" },
  { icon: SiElevenlabs, name: "ElevenLabs", url: "https://elevenlabs.io" },
  { icon: FaHubspot, name: "HubSpot", url: "https://hubspot.com" },
  { icon: FaLinkedin, name: "LinkedIn", url: "https://linkedin.com" },
  { icon: FaMeta, name: "Meta", url: "https://meta.com" },
  { icon: BsMicrosoft, name: "Microsoft", url: "https://microsoft.com" },
  { icon: FaGoogle, name: "Google", url: "https://google.com" },
  { icon: BiLogoGmail, name: "Gmail", url: "https://gmail.com" },
  { icon: FaGoogleDrive, name: "Google Drive", url: "https://drive.google.com" },
  { icon: GrOnedrive, name: "OneDrive", url: "https://onedrive.com" },
  { icon: SiGooglecalendar, name: "Google Calendar", url: "https://calendar.google.com" },
  { icon: FaFacebookF, name: "Facebook", url: "https://facebook.com" },
  { icon: FaFileWord, name: "Word", url: "https://office.com/word" },
  { icon: FaInstagram, name: "Instagram", url: "https://instagram.com" },
  { icon: SiGooglesheets, name: "Google Sheets", url: "https://sheets.google.com" },
  { icon: FaFileExcel, name: "Excel", url: "https://office.com/excel" },
  { icon: SiAirtable, name: "Airtable", url: "https://airtable.com" },
  { icon: SiZapier, name: "Zapier", url: "https://zapier.com" },
  { icon: SiAsana, name: "Asana", url: "https://asana.com" },
  { icon: FaTrello, name: "Trello", url: "https://trello.com" },
  { icon: FaPaypal, name: "PayPal", url: "https://paypal.com" },
  { icon: FaYoutube, name: "YouTube", url: "https://youtube.com" },
  { icon: FaTiktok, name: "TikTok", url: "https://tiktok.com" },
  { icon: FaAws, name: "AWS", url: "https://aws.amazon.com" },
  { icon: RiSupabaseFill, name: "Supabase", url: "https://supabase.com" },
  { icon: IoLogoVercel, name: "Vercel", url: "https://vercel.com" },
  { icon: RiNextjsFill, name: "Next.js", url: "https://nextjs.org" },
];

interface IntegrationsCarouselProps {
  className?: string;
}

export default function IntegrationsCarousel({ className = '' }: IntegrationsCarouselProps) {
  // Duplica l'array per creare un effetto infinito
  const duplicatedIntegrations = [...integrations, ...integrations];

  const handleIntegrationClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Integriamo con i tuoi strumenti preferiti</h3>
        <p className="text-gray-400 text-sm">Connetti LarinAI con le piattaforme che usi ogni giorno</p>
      </motion.div>

      <div className="relative">
        <motion.div
          className="flex gap-4 items-center"
          animate={{
            x: [-40 * integrations.length, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: integrations.length * 2, // 2 secondi per icona
              ease: "linear",
            },
          }}
          style={{
            width: `${duplicatedIntegrations.length * 160}px`, // Larghezza per contenere tutte le icone
          }}
        >
          {duplicatedIntegrations.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <div
                key={`${integration.name}-${index}`}
                className="flex flex-col items-center justify-center min-w-[100px] cursor-pointer group"
                onClick={() => handleIntegrationClick(integration.url)}
              >
                <div className="w-18 h-18 flex items-center justify-center mb-2 rounded-lg bg-gray-800/50 border border-gray-700 group-hover:border-[#00D9AA]/50 group-hover:bg-gray-700/50 transition-all duration-300 group-hover:scale-110">
                  <IconComponent 
                    size={32} 
                    className="text-gray-400 group-hover:text-[#00D9AA] transition-colors duration-300" 
                  />
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-300 text-center">
                  {integration.name}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Gradiente per nascondere i bordi */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
