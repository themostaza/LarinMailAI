import { getUserWithProfile } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import SuperAdminDashboard from './SuperAdminDashboard'

export default async function SuperAdminPage() {
  const { user, profile } = await getUserWithProfile()
  
  // Check if user is authenticated
  if (!user) {
    redirect('/login')
  }
  
  // Check if user has superadmin role
  if (!profile || profile.role !== 'superadmin') {
    redirect('/manage')
  }
  
  return <SuperAdminDashboard user={user} profile={profile} />
}
