'use client';

import React from 'react';

import { useState } from 'react';
import { useAppContext, type Goal } from '@/contexts/app-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CalendarIcon,
  Check,
  Clock,
  Edit,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';

const goalFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  targetDate: z.date({
    required_error: 'Target date is required',
  }),
  category: z.enum(
    ['sobriety', 'health', 'relationships', 'personal', 'other'],
    {
      required_error: 'Category is required',
    }
  ),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppContext();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const addForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'sobriety',
    },
  });

  const editForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: selectedGoal?.title || '',
      description: selectedGoal?.description || '',
      category: (selectedGoal?.category as any) || 'sobriety',
      targetDate: selectedGoal?.targetDate
        ? new Date(selectedGoal.targetDate)
        : new Date(),
    },
  });

  // Update edit form when selected goal changes
  React.useEffect(() => {
    if (selectedGoal) {
      editForm.reset({
        title: selectedGoal.title,
        description: selectedGoal.description,
        category: selectedGoal.category,
        targetDate: new Date(selectedGoal.targetDate),
      });
    }
  }, [selectedGoal, editForm]);

  const handleAddGoal = (values: GoalFormValues) => {
    const newGoal = {
      title: values.title,
      description: values.description,
      targetDate: values.targetDate.toISOString(),
      category: values.category,
      progress: 0,
      completed: false,
    };

    addGoal(newGoal);
    addForm.reset();
    setIsAddDialogOpen(false);

    toast({
      title: 'Goal Added',
      description: 'Your new goal has been added successfully.',
      variant: 'success',
    });
  };

  const handleEditGoal = (values: GoalFormValues) => {
    if (!selectedGoal) return;

    updateGoal(selectedGoal.id, {
      title: values.title,
      description: values.description,
      targetDate: values.targetDate.toISOString(),
      category: values.category,
    });

    setIsEditDialogOpen(false);

    toast({
      title: 'Goal Updated',
      description: 'Your goal has been updated successfully.',
      variant: 'success',
    });
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);

    toast({
      title: 'Goal Deleted',
      description: 'Your goal has been deleted.',
    });
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    updateGoal(id, { progress: newProgress });

    if (newProgress === 100) {
      updateGoal(id, { completed: true });

      toast({
        title: 'Goal Completed!',
        description: 'Congratulations on completing your goal!',
        variant: 'success',
      });
    } else {
      toast({
        description: `Progress updated to ${newProgress}%`,
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sobriety':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'health':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'relationships':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'personal':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>Recovery Goals</h1>
            <p className='text-muted-foreground'>
              Set and track meaningful goals for your recovery journey
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[550px]'>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a specific, measurable, and achievable goal for your
                  recovery journey.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form
                  onSubmit={addForm.handleSubmit(handleAddGoal)}
                  className='space-y-4'
                >
                  <FormField
                    control={addForm.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                          <Input placeholder='30 Days Sober' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your goal and why it's important to you"
                            className='resize-none'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={addForm.control}
                      name='targetDate'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Target Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='sobriety'>Sobriety</SelectItem>
                              <SelectItem value='health'>
                                Health & Wellness
                              </SelectItem>
                              <SelectItem value='relationships'>
                                Relationships
                              </SelectItem>
                              <SelectItem value='personal'>
                                Personal Growth
                              </SelectItem>
                              <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button type='submit'>Create Goal</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue='active'>
          <TabsList>
            <TabsTrigger value='active'>
              Active Goals ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value='completed'>
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='active' className='pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {activeGoals.length === 0 ? (
                <Card className='col-span-full'>
                  <CardContent className='pt-6 text-center'>
                    <div className='flex flex-col items-center justify-center py-8'>
                      <Target className='h-12 w-12 text-muted-foreground mb-4' />
                      <h3 className='text-lg font-medium mb-2'>
                        No Active Goals
                      </h3>
                      <p className='text-muted-foreground mb-4'>
                        Set goals to track your progress and stay motivated on
                        your recovery journey.
                      </p>
                      <DialogTrigger asChild>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          <Plus className='mr-2 h-4 w-4' />
                          Add Your First Goal
                        </Button>
                      </DialogTrigger>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeGoals.map((goal) => (
                  <Card key={goal.id} className='overflow-hidden'>
                    <CardHeader className='pb-3'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <Badge
                            className={cn(
                              'mb-2',
                              getCategoryColor(goal.category)
                            )}
                          >
                            {goal.category.charAt(0).toUpperCase() +
                              goal.category.slice(1)}
                          </Badge>
                          <CardTitle className='text-lg'>
                            {goal.title}
                          </CardTitle>
                        </div>
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setSelectedGoal(goal);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className='h-4 w-4 text-destructive' />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className='line-clamp-2'>
                        {goal.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Clock className='h-4 w-4 text-muted-foreground' />
                          <span>
                            Target:{' '}
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className='h-2' />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='border-t pt-4'>
                      <div className='grid grid-cols-4 gap-2 w-full'>
                        {[25, 50, 75, 100].map((progress) => (
                          <Button
                            key={progress}
                            variant='outline'
                            size='sm'
                            disabled={goal.progress >= progress}
                            onClick={() =>
                              handleUpdateProgress(goal.id, progress)
                            }
                          >
                            {progress}%
                          </Button>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value='completed' className='pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {completedGoals.length === 0 ? (
                <Card className='col-span-full'>
                  <CardContent className='pt-6 text-center'>
                    <div className='flex flex-col items-center justify-center py-8'>
                      <Check className='h-12 w-12 text-muted-foreground mb-4' />
                      <h3 className='text-lg font-medium mb-2'>
                        No Completed Goals Yet
                      </h3>
                      <p className='text-muted-foreground mb-4'>
                        As you achieve your goals, they will appear here as a
                        record of your progress.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                completedGoals.map((goal) => (
                  <Card key={goal.id} className='bg-muted/30'>
                    <CardHeader className='pb-3'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <Badge
                            className={cn(
                              'mb-2',
                              getCategoryColor(goal.category)
                            )}
                          >
                            {goal.category.charAt(0).toUpperCase() +
                              goal.category.slice(1)}
                          </Badge>
                          <CardTitle className='text-lg'>
                            {goal.title}
                          </CardTitle>
                        </div>
                        <Badge
                          variant='outline'
                          className='bg-green-600 text-white'
                        >
                          Completed
                        </Badge>
                      </div>
                      <CardDescription className='line-clamp-2'>
                        {goal.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Clock className='h-4 w-4 text-muted-foreground' />
                          <span>
                            Completed on:{' '}
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span>Progress</span>
                            <span>100%</span>
                          </div>
                          <Progress value={100} className='h-2' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Goal Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='sm:max-w-[550px]'>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>
                Update your goal details and progress.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleEditGoal)}
                className='space-y-4'
              >
                <FormField
                  control={editForm.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className='resize-none' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={editForm.control}
                    name='targetDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Target Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='sobriety'>Sobriety</SelectItem>
                            <SelectItem value='health'>
                              Health & Wellness
                            </SelectItem>
                            <SelectItem value='relationships'>
                              Relationships
                            </SelectItem>
                            <SelectItem value='personal'>
                              Personal Growth
                            </SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type='submit'>Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
