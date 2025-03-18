'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Send,
  Phone,
  Video,
  Paperclip,
  Mic,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Plus,
  File,
  X,
  ChevronLeft,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase';


// Types for our data
interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: string;
  updated_at?: string;
  typing?: boolean;
}

interface Message {
  id: string;
  conversation_id: string;
  sender: string;
  content: string;
  time: string;
  status: string;
  isme: boolean;
  created_at?: string;
  edited?: boolean;
}


interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface NewConversationForm {
  name: string;
  role: string;
  type: string;
}

// Message status component
const MessageStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'sending':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center'>
                <Clock className='h-3 w-3 text-muted-foreground' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sending</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'sent':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center'>
                <Check className='h-3 w-3 text-muted-foreground' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'delivered':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center'>
                <CheckCheck className='h-3 w-3 text-muted-foreground' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delivered</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'read':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center'>
                <CheckCheck className='h-3 w-3 text-blue-500' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Read</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

// Format time helper
const formatMessageTime = (timeString: string, createdAt?: string) => {
  if (!createdAt) return timeString;

  const date = new Date(createdAt);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'Yesterday ' + format(date, 'h:mm a');
  } else {
    return format(date, 'MMM d, h:mm a');
  }
};

// Format conversation time helper
const formatConversationTime = (timeString: string, updatedAt?: string) => {
  if (!updatedAt) return timeString;

  const date = new Date(updatedAt);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
};

// Conversation skeleton loader
const ConversationSkeleton = () => (
  <div className='flex items-start gap-3 p-3 rounded-lg'>
    <Skeleton className='h-10 w-10 rounded-full' />
    <div className='space-y-2 flex-1'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-3 w-1/2' />
      <Skeleton className='h-3 w-5/6' />
    </div>
  </div>
);

// Message skeleton loader
const MessageSkeleton = ({ isme }: { isme: boolean }) => (
  <div className={`flex ${isme ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex gap-2 max-w-[80%] ${isme ? 'flex-row-reverse' : ''}`}>
      {!isme && <Skeleton className='h-8 w-8 rounded-full' />}
      <div>
        <Skeleton className={`h-10 w-40 rounded-lg ${isme ? 'ml-auto' : ''}`} />
        <div className='flex items-center gap-1 mt-1 justify-end'>
          <Skeleton className='h-2 w-10' />
        </div>
      </div>
    </div>
  </div>
);

