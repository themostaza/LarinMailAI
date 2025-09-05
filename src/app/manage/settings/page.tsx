import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAuth } from '@/lib/auth-server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const user = await requireAuth()
  
  // Controlla se l'utente ha un account Google connesso
  let isConnected = false
  let connectedAccount = null
  
  try {
    const { data, error } = await supabaseAdmin
      .from('user_accounts')
      .select('email, google_refresh_token')
      .eq('user_id', user.id)
      .single()

    if (!error && data?.google_refresh_token) {
      isConnected = true
      connectedAccount = data.email
    }
  } catch (error) {
    console.error('Error checking connection:', error)
  }

  return (
    <SettingsClient 
      initialConnected={isConnected} 
      initialAccount={connectedAccount} 
    />
  )
}