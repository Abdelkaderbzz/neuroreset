'use client';

import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Brain,
  Heart,
  Shield,
  Users,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Floating Navigation */}
      <nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out',
          scrolled
            ? 'bg-white/80 py-2 shadow-md backdrop-blur-md'
            : 'bg-transparent py-4'
        )}
      >
        <div className='container mx-auto flex items-center justify-between px-4'>
          <div className='flex items-center'>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='flex items-center'
            >
              <Image
                src='/images/favicon.png'
                alt='NeuroReset Logo'
                width={40}
                height={40}
                className='rounded-xl'
              />
              <span
                className={cn(
                  'ml-2 text-xl font-bold transition-colors duration-300',
                  scrolled ? 'text-purple-700' : 'text-white'
                )}
              >
                NeuroReset
              </span>
            </motion.div>
          </div>
          <div className='hidden space-x-6 md:flex'>
            {['Home', 'About', 'Features', 'Contact'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Link
                  href='#'
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-purple-500',
                    scrolled ? 'text-gray-700' : 'text-white'
                  )}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button className='rounded-full bg-white/20 px-4 text-white backdrop-blur-md hover:bg-white/30'>
              Sign In
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className='relative min-h-screen overflow-hidden'>
        {/* Background with gradient and animated particles */}
        <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-95'></div>

        <AnimatedParticles />

        <div className='container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-16'>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='mb-8 flex items-center justify-center'
          >
            <div className='rounded-2xl bg-white/10 p-3 backdrop-blur-sm'>
              <Image
                src='/images/favicon.png'
                alt='NeuroReset Logo'
                width={100}
                height={100}
                className='rounded-xl'
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='mb-6 text-center text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl'
          >
            Begin Your{' '}
            <span className='bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>
              Recovery Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className='mb-10 max-w-2xl text-center text-xl text-white/90 md:text-2xl'
          >
            NeuroReset provides personalized support, community connection, and
            expert guidance on your path to recovery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className='flex flex-col gap-4 sm:flex-row'
          >
            <Button
              asChild
              size='lg'
              className='group relative overflow-hidden rounded-full bg-white px-8 text-purple-700 hover:bg-white/90'
            >
              <Link href='/login'>
                <span className='relative z-10 flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1'>
                  Get Started{' '}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1' />
                </span>
                <span className='absolute bottom-0 left-0 right-0 top-0 scale-x-0 transform rounded-full bg-gradient-to-r from-purple-100 to-blue-100 opacity-70 transition-transform duration-300 group-hover:scale-x-100'></span>
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20'
            >
              <Link href='/about'>Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className='absolute bottom-10 left-0 right-0 flex justify-center'
          >
            <Button
              variant='ghost'
              size='icon'
              className='animate-bounce rounded-full text-white'
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth',
                });
              }}
            >
              <ArrowDown />
              <span className='sr-only'>Scroll Down</span>
            </Button>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className='absolute bottom-0 left-0 right-0'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 120'
            fill='white'
          >
            <path d='M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z'></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <Section>
        <div className='container mx-auto px-4'>
          <SectionHeader
            badge='Our Approach'
            title='Your Recovery, Your Way'
            badgeColor='purple'
          />

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <AnimatedFeatureCard
              icon={<Brain className='h-10 w-10 text-purple-600' />}
              title='Personalized Plan'
              description='AI-powered recovery plans tailored to your specific needs and goals.'
              delay={0}
            />
            <AnimatedFeatureCard
              icon={<Users className='h-10 w-10 text-purple-600' />}
              title='Community Support'
              description='Connect with peers who understand your journey and share experiences.'
              delay={0.1}
            />
            <AnimatedFeatureCard
              icon={<Shield className='h-10 w-10 text-purple-600' />}
              title='Expert Guidance'
              description='Access to certified addiction recovery specialists and therapists.'
              delay={0.2}
            />
            <AnimatedFeatureCard
              icon={<Heart className='h-10 w-10 text-purple-600' />}
              title='Progress Tracking'
              description='Visualize your recovery journey with motivating progress metrics.'
              delay={0.3}
            />
          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section className='bg-gray-50'>
        <div className='container mx-auto px-4'>
          <SectionHeader
            badge='The Process'
            title='How NeuroReset Works'
            badgeColor='blue'
          />

          <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
            <AnimatedStep
              number='1'
              title='Assessment'
              description='Complete our AI-powered assessment to create your personalized recovery plan.'
              delay={0}
            />
            <AnimatedStep
              number='2'
              title='Connect'
              description='Join our supportive community and connect with therapists who understand your journey.'
              delay={0.2}
            />
            <AnimatedStep
              number='3'
              title='Grow'
              description='Track your progress, celebrate milestones, and build healthy habits for lasting recovery.'
              delay={0.4}
            />
          </div>
        </div>
      </Section>

      {/* App Features Showcase Section */}
      <Section>
        <div className='container mx-auto px-4'>
          <SectionHeader
            badge='App Features'
            title='Tools Designed For Your Recovery'
            badgeColor='purple'
          />

          <AppFeatureShowcase
            title='Personalized Recovery Plan'
            description='Track your progress through a customized 12-week recovery program with daily tasks, milestones, and achievement tracking.'
            imageSrc='/images/rec-plan.png'
            imageAlt='Recovery Plan Screenshot'
            reverse={false}
          />

          <AppFeatureShowcase
            title='Community Support Groups'
            description='Connect with peers in specialized support groups focused on different aspects of recovery, from mindfulness to family support.'
            imageSrc='/images/community.png'
            imageAlt='Community Support Screenshot'
            reverse={true}
          />

          <AppFeatureShowcase
            title='Daily Progress Dashboard'
            description='Stay motivated with your personalized dashboard showing your current streak, daily tasks, and upcoming therapy sessions.'
            imageSrc='/images/dashbaord.png'
            imageAlt='Dashboard Screenshot'
            reverse={false}
          />

          <AppFeatureShowcase
            title='Recovery Resources Library'
            description='Access a comprehensive library of educational materials, worksheets, videos, and tools to support your recovery journey.'
            imageSrc='/images/resources.png'
            imageAlt='Resources Screenshot'
            reverse={true}
          />

          <AppFeatureShowcase
            title='Secure Messaging'
            description='Communicate privately with therapists, recovery coaches, and support groups through our secure messaging platform.'
            imageSrc='/images/messages.png'
            imageAlt='Messaging Screenshot'
            reverse={false}
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500'></div>
        <AnimatedParticles />

        <div className='container relative mx-auto px-4 text-center'>
          <div className='mx-auto max-w-3xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
                Ready to Take the First Step?
              </h2>
              <p className='mb-10 text-xl text-white/90'>
                Join thousands who have transformed their lives with
                NeuroReset's supportive recovery platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className='flex flex-col items-center justify-center gap-4 sm:flex-row'
            >
              <Button
                asChild
                size='lg'
                className='group relative overflow-hidden rounded-full bg-white px-8 text-purple-700 hover:bg-white/90'
              >
                <Link href='/signup'>
                  <span className='relative z-10 flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1'>
                    Start Your Journey{' '}
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1' />
                  </span>
                  <span className='absolute bottom-0 left-0 right-0 top-0 scale-x-0 transform rounded-full bg-gradient-to-r from-purple-100 to-blue-100 opacity-70 transition-transform duration-300 group-hover:scale-x-100'></span>
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20'
              >
                <Link href='/contact'>Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className='bg-gray-900 py-16 text-gray-300'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className='mb-12 flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between'
          >
            <div className='mb-6 flex items-center sm:mb-0'>
              <div className='mr-3 rounded-xl bg-white/10 p-2'>
                <Image
                  src='/images/favicon.png'
                  alt='NeuroReset Logo'
                  width={40}
                  height={40}
                  className='rounded-lg'
                />
              </div>
              <span className='text-xl font-bold text-white'>NeuroReset</span>
            </div>
            <div className='flex space-x-6'>
              {[
                {
                  icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
                },
                {
                  icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
                },
                {
                  icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href='#'
                  className='text-gray-400 transition-colors hover:text-white'
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  whileHover={{ scale: 1.1 }}
                >
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d={social.icon}
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className='max-w-xs'>
                Empowering recovery through technology, community, and
                personalized support.
              </p>
            </motion.div>

            {[
              {
                title: 'Resources',
                links: [
                  { name: 'Articles', href: '/resources' },
                  { name: 'Videos', href: '/resources/videos' },
                  { name: 'FAQ', href: '/faq' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Careers', href: '/careers' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                ],
              },
            ].map((column, i) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 * i }}
              >
                <h4 className='mb-4 text-lg font-semibold text-white'>
                  {column.title}
                </h4>
                <ul className='space-y-3'>
                  {column.links.map((link, j) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * j + 0.2 * i }}
                    >
                      <Link
                        href={link.href}
                        className='transition-colors hover:text-white'
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className='mt-12 border-t border-gray-800 pt-8 text-center'
          >
            <p>
              &copy; {new Date().getFullYear()} NeuroReset. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Animated Components
function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn('py-20', className)}>{children}</section>;
}

function SectionHeader({
  badge,
  title,
  badgeColor = 'purple',
}: {
  badge: string;
  title: string;
  badgeColor?: 'purple' | 'blue';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className='mb-16 text-center'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'mb-3 inline-block rounded-full px-4 py-1 text-sm font-medium',
          badgeColor === 'purple'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        )}
      >
        {badge}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className='text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='mx-auto mt-4 h-1 w-20 rounded bg-gradient-to-r from-purple-600 to-blue-500'
      ></motion.div>
    </div>
  );
}

function AnimatedFeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.95 }
      }
      transition={{ duration: 0.5, delay: delay }}
      className='group'
    >
      <Card className='h-full overflow-hidden border-0 transition-all duration-300 hover:shadow-lg'>
        <CardHeader className='pb-2'>
          <div className='mb-4 transform transition-transform duration-300 group-hover:scale-110'>
            {icon}
          </div>
          <CardTitle className='text-xl'>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className='text-base'>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnimatedStep({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay }}
      className='flex flex-col items-center text-center'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: delay + 0.2,
        }}
        className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white'
      >
        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-purple-600'>
          {number}
        </div>
      </motion.div>
      <h3 className='mb-3 text-xl font-bold'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </motion.div>
  );
}

function AppFeatureShowcase({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={cn(
        'my-16 grid items-center gap-8 md:grid-cols-2 md:gap-12',
        reverse && 'md:grid-flow-dense'
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: reverse ? 30 : -30 }
        }
        transition={{ duration: 0.7, delay: 0.2 }}
        className={cn(reverse && 'md:col-start-2')}
      >
        <h3 className='mb-4 text-2xl font-bold text-gray-900'>{title}</h3>
        <p className='text-lg text-gray-600'>{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: reverse ? -30 : 30 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1, x: 0 }
            : { opacity: 0, scale: 0.9, x: reverse ? -30 : 30 }
        }
        transition={{ duration: 0.7, delay: 0.4 }}
        className={cn(
          'relative mx-auto max-w-md overflow-hidden rounded-xl shadow-xl',
          reverse && 'md:col-start-1'
        )}
      >
        <div className='absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 opacity-50 blur-sm'></div>
        <div className='relative overflow-hidden rounded-xl bg-white'>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={400}
            className='w-full'
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedParticles() {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className='absolute inset-0 overflow-hidden'>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className='absolute rounded-full bg-white'
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: ['0%', '100%'],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            y: {
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
            opacity: {
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
          }}
        />
      ))}
    </div>
  );
}
