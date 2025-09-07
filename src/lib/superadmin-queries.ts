import { createSupabaseServerClientReadOnly, supabaseAdmin } from './supabase-server'
import { Json } from '@/types/database.types'

export interface SuperAdminMetrics {
  users: {
    activeUsers: number
    invitedNotActive: number
  }
  functions: {
    total: number
    generallyAvailable: number
    generallyVisible: number
    activeInstances: number
    pendingRequests: number
  }
  system: {
    totalActivations: number
    totalExceptions: number
    uniqueUsersWithFunctions: number
  }
}

export interface UserTableData {
  id: string
  email: string
  registrationDate: string
  status: 'active' | 'inactive'
  activeFunctions: number
  role: string
  emailConfirmed: boolean
}

export interface FunctionTableData {
  id: string
  name: string | null
  slug: string | null
  created_at: string
  updated_at: string | null
  generally_available: boolean | null
  generally_visible: boolean | null
  lucide_react_icon: string | null
  body: Json | null
  activeInstances: number
  pendingRequests: number
  uniqueUsers: number
  exceptionsCount: number
}

export interface FunctionExceptionUser {
  user_id: string | null
  email: string
  available: boolean | null
  visible: boolean | null
  created_at: string
  edited_at: string | null
}

export interface RequestTableData {
  id: number
  user_id: string | null
  user_email: string
  lfunction_id: string | null
  function_name: string | null
  done: boolean | null
  created_at: string
}

export async function getSuperAdminMetrics(): Promise<SuperAdminMetrics> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    // Query parallele per performance
    const [
      usersResult,
      functionsResult,
      activeFunctionsResult,
      pendingRequestsResult,
      exceptionsResult
    ] = await Promise.all([
      // Conteggio utenti totali (dalla tabella auth.users) usando service role
      supabaseAdmin.auth.admin.listUsers(),
      
      // Funzioni totali
      supabase.from('larin_functions').select('id, generally_available, generally_visible', { count: 'exact' }),
      
      // Istanze attive di funzioni
      supabase.from('link_specific_lfunction_user').select('id', { count: 'exact', head: true }),
      
      // Richieste pendenti
      supabase.from('lfunction_request').select('id', { count: 'exact', head: true }).eq('done', false),
      
      // Eccezioni totali
      supabase.from('link_general_lfunction_user_exception').select('id', { count: 'exact', head: true })
    ])

    // Calcola utenti attivi (email confermata) e non attivi
    const allUsers = usersResult.data?.users || []
    const activeUsers = allUsers.filter(user => user.email_confirmed_at !== null).length
    const invitedNotActive = allUsers.filter(user => user.email_confirmed_at === null).length

    // Utenti unici con funzioni attive
    const uniqueUsersQuery = await supabase
      .from('link_specific_lfunction_user')
      .select('user_id')
    
    const uniqueUsers = new Set(uniqueUsersQuery.data?.map(item => item.user_id).filter(Boolean)).size

    // Processa i risultati delle funzioni
    const functions = functionsResult.data || []
    const generallyAvailable = functions.filter(f => f.generally_available).length
    const generallyVisible = functions.filter(f => f.generally_visible).length

    return {
      users: {
        activeUsers,
        invitedNotActive
      },
      functions: {
        total: functionsResult.count || 0,
        generallyAvailable,
        generallyVisible,
        activeInstances: activeFunctionsResult.count || 0,
        pendingRequests: pendingRequestsResult.count || 0
      },
      system: {
        totalActivations: activeFunctionsResult.count || 0,
        totalExceptions: exceptionsResult.count || 0,
        uniqueUsersWithFunctions: uniqueUsers
      }
    }
  } catch (error) {
    console.error('Error fetching superadmin metrics:', error)
    // Return default values in case of error
    return {
      users: {
        activeUsers: 0,
        invitedNotActive: 0
      },
      functions: {
        total: 0,
        generallyAvailable: 0,
        generallyVisible: 0,
        activeInstances: 0,
        pendingRequests: 0
      },
      system: {
        totalActivations: 0,
        totalExceptions: 0,
        uniqueUsersWithFunctions: 0
      }
    }
  }
}

