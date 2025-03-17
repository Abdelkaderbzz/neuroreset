'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  Award, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SuccessStory, User } from '@/types/community';
import { StoryDetailModal } from './story-detail-modal';

interface SuccessStoryCardProps {
  story: SuccessStory;
  currentUser?: User;
  onStoryUpdate?: (story: SuccessStory) => void;
}

export function SuccessStoryCard({
  story,
  currentUser,
  onStoryUpdate,
}: SuccessStoryCardProps) {
  const router = useRouter();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);



  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };



  return (
    <>
      <Card
        className='overflow-hidden cursor-pointer hover:shadow-md transition-shadow'
        onClick={() => setIsDetailModalOpen(true)}
      >
        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage
                    src={story?.author?.avatar_url}
                    alt={story?.author?.name}
                  />
                  <AvatarFallback>{story?.author?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{story?.author?.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {story.created_at && formatDate(story.created_at)}
                  </p>
                </div>
              </div>
              <Badge className='flex items-center gap-1'>
                <Award className='h-3 w-3' />
                {story?.milestone}
              </Badge>
            </div>

            <h3 className='font-semibold text-lg'>{story.title}</h3>

            <p className='text-sm text-muted-foreground line-clamp-3'>
              {story.content}
            </p>
          </div>
        </CardContent>
        <CardFooter className='p-4 pt-0 flex justify-between'>
          
        </CardFooter>
      </Card>

      {currentUser && (
        <StoryDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          story={story}
          currentUser={currentUser}
          onStoryUpdate={onStoryUpdate}
        />
      )}
    </>
  );
}
