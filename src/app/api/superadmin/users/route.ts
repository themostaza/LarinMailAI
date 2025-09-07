import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { getUsersTableData } from '@/lib/superadmin-queries'

export async function GET(request: NextRequest) {
  try {
    // Check authentication only
    const { user } = await getUserWithProfile()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    
    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
    }
    
    // Fetch users data
    const result = await getUsersTableData(page, pageSize)
    
    return NextResponse.json({
      users: result.users,
      totalCount: result.totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(result.totalCount / pageSize)
    })
  } catch (error) {
    console.error('Error fetching users table:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
