import { createClient } from '@supabase/supabase-js'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client per uso server-side con service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Client per uso client-side (browser)
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client server-side READ-ONLY per Server Components (non può modificare i cookie)
export async function createSupabaseServerClientReadOnly() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {},
      remove() {},
    },
  })
}

// Client server-side MUTABILE per Server Actions o Route Handlers (può modificare i cookie)
export async function createSupabaseServerClientMutable() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}

export interface UserAccount {
  id: string
  user_id: string
  email: string
  google_refresh_token: string
  google_access_token?: string
  token_expires_at?: Date
  scopes?: string[]
  created_at?: Date
  updated_at?: Date
}
