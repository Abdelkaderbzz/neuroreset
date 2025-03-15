"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupabaseEnvSetup } from "@/components/supabase-env-setup"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Database, FileCode, ArrowRight, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState("credentials")
  const { toast } = useToast()

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description,
        action: (
          <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
        ),
      })
    })
  }

  const schemaSQL = `-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'phone', 'in-person')),
  provider TEXT NOT NULL,
  provider_title TEXT,
  notes TEXT,
  join_link TEXT,
  phone_number TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource_categories table
CREATE TABLE resource_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Article', 'Video', 'Audio', 'Worksheet', 'Book')),
  category TEXT NOT NULL REFERENCES resource_categories(id),
  author TEXT NOT NULL,
  read_time TEXT NOT NULL,
  saved BOOLEAN NOT NULL DEFAULT FALSE,
  recommended BOOLEAN NOT NULL DEFAULT FALSE,
  url TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  username TEXT,
  avatar_url TEXT,
  sober_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_contacts table
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Public can read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public can read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Public can update resources" ON resources FOR UPDATE USING (true);
CREATE POLICY "Public can read resource_categories" ON resource_categories FOR SELECT USING (true);
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can read emergency_contacts" ON emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public can insert emergency_contacts" ON emergency_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete emergency_contacts" ON emergency_contacts FOR DELETE USING (true);`

  const dataSQL = `-- Insert dummy data for resource_categories
INSERT INTO resource_categories (id, name, icon) VALUES
  ('coping', 'Coping Strategies', 'Brain'),
  ('wellness', 'Wellness & Self-Care', 'Heart'),
  ('relapse', 'Relapse Prevention', 'Shield'),
  ('relationships', 'Relationships', 'Users'),
  ('mindfulness', 'Mindfulness', 'Lightbulb'),
  ('physical', 'Physical Health', 'Dumbbell'),
  ('lifestyle', 'Lifestyle Changes', 'Home'),
  ('career', 'Career & Education', 'Briefcase');

-- Insert dummy data for appointments
INSERT INTO appointments (title, date, time, type, provider, provider_title, notes, join_link, status) VALUES
  ('Therapy Session with Dr. Sarah Johnson', '2025-03-15T15:00:00Z', '3:00 PM - 4:00 PM', 'video', 'Dr. Sarah Johnson', 'Licensed Therapist', 'We''ll be discussing coping strategies for social situations and reviewing progress from last week.', 'https://meeting.example.com/dr-johnson', 'upcoming'),
  ('Group Support Session', '2025-03-18T18:00:00Z', '6:00 PM - 7:30 PM', 'video', 'Recovery Support Group', 'Weekly Group Session', 'This week''s topic: Building a support network outside of treatment.', 'https://meeting.example.com/support-group', 'upcoming'),
  ('Check-in with Recovery Coach', '2025-03-22T11:00:00Z', '11:00 AM - 11:30 AM', 'phone', 'James Wilson', 'Recovery Coach', 'Quick check-in to discuss weekly goals and any challenges.', NULL, 'upcoming'),
  ('Therapy Session with Dr. Sarah Johnson', '2025-03-25T15:00:00Z', '3:00 PM - 4:00 PM', 'video', 'Dr. Sarah Johnson', 'Licensed Therapist', 'Follow-up session to discuss progress and adjust treatment plan as needed.', 'https://meeting.example.com/dr-johnson', 'upcoming'),
  ('In-person Support Group', '2025-03-29T10:00:00Z', '10:00 AM - 11:30 AM', 'in-person', 'Community Center', 'Weekend Support Group', 'Bring your journal. This week''s focus is on celebrating small victories.', NULL, 'upcoming');

UPDATE appointments SET phone_number = '+1 (555) 123-4567' WHERE type = 'phone';
UPDATE appointments SET location = '123 Recovery St, City' WHERE type = 'in-person';

-- Insert dummy data for resources
INSERT INTO resources (title, description, type, category, author, read_time, saved, recommended, url, content) VALUES
  ('Understanding Triggers and Cravings', 'Learn to identify and manage triggers that lead to cravings.', 'Article', 'coping', 'Dr. Sarah Johnson', '10 min read', FALSE, FALSE, '#', 'This comprehensive article explores the science behind addiction triggers and cravings, and provides practical strategies for managing them effectively.'),
  ('Guided Meditation for Cravings', 'A 15-minute meditation specifically designed to help during intense cravings.', 'Audio', 'mindfulness', 'Lisa Rodriguez, LCSW', '15 min', TRUE, FALSE, '#', 'This guided meditation helps you navigate through intense cravings by focusing on breath work and mindfulness techniques.'),
  ('Building a Support Network', 'How to create and maintain a strong support system during recovery.', 'Video', 'relationships', 'James Wilson', '22 min', FALSE, TRUE, '#', 'This video workshop guides you through the process of identifying potential support people and how to effectively communicate your needs.'),
  ('Daily Wellness Tracker', 'A printable worksheet to track your daily wellness activities.', 'Worksheet', 'wellness', 'Recovery Tools', 'Interactive', FALSE, FALSE, '#', 'This printable worksheet helps you track your daily wellness activities, including sleep, nutrition, exercise, and mood.'),
  ('The Science of Recovery', 'Understanding how your brain heals during the recovery process.', 'Article', 'physical', 'Dr. Michael Chen', '15 min read', FALSE, TRUE, '#', 'This article explains the neurological processes that occur during recovery, and how understanding these changes can provide hope and motivation.'),
  ('Relapse Prevention Plan', 'Create a personalized plan to prevent and manage potential relapses.', 'Worksheet', 'relapse', 'Recovery Tools', 'Interactive', TRUE, FALSE, '#', 'This interactive worksheet guides you through creating a comprehensive relapse prevention plan tailored to your specific triggers and needs.'),
  ('Healthy Sleep Habits', 'Strategies for improving sleep quality during recovery.', 'Video', 'wellness', 'Dr. Emily Taylor', '18 min', FALSE, TRUE, '#', 'This video presentation covers the importance of sleep in recovery and provides practical tips for improving sleep quality.'),
  ('Recovery and Relationships', 'How to navigate changing relationships during your recovery journey.', 'Book', 'relationships', 'Robert Johnson, PhD', '240 pages', FALSE, FALSE, '#', 'This book excerpt discusses how relationships change during recovery and provides guidance on rebuilding trust and setting healthy boundaries.');

-- Insert dummy data for profiles
INSERT INTO profiles (name, email, phone, username, sober_days) VALUES
  ('Alex Johnson', 'alex@example.com', '555-123-4567', 'alexj', 7);

-- Insert dummy data for emergency_contacts
INSERT INTO emergency_contacts (name, relationship, phone, email) VALUES
  ('James Wilson', 'Sponsor', '555-987-6543', 'james@example.com'),
  ('Dr. Sarah Johnson', 'Therapist', '555-123-4567', 'dr.johnson@example.com');`

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">NeuroReset Supabase Setup</h1>
        <p className="text-muted-foreground">Follow these steps to set up Supabase for your NeuroReset application</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="credentials">1. Credentials</TabsTrigger>
          <TabsTrigger value="schema">2. Database Schema</TabsTrigger>
          <TabsTrigger value="data">3. Sample Data</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="mt-6">
          <SupabaseEnvSetup />

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setActiveTab("schema")}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Create Database Schema
              </CardTitle>
              <CardDescription>
                Run the following SQL in your Supabase SQL Editor to create the necessary tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copyToClipboard(schemaSQL, "Schema SQL copied to clipboard")}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <pre className="text-sm">{schemaSQL}</pre>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">How to run this SQL</h3>
                <ol className="text-sm text-muted-foreground space-y-3 ml-4 list-decimal">
                  <li>
                    <div className="font-medium text-foreground">Go to the SQL Editor</div>
                    <p>Navigate to the SQL Editor in your Supabase dashboard</p>
                  </li>
                  <li>
                    <div className="font-medium text-foreground">Create a new query</div>
                    <p>Click "New Query" and paste the SQL code above</p>
                  </li>
                  <li>
                    <div className="font-medium text-foreground">Run the query</div>
                    <p>Click "Run" to execute the SQL and create the tables</p>
                  </li>
                </ol>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <a
                      href="https://supabase.com/dashboard/project/_/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Open SQL Editor
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("credentials")}>
                Previous Step
              </Button>
              <Button onClick={() => setActiveTab("data")}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Insert Sample Data
              </CardTitle>
              <CardDescription>
                Run the following SQL in your Supabase SQL Editor to populate the tables with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copyToClipboard(dataSQL, "Sample data SQL copied to clipboard")}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <pre className="text-sm">{dataSQL}</pre>
              </div>

              <div className="mt-6">
                <div className="flex items-start gap-2 p-4 border rounded-md bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Important Note</h4>
                    <p className="text-sm mt-1">
                      For a production application, you should implement proper authentication and authorization. The
                      current setup uses public policies for demonstration purposes only.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Troubleshooting</h3>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">If you encounter errors:</div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Make sure you've run the schema SQL first before the data SQL</li>
                      <li>Check for any error messages in the SQL Editor</li>
                      <li>Verify that all tables were created successfully</li>
                      <li>
                        If you see foreign key errors, ensure the resource_categories table was created and populated
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("schema")}>
                Previous Step
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Need help? Check out the{" "}
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Supabase documentation
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/supabase/supabase"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  )
}

