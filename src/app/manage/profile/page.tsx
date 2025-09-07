import { requireAuth, getUserWithProfile } from '@/lib/auth-server'
import ProfilePageClient from './ProfilePageClient'

export default async function ProfilePage() {
  const user = await requireAuth()
  const { profile } = await getUserWithProfile()
  
  return (
    <ProfilePageClient 
      user={user} 
      profile={profile}
    />
  )
}