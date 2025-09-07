import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase-server'

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
    
    const { id: functionId } = await params
    
    if (!functionId) {
      return NextResponse.json({ error: 'Function ID is required' }, { status: 400 })
    }
    
    // Parse request body
    const body = await request.json()
    const {
      name,
      slug,
      lucide_react_icon,
      generally_visible,
      generally_available,
      description,
      platforms,
      features,
      setupRequired
    } = body
    
    // Validate required fields
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }
    
    // Create the body JSON object
    const functionBody = {
      description: description || '',
      list_software: platforms || [],
      included: features || [],
      setup: setupRequired || []
    }
    
    // Update function
    const { data: updatedFunction, error } = await supabaseAdmin
      .from('larin_functions')
      .update({
        name: name.trim(),
        slug: slug.trim(),
        lucide_react_icon: lucide_react_icon?.trim() || null,
        generally_visible: generally_visible ?? true,
        generally_available: generally_available ?? true,
        body: functionBody,
        updated_at: new Date().toISOString()
      })
      .eq('id', functionId)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating function:', error)
      return NextResponse.json({ error: 'Failed to update function' }, { status: 500 })
    }
    
    console.log('✅ Function updated successfully:', functionId)
    
    return NextResponse.json({
      success: true,
      function: updatedFunction
    })
  } catch (error) {
    console.error('Error updating function:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
