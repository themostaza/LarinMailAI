'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import IconSelect from '@/components/ui/IconSelect'
import { 
  Users,
  Shield, 
  Activity,
  Zap,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  User as UserIcon,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { SuperAdminMetrics, UserTableData, FunctionTableData, FunctionExceptionUser, RequestTableData } from '@/lib/superadmin-queries'

interface SuperAdminDashboardProps {
  user: User
  profile: { role?: string | null } | null
}

interface TabConfig {
  id: string
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

export default function SuperAdminDashboard({}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('utenti')
  const [metrics, setMetrics] = useState<SuperAdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [usersData, setUsersData] = useState<UserTableData[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  
  // Functions state
  const [functionsData, setFunctionsData] = useState<FunctionTableData[]>([])
  const [functionsLoading, setFunctionsLoading] = useState(false)
  const [functionsCurrentPage, setFunctionsCurrentPage] = useState(1)
  const [functionsTotalPages, setFunctionsTotalPages] = useState(0)
  const [totalFunctions, setTotalFunctions] = useState(0)
  
  // Exceptions sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState<FunctionTableData | null>(null)
  const [exceptionUsers, setExceptionUsers] = useState<FunctionExceptionUser[]>([])
  const [exceptionsLoading, setExceptionsLoading] = useState(false)
  
  // Requests state
  const [requestsData, setRequestsData] = useState<RequestTableData[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestsCurrentPage, setRequestsCurrentPage] = useState(1)
  const [requestsTotalPages, setRequestsTotalPages] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [requestsFilter, setRequestsFilter] = useState<boolean | undefined>(undefined)
  
  // Invite user modal state
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedPassword, setSelectedPassword] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  
  // Function dialog state
  const [showFunctionDialog, setShowFunctionDialog] = useState(false)
  const [editingFunction, setEditingFunction] = useState<FunctionTableData | null>(null)
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingFunction, setDeletingFunction] = useState<FunctionTableData | null>(null)
  const [functionFormData, setFunctionFormData] = useState({
    name: '',
    slug: '',
    lucide_react_icon: '',
    generally_visible: true,
    generally_available: true,
    description: '',
    platforms: [] as string[],
    features: [] as string[],
    setupRequired: [] as string[]
  })
  const [originalFormData, setOriginalFormData] = useState({
    name: '',
    slug: '',
    lucide_react_icon: '',
    generally_visible: true,
    generally_available: true,
    description: '',
    platforms: [] as string[],
    features: [] as string[],
    setupRequired: [] as string[]
  })

  const tabs: TabConfig[] = [
    {
      id: 'utenti',
      title: 'Utenti',
      icon: Users,
      color: 'text-blue-400 border-blue-400'
    },
    {
      id: 'funzionalità',
      title: 'Funzionalità',
      icon: Zap,
      color: 'text-[#00D9AA] border-[#00D9AA]'
    },
    {
      id: 'richieste',
      title: 'Richieste',
      icon: AlertTriangle,
      color: 'text-yellow-400 border-yellow-400'
    }
  ]

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/superadmin/metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const fetchUsersData = async (page: number = 1) => {
    setUsersLoading(true)
    try {
      console.log('🔄 Fetching users data, page:', page)
      const response = await fetch(`/api/superadmin/users?page=${page}&pageSize=50`)
      
      console.log('📡 API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Users data received:', {
          totalUsers: data.totalCount,
          usersInPage: data.users?.length || 0,
          totalPages: data.totalPages
        })
        setUsersData(data.users)
        setTotalPages(data.totalPages)
        setTotalUsers(data.totalCount)
        setCurrentPage(page)
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('❌ API Error:', response.status, errorData)
      }
    } catch (error) {
      console.error('❌ Network error fetching users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchFunctionsData = async (page: number = 1) => {
    setFunctionsLoading(true)
    try {
      console.log('🔄 Fetching functions data, page:', page)
      const response = await fetch(`/api/superadmin/functions?page=${page}&pageSize=50`)
      
      console.log('📡 API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Functions data received:', {
          totalFunctions: data.totalCount,
          functionsInPage: data.functions?.length || 0,
          totalPages: data.totalPages
        })
        setFunctionsData(data.functions)
        setFunctionsTotalPages(data.totalPages)
        setTotalFunctions(data.totalCount)
        setFunctionsCurrentPage(page)
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('❌ API Error:', response.status, errorData)
      }
    } catch (error) {
      console.error('❌ Network error fetching functions:', error)
    } finally {
      setFunctionsLoading(false)
    }
  }

  const fetchExceptionUsers = async (functionData: FunctionTableData) => {
    setExceptionsLoading(true)
    try {
      const response = await fetch(`/api/superadmin/functions/${functionData.id}/exceptions`)
      
      if (response.ok) {
        const data = await response.json()
        setExceptionUsers(data.exceptionUsers || [])
        setSelectedFunction(functionData)
        setSidebarOpen(true)
      } else {
        console.error('❌ Error fetching exceptions:', response.status)
      }
    } catch (error) {
      console.error('❌ Network error fetching exceptions:', error)
    } finally {
      setExceptionsLoading(false)
    }
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedFunction(null)
    setExceptionUsers([])
  }

  const fetchRequestsData = async (page: number = 1, filter?: boolean) => {
    setRequestsLoading(true)
    try {
      console.log('🔄 Fetching requests data, page:', page, 'filter:', filter)
      let url = `/api/superadmin/requests?page=${page}&pageSize=50`
      if (filter !== undefined) {
        url += `&done=${filter}`
      }
      
      const response = await fetch(url)
      
      console.log('📡 API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Requests data received:', {
          totalRequests: data.totalCount,
          requestsInPage: data.requests?.length || 0,
          totalPages: data.totalPages
        })
        setRequestsData(data.requests)
        setRequestsTotalPages(data.totalPages)
        setTotalRequests(data.totalCount)
        setRequestsCurrentPage(page)
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('❌ API Error:', response.status, errorData)
      }
    } catch (error) {
      console.error('❌ Network error fetching requests:', error)
    } finally {
      setRequestsLoading(false)
    }
  }

  const toggleRequestStatus = async (requestId: number, currentStatus: boolean | null) => {
    try {
      const newStatus = !currentStatus
      const response = await fetch(`/api/superadmin/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: newStatus }),
      })

      if (response.ok) {
        // Update only the specific request in the local state
        setRequestsData(prevData => 
          prevData.map(request => 
            request.id === requestId 
              ? { ...request, done: newStatus }
              : request
          )
        )
        
        // If we're filtering and the item no longer matches the filter, remove it from view
        if (requestsFilter !== undefined && requestsFilter !== newStatus) {
          setRequestsData(prevData => 
            prevData.filter(request => request.id !== requestId)
          )
          // Update total count
          setTotalRequests(prev => prev - 1)
        }
      } else {
        console.error('❌ Error updating request status:', response.status)
      }
    } catch (error) {
      console.error('❌ Network error updating request status:', error)
    }
  }

  // Password suggestions - puoi personalizzare queste password
  const passwordSuggestions = [
    'LarinAI2026!',
    'Benvenuto@123',
    'Sicura2026#',
    'Welcome$456'
  ]

  // Invite user function
  const inviteUser = async () => {
    if (!inviteEmail || !selectedPassword) {
      setInviteError('Email e password sono obbligatori')
      return
    }

    setInviteLoading(true)
    setInviteError(null)

    try {
      const response = await fetch('/api/superadmin/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          password: selectedPassword
        }),
      })

      if (response.ok) {
        // Reset form and close modal
        setInviteEmail('')
        setSelectedPassword('')
        setShowInviteModal(false)
        
        // Refresh users data
        fetchUsersData(currentPage)
        
        alert('Invito inviato con successo!')
      } else {
        const errorData = await response.json().catch(() => null)
        setInviteError(errorData?.error || 'Errore durante l\'invio dell\'invito')
      }
    } catch (error) {
      console.error('❌ Network error inviting user:', error)
      setInviteError('Errore di rete durante l\'invio dell\'invito')
    } finally {
      setInviteLoading(false)
    }
  }

  const openCreateFunctionDialog = () => {
    setEditingFunction(null)
    const initialData = {
      name: '',
      slug: '',
      lucide_react_icon: '',
      generally_visible: true,
      generally_available: true,
      description: '',
      platforms: [],
      features: [],
      setupRequired: []
    }
    setFunctionFormData(initialData)
    setOriginalFormData(initialData)
    setShowFunctionDialog(true)
  }

  const openEditFunctionDialog = (func: FunctionTableData) => {
    setEditingFunction(func)
    // Parse existing body data
    const bodyData = func.body ? (typeof func.body === 'object' ? func.body : JSON.parse(func.body as string)) : {}
    const formData = {
      name: func.name || '',
      slug: func.slug || '',
      lucide_react_icon: func.lucide_react_icon || '',
      generally_visible: func.generally_visible || false,
      generally_available: func.generally_available || false,
      description: bodyData.description || '',
      platforms: bodyData.list_software || [],
      features: bodyData.included || [],
      setupRequired: bodyData.setup || []
    }
    setFunctionFormData(formData)
    setOriginalFormData(JSON.parse(JSON.stringify(formData))) // Deep copy
    setShowFunctionDialog(true)
  }

  const closeFunctionDialog = () => {
    setShowFunctionDialog(false)
    setEditingFunction(null)
  }

  const hasFormChanges = () => {
    // For new functions, check if any field has been filled
    if (!editingFunction) {
      return functionFormData.name.trim() !== '' || 
             functionFormData.slug.trim() !== '' ||
             functionFormData.lucide_react_icon.trim() !== '' ||
             functionFormData.description.trim() !== '' ||
             functionFormData.platforms.length > 0 ||
             functionFormData.features.length > 0 ||
             functionFormData.setupRequired.length > 0 ||
             functionFormData.generally_visible !== true ||
             functionFormData.generally_available !== true
    }

    // For editing, compare with original data
    return JSON.stringify(functionFormData) !== JSON.stringify(originalFormData)
  }

  const handleArrayFieldChange = (field: 'platforms' | 'features' | 'setupRequired', value: string) => {
    if (!value.trim()) return
    setFunctionFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
  }

  const removeArrayItem = (field: 'platforms' | 'features' | 'setupRequired', index: number) => {
    setFunctionFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSaveFunction = async () => {
    if (!functionFormData.name.trim() || !functionFormData.slug.trim()) {
      return
    }

    try {
      const url = editingFunction 
        ? `/api/superadmin/functions/${editingFunction.id}/update`
        : '/api/superadmin/functions/create'
      
      const method = editingFunction ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: functionFormData.name,
          slug: functionFormData.slug,
          lucide_react_icon: functionFormData.lucide_react_icon,
          generally_visible: functionFormData.generally_visible,
          generally_available: functionFormData.generally_available,
          description: functionFormData.description,
          platforms: functionFormData.platforms,
          features: functionFormData.features,
          setupRequired: functionFormData.setupRequired
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (editingFunction) {
          // Update existing function in the list
          setFunctionsData(prevData => 
            prevData.map(func => 
              func.id === editingFunction.id 
                ? { 
                    ...func, 
                    ...data.function,
                    activeInstances: func.activeInstances, // Keep existing counts
                    exceptionsCount: func.exceptionsCount,
                    pendingRequests: func.pendingRequests,
                    uniqueUsers: func.uniqueUsers
                  }
                : func
            )
          )
        } else {
          // Add new function to the list (refresh to get all data)
          fetchFunctionsData(functionsCurrentPage)
        }
        
        closeFunctionDialog()
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('❌ Error saving function:', response.status, errorData)
      }
    } catch (error) {
      console.error('❌ Network error saving function:', error)
    }
  }

  const openDeleteFunctionDialog = (func: FunctionTableData) => {
    setDeletingFunction(func)
    setShowDeleteDialog(true)
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setDeletingFunction(null)
  }

  const handleDeleteFunction = async () => {
    if (!deletingFunction) return

    try {
      const response = await fetch(`/api/superadmin/functions/${deletingFunction.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted function from the local state
        setFunctionsData(prevData => 
          prevData.filter(func => func.id !== deletingFunction.id)
        )
        
        // Update total count
        setTotalFunctions(prev => prev - 1)
        
        // If we're on a page with no functions left, go to previous page
        if (functionsData.length === 1 && functionsCurrentPage > 1) {
          fetchFunctionsData(functionsCurrentPage - 1)
        }
        
        closeDeleteDialog()
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('❌ Error deleting function:', response.status, errorData)
      }
    } catch (error) {
      console.error('❌ Network error deleting function:', error)
    }
  }

  const generateSlugFromName = () => {
    const slug = functionFormData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    
    setFunctionFormData(prev => ({ ...prev, slug }))
  }

  useEffect(() => {
    if (activeTab === 'utenti') {
      fetchUsersData(1)
    } else if (activeTab === 'funzionalità') {
      fetchFunctionsData(1)
    } else if (activeTab === 'richieste') {
      fetchRequestsData(1, requestsFilter)
    }
  }, [activeTab])

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Compact KPIs */}
      <div className="flex gap-4 w-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
        >
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-green-400" />
            <span className="text-xs text-gray-400">Utenti Attivi</span>
            <span className="text-lg font-bold">{metrics?.users.activeUsers || 0}</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
        >
          <div className="flex items-center gap-2">
            <UserX size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Invitati Non Attivi</span>
            <span className="text-lg font-bold">{metrics?.users.invitedNotActive || 0}</span>
          </div>
        </motion.div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Utenti ({totalUsers})</h3>
            <div className="flex items-center gap-4">
              {/* Invite User Button */}
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors"
              >
                <Plus size={16} />
                Invita Utente
              </button>
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchUsersData(currentPage - 1)}
                  disabled={currentPage <= 1 || usersLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-400">
                  Pagina {currentPage} di {totalPages}
                </span>
                <button
                  onClick={() => fetchUsersData(currentPage + 1)}
                  disabled={currentPage >= totalPages || usersLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {usersLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data Iscrizione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    # Funzioni Attive
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ruolo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {usersData.map((userData, index) => (
                  <motion.tr
                    key={userData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(userData.registrationDate).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {userData.status === 'active' ? 'Attivo' : 'Non Attivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-[#00D9AA]/10 text-[#00D9AA] border border-[#00D9AA]/20">
                        {userData.activeFunctions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.role === 'superadmin' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {userData.role}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )

  const renderFunctionsTab = () => (
    <div className="space-y-6">
      {/* Header with KPIs and Create Button */}
      <div className="flex items-center justify-between">
        {/* Compact KPIs */}
        <div className="flex gap-4 w-fit">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#00D9AA]" />
              <span className="text-xs text-gray-400">Funzioni Totali</span>
              <span className="text-lg font-bold">{metrics?.functions.total || 0}</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
          >
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-blue-400" />
              <span className="text-xs text-gray-400">Visibili</span>
              <span className="text-lg font-bold">{metrics?.functions.generallyVisible || 0}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
          >
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-green-400" />
              <span className="text-xs text-gray-400">Disponibili</span>
              <span className="text-lg font-bold">{metrics?.functions.generallyAvailable || 0}</span>
            </div>
          </motion.div>
        </div>

        {/* Create Function Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={openCreateFunctionDialog}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-all"
        >
          <Plus size={16} />
          Crea Funzione
        </motion.button>
      </div>

      {/* Functions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Funzionalità ({totalFunctions})</h3>
            <div className="flex items-center gap-4">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchFunctionsData(functionsCurrentPage - 1)}
                  disabled={functionsCurrentPage <= 1 || functionsLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-400">
                  Pagina {functionsCurrentPage} di {functionsTotalPages}
                </span>
                <button
                  onClick={() => fetchFunctionsData(functionsCurrentPage + 1)}
                  disabled={functionsCurrentPage >= functionsTotalPages || functionsLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {functionsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data Creazione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Istanze Attive
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Eccezioni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {functionsData.map((funcData, index) => (
                  <motion.tr
                    key={funcData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {funcData.lucide_react_icon && (
                          <div className="w-4 h-4 text-[#00D9AA]">
                            <Zap size={16} />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-300">
                          {funcData.name || 'Senza nome'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(funcData.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          funcData.generally_visible 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                          {funcData.generally_visible ? 'Visibile' : 'Nascosta'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          funcData.generally_available 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {funcData.generally_available ? 'Disponibile' : 'Non Disponibile'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-[#00D9AA]/10 text-[#00D9AA] border border-[#00D9AA]/20">
                        {funcData.activeInstances}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => fetchExceptionUsers(funcData)}
                        disabled={exceptionsLoading}
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full transition-all ${
                          funcData.exceptionsCount > 0
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 cursor-pointer'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 cursor-default'
                        }`}
                      >
                        {funcData.exceptionsCount}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openEditFunctionDialog(funcData)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all h-8"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteFunctionDialog(funcData)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all h-8"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )

  const renderRequestsTab = () => (
    <div className="space-y-6">
      {/* Compact KPIs */}
      <div className="flex gap-4 w-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Richieste Totali</span>
            <span className="text-lg font-bold">{totalRequests}</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-3 w-fit"
        >
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-400" />
            <span className="text-xs text-gray-400">Pendenti</span>
            <span className="text-lg font-bold">{metrics?.functions.pendingRequests || 0}</span>
          </div>
        </motion.div>
      </div>

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Richieste ({totalRequests})</h3>
            <div className="flex items-center gap-4">
              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRequestsFilter(undefined)
                    fetchRequestsData(1, undefined)
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    requestsFilter === undefined
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Tutte
                </button>
                <button
                  onClick={() => {
                    setRequestsFilter(false)
                    fetchRequestsData(1, false)
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    requestsFilter === false
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Pendenti
                </button>
                <button
                  onClick={() => {
                    setRequestsFilter(true)
                    fetchRequestsData(1, true)
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    requestsFilter === true
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Completate
                </button>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchRequestsData(requestsCurrentPage - 1, requestsFilter)}
                  disabled={requestsCurrentPage <= 1 || requestsLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-400">
                  Pagina {requestsCurrentPage} di {requestsTotalPages}
                </span>
                <button
                  onClick={() => fetchRequestsData(requestsCurrentPage + 1, requestsFilter)}
                  disabled={requestsCurrentPage >= requestsTotalPages || requestsLoading}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {requestsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Utente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Funzione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data Richiesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {requestsData.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {request.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {request.function_name || 'Funzione non trovata'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(request.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        request.done 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {request.done ? 'Completata' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRequestStatus(request.id, request.done)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                          request.done
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                        }`}
                      >
                        {request.done ? 'Riapri' : 'Completa'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9AA]"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'utenti':
        return renderUsersTab()
      case 'funzionalità':
        return renderFunctionsTab()
      case 'richieste':
        return renderRequestsTab()
      default:
        return renderUsersTab()
    }
  }

  const renderExceptionsSidebar = () => (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-fit min-w-[500px] bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Eccezioni Utenti</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedFunction?.name || 'Funzione senza nome'}
                </p>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {exceptionsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D9AA]"></div>
              </div>
            ) : exceptionUsers.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <UserIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nessuna eccezione trovata per questa funzione</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exceptionUsers.map((exceptionUser, index) => (
                  <motion.div
                    key={`${exceptionUser.user_id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-center gap-4 text-sm w-fit">
                      {/* Icon */}
                      <div className="w-8 h-8 bg-[#00D9AA]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon size={14} className="text-[#00D9AA]" />
                      </div>
                      
                      {/* Email */}
                      <div className="w-fit">
                        <p className="text-sm font-medium text-white whitespace-nowrap">
                          {exceptionUser.email}
                        </p>
                      </div>
                      
                      {/* Available Status */}
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full w-fit ${
                        exceptionUser.available 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {exceptionUser.available ? 'Disponibile' : 'Non Disponibile'}
                      </span>
                      
                      {/* Visible Status */}
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full w-fit ${
                        exceptionUser.visible 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {exceptionUser.visible ? 'Visibile' : 'Nascosta'}
                      </span>
                      
                      {/* Creation Date */}
                      <span className="text-sm text-gray-400 w-fit whitespace-nowrap">
                        {new Date(exceptionUser.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800">
            <div className="text-sm text-gray-400 text-center">
              {exceptionUsers.length} {exceptionUsers.length === 1 ? 'eccezione' : 'eccezioni'} trovate
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Shield size={32} className="text-red-400" />
            <div>
              <h1 className="text-3xl font-bold">SuperAdmin Dashboard</h1>
              <p className="text-gray-400">Pannello di controllo amministrativo</p>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${tab.color} bg-current/10`
                    : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.title}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Function Dialog */}
      {showFunctionDialog && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeFunctionDialog}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[95vh] min-w-[70vw] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00D9AA]/20 border border-[#00D9AA]/30 rounded-full flex items-center justify-center">
                  {editingFunction ? <Edit size={20} className="text-[#00D9AA]" /> : <Plus size={20} className="text-[#00D9AA]" />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingFunction ? 'Modifica Funzionalità' : 'Crea Nuova Funzionalità'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {editingFunction ? 'Modifica i parametri della funzionalità' : 'Configura una nuova funzionalità per il sistema'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeFunctionDialog}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Funzione *
                  </label>
                  <input
                    type="text"
                    value={functionFormData.name}
                    onChange={(e) => setFunctionFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                    placeholder="Nome della funzionalità"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={functionFormData.slug}
                      onChange={(e) => setFunctionFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent"
                      placeholder="slug-funzione"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSlugFromName}
                      disabled={!functionFormData.name.trim()}
                      className="px-3 py-2 bg-[#00D9AA]/20 text-[#00D9AA] rounded-lg hover:bg-[#00D9AA]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Genera slug dal nome"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icona Lucide
                  </label>
                  <IconSelect
                    value={functionFormData.lucide_react_icon}
                    onChange={(iconName) => setFunctionFormData(prev => ({ ...prev, lucide_react_icon: iconName }))}
                    placeholder="Seleziona un'icona per la funzione"
                  />
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={functionFormData.generally_visible}
                      onChange={(e) => setFunctionFormData(prev => ({ ...prev, generally_visible: e.target.checked }))}
                      className="rounded border-gray-600 text-[#00D9AA] focus:ring-[#00D9AA] focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">Visibile</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={functionFormData.generally_available}
                      onChange={(e) => setFunctionFormData(prev => ({ ...prev, generally_available: e.target.checked }))}
                      className="rounded border-gray-600 text-[#00D9AA] focus:ring-[#00D9AA] focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">Disponibile</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrizione
                </label>
                <textarea
                  value={functionFormData.description}
                  onChange={(e) => setFunctionFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent h-24 resize-none"
                  placeholder="Descrizione dettagliata della funzionalità..."
                />
              </div>

              {/* Array Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Piattaforme/Software
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Aggiungi piattaforma"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayFieldChange('platforms', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleArrayFieldChange('platforms', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-[#00D9AA]/20 text-[#00D9AA] rounded-lg hover:bg-[#00D9AA]/30 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {functionFormData.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {platform}
                          <button
                            onClick={() => removeArrayItem('platforms', index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Funzionalità Incluse
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Aggiungi funzionalità"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayFieldChange('features', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleArrayFieldChange('features', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-[#00D9AA]/20 text-[#00D9AA] rounded-lg hover:bg-[#00D9AA]/30 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {functionFormData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {feature}
                          <button
                            onClick={() => removeArrayItem('features', index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Setup Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Setup Richiesto
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Aggiungi requisito"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D9AA] focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayFieldChange('setupRequired', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleArrayFieldChange('setupRequired', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-[#00D9AA]/20 text-[#00D9AA] rounded-lg hover:bg-[#00D9AA]/30 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {functionFormData.setupRequired.map((requirement, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {requirement}
                          <button
                            onClick={() => removeArrayItem('setupRequired', index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700 flex-shrink-0">
              <button
                onClick={closeFunctionDialog}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveFunction}
                disabled={!functionFormData.name.trim() || !functionFormData.slug.trim() || !hasFormChanges()}
                className="flex items-center gap-2 px-6 py-2 bg-[#00D9AA] text-black rounded-lg font-medium hover:bg-[#00D9AA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingFunction ? <Edit size={16} /> : <Plus size={16} />}
                {editingFunction ? 'Salva Modifiche' : 'Crea Funzione'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deletingFunction && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeDeleteDialog}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 border border-red-500/30 rounded-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-700">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Elimina Funzionalità</h2>
                <p className="text-sm text-gray-400">Questa azione non può essere annullata</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-300 mb-2">
                Sei sicuro di voler eliminare la funzionalità:
              </p>
              <p className="text-white font-semibold text-lg mb-4">
              &quot;{deletingFunction.name}&quot;
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">
                  ⚠️ Tutti i dati associati a questa funzionalità verranno eliminati permanentemente.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteFunction}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Elimina Definitivamente
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Exceptions Sidebar */}
      {renderExceptionsSidebar()}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Plus size={20} className="text-[#00D9AA]" />
                Invita Nuovo Utente
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Message */}
            {inviteError && (
              <div className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 text-sm">
                {inviteError}
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors"
                  placeholder="utente@esempio.com"
                  disabled={inviteLoading}
                />
              </div>

              {/* Password Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password Suggerite
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {passwordSuggestions.map((password, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedPassword(password)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedPassword === password
                          ? 'border-[#00D9AA] bg-[#00D9AA]/10 text-[#00D9AA]'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                      disabled={inviteLoading}
                    >
                      {password}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Password Field */}
              <div>
                <label htmlFor="customPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Oppure inserisci password personalizzata
                </label>
                <input
                  type="text"
                  id="customPassword"
                  value={selectedPassword}
                  onChange={(e) => setSelectedPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D9AA] focus:ring-1 focus:ring-[#00D9AA] transition-colors font-mono"
                  placeholder="Inserisci password personalizzata..."
                  disabled={inviteLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  La password deve contenere: 8+ caratteri, maiuscola, minuscola, numero e carattere speciale
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  disabled={inviteLoading}
                >
                  Annulla
                </button>
                <button
                  onClick={inviteUser}
                  disabled={inviteLoading || !inviteEmail || !selectedPassword}
                  className="flex-1 bg-[#00D9AA] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00D9AA]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {inviteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Invio...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Invia Invito
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
