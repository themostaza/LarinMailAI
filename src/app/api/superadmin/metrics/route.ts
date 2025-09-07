import { NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { getSuperAdminMetrics } from '@/lib/superadmin-queries'

export async function GET() {
  try {
    // Check authentication and superadmin role
    const { user, profile } = await getUserWithProfile()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    // Fetch metrics
    const metrics = await getSuperAdminMetrics()
    
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching superadmin metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
