'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft,
  ChevronRight,
  Settings,
  History,
  User,
  LogOut,
  Zap,
  FileText,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SidebarItem } from '@/types'

interface SidebarProps {
  className?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'actions',
    label: 'Actions AI',
    href: '/manage/actions',
    icon: Zap
  },
  {
    id: 'history',
    label: 'Esecuzioni',
    href: '/manage/history',
    icon: History
  },
  {
    id: 'instructions',
    label: 'Come funziona',
    href: '/instructions',
    icon: FileText,
    external: true
  }
]

const bottomItems: SidebarItem[] = [
  {
    id: 'profile',
    label: 'Profilo',
    href: '/manage/profile',
    icon: User
  },
  {
    id: 'settings',
    label: 'Impostazioni',
    href: '/manage/settings',
    icon: Settings
  },
  {
    id: 'logout',
    label: 'Logout',
    href: '/logout',
    icon: LogOut
  }
]

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const SidebarLink = ({ item }: { item: SidebarItem }) => {
    const isActive = !item.external && pathname === item.href
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
              className="truncate flex items-center gap-2"
            >
              {item.label}
              {item.external && (
                <ExternalLink size={14} className="flex-shrink-0 opacity-70" />
              )}
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

    if (item.external) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      )
    }

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
                  Mail<span className="text-[#00D9AA]">AI</span>
                </h2>
                <span className="text-xs bg-[#00D9AA] text-black px-2 py-1 rounded-full font-medium">
                  MANAGE
                </span>
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
        {bottomItems.map((item) => (
          <SidebarLink key={item.id} item={item} />
        ))}
      </div>
    </motion.aside>
  )
}