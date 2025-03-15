"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database } from "lucide-react"
import { useRouter } from "next/navigation"

interface SupabaseFallbackProps {
  title?: string
  message?: string
  showSetupButton?: boolean
}

export function SupabaseFallback({
  title = "Data Connection Issue",
  message = "We couldn't connect to the database or retrieve the necessary data.",
  showSetupButton = true,
}: SupabaseFallbackProps) {
  const router = useRouter()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{message}</p>
      </CardContent>
      {showSetupButton && (
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/setup")} className="gap-2">
            <Database className="h-4 w-4" />
            Go to Setup Page
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

