import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // Redirect based on auth status
    if (!session) {
      return redirect("/login")
    }
    return redirect("/dashboard")
  } catch (error) {
    console.error("Auth error:", error)
    // Safer fallback - redirect to login instead of dashboard
    return redirect("/login")
  }
}