export async function getAllUsers() {
  // const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    // Get users from auth using service role
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    
    if (!authUsers?.users) return []

    // Get user profiles and accounts
    const userIds = authUsers.users.map(u => u.id)
    
    const [profilesResult, accountsResult] = await Promise.all([
      supabaseAdmin.from('user_profile').select('*').in('user_id', userIds),
      supabaseAdmin.from('user_accounts').select('*').in('user_id', userIds)
    ])

    // Combine data
    return authUsers.users.map(user => ({
      ...user,
      profile: profilesResult.data?.find(p => p.user_id === user.id) || null,
      account: accountsResult.data?.find(a => a.user_id === user.id) || null
    }))
  } catch (error) {
    console.error('Error fetching all users:', error)
    return []
  }
}

export async function getAllFunctionsAdmin() {
  const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    const { data, error } = await supabase
      .from('larin_functions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching functions:', error)
    return []
  }
}

export async function getUsersTableData(page: number = 1, pageSize: number = 50): Promise<{ users: UserTableData[], totalCount: number }> {
  try {
    // Get all users from auth using service role
    console.log('🔍 Fetching users from auth.users...')
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    console.log('📊 Auth users result:', {
      users: authUsers?.users?.length || 0,
      error: authError?.message || null
    })
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return { users: [], totalCount: 0 }
    }
    
    if (!authUsers?.users) {
      console.log('⚠️ No users found in auth.users')
      return { users: [], totalCount: 0 }
    }

    const allUsers = authUsers.users
    const totalCount = allUsers.length
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = allUsers.slice(startIndex, endIndex)
    
    const userIds = paginatedUsers.map(u => u.id)
    
    // Get user profiles and active functions count in parallel using service role
    const [profilesResult, activeFunctionsResult] = await Promise.all([
      supabaseAdmin.from('user_profile').select('*').in('user_id', userIds),
      supabaseAdmin
        .from('link_specific_lfunction_user')
        .select('user_id')
        .in('user_id', userIds)
    ])

    // Create a map of active functions count per user
    const activeFunctionsMap = new Map<string, number>()
    activeFunctionsResult.data?.forEach(item => {
      if (item.user_id) {
        activeFunctionsMap.set(item.user_id, (activeFunctionsMap.get(item.user_id) || 0) + 1)
      }
    })

    // Create a map of profiles
    const profilesMap = new Map(
      profilesResult.data?.map(profile => [profile.user_id, profile]) || []
    )

    // Transform data for table
    const users: UserTableData[] = paginatedUsers.map(user => {
      const profile = profilesMap.get(user.id)
      
      return {
        id: user.id,
        email: user.email || '',
        registrationDate: user.created_at,
        status: user.email_confirmed_at ? 'active' : 'inactive',
        activeFunctions: activeFunctionsMap.get(user.id) || 0,
        role: profile?.role || 'std user',
        emailConfirmed: !!user.email_confirmed_at
      }
    })

    return { users, totalCount }
  } catch (error) {
    console.error('Error fetching users table data:', error)
    return { users: [], totalCount: 0 }
  }
}

