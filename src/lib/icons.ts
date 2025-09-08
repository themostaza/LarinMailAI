// Importa le icone specifiche che usiamo
import {
  // Email & Communication
  Mail, Send, Inbox, Archive, MessageSquare, MessageCircle, AtSign, PenTool,
  
  // Analytics & Data  
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity, Target,
  
  // AI & Automation
  Bot, Zap, Workflow, Repeat, Play, Pause, GitBranch,
  
  // Business & Finance
  DollarSign, CreditCard, Calculator, Receipt, Banknote,
  
  // Time & Calendar
  Calendar, Clock, Timer, AlarmClock,
  
  // Users & Social
  Users, User, UserPlus, Share, Share2, Heart, ThumbsUp,
  
  // Technology
  Database, Server, Cloud, Smartphone, Monitor, Wifi, Globe,
  
  // Files & Documents
  FileText, File, Files, Folder, FolderOpen, Upload, Download, Paperclip,
  
  // Settings & Tools
  Settings, Wrench, Cog, Sliders, Search, Filter,
  
  // Actions
  Plus, Minus, Edit, Trash2, Save, Eye, EyeOff,
  
  // Status & Feedback
  CheckCircle, XCircle, AlertTriangle, Info, HelpCircle,
  
  // Navigation
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  
  // Security
  Shield, Lock, Key,
  
  // Media
  Image, Video, Music, Camera, Mic,
  
  // E-commerce
  ShoppingCart, ShoppingBag, Package, Truck,
  
  // Location
  MapPin, Navigation,
  
  // Misc
  Star, Bookmark, Tag, Flag, Bell, Home, Building, Circle,
  
  // Types
  type LucideProps
} from 'lucide-react'

