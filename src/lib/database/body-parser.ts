import { Json } from '@/types/database.types'
import { FunctionBodyData } from './functions'

/**
 * Parser sicuro per il campo body delle funzioni Larin
 */
export function parseFunctionBody(body: Json | null): FunctionBodyData {
  if (!body) return {}
  
  try {
    // Se è già un oggetto, lo usiamo direttamente
    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      return body as FunctionBodyData
    }
    
    // Se è una stringa, proviamo a parsarla
    if (typeof body === 'string') {
      return JSON.parse(body) as FunctionBodyData
    }
    
    // In tutti gli altri casi, ritorniamo un oggetto vuoto
    return {}
  } catch (error) {
    console.error('Errore nel parsing del body della funzione:', error)
    return {}
  }
}

/**
 * Estrae i dati strutturati dal body di una funzione
 */
export function extractFunctionData(body: Json | null) {
  const bodyData = parseFunctionBody(body)
  
  return {
    platforms: bodyData.list_software || [],
    features: bodyData.included || [],
    setupRequired: bodyData.setup || [],
    description: bodyData.description || 'Descrizione non disponibile'
  }
}
