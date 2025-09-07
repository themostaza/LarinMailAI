import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { getFunctionsTableData } from '@/lib/superadmin-queries'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and superadmin role
    const { user, profile } = await getUserWithProfile()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    
    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
    }
    
    // Fetch functions data
    const result = await getFunctionsTableData(page, pageSize)
    
    return NextResponse.json({
      functions: result.functions,
      totalCount: result.totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(result.totalCount / pageSize)
    })
  } catch (error) {
    console.error('Error fetching functions table:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
