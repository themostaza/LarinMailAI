import Sidebar from '@/components/ui/Sidebar'
import { getUserWithProfile } from '@/lib/auth-server'
import { AuthProvider } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserWithProfile()
  
  // Check if user is authenticated
  if (!user) {
    redirect('/login')
  }
  
  // Check if user has superadmin role
  if (!profile || profile.role !== 'superadmin') {
    redirect('/manage')
  }
  
  return (
    <AuthProvider>
      <div className="h-screen bg-black text-white flex">
        <Sidebar user={user} userProfile={profile} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
