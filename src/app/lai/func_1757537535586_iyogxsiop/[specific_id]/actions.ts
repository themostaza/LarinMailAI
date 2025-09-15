// Client-side functions per gestire le compilazioni PDF
import { Tables } from '@/types/database.types'

// Re-export delle Server Actions dal file separato
export {
  getFunctionBySpecificId,
  updateFunctionGivenName,
  getPdfCompilations,
  getPdfCompilation,
  updatePdfCompilationTitle
} from './server-actions'

/**
 * Client function per creare una nuova compilazione PDF tramite API
 */
export async function createPdfCompilation(
  formData: Record<string, unknown>,
  title: string,
  userId: string,
  specificId: string
): Promise<{
  success: boolean;
  data?: { id: string; pdfUrl: string };
  error?: string;
}> {
  try {
    const response = await fetch('/api/pdf/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        title,
        userId,
        specificId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Errore nella compilazione del PDF'
      }
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Errore nella compilazione del PDF:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Client function per processare la compilazione PDF tramite API
 */
export async function processPdfCompilation(
  compilationId: string,
  formData: Record<string, unknown>,
  userId: string
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const response = await fetch('/api/pdf/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compilationId,
        formData,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Errore nel processamento del PDF'
      }
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Errore nel processamento del PDF:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

