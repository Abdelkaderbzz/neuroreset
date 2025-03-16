'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import type { User, SupportGroup } from '@/types/community';
import { supabase } from '@/lib/supabase';


interface CreateGroupDialogProps {
  currentUser: User;
  onGroupCreated: (group: SupportGroup) => void;
}

export function CreateGroupDialog({
  currentUser,
  onGroupCreated,
}: CreateGroupDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meetingTimes: '',
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.meetingTimes.trim()
    ) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert group into database
      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          name: formData.name,
          description: formData.description,
          meeting_times: formData.meetingTimes,
          members_count: 1, // Creator is the first member
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as a member
      await supabase.from('group_members').insert({
        group_id: data.id,
        user_id: currentUser.id,
      });

      // Format the group for the UI
      const newGroup: SupportGroup = {
        ...data,
        joined: true,
        active_now: 1, // Just the creator for now
      };

      // Update UI
      onGroupCreated(newGroup);

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        meetingTimes: '',
      });
      setOpen(false);

      toast({
        title: 'Group created',
        description: 'Your support group has been created successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus className='h-4 w-4 mr-2' />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Support Group</DialogTitle>
            <DialogDescription>
              Create a new support group for community members with similar
              interests or needs.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Group Name</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='e.g., Mindfulness Practice'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Describe the purpose and focus of this group...'
                rows={3}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='meetingTimes'>Meeting Times</Label>
              <Input
                id='meetingTimes'
                name='meetingTimes'
                value={formData.meetingTimes}
                onChange={handleChange}
                placeholder='e.g., Mondays at 7 PM'
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
