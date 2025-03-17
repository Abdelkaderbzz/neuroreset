'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import type { SupportGroup, User } from '@/types/community';
import { supabase } from '@/lib/supabase';


interface GroupDetailsDialogProps {
  group: SupportGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailsDialog({
  group,
  open,
  onOpenChange,
}: GroupDetailsDialogProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (open) {
      fetchGroupMembers();
    }
  }, [open]);

  const fetchGroupMembers = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(
          `
          user_id,
          users:user_id(*)
        `
        )
        .eq('group_id', group.id)
        .limit(10);

      if (error) throw error;

      // Format members
      const formattedMembers = data.map((item) => item.users as User);
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching group members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{group.name}</DialogTitle>
          <DialogDescription>{group.description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-muted-foreground' />
              <span>{group.meeting_times}</span>
            </div>
            <Badge variant='outline' className='w-fit'>
              <Users className='h-4 w-4 mr-1' />
              {group.members_count} members
            </Badge>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-3'>Group Members</h3>
            {isLoading ? (
              <div className='flex justify-center py-4'>
                <div className='animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full'></div>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {members.map((member) => (
                  <div key={member.id} className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={member.avatar_url} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>{member.name}</div>
                      <div className='text-xs text-muted-foreground'>
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-medium'>Upcoming Meetings</h3>
            <div className='p-4 border rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <Clock className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>Next meeting</span>
              </div>
              <p className='text-muted-foreground'>
                The next meeting is scheduled according to the group's regular
                schedule: {group.meeting_times}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
