"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Clock, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { EPriority } from "@/api"

interface TaskItemProps {
  id: string
  title: string
  description: string
  time: string
  priority?: EPriority
  completed?:boolean
  onComplete: (id: string, completed: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function TaskItem({
  id,
  title,
  description,
  time,
  priority = EPriority.Medium,
  completed = false,
  onComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [taskCompleted, setTaskCompleted] = useState(completed)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCheckboxChange = (checked: boolean) => {
    setTaskCompleted(checked)
    onComplete(id, checked)
  }

  const handleEdit = () => {
    if (onEdit) onEdit(id)
  }

  const handleDelete = () => {
    setIsDeleting(false)
    if (onDelete) onDelete(id)
  }

  const getPriorityColor = () => {
    switch (priority) {
      case EPriority.High:
        return "text-red-600 dark:text-red-400"
      case EPriority.Medium:
        return "text-amber-600 dark:text-amber-400"
      case EPriority.Low:
        return "text-green-600 dark:text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
        taskCompleted ? "bg-muted/30" : "",
        "hover:border-primary/50",
      )}
    >
      <Checkbox id={id} checked={taskCompleted} onCheckedChange={handleCheckboxChange} className="mt-1" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <label
              htmlFor={id}
              className={cn("font-medium cursor-pointer", taskCompleted ? "line-through text-muted-foreground" : "")}
            >
              {title}
            </label>
            <p className={cn("text-sm", taskCompleted ? "text-muted-foreground/70" : "text-muted-foreground")}>
              {description}
            </p>
          </div>
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Task options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Clock className={cn("h-3 w-3", getPriorityColor())} />
            <span className={cn("text-xs", getPriorityColor())}>{time}</span>
          </div>
          {priority && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                priority === EPriority.High
                  ? "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                  : priority === EPriority.Medium
                    ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
              )}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
          )}
          {taskCompleted && (
            <Badge variant="outline" className="bg-green-600 text-white dark:bg-green-700">
              Completed
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

