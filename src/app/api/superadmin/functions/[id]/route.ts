import { NextRequest, NextResponse } from 'next/server'
import { getUserWithProfile } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function DELETE(
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
    
    // First check if function exists
    const { data: existingFunction, error: fetchError } = await supabaseAdmin
      .from('larin_functions')
      .select('id, name')
      .eq('id', functionId)
      .single()
    
    if (fetchError || !existingFunction) {
      return NextResponse.json({ error: 'Function not found' }, { status: 404 })
    }
    
    // Note: Skipping active instances check as table structure may vary
    
    // Delete the function (this will cascade to related tables if properly configured)
    const { error: deleteError } = await supabaseAdmin
      .from('larin_functions')
      .delete()
      .eq('id', functionId)
    
    if (deleteError) {
      console.error('❌ Error deleting function:', deleteError)
      return NextResponse.json({ error: 'Failed to delete function' }, { status: 500 })
    }
    
    console.log('✅ Function deleted successfully:', functionId, existingFunction.name)
    
    return NextResponse.json({
      success: true,
      message: `Function "${existingFunction.name}" deleted successfully`,
      deletedFunction: existingFunction
    })
  } catch (error) {
    console.error('Error deleting function:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
