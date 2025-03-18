'use client';

import { Share2, Award } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


import type { SuccessStory, User } from '@/types/community';

interface StoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: SuccessStory;
  currentUser: User;
  onStoryUpdate?: (story: SuccessStory) => void;
}

export function StoryDetailModal({
  isOpen,
  onClose,
  story,
}: StoryDetailModalProps) {

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>{story.title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage
                  src={story?.author?.avatar_url}
                  alt={story?.author?.name}
                />
                <AvatarFallback>{story?.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{story?.author?.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {story.created_at && formatDate(story.created_at)}
                </p>
              </div>
            </div>
            <Badge className='flex items-center gap-1'>
              <Award className='h-3 w-3 mr-1' />
              {story.milestone}
            </Badge>
          </div>

          {story?.image_url && (
            <div className='relative w-full h-[300px] rounded-md overflow-hidden'>
              <Image
                src={story?.image_url || '/placeholder.svg'}
                alt={story.title}
                fill
                className='object-cover'
              />
            </div>
          )}

          <div className='prose prose-sm max-w-none'>
            {story.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <Button variant='ghost' size='sm'>
              <Share2 className='h-4 w-4 mr-2' />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
