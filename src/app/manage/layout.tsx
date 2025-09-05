import Sidebar from '@/components/ui/Sidebar'
import { requireAuth } from '@/lib/auth-server'
import { AuthProvider } from '@/contexts/AuthContext'

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  
  return (
    <AuthProvider>
      <div className="h-screen bg-black text-white flex">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}