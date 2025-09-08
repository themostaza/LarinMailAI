import { isValidIconName } from '@/lib/icons'

/**
 * Verifica se un'icona esiste nel registro delle icone disponibili
 */
export function isValidIcon(iconName: string): boolean {
  return isValidIconName(iconName)
}

/**
 * Restituisce un nome di icona valido, con fallback a 'Settings' se non trovata
 */
export function getValidIconName(iconName: string | null | undefined): string {
  if (!iconName) return 'Settings'
  
  // Controlla se l'icona esiste
  if (isValidIcon(iconName)) {
    return iconName
  }
  
  // Fallback a 'Settings' se l'icona non esiste
  console.warn(`Icona '${iconName}' non trovata, usando fallback 'Settings'`)
  return 'Settings'
}

/**
 * Converte il campo lucide_react_icon dal database in un nome di icona valido
 */
export function processIconFromDatabase(lucideReactIcon: string | null | undefined): string {
  return getValidIconName(lucideReactIcon)
}
