'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ArrowRight,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  Phone,
  Shield,
  SpeakerIcon as SpeakerWave,
} from 'lucide-react';

export function CrisisSupport() {
  const [showCallDialog, setShowCallDialog] = useState(false);

  return (
    <Card>
      <CardHeader className='bg-red-50 dark:bg-red-900/20 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
          <CardTitle>Emergency Support</CardTitle>
        </div>
        <CardDescription>
          Immediate help and resources for crisis situations
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-6'>
        <Tabs defaultValue='immediate'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='immediate'>Immediate Help</TabsTrigger>
            <TabsTrigger value='resources'>Resources</TabsTrigger>
            <TabsTrigger value='contacts'>My Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value='immediate' className='space-y-4 pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogDescription>
                      You're about to be connected to a trained crisis
                      counselor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='py-4'>
                    <div className='flex items-center justify-center gap-4 mb-6'>
                      <div className='h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center'>
                        <Phone className='h-8 w-8 text-red-600 dark:text-red-400' />
                      </div>
                      <div>
                        <h3 className='text-xl font-bold'>1-800-273-8255</h3>
                        <p className='text-sm text-muted-foreground'>
                          National Crisis Helpline
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2 text-sm'>
                      <p>• Available 24/7, free and confidential</p>
                      <p>• Trained counselors ready to listen</p>
                      <p>• No judgment, just support</p>
                    </div>
                  </div>
                  <DialogFooter className='flex flex-col sm:flex-row gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setShowCallDialog(false)}
                      className='sm:flex-1'
                    >
                      Cancel
                    </Button>
                    <Button className='bg-red-600 hover:bg-red-700 sm:flex-1'>
                      Call Now
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className='p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200'>
              <div className='flex gap-3'>
                <Shield className='h-5 w-5 shrink-0 mt-0.5' />
                <div>
                  <h4 className='font-medium'>When to seek immediate help:</h4>
                  <ul className='list-disc pl-5 mt-2 space-y-1 text-sm'>
                    <li>Thoughts of harming yourself or others</li>
                    <li>Severe withdrawal symptoms</li>
                    <li>Feeling overwhelmed by cravings</li>
                    <li>Panic attacks or extreme anxiety</li>
                    <li>Feeling unsafe in your environment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='border rounded-md overflow-hidden'>
              <div className='bg-muted p-3 font-medium'>
                Quick Coping Strategies
              </div>
              <div className='p-3 space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0'>
                    <SpeakerWave className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h5 className='font-medium'>Deep Breathing Exercise</h5>
                    <p className='text-sm text-muted-foreground'>
                      Breathe in for 4 counts, hold for 4, exhale for 6. Repeat
                      5 times.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className='flex items-start gap-3'>
                  <div className='h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0'>
                    <Clock className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <h5 className='font-medium'>5-4-3-2-1 Grounding</h5>
                    <p className='text-sm text-muted-foreground'>
                      Name 5 things you see, 4 you feel, 3 you hear, 2 you
                      smell, 1 you taste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='resources' className='pt-4'>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className='bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-none'
                    >
                      Guide
                    </Badge>
                    <span>Managing Intense Cravings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p className='text-sm'>
                    Cravings are temporary and typically peak after 15-30
                    minutes before subsiding. Here are strategies to help you
                    through them:
                  </p>
                  <ul className='list-disc pl-5 text-sm space-y-1'>
                    <li>
                      Delay: Tell yourself you'll wait 15 minutes before acting
                      on the craving
                    </li>
                    <li>Distract: Engage in an activity that requires focus</li>
                    <li>Drink water: Hydration can help reduce cravings</li>
                    <li>
                      Deep breathing: Slow, deliberate breaths to calm your
                      nervous system
                    </li>
                    <li>
                      Distance: Remove yourself from triggering environments
                    </li>
                  </ul>
                  <Button variant='outline' size='sm' className='mt-2'>
                    <ExternalLink className='h-3 w-3 mr-2' />
                    Read Full Guide
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='item-2'>
                <AccordionTrigger>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-none'
                    >
                      Audio
                    </Badge>
                    <span>Guided Meditation for Anxiety</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='bg-muted p-3 rounded-md'>
                    <audio controls className='w-full'>
                      <source src='#' type='audio/mpeg' />
                      Your browser does not support the audio element.
                    </audio>
                    <p className='text-xs text-muted-foreground mt-2'>
                      10-minute guided meditation specifically designed for
                      addiction recovery
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='item-3'>
                <AccordionTrigger>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className='bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-none'
                    >
                      Article
                    </Badge>
                    <span>Understanding Withdrawal Symptoms</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className='text-sm mb-2'>
                    Learn about common withdrawal symptoms, when they're
                    dangerous, and how to manage them safely.
                  </p>
                  <Button variant='outline' size='sm'>
                    <ArrowRight className='h-3 w-3 mr-2' />
                    Read Article
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value='contacts' className='pt-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium'>Emergency Contacts</h3>
                <Button variant='outline' size='sm'>
                  Edit Contacts
                </Button>
              </div>

              <div className='space-y-3'>
                <div className='p-3 border rounded-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>Dr. Sarah Johnson</h4>
                      <p className='text-sm text-muted-foreground'>
                        Recovery Specialist
                      </p>
                    </div>
                    <Button size='sm'>
                      <Phone className='h-4 w-4 mr-2' />
                      Call
                    </Button>
                  </div>
                </div>

                <div className='p-3 border rounded-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>James Wilson</h4>
                      <p className='text-sm text-muted-foreground'>Sponsor</p>
                    </div>
                    <Button size='sm'>
                      <Phone className='h-4 w-4 mr-2' />
                      Call
                    </Button>
                  </div>
                </div>

                <div className='p-3 border rounded-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>Local Support Group</h4>
                      <p className='text-sm text-muted-foreground'>
                        24/7 Hotline
                      </p>
                    </div>
                    <Button size='sm'>
                      <Phone className='h-4 w-4 mr-2' />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='border-t pt-4'>
        <div className='flex items-center gap-2 w-full justify-center text-sm text-muted-foreground'>
          <HelpCircle className='h-4 w-4' />
          <span>Need more help? Contact your recovery specialist</span>
        </div>
      </CardFooter>
    </Card>
  );
}
