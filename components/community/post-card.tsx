'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Post, User, Comment } from '@/types/community';
import { formatTimeAgo } from '@/utils/date-utils';
import { supabase } from '@/lib/supabase';


interface PostCardProps {
  post: Post;
  currentUser: User;
  onPostUpdate: (updatedPost: Post) => void;
}

export function PostCard({ post, currentUser, onPostUpdate }: PostCardProps) {
  const { toast } = useToast();
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);


  // Fetch comments when showComments is toggled to true
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    if (post.comments_count === 0) return;

    setIsLoadingComments(true);

    try {
      // Fetch comments with author information
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          author:users(*)
        `
        )
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format comments with author
      const formattedComments = data.map((comment) => ({
        ...comment,
        author: comment.author as User,
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLikePost = async () => {
    try {
      if (post.liked) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .match({ post_id: post.id, user_id: currentUser.id });

        // Update post in UI
        onPostUpdate({
          ...post,
          likes_count: post.likes_count - 1,
          liked: false,
        });
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert({ post_id: post.id, user_id: currentUser.id });

        // Update post in UI
        onPostUpdate({
          ...post,
          likes_count: post.likes_count + 1,
          liked: true,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      // Insert comment into database
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          author_id: currentUser.id,
          content: commentText,
        })
        .select(
          `
          *,
          author:users(*)
        `
        )
        .single();

      if (error) throw error;

      // Update post comments count
      await supabase
        .from('posts')
        .update({ comments_count: post.comments_count + 1 })
        .eq('id', post.id);

      // Update post in UI
      onPostUpdate({
        ...post,
        comments_count: post.comments_count + 1,
      });

      // Add the new comment to the comments list
      const newComment: Comment = {
        ...data,
        author: data.author as User,
      };

      setComments([newComment, ...comments]);
      setIsPostingComment(false);
      setCommentText('');

      // Make sure comments are visible after posting
      setShowComments(true);

      toast({
        title: 'Comment posted',
        description: 'Your comment has been added to the discussion.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className='bg-card rounded-lg border shadow-sm overflow-hidden'>
      <div className='p-6'>
        <div className='flex gap-3'>
          <Avatar>
            <AvatarImage
              src={post.author?.avatar_url}
              alt={post.author?.name}
            />
            <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>{post.author?.name}</div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>{post.author?.role}</span>
                  {post.author?.badge && (
                    <Badge variant='outline' className='text-xs'>
                      {post.author.badge}
                    </Badge>
                  )}
                  <span>•</span>
                  <span>{formatTimeAgo(post.created_at)}</span>
                </div>
              </div>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>

            <div className='mt-3 whitespace-pre-line'>{post.content}</div>

            {post.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className='flex items-center justify-between mt-4 pt-4 border-t'>
              <div className='flex items-center gap-6'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={`flex items-center gap-1 ${
                    post.liked ? 'text-red-500' : ''
                  }`}
                  onClick={handleLikePost}
                >
                  <Heart
                    className='h-4 w-4'
                    fill={post.liked ? 'currentColor' : 'none'}
                  />
                  <span>{post.likes_count}</span>
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-1'
                  onClick={() => setIsPostingComment(true)}
                >
                  <MessageCircle className='h-4 w-4' />
                  <span>{post.comments_count}</span>
                </Button>
              </div>

              {post.comments_count > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={toggleComments}
                  className='flex items-center gap-1'
                >
                  {showComments ? (
                    <>
                      <ChevronUp className='h-4 w-4' />
                      <span>Hide comments</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className='h-4 w-4' />
                      <span>Show comments</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Comments section */}
            {showComments && (
              <div className='mt-4 pt-4 border-t space-y-4'>
                {isLoadingComments ? (
                  <div className='flex justify-center py-4'>
                    <div className='animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full'></div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className='space-y-4'>
                    {comments.map((comment) => (
                      <div key={comment.id} className='flex gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={comment.author?.avatar_url}
                            alt={comment.author?.name}
                          />
                          <AvatarFallback>
                            {comment.author?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='bg-muted p-3 rounded-lg'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-sm'>
                                {comment.author?.name}
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <div className='mt-1 text-sm'>
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4 text-muted-foreground'>
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            )}

            {/* Comment form */}
            {isPostingComment && (
              <div className='mt-4 pt-4 border-t'>
                <div className='flex gap-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={currentUser.avatar_url}
                      alt={currentUser.name}
                    />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <Input
                      placeholder='Write a comment...'
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className='flex justify-end gap-2 mt-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setIsPostingComment(false);
                          setCommentText('');
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || isSubmitting}
                      >
                        {isSubmitting ? 'Posting...' : 'Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
