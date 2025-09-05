import {
  // Email & Communication
  Mail,
  Send,
  Inbox,
  Archive,
  PenTool,
  MessageSquare,
  MessageCircle,
  AtSign,
  
  // Documents & Files
  FileText,
  File,
  Files,
  Folder,
  FolderOpen,
  Upload,
  Download,
  Paperclip,
  
  // Analytics & Data
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  
  // Automation & AI
  Bot,
  Zap,
  Workflow,
  GitBranch,
  Repeat,
  Play,
  Pause,
  
  // Security & Auth
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  
  // Business & Finance
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  Receipt,
  
  // Time & Calendar
  Calendar,
  Clock,
  Timer,
  AlarmClock,
  
  // Social & Marketing
  Users,
  User,
  UserPlus,
  Share,
  Share2,
  ThumbsUp,
  Heart,
  
  // Technology
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Wifi,
  
  // Settings & Tools
  Settings,
  Wrench,
  Cog,
  Sliders,
  
  // Navigation & Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Search,
  Filter,
  
  // Status & Feedback
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Arrows & Movement
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  
  // Media & Content
  Image,
  Video,
  Music,
  Camera,
  Mic,
  
  // E-commerce
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  
  // Location
  MapPin,
  Globe,
  Navigation,
  
  // Miscellaneous
  Star,
  Bookmark,
  Tag,
  Flag,
  Bell,
  Home,
  Building,
  
  // Fallback
  Circle,
  
  // Types
  type LucideProps
} from 'lucide-react'

// Mappa completa delle icone disponibili
export const iconRegistry = {
  // Email & Communication
  'mail': Mail,
  'send': Send,
  'inbox': Inbox,
  'archive': Archive,
  'pen-tool': PenTool,
  'message-square': MessageSquare,
  'message-circle': MessageCircle,
  'at-sign': AtSign,
  
  // Documents & Files
  'file-text': FileText,
  'file': File,
  'files': Files,
  'folder': Folder,
  'folder-open': FolderOpen,
  'upload': Upload,
  'download': Download,
  'paperclip': Paperclip,
  
  // Analytics & Data
  'bar-chart-3': BarChart3,
  'line-chart': LineChart,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'activity': Activity,
  'target': Target,
  
  // Automation & AI
  'bot': Bot,
  'zap': Zap,
  'workflow': Workflow,
  'git-branch': GitBranch,
  'repeat': Repeat,
  'play': Play,
  'pause': Pause,
  
  // Security & Auth
  'shield': Shield,
  'lock': Lock,
  'key': Key,
  'eye': Eye,
  'eye-off': EyeOff,
  
  // Business & Finance
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  'banknote': Banknote,
  'calculator': Calculator,
  'receipt': Receipt,
  
  // Time & Calendar
  'calendar': Calendar,
  'clock': Clock,
  'timer': Timer,
  'alarm-clock': AlarmClock,
  
  // Social & Marketing
  'users': Users,
  'user': User,
  'user-plus': UserPlus,
  'share': Share,
  'share-2': Share2,
  'thumbs-up': ThumbsUp,
  'heart': Heart,
  
  // Technology
  'database': Database,
  'server': Server,
  'cloud': Cloud,
  'smartphone': Smartphone,
  'monitor': Monitor,
  'wifi': Wifi,
  
  // Settings & Tools
  'settings': Settings,
  'wrench': Wrench,
  'cog': Cog,
  'sliders': Sliders,
  
  // Navigation & Actions
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash-2': Trash2,
  'save': Save,
  'search': Search,
  'filter': Filter,
  
  // Status & Feedback
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'help-circle': HelpCircle,
  
  // Arrows & Movement
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  
  // Media & Content
  'image': Image,
  'video': Video,
  'music': Music,
  'camera': Camera,
  'mic': Mic,
  
  // E-commerce
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'package': Package,
  'truck': Truck,
  
  // Location
  'map-pin': MapPin,
  'globe': Globe,
  'navigation': Navigation,
  
  // Miscellaneous
  'star': Star,
  'bookmark': Bookmark,
  'tag': Tag,
  'flag': Flag,
  'bell': Bell,
  'home': Home,
  'building': Building,
  
  // Fallback
  'circle': Circle
} as const

// Tipo per i nomi delle icone validi
export type IconName = keyof typeof iconRegistry

// Funzione per ottenere un'icona dal nome (quello che sarà salvato nel DB)
export function getIcon(iconName: string): React.ComponentType<LucideProps> {
  const normalizedName = iconName.toLowerCase().trim() as IconName
  return iconRegistry[normalizedName] || iconRegistry['circle'] // fallback a cerchio se non trovata
}