export async function getFunctionsTableData(page: number = 1, pageSize: number = 50): Promise<{ functions: FunctionTableData[], totalCount: number }> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    console.log('🔍 Fetching functions data...')
    
    // First, get total count
    const { count: totalCount } = await supabase
      .from('larin_functions')
      .select('*', { count: 'exact', head: true })
    
    // Get paginated functions
    const { data: functions, error: functionsError } = await supabase
      .from('larin_functions')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
    
    if (functionsError) {
      console.error('❌ Functions error:', functionsError)
      return { functions: [], totalCount: 0 }
    }
    
    if (!functions) {
      console.log('⚠️ No functions found')
      return { functions: [], totalCount: 0 }
    }
    
    const functionIds = functions.map(f => f.id)
    
    // Get additional data for each function in parallel
    const [activeInstancesResult, pendingRequestsResult, exceptionsResult] = await Promise.all([
      // Active instances per function
      supabase
        .from('link_specific_lfunction_user')
        .select('lfunction_id')
        .in('lfunction_id', functionIds),
      
      // Pending requests per function
      supabase
        .from('lfunction_request')
        .select('lfunction_id')
        .in('lfunction_id', functionIds)
        .eq('done', false),
      
      // Exceptions per function
      supabase
        .from('link_general_lfunction_user_exception')
        .select('lfunction_id')
        .in('lfunction_id', functionIds)
    ])
    
    // Create maps for counts
    const activeInstancesMap = new Map<string, number>()
    activeInstancesResult.data?.forEach(item => {
      if (item.lfunction_id) {
        activeInstancesMap.set(item.lfunction_id, (activeInstancesMap.get(item.lfunction_id) || 0) + 1)
      }
    })
    
    const pendingRequestsMap = new Map<string, number>()
    pendingRequestsResult.data?.forEach(item => {
      if (item.lfunction_id) {
        pendingRequestsMap.set(item.lfunction_id, (pendingRequestsMap.get(item.lfunction_id) || 0) + 1)
      }
    })
    
    const exceptionsMap = new Map<string, number>()
    exceptionsResult.data?.forEach(item => {
      if (item.lfunction_id) {
        exceptionsMap.set(item.lfunction_id, (exceptionsMap.get(item.lfunction_id) || 0) + 1)
      }
    })
    
    // Get unique users per function
    const uniqueUsersMap = new Map<string, number>()
    for (const functionId of functionIds) {
      const { data: users } = await supabase
        .from('link_specific_lfunction_user')
        .select('user_id')
        .eq('lfunction_id', functionId)
      
      const uniqueUsers = new Set(users?.map(u => u.user_id).filter(Boolean)).size
      uniqueUsersMap.set(functionId, uniqueUsers)
    }
    
    // Transform data for table
    const functionsData: FunctionTableData[] = functions.map(func => ({
      id: func.id,
      name: func.name,
      slug: func.slug,
      created_at: func.created_at,
      updated_at: func.updated_at,
      generally_available: func.generally_available,
      generally_visible: func.generally_visible,
      lucide_react_icon: func.lucide_react_icon,
      body: func.body,
      activeInstances: activeInstancesMap.get(func.id) || 0,
      pendingRequests: pendingRequestsMap.get(func.id) || 0,
      uniqueUsers: uniqueUsersMap.get(func.id) || 0,
      exceptionsCount: exceptionsMap.get(func.id) || 0
    }))
    
    console.log('✅ Functions data processed:', {
      totalCount: totalCount || 0,
      functionsInPage: functionsData.length
    })
    
    return { functions: functionsData, totalCount: totalCount || 0 }
  } catch (error) {
    console.error('Error fetching functions table data:', error)
    return { functions: [], totalCount: 0 }
  }
}

export async function getFunctionExceptionUsers(functionId: string): Promise<FunctionExceptionUser[]> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    // Get exceptions for this function with user emails
    const { data: exceptions, error } = await supabase
      .from('link_general_lfunction_user_exception')
      .select(`
        user_id,
        available,
        visible,
        created_at,
        edited_at
      `)
      .eq('lfunction_id', functionId)
    
    if (error) throw error
    
    if (!exceptions || exceptions.length === 0) {
      return []
    }
    
    // Get user emails from auth.users using service role
    const userIds = exceptions.map(e => e.user_id).filter(Boolean) as string[]
    
    if (userIds.length === 0) {
      return []
    }
    
    // Get users from auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const users = authUsers?.users || []
    
    // Create a map of user emails
    const userEmailMap = new Map<string, string>()
    users.forEach(user => {
      if (user.id && user.email) {
        userEmailMap.set(user.id, user.email)
      }
    })
    
    // Combine exception data with user emails
    const exceptionUsers: FunctionExceptionUser[] = exceptions.map(exception => ({
      user_id: exception.user_id,
      email: exception.user_id ? userEmailMap.get(exception.user_id) || 'Email non trovata' : 'User ID mancante',
      available: exception.available,
      visible: exception.visible,
      created_at: exception.created_at,
      edited_at: exception.edited_at
    }))
    
    return exceptionUsers
  } catch (error) {
    console.error('Error fetching function exception users:', error)
    return []
  }
}

