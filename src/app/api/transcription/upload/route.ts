import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import {  TablesInsert } from '@/types/database.types'

type TranscriptionInsert = TablesInsert<'_lf_transcriptions'>

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const userId = formData.get('userId') as string
    const specificId = formData.get('specificId') as string

    if (!file || !title || !userId || !specificId) {
      return NextResponse.json(
        { error: 'File, title, userId e specificId sono richiesti' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()

    // Prima ottieni l'ID della link_specific_lfunction_user
    const { data: linkData, error: linkError } = await supabase
      .from('link_specific_lfunction_user')
      .select('id')
      .eq('unique_public_code_uuid', specificId)
      .eq('user_id', userId)
      .single()

    if (linkError || !linkData) {
      console.error('Errore nel trovare la funzione specifica:', linkError)
      return NextResponse.json(
        { error: 'Funzione specifica non trovata' },
        { status: 404 }
      )
    }

    // Step 1: Carica il file audio su Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('transcription_audio')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Errore nel caricamento del file:', uploadError)
      return NextResponse.json(
        { error: 'Errore nel caricamento del file audio' },
        { status: 500 }
      )
    }

    // Ottieni l'URL pubblico del file
    const { data: urlData } = supabase.storage
      .from('transcription_audio')
      .getPublicUrl(uploadData.path)

    // Step 2: Crea record trascrizione nel database
    const transcriptionData: TranscriptionInsert = {
      title: title.trim(),
      audio_file_url: urlData.publicUrl,
      audio_file_length: file.size / (1024 * 1024), // Peso del file in MB
      user_id: userId,
      specific_lfunction_id: linkData.id,
      status: 'elaborazione',
      data: null
    }

    const { data, error } = await supabase
      .from('_lf_transcriptions')
      .insert(transcriptionData)
      .select('id')
      .single()

    if (error) {
      console.error('Errore nella creazione della trascrizione:', error)
      return NextResponse.json(
        { error: 'Errore nella creazione della trascrizione' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        audioUrl: urlData.publicUrl
      }
    })

  } catch (error) {
    console.error('Errore nell\'upload:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
