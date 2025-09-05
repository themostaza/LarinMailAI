'use client'

import React from 'react'
import { getIcon } from '@/lib/icons'
import { LucideProps } from 'lucide-react'

interface DynamicIconProps extends Omit<LucideProps, 'children'> {
  /** Nome dell'icona come salvato nel database */
  iconName: string
  /** Dimensione dell'icona (default: 24) */
  size?: number
  /** Classe CSS aggiuntiva */
  className?: string
  /** Colore dell'icona */
  color?: string
}

/**
 * Componente per renderizzare dinamicamente un'icona Lucide React
 * basata sul nome salvato nel database
 */
export default function DynamicIcon({ 
  iconName, 
  size = 24, 
  className = '', 
  color,
  ...props 
}: DynamicIconProps) {
  // Ottieni il componente icona dal registro
  const IconComponent = getIcon(iconName)
  
  return (
    <IconComponent 
      size={size}
      className={className}
      color={color}
      {...props}
    />
  )
}

/**
 * Componente wrapper per icone con stili predefiniti per l'app
 */
interface AppIconProps extends DynamicIconProps {
  /** Variante di stile */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  /** Dimensione predefinita */
  preset?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AppIcon({ 
  iconName, 
  variant = 'default',
  preset = 'md',
  className = '',
  ...props 
}: AppIconProps) {
  // Mappa delle dimensioni
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  }
  
  // Mappa dei colori per le varianti
  const variantClasses = {
    default: 'text-gray-400',
    primary: 'text-[#00D9AA]',
    secondary: 'text-gray-300',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  }
  
  const size = props.size || sizeMap[preset]
  const variantClass = variantClasses[variant]
  const combinedClassName = `${variantClass} ${className}`.trim()
  
  return (
    <DynamicIcon
      iconName={iconName}
      size={size}
      className={combinedClassName}
      {...props}
    />
  )
}

/**
 * Componente per icone con background e bordo (come nel design attuale)
 */
interface IconWithBackgroundProps extends DynamicIconProps {
  /** Dimensione del container */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl'
  /** Variante di colore */
  variant?: 'default' | 'primary' | 'active'
}

export function IconWithBackground({ 
  iconName,
  containerSize = 'md',
  variant = 'default',
  className = '',
  ...props
}: IconWithBackgroundProps) {
  // Mappa delle dimensioni del container
  const containerSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  // Mappa delle dimensioni delle icone
  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  }
  
  // Stili per le varianti
  const variantStyles = {
    default: {
      container: 'bg-gray-800/50 border border-gray-700',
      icon: 'text-gray-400'
    },
    primary: {
      container: 'bg-[#00D9AA]/20 border border-[#00D9AA]/30',
      icon: 'text-[#00D9AA]'
    },
    active: {
      container: 'bg-[#00D9AA] border border-[#00D9AA]',
      icon: 'text-black'
    }
  }
  
  const containerClass = containerSizeMap[containerSize]
  const iconSize = props.size || iconSizeMap[containerSize]
  const styles = variantStyles[variant]
  
  return (
    <div className={`${containerClass} ${styles.container} rounded-lg flex items-center justify-center ${className}`}>
      <DynamicIcon
        iconName={iconName}
        size={iconSize}
        className={styles.icon}
        {...props}
      />
    </div>
  )
}
