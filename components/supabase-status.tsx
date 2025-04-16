"use client"

import { useEffect, useState } from "react"
import { checkSupabaseConnection } from "@/lib/supabase-client"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkSupabaseConnection()
      setStatus(result)
    }

    checkConnection()
  }, [])

  if (!status) return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
        status.success ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          status.success ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <p className={`text-sm ${
          status.success ? 'text-green-700' : 'text-red-700'
        }`}>
          {status.message}
        </p>
      </div>
    </div>
  )
}