'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

import type { User } from '@/types/community';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  content: z
    .string()
    .min(50, { message: 'Story must be at least 50 characters' }),
  milestone: z.string().min(1, { message: 'Milestone is required' }),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: any) => void;
  currentUser: User;
}

export function CreateStoryModal({
  isOpen,
  onClose,
  onStoryCreated,
  currentUser,
}: CreateStoryModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      milestone: '',
      image_url: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();

      // Create the success story
      const { error } = await supabase.from('success_stories').insert({
        title: values.title,
        content: values.content,
        milestone: values.milestone,
        image_url: values.image_url || null,
        author_id: currentUser.id,
        created_at: now,
      });

      if (error) throw error;

      // Fetch the created story with author info
      const { data: newStory, error: fetchError } = await supabase
        .from('success_stories')
        .select(
          `
          *,
          author:users(*)
        `
        )
        .single();

      if (fetchError) throw fetchError;

      toast({
        title: 'Success',
        description: 'Your story has been shared with the community',
      });

      // Format the story with author
      const formattedStory = {
        ...newStory,
        author: newStory.author as User,
      };

      onStoryCreated(formattedStory);
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: 'Error',
        description: 'Failed to share your story. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Share Your Success Story
          </DialogTitle>
          <DialogDescription>
            Inspire others by sharing your recovery journey and milestones.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Give your story a title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='milestone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., 30 Days Sober, Completed Therapy'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What achievement are you celebrating?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Story</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Share your journey, challenges, and how you overcame them...'
                      className='min-h-[200px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Add an image to your story'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a relevant image to accompany your story
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Sharing...' : 'Share Story'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
