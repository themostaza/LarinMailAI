import { LarinFunction, FunctionUserException } from './functions'

/**
 * Calcola la visibilità e disponibilità di una funzione per un utente specifico
 * 
 * @param func - La funzione Larin dal database
 * @param exception - L'eventuale eccezione per l'utente (null se non esiste)
 * @returns Oggetto con visible, available e hasException
 */
export function calculateFunctionPermissions(
  func: LarinFunction,
  exception: FunctionUserException | null
) {
  // Se esiste un'eccezione, usa i valori dell'eccezione
  if (exception) {
    return {
      visible: exception.visible ?? true,
      available: exception.available ?? false,
      hasException: true
    }
  }
  
  // Altrimenti usa i valori generali (con default)
  return {
    visible: func.generally_visible ?? true,
    available: func.generally_available ?? false,
    hasException: false
  }
}

/**
 * Esempi di come funziona la logica:
 * 
 * Caso 1: Funzione pubblica, disponibile per tutti
 * - generally_visible: true, generally_available: true
 * - Nessuna eccezione
 * - Risultato: visible=true, available=true
 * 
 * Caso 2: Funzione pubblica, ma non disponibile (richiede attivazione)
 * - generally_visible: true, generally_available: false
 * - Nessuna eccezione
 * - Risultato: visible=true, available=false
 * 
 * Caso 3: Funzione nascosta per tutti, tranne utenti specifici
 * - generally_visible: false, generally_available: false
 * - Eccezione per utente X: visible=true, available=true
 * - Risultato per utente X: visible=true, available=true
 * - Risultato per altri utenti: visible=false, available=false
 * 
 * Caso 4: Funzione visibile a tutti, ma disponibile solo per utenti specifici
 * - generally_visible: true, generally_available: false
 * - Eccezione per utente Y: visible=true, available=true
 * - Risultato per utente Y: visible=true, available=true
 * - Risultato per altri utenti: visible=true, available=false
 */

/**
 * Valida la logica di visibilità per test
 */
export function validateVisibilityLogic(
  generallyVisible: boolean | null,
  generallyAvailable: boolean | null,
  exceptionVisible: boolean | null = null,
  exceptionAvailable: boolean | null = null
) {
  const func = {
    generally_visible: generallyVisible,
    generally_available: generallyAvailable
  } as LarinFunction
  
  const exception = (exceptionVisible !== null || exceptionAvailable !== null) ? {
    visible: exceptionVisible,
    available: exceptionAvailable
  } as FunctionUserException : null
  
  return calculateFunctionPermissions(func, exception)
}
