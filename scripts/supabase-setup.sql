-- Create appointments table
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

-- Insert dummy data for resource_categories
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
  ('Understanding Triggers and Cravings', 'Learn to identify and manage triggers that lead to cravings.', 'Article', 'coping', 'Dr. Sarah Johnson', '10 min read', FALSE, FALSE, '#', 'This comprehensive article explores the science behind addiction triggers and cravings, and provides practical strategies for managing them effectively. The content includes:

- The neurological basis of cravings
- Common external and internal triggers
- HALT: Hungry, Angry, Lonely, Tired
- Creating a personalized trigger management plan
- Immediate coping strategies for intense cravings
- Long-term strategies for reducing trigger sensitivity

Understanding your personal triggers is a crucial step in recovery. By identifying situations, emotions, people, or places that trigger cravings, you can develop strategies to either avoid these triggers or cope with them effectively.'),
  
  ('Guided Meditation for Cravings', 'A 15-minute meditation specifically designed to help during intense cravings.', 'Audio', 'mindfulness', 'Lisa Rodriguez, LCSW', '15 min', TRUE, FALSE, '#', 'This guided meditation helps you navigate through intense cravings by focusing on breath work and mindfulness techniques. The meditation guides you through:

- Grounding techniques to stay present
- Breath awareness to calm the nervous system
- Body scan to release physical tension
- Visualization for craving reduction
- Self-compassion practice

This meditation can be used whenever you experience cravings or as a daily practice to build resilience.'),
  
  ('Building a Support Network', 'How to create and maintain a strong support system during recovery.', 'Video', 'relationships', 'James Wilson', '22 min', FALSE, TRUE, '#', 'This video workshop guides you through the process of identifying potential support people and how to effectively communicate your needs. Topics covered include:

- Types of support needed in recovery
- Identifying supportive vs. triggering relationships
- How to ask for specific types of support
- Setting boundaries with family and friends
- Building new, healthy relationships
- Utilizing professional support resources

A strong support network is one of the most important factors in successful long-term recovery.'),
  
  ('Daily Wellness Tracker', 'A printable worksheet to track your daily wellness activities.', 'Worksheet', 'wellness', 'Recovery Tools', 'Interactive', FALSE, FALSE, '#', 'This printable worksheet helps you track your daily wellness activities, including sleep, nutrition, exercise, and mood. Regular tracking can help you:

- Identify patterns in your well-being
- Recognize early warning signs of potential relapse
- Celebrate progress and small victories
- Stay accountable to your recovery plan
- Share concrete information with your healthcare providers

The worksheet includes sections for morning, afternoon, and evening check-ins, as well as a reflection space for the end of the day.'),
  
  ('The Science of Recovery', 'Understanding how your brain heals during the recovery process.', 'Article', 'physical', 'Dr. Michael Chen', '15 min read', FALSE, TRUE, '#', 'This article explains the neurological processes that occur during recovery, and how understanding these changes can provide hope and motivation. Key topics include:

- How substance use alters brain chemistry
- The timeline of brain healing in recovery
- Neuroplasticity and forming new neural pathways
- The role of dopamine in addiction and recovery
- How lifestyle changes support brain healing
- The science behind cravings and how they diminish over time

Understanding the science behind recovery can help reduce shame and increase motivation by recognizing that addiction is a brain disease that can heal with time and proper support.'),
  
  ('Relapse Prevention Plan', 'Create a personalized plan to prevent and manage potential relapses.', 'Worksheet', 'relapse', 'Recovery Tools', 'Interactive', TRUE, FALSE, '#', 'This interactive worksheet guides you through creating a comprehensive relapse prevention plan tailored to your specific triggers and needs. The plan includes:

- Personal warning signs and high-risk situations
- Healthy coping strategies for different scenarios
- Contact information for your support network
- Step-by-step action plan for moments of crisis
- Daily practices to maintain recovery
- What to do if a slip or relapse occurs

Having a written plan in place before challenges arise can significantly improve your ability to maintain long-term recovery.'),
  
  ('Healthy Sleep Habits', 'Strategies for improving sleep quality during recovery.', 'Video', 'wellness', 'Dr. Emily Taylor', '18 min', FALSE, TRUE, '#', 'This video presentation covers the importance of sleep in recovery and provides practical tips for improving sleep quality. Topics include:

- How substance use disrupts sleep patterns
- The role of quality sleep in reducing cravings
- Creating an effective bedtime routine
- Environmental factors that affect sleep
- Managing sleep anxiety
- When to seek professional help for sleep issues

Quality sleep is a crucial but often overlooked component of successful recovery.'),
  
  ('Recovery and Relationships', 'How to navigate changing relationships during your recovery journey.', 'Book', 'relationships', 'Robert Johnson, PhD', '240 pages', FALSE, FALSE, '#', 'This book excerpt discusses how relationships change during recovery and provides guidance on rebuilding trust and setting healthy boundaries. Key topics include:

- Understanding how addiction affects relationships
- Communicating effectively about your recovery needs
- Rebuilding trust with loved ones
- Setting and maintaining healthy boundaries
- When to repair relationships and when to let go
- Building new relationships in recovery
- Navigating romantic relationships in sobriety

Healthy relationships are vital to long-term recovery, but they require intentional work and clear communication.');

-- Insert dummy data for profiles
INSERT INTO profiles (name, email, phone, username, sober_days) VALUES
  ('Alex Johnson', 'alex@example.com', '555-123-4567', 'alexj', 7);

-- Insert dummy data for emergency_contacts
INSERT INTO emergency_contacts (name, relationship, phone, email) VALUES
  ('James Wilson', 'Sponsor', '555-987-6543', 'james@example.com'),
  ('Dr. Sarah Johnson', 'Therapist', '555-123-4567', 'dr.johnson@example.com');

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
CREATE POLICY "Public can delete emergency_contacts" ON emergency_contacts FOR DELETE USING (true);

