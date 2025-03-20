"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notification-center"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, Calendar, Home, LifeBuoy, Menu, MessageSquare, Search, Settings, User, Users } from "lucide-react"
import Image from "next/image"
import { useAppContext } from "@/contexts/app-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {

  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Ensure theme is only accessed after mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // Update the toggleSidebar function to be more robust
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Recovery Plan", href: "/recovery-plan", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Community", href: "/community", icon: <Users className="h-5 w-5" /> },
    { name: "Messages", href: "/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Resources", href: "/resources", icon: <LifeBuoy className="h-5 w-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={isMobile && isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <MobileSidebar pathname={pathname} navigationItems={navigationItems} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } hidden md:flex`}
      >
        <DesktopSidebar pathname={pathname} navigationItems={navigationItems} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <div className="flex items-center gap-2 md:hidden">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                NR
              </div>
              <span className="font-semibold">NeuroReset</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="pl-8 w-[200px] lg:w-[300px]" />
              </div>

              <NotificationCenter />
              <ThemeToggle />

              <UserMenu />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Floating button to reopen sidebar when closed */}
      {!isSidebarOpen && !isMobile && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 left-4 z-20 shadow-md"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

function DesktopSidebar({
  pathname,
  navigationItems,
  toggleSidebar,
}: { pathname: string; navigationItems: any[]; toggleSidebar: () => void }) {
  return (
    <>
      <div className='flex h-14 items-center border-b px-4'>
        <div className='flex items-center gap-2'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-20%20at%2016.12.39-fQkvfFNQ8nR8LVt67CpgolNhp5ptMc.png'
            alt='NeuroReset Logo'
            width={30}
            height={30}
            className='rounded-xl'
          />
          <span
            className={
              'ml-2 text-l font-bold transition-colors duration-300 text-purple-600'
            }
          >
            NeuroReset
          </span>
        </div>
      </div>

      <div className='flex-1 overflow-auto py-2'>
        <nav className='grid gap-1 px-2'>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

function MobileSidebar({ pathname, navigationItems }: { pathname: string; navigationItems: any[] }) {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            NR
          </div>
          <span className="font-semibold">NeuroReset</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

    </div>
  )
}

function UserMenu()
{
  const { profile } = useAppContext();
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar} alt="User" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

