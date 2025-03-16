'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Bell, PenSquare, Plus, Search, Filter, Calendar } from 'lucide-react';

import type {
  Post,
  User,
  SupportGroup,
  Event,
  SuccessStory,
} from '@/types/community';
import { CreatePost } from '@/components/community/create-post';
import { PostCard } from '@/components/community/post-card';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { SupportGroupCard } from '@/components/community/support-group-card';
import { EventCard } from '@/components/community/event-card';
import { SuccessStoryCard } from '@/components/community/success-story-card';
import { supabase } from '@/lib/supabase';

export default function CommunityPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User>({
    id: '88888888-8888-8888-8888-888888888888',
    name: 'Alex Johnson',
    avatar_url: '/placeholder.svg?height=40&width=40',
    role: 'Member',
    badge: '7 Days',
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [activeMembers, setActiveMembers] = useState<User[]>([]);
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    activeDiscussions: 0,
    upcomingEvents: 0,
    successStories: 0,
  });
  const [trendingTopics, setTrendingTopics] = useState<
    Array<{ tag: string; count: number }>
  >([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts with authors and check if current user liked them
  const fetchPosts = async () => {
    try {
      // Get posts with authors
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:users(*)
        `
        )
        .order('created_at', { ascending: false });
      console.log(postsData, 'postdata');
      if (postsError) throw postsError;

      // Get likes for current user
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', currentUser.id);

      if (likesError) throw likesError;

      // Create a set of liked post IDs for quick lookup
      const likedPostIds = new Set(likesData.map((like) => like.post_id));

      // Format posts with author and liked status
      const formattedPosts = postsData.map((post) => ({
        ...post,
        author: post.author as User,
        liked: likedPostIds.has(post.id),
      }));

      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    }
  };

  // Fetch support groups and check if current user is a member
  const fetchSupportGroups = async () => {
    try {
      // Get support groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('support_groups')
        .select('*');

      if (groupsError) throw groupsError;

      // Get group memberships for current user
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', currentUser.id);

      if (membershipsError) throw membershipsError;

      // Create a set of joined group IDs for quick lookup
      const joinedGroupIds = new Set(
        membershipsData.map((membership) => membership.group_id)
      );

      // Format groups with joined status and add active_now (mock data)
      const formattedGroups = groupsData.map((group) => ({
        ...group,
        joined: joinedGroupIds.has(group.id),
        active_now: Math.floor(Math.random() * 20), // Mock data
      }));

      setSupportGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching support groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load support groups',
        variant: 'destructive',
      });
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    }
  };

  // Fetch success stories with authors
  const fetchSuccessStories = async () => {
    try {
      const { data, error } = await supabase.from('success_stories').select(`
          *,
          author:users(*)
        `);

      if (error) throw error;

      // Format success stories with author
      const formattedStories = data.map((story) => ({
        ...story,
        author: story.author as User,
      }));

      setSuccessStories(formattedStories);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load success stories',
        variant: 'destructive',
      });
    }
  };

  // Fetch active members
  const fetchActiveMembers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*').limit(4);

      if (error) throw error;

      setActiveMembers(data);
    } catch (error) {
      console.error('Error fetching active members:', error);
    }
  };

  // Fetch community stats
  const fetchCommunityStats = async () => {
    try {
      // Get total members count
      const { count: membersCount, error: membersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (membersError) throw membersError;

      // Get active discussions (posts with comments)
      const { count: discussionsCount, error: discussionsError } =
        await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .gt('comments_count', 0);

      if (discussionsError) throw discussionsError;

      // Get upcoming events count
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString().split('T')[0]);

      if (eventsError) throw eventsError;

      // Get success stories count
      const { count: storiesCount, error: storiesError } = await supabase
        .from('success_stories')
        .select('*', { count: 'exact', head: true });

      if (storiesError) throw storiesError;

      setCommunityStats({
        totalMembers: membersCount || 0,
        activeDiscussions: discussionsCount || 0,
        upcomingEvents: eventsCount || 0,
        successStories: storiesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  // Fetch trending topics
  const fetchTrendingTopics = async () => {
    // In a real app, this would be a more complex query
    // For now, we'll use mock data
    setTrendingTopics([
      { tag: 'MindfulnessMonday', count: 24 },
      { tag: 'SobrietyMilestones', count: 18 },
      { tag: 'CopingStrategies', count: 15 },
      { tag: 'RecoveryTips', count: 12 },
      { tag: 'SelfCare', count: 10 },
    ]);
  };

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPosts(),
        fetchSupportGroups(),
        fetchEvents(),
        fetchSuccessStories(),
        fetchActiveMembers(),
        fetchCommunityStats(),
        fetchTrendingTopics(),
      ]);
      setIsLoading(false);
    };

    loadAllData();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post?.author?.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  // Handle post update
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  // Handle post creation
  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  // Handle group update
  const handleGroupUpdate = (updatedGroup: SupportGroup) => {
    setSupportGroups((groups) =>
      groups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
  };

  // Handle event update
  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents((events) =>
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>Community</h1>
            <p className='text-muted-foreground'>
              Connect with peers and experts on your recovery journey
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='relative w-full md:w-auto'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search community...'
                className='pl-8 w-full md:w-[200px]'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Bell className='h-4 w-4 mr-2' />
              Notifications
            </Button>
          </div>
        </div>

        <Tabs defaultValue='feed'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='feed'>Feed</TabsTrigger>
            <TabsTrigger value='groups'>Groups</TabsTrigger>
            <TabsTrigger value='events'>Events</TabsTrigger>
            <TabsTrigger value='stories'>Success Stories</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value='feed' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2 space-y-6'>
                {/* Create Post Card */}
                <CreatePost
                  currentUser={currentUser}
                  onPostCreated={handlePostCreated}
                />

                {/* Feed Posts */}
                {isLoading ? (
                  <div className='space-y-4'>
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className='overflow-hidden'>
                        <CardContent className='p-6'>
                          <div className='flex gap-3 items-center'>
                            <div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
                            <div className='space-y-2 flex-1'>
                              <div className='h-4 w-1/4 bg-muted animate-pulse rounded' />
                              <div className='h-3 w-1/3 bg-muted animate-pulse rounded' />
                            </div>
                          </div>
                          <div className='space-y-2 mt-4'>
                            <div className='h-4 w-full bg-muted animate-pulse rounded' />
                            <div className='h-4 w-full bg-muted animate-pulse rounded' />
                            <div className='h-4 w-2/3 bg-muted animate-pulse rounded' />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onPostUpdate={handlePostUpdate}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className='pt-6 text-center py-12'>
                      <div className='flex flex-col items-center justify-center'>
                        <Search className='h-12 w-12 text-muted-foreground mb-4' />
                        <h3 className='text-lg font-medium mb-2'>
                          No posts found
                        </h3>
                        <p className='text-muted-foreground mb-4'>
                          We couldn't find any posts matching your search.
                        </p>
                        <Button onClick={() => setSearchQuery('')}>
                          Clear Search
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <CommunitySidebar
                activeMembers={activeMembers}
                communityStats={communityStats}
                trendingTopics={trendingTopics}
              />
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value='groups' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Support Groups</h2>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter
                </Button>
                <Button size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Group
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        <div className='h-6 w-1/2 bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                        <div className='h-10 w-full bg-muted animate-pulse rounded' />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {supportGroups.map((group) => (
                  <SupportGroupCard
                    key={group.id}
                    group={group}
                    currentUser={currentUser}
                    onGroupUpdate={handleGroupUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value='events' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Upcoming Events</h2>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <Calendar className='h-4 w-4 mr-2' />
                  Calendar View
                </Button>
                <Button size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Event
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        <div className='h-6 w-1/2 bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                        <div className='h-10 w-full bg-muted animate-pulse rounded' />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    currentUser={currentUser}
                    onEventUpdate={handleEventUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value='stories' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Success Stories</h2>
              <Button>
                <PenSquare className='h-4 w-4 mr-2' />
                Share Your Story
              </Button>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
                          <div className='space-y-2 flex-1'>
                            <div className='h-4 w-1/3 bg-muted animate-pulse rounded' />
                            <div className='h-3 w-1/4 bg-muted animate-pulse rounded' />
                          </div>
                        </div>
                        <div className='h-6 w-2/3 bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                        <div className='h-4 w-full bg-muted animate-pulse rounded' />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {successStories.map((story) => (
                  <SuccessStoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
