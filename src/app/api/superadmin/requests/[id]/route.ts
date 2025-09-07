import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { updateRequestStatus } from '@/lib/superadmin-queries'

export async function PATCH(
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
    
    const { id } = await params
    const requestId = parseInt(id)
    
    if (!requestId || isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 })
    }
    
    // Parse request body
    const body = await request.json()
    const { done } = body
    
    if (typeof done !== 'boolean') {
      return NextResponse.json({ error: 'Invalid done status' }, { status: 400 })
    }
    
    // Update request status
    const success = await updateRequestStatus(requestId, done)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      requestId,
      done
    })
  } catch (error) {
    console.error('Error updating request status:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
