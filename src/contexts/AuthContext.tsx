'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { getCurrentUser, signInAction, signOutAction } from '@/app/auth-actions'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const result = await getCurrentUser()
      if (result.success) {
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Errore nel recuperare l\'utente:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInAction(email, password)
      if (result.success) {
        setUser(result.user || null)
        return { error: null }
      } else {
        return { error: result.error }
      }
    } catch {
      return { error: 'Errore durante il login' }
    }
  }

  const signOut = async () => {
    try {
      await signOutAction()
      setUser(null)
    } catch (error) {
      console.error('Errore durante il logout:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}