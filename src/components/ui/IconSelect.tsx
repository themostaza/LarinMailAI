'use client'

import { useState } from 'react'
import { availableIcons, getIconCategories } from '@/lib/icons'
import DynamicIcon from './DynamicIcon'
import { ChevronDown } from 'lucide-react'

interface IconSelectProps {
  value?: string
  onChange: (iconName: string) => void
  placeholder?: string
  className?: string
}

export default function IconSelect({ 
  value, 
  onChange, 
  placeholder = "Seleziona un'icona",
  className = '' 
}: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutte')
  
  const categories = ['Tutte', ...getIconCategories()]
  
  // Filtra le icone
  const filteredIcons = availableIcons.filter(icon => {
    const matchesCategory = selectedCategory === 'Tutte' || icon.category === selectedCategory
    const matchesSearch = !search || 
      icon.name.toLowerCase().includes(search.toLowerCase()) ||
      icon.label.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const selectedIcon = availableIcons.find(icon => icon.name === value)
  
  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setIsOpen(false)
    setSearch('')
  }
  
  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 focus:outline-none focus:border-[#00D9AA] transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedIcon ? (
            <>
              <DynamicIcon iconName={selectedIcon.name} size={20} className="text-[#00D9AA]" />
              <span className="text-white">{selectedIcon.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[9999] mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-hidden">
          {/* Search and Category Filter */}
          <div className="p-4 border-b border-gray-700">
            <input
              type="text"
              placeholder="Cerca icone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#00D9AA] mb-3"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#00D9AA]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Icons Grid */}
          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2 p-4">
              {filteredIcons.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => handleSelect(icon.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    value === icon.name ? 'bg-gray-700 border border-[#00D9AA]' : 'border border-transparent'
                  }`}
                  title={icon.label}
                >
                  <DynamicIcon 
                    iconName={icon.name} 
                    size={20} 
                    className={value === icon.name ? 'text-[#00D9AA]' : 'text-gray-400'} 
                  />
                  <span className="text-xs text-gray-300 text-center truncate w-full">
                    {icon.label}
                  </span>
                </button>
              ))}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                Nessuna icona trovata
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
