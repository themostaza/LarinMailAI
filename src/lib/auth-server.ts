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
