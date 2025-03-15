"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { ResourceGrid } from "@/components/resources/resource-grid"
import { ResourceCategories } from "@/components/resources/resource-categories"
import { SavedResources } from "@/components/resources/saved-resources"
import { RecommendedResources } from "@/components/resources/recommended-resources"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [resourceType, setResourceType] = useState<string | null>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Recovery Resources</h1>
            <p className="text-muted-foreground">Educational materials and tools to support your journey</p>
          </div>
          <ResourceFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resourceType={resourceType}
            setResourceType={setResourceType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ResourceCategories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <ResourceGrid searchQuery={searchQuery} selectedCategory={selectedCategory} resourceType={resourceType} />
          </div>

          <div className="space-y-6">
            <SavedResources />
            <RecommendedResources />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

