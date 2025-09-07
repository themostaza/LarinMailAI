import { 
  createSupabaseServerClientReadOnly,
  createSupabaseServerClientMutable
} from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createSupabaseServerClientReadOnly()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClientMutable()
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signOut() {
  const supabase = await createSupabaseServerClientMutable()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signUp(email: string) {
  const supabase = await createSupabaseServerClientMutable()
  return await supabase.auth.signUp({
    email,
    password: Math.random().toString(36).slice(-8), // Password temporanea
    options: {
      emailRedirectTo: `${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app' : 'http://localhost:3000'}/register/verify`,
      data: {
        email_confirm: true
      }
    }
  })
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createSupabaseServerClientMutable()
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })
}

export async function resendOtp(email: string) {
  const supabase = await createSupabaseServerClientMutable()
  return await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app' : 'http://localhost:3000'}/register/verify`,
    }
  })
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServerClientReadOnly()
  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Errore nel recuperare il profilo utente:', error)
    return null
  }
  
  return data
}

export async function getUserWithProfile() {
  const user = await getUser()
  if (!user) return { user: null, profile: null }
  
  const profile = await getUserProfile(user.id)
  return { user, profile }
}
