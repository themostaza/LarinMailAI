import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { getRequestsTableData } from '@/lib/superadmin-queries'

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
    
    // Get pagination and filter parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const doneParam = searchParams.get('done')
    
    // Parse done filter
    let doneFilter: boolean | undefined = undefined
    if (doneParam === 'true') doneFilter = true
    else if (doneParam === 'false') doneFilter = false
    
    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
    }
    
    // Fetch requests data
    const result = await getRequestsTableData(page, pageSize, doneFilter)
    
    return NextResponse.json({
      requests: result.requests,
      totalCount: result.totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(result.totalCount / pageSize),
      filter: doneFilter
    })
  } catch (error) {
    console.error('Error fetching requests table:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
