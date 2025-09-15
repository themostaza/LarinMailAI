
// Re-export delle Server Actions dal file separato
export {
  getFunctionBySpecificId,
  updateFunctionGivenName,
  getTranscriptions,
  getTranscription,
  updateTranscriptionTitle
} from './server-actions'

/**
 * Client function per caricare un file audio tramite API
 */
export async function uploadAudioFile(
  file: File, 
  title: string,
  userId: string, 
  specificId: string
): Promise<{
  success: boolean;
  data?: { id: string; audioUrl: string };
  error?: string;
}> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('userId', userId)
    formData.append('specificId', specificId)

    const response = await fetch('/api/transcription/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Errore nel caricamento del file'
      }
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Errore nel caricamento del file:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Client function per processare la trascrizione tramite API
 */
export async function processTranscriptionWithAssemblyAI(
  transcriptionId: string,
  audioUrl: string,
  userId: string
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const response = await fetch('/api/transcription/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcriptionId,
        audioUrl,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Errore nella trascrizione'
      }
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('Errore nel processamento della trascrizione:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}