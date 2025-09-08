'use client'

import { availableIcons, getIconCategories } from '@/lib/icons'
import DynamicIcon from '@/components/ui/DynamicIcon'
import { useState, useMemo } from 'react'

export default function TestIconsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutte')
  const categories = ['Tutte', ...getIconCategories()]
  
  const filteredIcons = useMemo(() => {
    let icons = [...availableIcons]
    
    // Filtra per categoria
    if (selectedCategory !== 'Tutte') {
      icons = icons.filter(icon => icon.category === selectedCategory)
    }
    
    // Filtra per ricerca
    if (search) {
      icons = icons.filter(icon => 
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.label.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return icons
  }, [search, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Test Icone Lucide React ({availableIcons.length} totali)
        </h1>
        
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Cerca icone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9AA]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#00D9AA]"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <p className="text-gray-400 mb-6">
          Risultati: {filteredIcons.length}
        </p>

        {/* Grid delle icone */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {filteredIcons.map((icon) => (
            <div 
              key={icon.name}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-[#00D9AA]/30 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <DynamicIcon 
                  iconName={icon.name} 
                  size={24} 
                  className="text-[#00D9AA]" 
                />
                <span className="text-xs text-gray-300 text-center break-all">
                  {icon.name}
                </span>
                <span className="text-xs text-gray-500 text-center">
                  {icon.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Esempi di nomi corretti per il tuo database */}
        <div className="mt-16 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Nomi corretti per il tuo database:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-[#00D9AA] font-medium mb-2">Email & Communication:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>Mail, Send, Inbox, MessageSquare</li>
                <li>AtSign, Archive, PenTool</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00D9AA] font-medium mb-2">Charts & Analytics:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>BarChart3, LineChart, PieChart</li>
                <li>TrendingUp, Activity, Target</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00D9AA] font-medium mb-2">AI & Automation:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>Bot, Zap, Workflow</li>
                <li>Repeat, Play, Pause</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#00D9AA] font-medium mb-2">Calendar & Time:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>Calendar, Clock, Timer</li>
                <li>AlarmClock (non CalendarDays!)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
