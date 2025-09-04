'use server'

import { signOut } from '@/lib/auth-server'

export async function logoutAction() {
  await signOut()
}
