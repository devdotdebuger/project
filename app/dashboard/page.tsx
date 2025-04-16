import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import HeroSection from "@/components/hero-section"
import HeatMapSection from "@/components/heat-map-section"
import CommunityInputSection from "@/components/community-input-section"
import InterventionsSection from "@/components/interventions-section"
import LoadingSpinner from "@/components/loading-spinner"

export default async function Dashboard() {
  let connectionError = null;

  try {
    // Check if user is authenticated
    const supabase = createServerComponentClient({ cookies })
    
    // Test database connection
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .single()
    
    if (dbError) {
      throw dbError
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }
  } catch (error: any) {
    console.error("Supabase error:", error)
    connectionError = error.message
    // Don't redirect, let's show the error to the user
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Database connection error: {connectionError}
              </p>
            </div>
          </div>
        </div>
      )}

      <HeroSection />

      <Suspense fallback={<LoadingSpinner />}>
        <HeatMapSection />
      </Suspense>

      <InterventionsSection />

      <Suspense fallback={<LoadingSpinner />}>
        <CommunityInputSection />
      </Suspense>
    </main>
  )
}

