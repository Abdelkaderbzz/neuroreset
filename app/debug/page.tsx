"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Database, Table, Key } from "lucide-react"
import { supabase, checkSupabaseConnection } from "@/lib/supabase"

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [connectionMessage, setConnectionMessage] = useState<string>("")
  const [connectionDetails, setConnectionDetails] = useState<any>(null)

  const [tables, setTables] = useState<any[]>([])
  const [tablesStatus, setTablesStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [tablesMessage, setTablesMessage] = useState<string>("")

  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [tableDataStatus, setTableDataStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const [envVars, setEnvVars] = useState<{
    url: string | null
    key: string | null
  }>({
    url: null,
    key: null,
  })

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "(set but hidden)" : null,
    })

    // Test connection
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionStatus("loading")

    try {
      const result = await checkSupabaseConnection()

      if (result.success) {
        setConnectionStatus("success")
        setConnectionMessage(result.message)
        setConnectionDetails(null)

        // If connection is successful, fetch tables
        fetchTables()
      } else {
        setConnectionStatus("error")
        setConnectionMessage(result.message)
        setConnectionDetails(result.details)
      }
    } catch (error: any) {
      setConnectionStatus("error")
      setConnectionMessage(error.message || "An unexpected error occurred")
      setConnectionDetails(error)
    }
  }

  const fetchTables = async () => {
    setTablesStatus("loading")

    try {
      const { data, error } = await supabase.from("pg_catalog.pg_tables").select("tablename").eq("schemaname", "public")

      if (error) throw error

      const tableNames = data.map((t) => t.tablename)
      setTables(tableNames)
      setTablesStatus("success")
      setTablesMessage(`Found ${tableNames.length} tables`)
    } catch (error: any) {
      console.error("Error fetching tables:", error)
      setTablesStatus("error")
      setTablesMessage(error.message || "Failed to fetch tables")
      setTables([])
    }
  }

  const fetchTableData = async (tableName: string) => {
    setSelectedTable(tableName)
    setTableDataStatus("loading")

    try {
      const { data, error } = await supabase.from(tableName).select("*").limit(10)

      if (error) throw error

      setTableData(data)
      setTableDataStatus("success")
    } catch (error: any) {
      console.error(`Error fetching data from ${tableName}:`, error)
      setTableDataStatus("error")
      setTableData([])
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Debug</h1>
        <p className="text-muted-foreground">Diagnose and fix issues with your Supabase connection</p>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Connection Status
              </CardTitle>
              <CardDescription>Check if your Supabase connection is working properly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Environment Variables</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                      </div>
                      <Badge variant={envVars.url ? "outline" : "destructive"}>
                        {envVars.url ? envVars.url : "Not Set"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                      </div>
                      <Badge variant={envVars.key ? "outline" : "destructive"}>
                        {envVars.key ? envVars.key : "Not Set"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Connection Test</h3>
                  <div className="p-4 border rounded-md">
                    {connectionStatus === "success" && (
                      <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Connection Successful</h4>
                          <p className="text-sm mt-1">{connectionMessage}</p>
                        </div>
                      </div>
                    )}

                    {connectionStatus === "error" && (
                      <div className="flex items-start gap-2 text-destructive">
                        <XCircle className="h-5 w-5 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Connection Failed</h4>
                          <p className="text-sm mt-1">{connectionMessage}</p>
                          {connectionDetails && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm font-medium">Show error details</summary>
                              <pre className="mt-2 whitespace-pre-wrap text-xs bg-destructive/10 p-2 rounded">
                                {JSON.stringify(connectionDetails, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    )}

                    {connectionStatus === "loading" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Testing connection...</span>
                      </div>
                    )}

                    {connectionStatus === "idle" && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <AlertTriangle className="h-5 w-5 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Connection Not Tested</h4>
                          <p className="text-sm mt-1">Click the button below to test your Supabase connection.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={testConnection} disabled={connectionStatus === "loading"} className="gap-2">
                {connectionStatus === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Database Tables
              </CardTitle>
              <CardDescription>View and verify your Supabase database tables</CardDescription>
            </CardHeader>
            <CardContent>
              {tablesStatus === "loading" && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {tablesStatus === "error" && (
                <div className="flex items-start gap-2 p-4 border rounded-md text-destructive">
                  <XCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Failed to Fetch Tables</h4>
                    <p className="text-sm mt-1">{tablesMessage}</p>
                  </div>
                </div>
              )}

              {tablesStatus === "success" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-4 border rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tables Found</h4>
                      <p className="text-sm mt-1">{tablesMessage}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tables.map((table) => (
                      <div
                        key={table}
                        className="p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => fetchTableData(table)}
                      >
                        <span className="font-mono text-sm">{table}</span>
                        <Badge
                          variant="outline"
                          className={
                            table === "appointments" ||
                            table === "resources" ||
                            table === "resource_categories" ||
                            table === "profiles" ||
                            table === "emergency_contacts"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : ""
                          }
                        >
                          {table === "appointments" ||
                          table === "resources" ||
                          table === "resource_categories" ||
                          table === "profiles" ||
                          table === "emergency_contacts"
                            ? "Required"
                            : "Other"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={fetchTables}
                disabled={tablesStatus === "loading" || connectionStatus !== "success"}
                className="gap-2"
              >
                {tablesStatus === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh Tables
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Table Data
              </CardTitle>
              <CardDescription>
                {selectedTable
                  ? `Viewing data from the "${selectedTable}" table`
                  : "Select a table from the Tables tab to view its data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedTable && (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Table Selected</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Please select a table from the Tables tab to view its data.
                  </p>
                </div>
              )}

              {selectedTable && tableDataStatus === "loading" && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {selectedTable && tableDataStatus === "error" && (
                <div className="flex items-start gap-2 p-4 border rounded-md text-destructive">
                  <XCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Failed to Fetch Data</h4>
                    <p className="text-sm mt-1">Could not retrieve data from the "{selectedTable}" table.</p>
                  </div>
                </div>
              )}

              {selectedTable && tableDataStatus === "success" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      {tableData.length} {tableData.length === 1 ? "row" : "rows"} found
                    </h3>
                    <Badge variant="outline">Showing up to 10 rows</Badge>
                  </div>

                  {tableData.length > 0 ? (
                    <div className="border rounded-md overflow-auto max-h-[400px]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted">
                            {Object.keys(tableData[0]).map((column) => (
                              <th key={column} className="p-2 text-left font-medium border-b">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b last:border-0 hover:bg-muted/50">
                              {Object.entries(row).map(([column, value], colIndex) => (
                                <td key={colIndex} className="p-2 font-mono text-xs">
                                  {value === null ? (
                                    <span className="text-muted-foreground">null</span>
                                  ) : typeof value === "object" ? (
                                    JSON.stringify(value).substring(0, 50) +
                                    (JSON.stringify(value).length > 50 ? "..." : "")
                                  ) : (
                                    String(value).substring(0, 50) + (String(value).length > 50 ? "..." : "")
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">No data found in this table</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {selectedTable && (
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => fetchTableData(selectedTable)}
                  disabled={tableDataStatus === "loading"}
                  className="gap-2"
                >
                  {tableDataStatus === "loading" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Having issues? Visit the{" "}
          <a href="/setup" className="text-primary hover:underline">
            Setup Page
          </a>{" "}
          to reconfigure your Supabase connection.
        </p>
      </div>
    </div>
  )
}

