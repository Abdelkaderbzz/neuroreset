"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Edit3, Lock, Save, Trash2 } from "lucide-react"

// Sample journal entries
const journalEntries = [
  {
    id: 1,
    date: "March 12, 2025",
    title: "First day of recovery",
    content:
      "Today marks the beginning of my recovery journey. I'm feeling a mix of anxiety and hope. The onboarding process was helpful in setting realistic goals. I'm committed to taking this one day at a time.",
    tags: ["Day 1", "Beginning", "Hope"],
    isPrivate: true,
  },
  {
    id: 2,
    date: "March 13, 2025",
    title: "Identifying triggers",
    content:
      "I spent some time today reflecting on my triggers. Social gatherings with old friends seem to be the most challenging. I'm going to work on developing strategies to handle these situations better. The meditation session this morning was really helpful in clearing my mind.",
    tags: ["Triggers", "Awareness", "Meditation"],
    isPrivate: true,
  },
  {
    id: 3,
    date: "March 14, 2025",
    title: "Small victory today",
    content:
      "I successfully avoided a situation that would have been triggering. Instead of going to the usual Friday happy hour, I attended an online support group meeting. It felt empowering to make this choice. I'm proud of myself for prioritizing my recovery.",
    tags: ["Victory", "Support Group", "Choices"],
    isPrivate: false,
  },
]

export function JournalEntry() {
  const [activeTab, setActiveTab] = useState("write")
  const [journalTitle, setJournalTitle] = useState("")
  const [journalContent, setJournalContent] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSaveJournal = () => {
    if (journalTitle && journalContent) {
      setShowSuccess(true)

      // Reset form after a delay
      setTimeout(() => {
        setJournalTitle("")
        setJournalContent("")
        setTags([])
        setIsPrivate(true)
        setShowSuccess(false)
        setActiveTab("history")
      }, 2000)
    }
  }

  const handleViewEntry = (id: number) => {
    setSelectedEntry(id)
    const entry = journalEntries.find((e) => e.id === id)
    if (entry) {
      setJournalTitle(entry.title)
      setJournalContent(entry.content)
      setTags(entry.tags)
      setIsPrivate(entry.isPrivate)
      setActiveTab("view")
    }
  }

  const handleEditEntry = () => {
    setActiveTab("write")
  }

  const handleNewEntry = () => {
    setSelectedEntry(null)
    setJournalTitle("")
    setJournalContent("")
    setTags([])
    setIsPrivate(true)
    setActiveTab("write")
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recovery Journal</CardTitle>
        <CardDescription>Document your thoughts, feelings, and progress in your recovery journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="view" disabled={selectedEntry === null}>
              View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4 pt-4">
            {showSuccess ? (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-md text-center animate-in fade-in-50 duration-300">
                Journal entry saved successfully!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="journal-title" className="text-sm font-medium">
                      Title
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <input
                    id="journal-title"
                    type="text"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Give your entry a title..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="journal-content" className="text-sm font-medium">
                    What's on your mind today?
                  </label>
                  <textarea
                    id="journal-content"
                    className="w-full p-2 border rounded-md h-40 bg-background"
                    placeholder="Write about your feelings, challenges, victories, or reflections..."
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="journal-tags" className="text-sm font-medium">
                    Tags (press Enter to add)
                  </label>
                  <input
                    id="journal-tags"
                    type="text"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Add tags like 'meditation', 'triggers', 'victory'..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                          {tag}
                          <button
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="private-entry"
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <label htmlFor="private-entry" className="text-sm flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Keep this entry private
                  </label>
                </div>

                <Button onClick={handleSaveJournal} disabled={!journalTitle || !journalContent} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Journal Entry
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Entries</h3>
                <Button size="sm" onClick={handleNewEntry}>
                  New Entry
                </Button>
              </div>

              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 border rounded-md cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleViewEntry(entry.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{entry.title}</h4>
                      {entry.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                    <p className="text-sm mt-2 line-clamp-2">{entry.content}</p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="view" className="pt-4">
            {selectedEntry !== null && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{journalTitle}</h3>
                    {isPrivate && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleEditEntry}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this journal entry? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {journalEntries.find((e) => e.id === selectedEntry)?.date}
                </div>

                <Separator />

                <div className="whitespace-pre-wrap">{journalContent}</div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="text-xs text-muted-foreground w-full text-center">
          Your journal entries help track your recovery progress and identify patterns over time.
        </div>
      </CardFooter>
    </Card>
  )
}

