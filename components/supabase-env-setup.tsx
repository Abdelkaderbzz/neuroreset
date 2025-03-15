"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export function SupabaseEnvSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Credentials</CardTitle>
        <CardDescription>Configure your Supabase connection details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <div className="mt-1.5 relative">
              <Input
                id="supabase-url"
                value={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
                readOnly
                className="pr-12 font-mono text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗"}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your Supabase project URL (e.g., https://your-project-id.supabase.co)
            </p>
          </div>

          <div>
            <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
            <div className="mt-1.5 relative">
              <Input
                id="supabase-anon-key"
                value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "••••••••••••••••••••••••••••••••" : ""}
                readOnly
                className="pr-12 font-mono text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗"}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Your Supabase anonymous/public API key</p>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium mb-2">How to find your credentials</h3>
          <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
            <li>Go to your Supabase project dashboard</li>
            <li>Click on the "Settings" icon in the sidebar</li>
            <li>Select "API" from the settings menu</li>
            <li>Your Project URL and anon/public key will be displayed under "Project API keys"</li>
          </ol>
          <div className="mt-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Open Supabase Dashboard
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Connection Status</h3>
          <SupabaseConnectionTest />
        </div>
      </CardContent>
    </Card>
  )
}