// Mappa curata delle icone disponibili con categorie
export const availableIcons = [
  // Email & Communication
  { name: 'Mail', label: 'Email', category: 'Email & Communication' },
  { name: 'Send', label: 'Invia', category: 'Email & Communication' },
  { name: 'Inbox', label: 'Inbox', category: 'Email & Communication' },
  { name: 'Archive', label: 'Archivio', category: 'Email & Communication' },
  { name: 'MessageSquare', label: 'Messaggio', category: 'Email & Communication' },
  { name: 'MessageCircle', label: 'Chat', category: 'Email & Communication' },
  { name: 'AtSign', label: 'Menzione', category: 'Email & Communication' },
  { name: 'PenTool', label: 'Scrittura', category: 'Email & Communication' },
  
  // Analytics & Data
  { name: 'BarChart3', label: 'Grafico Barre', category: 'Analytics & Data' },
  { name: 'LineChart', label: 'Grafico Lineare', category: 'Analytics & Data' },
  { name: 'PieChart', label: 'Grafico Torta', category: 'Analytics & Data' },
  { name: 'TrendingUp', label: 'Crescita', category: 'Analytics & Data' },
  { name: 'TrendingDown', label: 'Decrescita', category: 'Analytics & Data' },
  { name: 'Activity', label: 'Attività', category: 'Analytics & Data' },
  { name: 'Target', label: 'Obiettivo', category: 'Analytics & Data' },
  
  // AI & Automation
  { name: 'Bot', label: 'Bot/AI', category: 'AI & Automation' },
  { name: 'Zap', label: 'Automazione', category: 'AI & Automation' },
  { name: 'Workflow', label: 'Flusso di Lavoro', category: 'AI & Automation' },
  { name: 'Repeat', label: 'Ripeti', category: 'AI & Automation' },
  { name: 'Play', label: 'Avvia', category: 'AI & Automation' },
  { name: 'Pause', label: 'Pausa', category: 'AI & Automation' },
  { name: 'GitBranch', label: 'Processo', category: 'AI & Automation' },
  
  // Business & Finance
  { name: 'DollarSign', label: 'Denaro', category: 'Business & Finance' },
  { name: 'CreditCard', label: 'Carta di Credito', category: 'Business & Finance' },
  { name: 'Calculator', label: 'Calcolatrice', category: 'Business & Finance' },
  { name: 'Receipt', label: 'Ricevuta', category: 'Business & Finance' },
  { name: 'Banknote', label: 'Banconota', category: 'Business & Finance' },
  
  // Time & Calendar
  { name: 'Calendar', label: 'Calendario', category: 'Time & Calendar' },
  { name: 'Clock', label: 'Orologio', category: 'Time & Calendar' },
  { name: 'Timer', label: 'Timer', category: 'Time & Calendar' },
  { name: 'AlarmClock', label: 'Sveglia', category: 'Time & Calendar' },
  
  // Users & Social
  { name: 'Users', label: 'Utenti', category: 'Users & Social' },
  { name: 'User', label: 'Utente', category: 'Users & Social' },
  { name: 'UserPlus', label: 'Aggiungi Utente', category: 'Users & Social' },
  { name: 'Share', label: 'Condividi', category: 'Users & Social' },
  { name: 'Share2', label: 'Condividi 2', category: 'Users & Social' },
  { name: 'Heart', label: 'Cuore', category: 'Users & Social' },
  { name: 'ThumbsUp', label: 'Mi Piace', category: 'Users & Social' },
  
  // Technology
  { name: 'Database', label: 'Database', category: 'Technology' },
  { name: 'Server', label: 'Server', category: 'Technology' },
  { name: 'Cloud', label: 'Cloud', category: 'Technology' },
  { name: 'Smartphone', label: 'Smartphone', category: 'Technology' },
  { name: 'Monitor', label: 'Monitor', category: 'Technology' },
  { name: 'Wifi', label: 'WiFi', category: 'Technology' },
  { name: 'Globe', label: 'Globo', category: 'Technology' },
  
  // Files & Documents
  { name: 'FileText', label: 'Documento', category: 'Files & Documents' },
  { name: 'File', label: 'File', category: 'Files & Documents' },
  { name: 'Files', label: 'File Multipli', category: 'Files & Documents' },
  { name: 'Folder', label: 'Cartella', category: 'Files & Documents' },
  { name: 'FolderOpen', label: 'Cartella Aperta', category: 'Files & Documents' },
  { name: 'Upload', label: 'Carica', category: 'Files & Documents' },
  { name: 'Download', label: 'Scarica', category: 'Files & Documents' },
  { name: 'Paperclip', label: 'Allegato', category: 'Files & Documents' },
  
  // Settings & Tools
  { name: 'Settings', label: 'Impostazioni', category: 'Settings & Tools' },
  { name: 'Wrench', label: 'Chiave Inglese', category: 'Settings & Tools' },
  { name: 'Cog', label: 'Ingranaggio', category: 'Settings & Tools' },
  { name: 'Sliders', label: 'Controlli', category: 'Settings & Tools' },
  { name: 'Search', label: 'Cerca', category: 'Settings & Tools' },
  { name: 'Filter', label: 'Filtra', category: 'Settings & Tools' },
  
  // Actions
  { name: 'Plus', label: 'Aggiungi', category: 'Actions' },
  { name: 'Minus', label: 'Rimuovi', category: 'Actions' },
  { name: 'Edit', label: 'Modifica', category: 'Actions' },
  { name: 'Trash2', label: 'Elimina', category: 'Actions' },
  { name: 'Save', label: 'Salva', category: 'Actions' },
  { name: 'Eye', label: 'Visualizza', category: 'Actions' },
  { name: 'EyeOff', label: 'Nascondi', category: 'Actions' },
  
  // Status & Feedback
  { name: 'CheckCircle', label: 'Completato', category: 'Status & Feedback' },
  { name: 'XCircle', label: 'Errore', category: 'Status & Feedback' },
  { name: 'AlertTriangle', label: 'Attenzione', category: 'Status & Feedback' },
  { name: 'Info', label: 'Informazione', category: 'Status & Feedback' },
  { name: 'HelpCircle', label: 'Aiuto', category: 'Status & Feedback' },
  
  // Navigation
  { name: 'ArrowRight', label: 'Freccia Destra', category: 'Navigation' },
  { name: 'ArrowLeft', label: 'Freccia Sinistra', category: 'Navigation' },
  { name: 'ArrowUp', label: 'Freccia Su', category: 'Navigation' },
  { name: 'ArrowDown', label: 'Freccia Giù', category: 'Navigation' },
  { name: 'ChevronRight', label: 'Chevron Destra', category: 'Navigation' },
  { name: 'ChevronLeft', label: 'Chevron Sinistra', category: 'Navigation' },
  
  // Security
  { name: 'Shield', label: 'Sicurezza', category: 'Security' },
  { name: 'Lock', label: 'Blocco', category: 'Security' },
  { name: 'Key', label: 'Chiave', category: 'Security' },
  
  // Media
  { name: 'Image', label: 'Immagine', category: 'Media' },
  { name: 'Video', label: 'Video', category: 'Media' },
  { name: 'Music', label: 'Musica', category: 'Media' },
  { name: 'Camera', label: 'Fotocamera', category: 'Media' },
  { name: 'Mic', label: 'Microfono', category: 'Media' },
  
  // E-commerce
  { name: 'ShoppingCart', label: 'Carrello', category: 'E-commerce' },
  { name: 'ShoppingBag', label: 'Borsa Spesa', category: 'E-commerce' },
  { name: 'Package', label: 'Pacco', category: 'E-commerce' },
  { name: 'Truck', label: 'Consegna', category: 'E-commerce' },
  
  // Location
  { name: 'MapPin', label: 'Posizione', category: 'Location' },
  { name: 'Navigation', label: 'Navigazione', category: 'Location' },
  
  // Misc
  { name: 'Star', label: 'Stella', category: 'Misc' },
  { name: 'Bookmark', label: 'Segnalibro', category: 'Misc' },
  { name: 'Tag', label: 'Tag', category: 'Misc' },
  { name: 'Flag', label: 'Bandiera', category: 'Misc' },
  { name: 'Bell', label: 'Notifica', category: 'Misc' },
  { name: 'Home', label: 'Casa', category: 'Misc' },
  { name: 'Building', label: 'Edificio', category: 'Misc' }
] as const

