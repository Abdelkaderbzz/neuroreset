"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Heart, Shield, Users, Lightbulb, Dumbbell, Home, Briefcase } from "lucide-react"

// Sample categories
const categories = [
  { id: "coping", name: "Coping Strategies", icon: <Brain className="h-4 w-4" /> },
  { id: "wellness", name: "Wellness & Self-Care", icon: <Heart className="h-4 w-4" /> },
  { id: "relapse", name: "Relapse Prevention", icon: <Shield className="h-4 w-4" /> },
  { id: "relationships", name: "Relationships", icon: <Users className="h-4 w-4" /> },
  { id: "mindfulness", name: "Mindfulness", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "physical", name: "Physical Health", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "lifestyle", name: "Lifestyle Changes", icon: <Home className="h-4 w-4" /> },
  { id: "career", name: "Career & Education", icon: <Briefcase className="h-4 w-4" /> },
]

interface ResourceCategoriesProps {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export function ResourceCategories({ selectedCategory, setSelectedCategory }: ResourceCategoriesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="justify-start h-auto py-2"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center">
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

