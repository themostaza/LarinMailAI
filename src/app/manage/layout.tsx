import Sidebar from '@/components/ui/Sidebar'

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}