export default function MessagesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newConversation, setNewConversation] = useState<NewConversationForm>({
    name: '',
    role: 'Peer Support',
    type: 'peer',
  });
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch conversations from Supabase
  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setConversations(data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversations. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();

    // Set up real-time subscription for conversations
    const conversationsSubscription = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, [toast]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    async function fetchMessages() {
      if (!activeConversation) return;

      try {
        setMessagesLoading(true);
        setPage(1); // Reset pagination when conversation changes

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', activeConversation)
          .order('created_at', { ascending: true })
          .limit(20); // Paginate messages

        if (error) {
          throw error;
        }

        if (data) {
          setMessages(data);
          setHasMore(data.length === 20);

          // Mark unread messages as read
          if (activeConversation) {
            await supabase
              .from('conversations')
              .update({ unread: 0 })
              .eq('id', activeConversation);

            // Update local state to reflect read messages
            setConversations((prevConversations) =>
              prevConversations.map((conv) =>
                conv.id === activeConversation ? { ...conv, unread: 0 } : conv
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();

    // Set up real-time subscription for messages
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Add new message
            const newMessage = payload.new as Message;
            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              if (prev.some((msg) => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing message
            const updatedMessage = payload.new as Message;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted message
            const deletedMessageId = payload.old.id;
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== deletedMessageId)
            );
          }
        }
      )
      .subscribe();

    // Set up typing indicator subscription
    const typingSubscription = supabase
      .channel('typing-indicators')
      .on(
        'broadcast',
        { event: 'typing', filter: `conversation=${activeConversation}` },
        (payload) => {
          if (!payload.payload.isme) {
            // Update conversation with typing indicator
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === activeConversation
                  ? { ...conv, typing: payload.payload.typing }
                  : conv
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(typingSubscription);
    };
  }, [activeConversation, toast]);

  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (!activeConversation || !hasMore) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversation)
        .order('created_at', { ascending: true })
        .range(page * 20, (page + 1) * 20 - 1);

      if (error) {
        throw error;
      }

      if (data) {
        setMessages((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
        setHasMore(data.length === 20);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more messages',
        variant: 'destructive',
      });
    }
  };

  // Scroll to bottom of messages when messages change or active conversation changes
  useEffect(() => {
    if (messages.length > 0 && !messagesLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeConversation, messagesLoading]);

  // Filter conversations based on search query and active tab
  useEffect(() => {
    let filtered = conversations;

    if (searchQuery) {
      filtered = filtered.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter((conv) => conv.type === activeTab);
    }

    setFilteredConversations(filtered);
  }, [searchQuery, activeTab, conversations]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!activeConversation) return;

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Broadcast typing event
    supabase
      .channel('typing-indicators')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { typing: true, isme: true, conversation: activeConversation },
      })
      .then();

    // Set timeout to stop typing indicator after 2 seconds
    const timeout = setTimeout(() => {
      supabase
        .channel('typing-indicators')
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            typing: false,
            isme: true,
            conversation: activeConversation,
          },
        })
        .then();
    }, 2000);

    setTypingTimeout(timeout);
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const now = new Date().toISOString();

    // If editing a message
    if (isEditing && editingMessage) {
      try {
        const { error } = await supabase
          .from('messages')
          .update({
            content: message,
            edited: true,
          })
          .eq('id', editingMessage.id);

        if (error) throw error;

        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage.id
              ? { ...msg, content: message, edited: true }
              : msg
          )
        );

        setMessage('');
        setIsEditing(false);
        setEditingMessage(null);

        toast({
          title: 'Message updated',
          description: 'Your message has been updated successfully',
        });
      } catch (error) {
        console.error('Error updating message:', error);
        toast({
          title: 'Error',
          description: 'Failed to update message',
          variant: 'destructive',
        });
      }

      return;
    }

    // Create new message object
    const newMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: activeConversation,
      sender: 'Me',
      content: message,
      time: currentTime,
      status: 'sending',
      isme: true,
      created_at: now,
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    try {
      // In a real app, you would upload attachments to Supabase Storage here
      // For this example, we'll just include the attachment metadata

      // Save message to Supabase
      const { error: messageError } = await supabase.from('messages').insert({
        id: newMessage.id,
        conversation_id: activeConversation,
        sender: 'Me',
        content: message,
        time: currentTime,
        status: 'sent',
        isme: true,
        created_at: now,
      });

      if (messageError) throw messageError;

      // Update conversation's last message
      const { error: conversationError } = await supabase
        .from('conversations')
        .update({
          time: currentTime,
          updated_at: now,
        })
        .eq('id', activeConversation);

      if (conversationError) throw conversationError;

      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      // Simulate message being delivered and read (in a real app, this would be handled by the recipient)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );

        // Update message status in Supabase
        supabase
          .from('messages')
          .update({ status: 'delivered' })
          .eq('id', newMessage.id)
          .then();
      }, 1000);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );

        // Update message status in Supabase
        supabase
          .from('messages')
          .update({ status: 'read' })
          .eq('id', newMessage.id)
          .then();

        // Simulate a response after 3 seconds
        setTimeout(() => {
          const responseId = crypto.randomUUID();
          const responseTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const responseNow = new Date().toISOString();

          const responseContent =
            message.length > 0
              ? `Thanks for your message: "${message.substring(0, 30)}${
                  message.length > 30 ? '...' : ''
                }"`
              : 'Thanks for sharing that attachment!';

          // Add response to UI
          const responseMessage: Message = {
            id: responseId,
            conversation_id: activeConversation,
            sender:
              conversations.find((c) => c.id === activeConversation)?.name ||
              'Contact',
            content: responseContent,
            time: responseTime,
            status: 'sent',
            isme: false,
            created_at: responseNow,
          };

          setMessages((prev) => [...prev, responseMessage]);

          // Save response to Supabase
          supabase
            .from('messages')
            .insert({
              id: responseId,
              conversation_id: activeConversation,
              sender:
                conversations.find((c) => c.id === activeConversation)?.name ||
                'Contact',
              content: responseContent,
              time: responseTime,
              status: 'sent',
              isme: false,
              created_at: responseNow,
            })
            .then();

          // Update conversation
          supabase
            .from('conversations')
            .update({
              lastMessage: `${
                conversations.find((c) => c.id === activeConversation)?.name ||
                'Contact'
              }: ${responseContent}`,
              time: responseTime,
              updated_at: responseNow,
              unread: 1, // This would be handled differently in a real app
            })
            .eq('id', activeConversation)
            .then();
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });

      // Remove the failed message from the UI
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }
  };

  // Handle start new chat
  const handleStartNewChat = async () => {
    setShowNewChatDialog(true);
  };

  // Create new conversation
  const createNewConversation = async () => {
    if (!newConversation.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the conversation',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newConversationId = crypto.randomUUID();
      const now = new Date().toISOString();
      const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const { error } = await supabase.from('conversations').insert({
        id: newConversationId,
        name: newConversation.name,
        role: newConversation.role,
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: 'Start a conversation',
        time: currentTime,
        unread: 0,
        online: true,
        type: newConversation.type,
        updated_at: now,
      });

      if (error) throw error;

      // Set the new conversation as active
      setActiveConversation(newConversationId);
      setShowNewChatDialog(false);

      // Reset form
      setNewConversation({
        name: '',
        role: 'Peer Support',
        type: 'peer',
      });

      toast({
        title: 'Success',
        description: 'New conversation created',
      });
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new conversation',
        variant: 'destructive',
      });
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Update local state
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      toast({
        title: 'Message deleted',
        description: 'Your message has been deleted',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  // Edit message
  const startEditMessage = (msg: Message) => {
    setEditingMessage(msg);
    setMessage(msg.content);
    setIsEditing(true);

    // Focus the input
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 0);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingMessage(null);
    setMessage('');
    setIsEditing(false);
  };

  // Copy message to clipboard
  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        toast({
          title: 'Copied',
          description: 'Message copied to clipboard',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy message',
          variant: 'destructive',
        });
      }
    );
  };

  return (
    <DashboardLayout>
      <div className='flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-3xl font-bold'>Messages</h1>
          <Button onClick={handleStartNewChat}>
            <Plus className='h-4 w-4 mr-2' />
            New Chat
          </Button>
        </div>

        <div className='flex flex-1 overflow-hidden border rounded-lg'>
          {/* Conversations List */}
          <div
            className={`w-full md:w-80 border-r ${
              activeConversation ? 'hidden md:block' : 'block'
            }`}
          >
            <div className='p-3 border-b'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search messages...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs
              defaultValue='all'
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className='px-3 pt-3'>
                <TabsList className='w-full grid grid-cols-3'>
                  <TabsTrigger value='all'>All</TabsTrigger>
                  <TabsTrigger value='expert'>Experts</TabsTrigger>
                  <TabsTrigger value='group'>Groups</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className='m-0'>
                <ScrollArea className='h-[calc(100vh-13rem)]'>
                  <div className='p-3 space-y-2'>
                    {loading ? (
                      // Skeleton loaders for conversations
                      Array(5)
                        .fill(0)
                        .map((_, i) => <ConversationSkeleton key={i} />)
                    ) : filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            activeConversation === conversation.id
                              ? 'bg-accent'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setActiveConversation(conversation.id)}
                        >
                          <div className='relative'>
                            <Avatar>
                              <AvatarImage
                                src={conversation.avatar}
                                alt={conversation.name}
                              />
                              <AvatarFallback>
                                {conversation.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background'></span>
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex justify-between items-start'>
                              <div className='font-medium truncate'>
                                {conversation.name}
                              </div>
                              <div className='text-xs text-muted-foreground whitespace-nowrap ml-2'>
                                {formatConversationTime(
                                  conversation.time,
                                  conversation.updated_at
                                )}
                              </div>
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {conversation.role}
                            </div>
                            <div className='text-sm truncate mt-1'>
                              {conversation.typing ? (
                                <span className='text-blue-500'>Typing...</span>
                              ) : (
                                conversation.lastMessage
                              )}
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge className='ml-auto shrink-0 bg-blue-600'>
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        No conversations found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Conversation View */}
          <div
            className={`flex-1 flex flex-col ${
              !activeConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                <div className='p-3 border-b flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='md:hidden'
                      onClick={() => setActiveConversation(null)}
                    >
                      <ChevronLeft className='h-5 w-5' />
                    </Button>

                    {conversations.find((c) => c.id === activeConversation) && (
                      <>
                        <Avatar>
                          <AvatarImage
                            src={
                              conversations.find(
                                (c) => c.id === activeConversation
                              )?.avatar
                            }
                            alt={
                              conversations.find(
                                (c) => c.id === activeConversation
                              )?.name || ''
                            }
                          />
                          <AvatarFallback>
                            {conversations.find(
                              (c) => c.id === activeConversation
                            )?.name[0] || ''}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className='font-medium'>
                            {
                              conversations.find(
                                (c) => c.id === activeConversation
                              )?.name
                            }
                          </div>
                          <div className='text-xs text-muted-foreground flex items-center gap-1'>
                            {conversations.find(
                              (c) => c.id === activeConversation
                            )?.online ? (
                              <>
                                <span className='h-1.5 w-1.5 rounded-full bg-green-500'></span>
                                <span>Online</span>
                              </>
                            ) : (
                              'Offline'
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='icon'>
                      <Phone className='h-5 w-5' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Video className='h-5 w-5' />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-5 w-5' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>
                          Search in conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                        <DropdownMenuItem className='text-red-500'>
                          Block contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <ScrollArea className='flex-1 p-4'>
                  {messagesLoading ? (
                    <div className='space-y-4'>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <MessageSkeleton key={i} isme={i % 2 === 0} />
                        ))}
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {hasMore && (
                        <div className='flex justify-center'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={loadMoreMessages}
                          >
                            Load more messages
                          </Button>
                        </div>
                      )}

                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.isme ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`flex gap-2 max-w-[80%] ${
                                msg.isme ? 'flex-row-reverse' : ''
                              }`}
                            >
                              {!msg.isme && (
                                <Avatar className='h-8 w-8'>
                                  <AvatarImage
                                    src={
                                      conversations.find(
                                        (c) => c.id === activeConversation
                                      )?.avatar ||
                                      '/placeholder.svg?height=32&width=32'
                                    }
                                    alt={msg.sender}
                                  />
                                  <AvatarFallback>
                                    {msg.sender[0]}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div className='group'>
                                <div
                                  className={`rounded-lg px-3 py-2 ${
                                    msg.isme
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  } relative`}
                                >
                                  {msg.content}
                                  {msg.edited && (
                                    <span className='text-xs text-muted-foreground ml-1'>
                                      (edited)
                                    </span>
                                  )}
                                  {msg.isme && (
                                    <div className='absolute top-0 right-0 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity'>
                                      <div className='flex items-center gap-1 bg-background border rounded-md shadow-sm'>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7'
                                          onClick={() =>
                                            copyMessageToClipboard(msg.content)
                                          }
                                        >
                                          <Copy className='h-3.5 w-3.5' />
                                        </Button>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7'
                                          onClick={() => startEditMessage(msg)}
                                        >
                                          <Edit className='h-3.5 w-3.5' />
                                        </Button>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7 text-red-500'
                                          onClick={() => deleteMessage(msg.id)}
                                        >
                                          <Trash2 className='h-3.5 w-3.5' />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                                  <span>
                                    {formatMessageTime(
                                      msg.time,
                                      msg.created_at
                                    )}
                                  </span>
                                  {msg.isme && (
                                    <MessageStatus status={msg.status} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          No messages yet. Start a conversation!
                        </div>
                      )}

                      {/* Typing indicator */}
                      {conversations.find((c) => c.id === activeConversation)
                        ?.typing && (
                        <div className='flex justify-start'>
                          <div className='flex gap-2 max-w-[80%]'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage
                                src={
                                  conversations.find(
                                    (c) => c.id === activeConversation
                                  )?.avatar ||
                                  '/placeholder.svg?height=32&width=32'
                                }
                                alt={
                                  conversations.find(
                                    (c) => c.id === activeConversation
                                  )?.name || ''
                                }
                              />
                              <AvatarFallback>
                                {conversations.find(
                                  (c) => c.id === activeConversation
                                )?.name[0] || ''}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className='rounded-lg px-3 py-2 bg-muted'>
                                <div className='flex space-x-1'>
                                  <div className='h-2 w-2 bg-muted-foreground rounded-full animate-bounce'></div>
                                  <div className='h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75'></div>
                                  <div className='h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150'></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Editing indicator */}
                {isEditing && (
                  <div className='px-3 py-1 bg-muted border-t flex items-center justify-between'>
                    <div className='text-sm'>
                      <span className='font-medium'>Editing message</span>
                    </div>
                    <Button variant='ghost' size='sm' onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Message input */}
                <div className='p-3 border-t'>
                  <form
                    onSubmit={handleSendMessage}
                    className='flex items-center gap-2'
                  >
                  
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className='h-5 w-5' />
                    </Button>
                    <Button type='button' variant='ghost' size='icon'>
                      <Smile className='h-5 w-5' />
                    </Button>
                    <Input
                      placeholder={
                        isEditing ? 'Edit your message...' : 'Type a message...'
                      }
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                      }}
                      className='flex-1'
                      ref={messageInputRef}
                    />
                    <Button type='button' variant='ghost' size='icon'>
                      <Mic className='h-5 w-5' />
                    </Button>
                    <Button
                      type='submit'
                      size='icon'
                      disabled={
                        !message.trim() &&
                        !isEditing
                      }
                    >
                      <Send className='h-5 w-5' />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4'>
                  <MessageSquare className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-medium mb-2'>Your Messages</h3>
                <p className='text-muted-foreground mb-6 max-w-md'>
                  Connect with your support network, therapists, and recovery
                  coaches through secure messaging.
                </p>
                <Button onClick={handleStartNewChat}>
                  <Plus className='h-4 w-4 mr-2' />
                  Start a New Conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with a contact, expert, or group.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='name' className='text-right'>
                Name
              </label>
              <Input
                id='name'
                value={newConversation.name}
                onChange={(e) =>
                  setNewConversation({
                    ...newConversation,
                    name: e.target.value,
                  })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='role' className='text-right'>
                Role
              </label>
              <Input
                id='role'
                value={newConversation.role}
                onChange={(e) =>
                  setNewConversation({
                    ...newConversation,
                    role: e.target.value,
                  })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='type' className='text-right'>
                Type
              </label>
              <select
                id='type'
                value={newConversation.type}
                onChange={(e) =>
                  setNewConversation({
                    ...newConversation,
                    type: e.target.value,
                  })
                }
                className='col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='peer'>Peer</option>
                <option value='expert'>Expert</option>
                <option value='group'>Group</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowNewChatDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={createNewConversation}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
    </svg>
  );
}
