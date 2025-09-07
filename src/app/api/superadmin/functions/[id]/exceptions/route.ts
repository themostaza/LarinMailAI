import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { getFunctionExceptionUsers } from '@/lib/superadmin-queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and superadmin role
    const { user, profile } = await getUserWithProfile()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    const { id: functionId } = await params
    
    if (!functionId) {
      return NextResponse.json({ error: 'Function ID is required' }, { status: 400 })
    }
    
    // Fetch exception users for this function
    const exceptionUsers = await getFunctionExceptionUsers(functionId)
    
    return NextResponse.json({
      functionId,
      exceptionUsers,
      count: exceptionUsers.length
    })
  } catch (error) {
    console.error('Error fetching function exceptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
