export interface User {
  id: string
  name: string
  avatar_url: string
  role: string
  badge?: string
  created_at?: string
}

export interface Post {
  id: string
  author_id: string
  content: string
  created_at: string
  likes_count: number
  comments_count: number
  tags: string[]
  author?: User
  liked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: User
}

export interface SupportGroup {
  id: string
  name: string
  description: string
  members_count: number
  meeting_times: string
  created_at?: string
  joined?: boolean
  active_now?: number
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  host: string
  attendees_count: number
  created_at?: string
}

export interface SuccessStory {
  id: string
  author_id: string
  title: string
  content: string
  excerpt: string
  read_time: string
  created_at?: string
  author?: User
}

