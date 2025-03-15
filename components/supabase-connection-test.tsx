"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { checkSupabaseConnection } from "@/lib/supabase"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    setStatus("loading")

    try {
      const result = await checkSupabaseConnection()

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
      } else {
        setStatus("error")
        setMessage(result.message)
        setDetails(result.details)
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "An unexpected error occurred")
      setDetails(error)
    }
  }

  useEffect(() => {
    // Auto-test on mount
    testConnection()
  }, [])

  return (
    <div className="space-y-4">
      {status === "success" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Connection Successful</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{message}</p>
            {details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">Show error details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-destructive/10 p-2 rounded">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          onClick={testConnection}
          disabled={status === "loading"}
          variant={status === "error" ? "destructive" : "default"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection Again"
          )}
        </Button>
      </div>
    </div>
  )
}

