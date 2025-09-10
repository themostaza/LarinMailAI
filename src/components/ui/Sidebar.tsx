'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Zap,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/manage/actions'
import type { SidebarItem } from '@/types'

interface SidebarProps {
  className?: string
  user?: { email?: string } | null
  userProfile?: { role?: string | null } | null
}

const sidebarItems: SidebarItem[] = []

const bottomItems: SidebarItem[] = [
  {
    id: 'profile',
    label: 'Profilo',
    href: '/manage/profile',
    icon: User
  }
]

export default function Sidebar({ className = '', userProfile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const SidebarLink = ({ item }: { item: SidebarItem }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <motion.div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#00D9AA] text-black font-medium'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon size={20} className="flex-shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {item.badge && item.badge > 0 && !isCollapsed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-[#00D9AA] text-black text-xs px-2 py-1 rounded-full font-medium"
          >
            {item.badge}
          </motion.span>
        )}
      </motion.div>
    )

    return (
      <Link href={item.href}>
        {content}
      </Link>
    )
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`bg-gray-900 border-r border-gray-800 flex flex-col h-screen ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <h2 className="text-xl font-bold">
                Larin<span className="text-[#00D9AA]">AI</span>
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        {/* CTA Funzionalità */}
        <Link href="/manage">
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#00D9AA]/10 border border-[#00D9AA]/20 text-[#00D9AA] hover:bg-[#00D9AA]/20 transition-all duration-200 mb-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate font-medium"
                >
                  Funzionalità
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* SuperAdmin Link - Only show for superadmin users */}
        {userProfile?.role === 'superadmin' && (
          <Link href="/superadmin">
            <motion.div
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-200 mb-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate font-medium"
                  >
                    SuperAdmin
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        )}

        {/* Profile with Logout */}
        <div className="flex items-center gap-1">
          <Link href="/manage/profile" className="flex-1">
            <motion.div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                pathname === '/manage/profile'
                  ? 'bg-[#00D9AA] text-black font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    Profilo
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
          
          {/* Logout Icon - Only show when expanded */}
          {!isCollapsed && (
            <form action={logoutAction}>
              <motion.button
                type="submit"
                className="p-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Logout"
              >
                <LogOut size={16} className="flex-shrink-0" />
              </motion.button>
            </form>
          )}
        </div>

      </div>
    </motion.aside>
  )
}