// Mappa delle icone per accesso rapido
const iconMap = {
  Mail, Send, Inbox, Archive, MessageSquare, MessageCircle, AtSign, PenTool,
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity, Target,
  Bot, Zap, Workflow, Repeat, Play, Pause, GitBranch,
  DollarSign, CreditCard, Calculator, Receipt, Banknote,
  Calendar, Clock, Timer, AlarmClock,
  Users, User, UserPlus, Share, Share2, Heart, ThumbsUp,
  Database, Server, Cloud, Smartphone, Monitor, Wifi, Globe,
  FileText, File, Files, Folder, FolderOpen, Upload, Download, Paperclip,
  Settings, Wrench, Cog, Sliders, Search, Filter,
  Plus, Minus, Edit, Trash2, Save, Eye, EyeOff,
  CheckCircle, XCircle, AlertTriangle, Info, HelpCircle,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Shield, Lock, Key,
  Image, Video, Music, Camera, Mic,
  ShoppingCart, ShoppingBag, Package, Truck,
  MapPin, Navigation,
  Star, Bookmark, Tag, Flag, Bell, Home, Building,
  Circle // fallback
} as const

// Tipo per i nomi delle icone
export type IconName = keyof typeof iconMap

// Funzione per ottenere un'icona dal nome
export function getIcon(iconName: string): React.ComponentType<LucideProps> {
  return iconMap[iconName as IconName] || Circle
}

// Funzione per verificare se un nome di icona è valido
export function isValidIconName(iconName: string): iconName is IconName {
  return iconName in iconMap
}

// Ottieni tutte le icone disponibili
export function getAllAvailableIcons(): string[] {
  return availableIcons.map(icon => icon.name)
}

// Ottieni icone per categoria
export function getIconsByCategory(category: string) {
  return availableIcons.filter(icon => icon.category === category)
}

// Ottieni tutte le categorie
export function getIconCategories(): string[] {
  return Array.from(new Set(availableIcons.map(icon => icon.category)))
}
