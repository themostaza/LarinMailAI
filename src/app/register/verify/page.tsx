import { getUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import VerifyPageClient from './VerifyPageClient'

export default async function VerifyPage() {
  // Controlla se l'utente è già autenticato
  const user = await getUser()
  if (user) {
    redirect('/manage')
  }

  return <VerifyPageClient />
}