// Funzione per verificare se un nome di icona è valido
export function isValidIconName(iconName: string): iconName is IconName {
  const normalizedName = iconName.toLowerCase().trim()
  return normalizedName in iconRegistry
}

// Lista di tutte le icone disponibili (utile per dropdown/select nel backend)
export const availableIcons: { name: IconName; label: string; category: string }[] = [
  // Email & Communication
  { name: 'mail', label: 'Email', category: 'Email & Communication' },
  { name: 'send', label: 'Invia', category: 'Email & Communication' },
  { name: 'inbox', label: 'Inbox', category: 'Email & Communication' },
  { name: 'archive', label: 'Archivio', category: 'Email & Communication' },
  { name: 'pen-tool', label: 'Scrittura', category: 'Email & Communication' },
  { name: 'message-square', label: 'Messaggio', category: 'Email & Communication' },
  { name: 'message-circle', label: 'Chat', category: 'Email & Communication' },
  { name: 'at-sign', label: 'Menzione', category: 'Email & Communication' },
  
  // Documents & Files
  { name: 'file-text', label: 'Documento', category: 'Documents & Files' },
  { name: 'file', label: 'File', category: 'Documents & Files' },
  { name: 'files', label: 'File Multipli', category: 'Documents & Files' },
  { name: 'folder', label: 'Cartella', category: 'Documents & Files' },
  { name: 'folder-open', label: 'Cartella Aperta', category: 'Documents & Files' },
  { name: 'upload', label: 'Carica', category: 'Documents & Files' },
  { name: 'download', label: 'Scarica', category: 'Documents & Files' },
  { name: 'paperclip', label: 'Allegato', category: 'Documents & Files' },
  
  // Analytics & Data
  { name: 'bar-chart-3', label: 'Grafico a Barre', category: 'Analytics & Data' },
  { name: 'line-chart', label: 'Grafico Lineare', category: 'Analytics & Data' },
  { name: 'pie-chart', label: 'Grafico a Torta', category: 'Analytics & Data' },
  { name: 'trending-up', label: 'Tendenza Positiva', category: 'Analytics & Data' },
  { name: 'trending-down', label: 'Tendenza Negativa', category: 'Analytics & Data' },
  { name: 'activity', label: 'Attività', category: 'Analytics & Data' },
  { name: 'target', label: 'Obiettivo', category: 'Analytics & Data' },
  
  // Automation & AI
  { name: 'bot', label: 'Bot/AI', category: 'Automation & AI' },
  { name: 'zap', label: 'Automazione', category: 'Automation & AI' },
  { name: 'workflow', label: 'Workflow', category: 'Automation & AI' },
  { name: 'git-branch', label: 'Processo', category: 'Automation & AI' },
  { name: 'repeat', label: 'Ripeti', category: 'Automation & AI' },
  { name: 'play', label: 'Avvia', category: 'Automation & AI' },
  { name: 'pause', label: 'Pausa', category: 'Automation & AI' },
  
  // Security & Auth
  { name: 'shield', label: 'Sicurezza', category: 'Security & Auth' },
  { name: 'lock', label: 'Blocco', category: 'Security & Auth' },
  { name: 'key', label: 'Chiave', category: 'Security & Auth' },
  { name: 'eye', label: 'Visualizza', category: 'Security & Auth' },
  { name: 'eye-off', label: 'Nascondi', category: 'Security & Auth' },
  
  // Business & Finance
  { name: 'dollar-sign', label: 'Dollaro', category: 'Business & Finance' },
  { name: 'credit-card', label: 'Carta di Credito', category: 'Business & Finance' },
  { name: 'banknote', label: 'Banconota', category: 'Business & Finance' },
  { name: 'calculator', label: 'Calcolatrice', category: 'Business & Finance' },
  { name: 'receipt', label: 'Ricevuta', category: 'Business & Finance' },
  
  // Time & Calendar
  { name: 'calendar', label: 'Calendario', category: 'Time & Calendar' },
  { name: 'clock', label: 'Orologio', category: 'Time & Calendar' },
  { name: 'timer', label: 'Timer', category: 'Time & Calendar' },
  { name: 'alarm-clock', label: 'Sveglia', category: 'Time & Calendar' },
  
  // Social & Marketing
  { name: 'users', label: 'Utenti', category: 'Social & Marketing' },
  { name: 'user', label: 'Utente', category: 'Social & Marketing' },
  { name: 'user-plus', label: 'Aggiungi Utente', category: 'Social & Marketing' },
  { name: 'share', label: 'Condividi', category: 'Social & Marketing' },
  { name: 'share-2', label: 'Condividi 2', category: 'Social & Marketing' },
  { name: 'thumbs-up', label: 'Like', category: 'Social & Marketing' },
  { name: 'heart', label: 'Cuore', category: 'Social & Marketing' },
  
  // Technology
  { name: 'database', label: 'Database', category: 'Technology' },
  { name: 'server', label: 'Server', category: 'Technology' },
  { name: 'cloud', label: 'Cloud', category: 'Technology' },
  { name: 'smartphone', label: 'Smartphone', category: 'Technology' },
  { name: 'monitor', label: 'Monitor', category: 'Technology' },
  { name: 'wifi', label: 'WiFi', category: 'Technology' },
  
  // Settings & Tools
  { name: 'settings', label: 'Impostazioni', category: 'Settings & Tools' },
  { name: 'wrench', label: 'Chiave Inglese', category: 'Settings & Tools' },
  { name: 'cog', label: 'Ingranaggio', category: 'Settings & Tools' },
  { name: 'sliders', label: 'Controlli', category: 'Settings & Tools' },
  
  // Navigation & Actions
  { name: 'plus', label: 'Aggiungi', category: 'Navigation & Actions' },
  { name: 'minus', label: 'Rimuovi', category: 'Navigation & Actions' },
  { name: 'edit', label: 'Modifica', category: 'Navigation & Actions' },
  { name: 'trash-2', label: 'Elimina', category: 'Navigation & Actions' },
  { name: 'save', label: 'Salva', category: 'Navigation & Actions' },
  { name: 'search', label: 'Cerca', category: 'Navigation & Actions' },
  { name: 'filter', label: 'Filtra', category: 'Navigation & Actions' },
  
  // Status & Feedback
  { name: 'check-circle', label: 'Completato', category: 'Status & Feedback' },
  { name: 'x-circle', label: 'Errore', category: 'Status & Feedback' },
  { name: 'alert-triangle', label: 'Attenzione', category: 'Status & Feedback' },
  { name: 'info', label: 'Informazione', category: 'Status & Feedback' },
  { name: 'help-circle', label: 'Aiuto', category: 'Status & Feedback' },
  
  // Arrows & Movement
  { name: 'arrow-right', label: 'Freccia Destra', category: 'Arrows & Movement' },
  { name: 'arrow-left', label: 'Freccia Sinistra', category: 'Arrows & Movement' },
  { name: 'arrow-up', label: 'Freccia Su', category: 'Arrows & Movement' },
  { name: 'arrow-down', label: 'Freccia Giù', category: 'Arrows & Movement' },
  { name: 'chevron-right', label: 'Chevron Destra', category: 'Arrows & Movement' },
  { name: 'chevron-left', label: 'Chevron Sinistra', category: 'Arrows & Movement' },
  { name: 'chevron-up', label: 'Chevron Su', category: 'Arrows & Movement' },
  { name: 'chevron-down', label: 'Chevron Giù', category: 'Arrows & Movement' },
  
  // Media & Content
  { name: 'image', label: 'Immagine', category: 'Media & Content' },
  { name: 'video', label: 'Video', category: 'Media & Content' },
  { name: 'music', label: 'Musica', category: 'Media & Content' },
  { name: 'camera', label: 'Fotocamera', category: 'Media & Content' },
  { name: 'mic', label: 'Microfono', category: 'Media & Content' },
  
  // E-commerce
  { name: 'shopping-cart', label: 'Carrello', category: 'E-commerce' },
  { name: 'shopping-bag', label: 'Borsa Spesa', category: 'E-commerce' },
  { name: 'package', label: 'Pacco', category: 'E-commerce' },
  { name: 'truck', label: 'Consegna', category: 'E-commerce' },
  
  // Location
  { name: 'map-pin', label: 'Posizione', category: 'Location' },
  { name: 'globe', label: 'Globo', category: 'Location' },
  { name: 'navigation', label: 'Navigazione', category: 'Location' },
  
  // Miscellaneous
  { name: 'star', label: 'Stella', category: 'Miscellaneous' },
  { name: 'bookmark', label: 'Segnalibro', category: 'Miscellaneous' },
  { name: 'tag', label: 'Tag', category: 'Miscellaneous' },
  { name: 'flag', label: 'Bandiera', category: 'Miscellaneous' },
  { name: 'bell', label: 'Notifica', category: 'Miscellaneous' },
  { name: 'home', label: 'Casa', category: 'Miscellaneous' },
  { name: 'building', label: 'Edificio', category: 'Miscellaneous' },
]

// Funzione helper per ottenere le icone per categoria
export function getIconsByCategory(category: string) {
  return availableIcons.filter(icon => icon.category === category)
}

// Funzione helper per ottenere tutte le categorie
export function getIconCategories(): string[] {
  return Array.from(new Set(availableIcons.map(icon => icon.category)))
}
