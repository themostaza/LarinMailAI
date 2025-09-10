import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { TablesUpdate } from '@/types/database.types'

type TranscriptionUpdate = TablesUpdate<'_lf_transcriptions'>

export async function POST(request: NextRequest) {
  try {
    const { transcriptionId, audioUrl, userId } = await request.json()

    if (!transcriptionId || !audioUrl || !userId) {
      return NextResponse.json(
        { error: 'TranscriptionId, audioUrl e userId sono richiesti' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()
    const assemblyApiKey = process.env.ASSEMBLYAI

    if (!assemblyApiKey) {
      return NextResponse.json(
        { error: 'API key AssemblyAI non configurata' },
        { status: 500 }
      )
    }

    // Chiama l'API di AssemblyAI per avviare la trascrizione
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': assemblyApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        auto_chapters: true,
        auto_highlights: true,
        speaker_labels: true,
        sentiment_analysis: true,
        entity_detection: true,
        language_detection: true,
        punctuate: true,
        format_text: true
      }),
    })

    if (!transcriptResponse.ok) {
      const errorData = await transcriptResponse.text()
      console.error('Errore nella chiamata ad AssemblyAI:', errorData)
      
      // Aggiorna lo stato a errore
      await supabase
        .from('_lf_transcriptions')
        .update({ 
          status: 'errore',
          data: { error: 'Errore nella chiamata ad AssemblyAI', details: errorData },
          edited_at: new Date().toISOString()
        })
        .eq('id', transcriptionId)
        .eq('user_id', userId)

      return NextResponse.json(
        { error: 'Errore nella chiamata ad AssemblyAI' },
        { status: 500 }
      )
    }

    const transcriptData = await transcriptResponse.json()
    const assemblyTranscriptId = transcriptData.id

    // Polling per controllare lo stato della trascrizione
    let attempts = 0
    const maxAttempts = 60 // 5 minuti con controlli ogni 5 secondi
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Aspetta 5 secondi
      
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${assemblyTranscriptId}`, {
        headers: {
          'Authorization': assemblyApiKey,
        },
      })

      if (!statusResponse.ok) {
        attempts++
        continue // Riprova
      }

      const statusData = await statusResponse.json()
      
      if (statusData.status === 'completed') {
        // Trascrizione completata con successo
        const updateData: TranscriptionUpdate = {
          status: 'elaborato',
          data: statusData,
          edited_at: new Date().toISOString()
        }

        const { error: updateError } = await supabase
          .from('_lf_transcriptions')
          .update(updateData)
          .eq('id', transcriptionId)
          .eq('user_id', userId)

        if (updateError) {
          console.error('Errore nell\'aggiornamento della trascrizione:', updateError)
          return NextResponse.json(
            { error: 'Errore nell\'aggiornamento della trascrizione' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          data: statusData
        })
      } else if (statusData.status === 'error') {
        // Errore nella trascrizione
        await supabase
          .from('_lf_transcriptions')
          .update({ 
            status: 'errore',
            data: { error: 'Errore in AssemblyAI', details: statusData },
            edited_at: new Date().toISOString()
          })
          .eq('id', transcriptionId)
          .eq('user_id', userId)

        return NextResponse.json(
          { error: 'Errore nella trascrizione AssemblyAI' },
          { status: 500 }
        )
      }
      
      attempts++
    }

    // Timeout raggiunto
    await supabase
      .from('_lf_transcriptions')
      .update({ 
        status: 'errore',
        data: { error: 'Timeout nella trascrizione', transcript_id: assemblyTranscriptId },
        edited_at: new Date().toISOString()
      })
      .eq('id', transcriptionId)
      .eq('user_id', userId)

    return NextResponse.json(
      { error: 'Timeout nella trascrizione' },
      { status: 408 }
    )

  } catch (error) {
    console.error('Errore nel processamento della trascrizione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
