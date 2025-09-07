import { NextResponse } from 'next/server'
import { getPublicFunctions } from '@/lib/database/functions'

/**
 * API endpoint pubblico per recuperare le funzioni disponibili
 * Non richiede autenticazione e restituisce solo le funzioni pubblicamente visibili
 */
export async function GET() {
  try {
    // Recupera tutte le funzioni pubblicamente visibili
    const functions = await getPublicFunctions()
    
    return NextResponse.json({ 
      success: true, 
      data: functions,
      error: null 
    })
  } catch (error) {
    console.error('Errore nel recuperare le funzioni pubbliche:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Errore interno del server', 
      data: [] 
    }, { status: 500 })
  }
}
