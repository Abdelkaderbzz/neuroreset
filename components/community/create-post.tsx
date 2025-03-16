'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X } from 'lucide-react';
import type { User, Post } from '@/types/community';
import { supabase } from '@/lib/supabase';


interface CreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      // Insert post into database
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: currentUser.id,
          content: content,
          tags: tags,
        })
        .select()
        .single();

      if (error) throw error;

      // Get the created post with author details
      const { data: postWithAuthor, error: fetchError } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:users(*)
        `
        )
        .eq('id', data.id)
        .single();

      if (fetchError) throw fetchError;

      // Format the post for the UI
      const newPost: Post = {
        ...postWithAuthor,
        author: postWithAuthor.author as User,
        liked: false,
      };

      // Update UI
      onPostCreated(newPost);

      // Reset form
      setContent('');
      setTags([]);
      setShowTagInput(false);
      setTagInput('');

      toast({
        title: 'Post created',
        description: 'Your post has been shared with the community.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    // Convert to title case and remove spaces
    const formattedTag = tagInput
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    // Check if tag already exists
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }

    setTagInput('');

    // Focus back on input for easy addition of multiple tags
    setTimeout(() => {
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }, 0);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const toggleTagInput = () => {
    setShowTagInput(!showTagInput);
    if (!showTagInput) {
      // Focus on the input when it appears
      setTimeout(() => {
        if (tagInputRef.current) {
          tagInputRef.current.focus();
        }
      }, 0);
    }
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex gap-3'>
          <Avatar>
            <AvatarImage src={currentUser.avatar_url} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <textarea
              className='w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Share something with the community...'
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {/* Tags display */}
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant='secondary'
                    className='text-xs flex items-center gap-1'
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className='hover:text-destructive focus:outline-none'
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Tag input */}
            {showTagInput && (
              <div className='mt-3'>
                <div className='flex gap-2'>
                  <Input
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Add a tag (press Enter)'
                    className='flex-1'
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            <div className='flex justify-between items-center mt-3'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={toggleTagInput}
                  className={showTagInput ? 'bg-muted' : ''}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Tag
                </Button>
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