export async function getRequestsTableData(page: number = 1, pageSize: number = 50, doneFilter?: boolean): Promise<{ requests: RequestTableData[], totalCount: number }> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    console.log('🔍 Fetching requests data...', { page, pageSize, doneFilter })
    
    // Build query with optional filter
    let query = supabase
      .from('lfunction_request')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Apply done filter if provided
    if (doneFilter !== undefined) {
      query = query.eq('done', doneFilter)
    }
    
    // Get total count first
    const { count: totalCount } = await query
    
    // Get paginated requests
    const { data: requests, error: requestsError } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
    
    if (requestsError) {
      console.error('❌ Requests error:', requestsError)
      return { requests: [], totalCount: 0 }
    }
    
    if (!requests) {
      console.log('⚠️ No requests found')
      return { requests: [], totalCount: 0 }
    }
    
    // Get user emails and function names
    const userIds = requests.map(r => r.user_id).filter(Boolean) as string[]
    const functionIds = requests.map(r => r.lfunction_id).filter(Boolean) as string[]
    
    // Get users from auth and functions data in parallel
    const [authUsersResult, functionsResult] = await Promise.all([
      userIds.length > 0 ? supabaseAdmin.auth.admin.listUsers() : Promise.resolve({ data: { users: [] } }),
      functionIds.length > 0 ? supabase.from('larin_functions').select('id, name').in('id', functionIds) : Promise.resolve({ data: [] })
    ])
    
    // Create maps
    const userEmailMap = new Map<string, string>()
    authUsersResult.data?.users?.forEach(user => {
      if (user.id && user.email) {
        userEmailMap.set(user.id, user.email)
      }
    })
    
    const functionNameMap = new Map<string, string>()
    functionsResult.data?.forEach(func => {
      if (func.id && func.name) {
        functionNameMap.set(func.id, func.name)
      }
    })
    
    // Transform data for table
    const requestsData: RequestTableData[] = requests.map(request => ({
      id: request.id,
      user_id: request.user_id,
      user_email: request.user_id ? userEmailMap.get(request.user_id) || 'Email non trovata' : 'User ID mancante',
      lfunction_id: request.lfunction_id,
      function_name: request.lfunction_id ? functionNameMap.get(request.lfunction_id) || 'Funzione non trovata' : 'Function ID mancante',
      done: request.done,
      created_at: request.created_at
    }))
    
    console.log('✅ Requests data processed:', {
      totalCount: totalCount || 0,
      requestsInPage: requestsData.length
    })
    
    return { requests: requestsData, totalCount: totalCount || 0 }
  } catch (error) {
    console.error('Error fetching requests table data:', error)
    return { requests: [], totalCount: 0 }
  }
}

export async function updateRequestStatus(requestId: number, done: boolean): Promise<boolean> {
  //const supabase = await createSupabaseServerClientReadOnly()
  
  try {
    const { error } = await supabaseAdmin
      .from('lfunction_request')
      .update({ done })
      .eq('id', requestId)
    
    if (error) {
      console.error('❌ Error updating request status:', error)
      return false
    }
    
    console.log('✅ Request status updated:', { requestId, done })
    return true
  } catch (error) {
    console.error('Error updating request status:', error)
    return false
  }
}
