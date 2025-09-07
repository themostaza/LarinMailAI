import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and superadmin role
    const { user, profile } = await getUserWithProfile()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
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
    
    // Generate unique UI code (simple UUID-like)
    const uniqueUiCode = `func_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Insert new function
    const { data: newFunction, error } = await supabaseAdmin
      .from('larin_functions')
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        lucide_react_icon: lucide_react_icon?.trim() || null,
        generally_visible: generally_visible ?? true,
        generally_available: generally_available ?? true,
        body: functionBody,
        unique_ui_code: uniqueUiCode,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating function:', error)
      return NextResponse.json({ error: 'Failed to create function' }, { status: 500 })
    }
    
    console.log('✅ Function created successfully:', newFunction.id)
    
    return NextResponse.json({
      success: true,
      function: newFunction
    })
  } catch (error) {
    console.error('Error creating function:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
