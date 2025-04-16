import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const checkSupabaseConnection = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from('profiles').select('count').single()
    
    if (error) {
      throw error
    }
    
    return { success: true, message: 'Connected to Supabase successfully' }
  } catch (error: any) {
    console.error('Supabase connection error:', error)
    return { 
      success: false, 
      message: error.message || 'Failed to connect to Supabase',
      error 
    }
  }
}