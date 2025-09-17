-- Create temp_users table
CREATE TABLE public.temp_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.temp_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for temp_users
-- Allow authenticated users to view all temp users
CREATE POLICY "Authenticated users can view temp users" 
ON public.temp_users 
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to insert their own temp user record
CREATE POLICY "Authenticated users can create temp users" 
ON public.temp_users 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update temp users
CREATE POLICY "Authenticated users can update temp users" 
ON public.temp_users 
FOR UPDATE 
TO authenticated
USING (true);

-- Allow authenticated users to delete temp users
CREATE POLICY "Authenticated users can delete temp users" 
ON public.temp_users 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_temp_users_updated_at
BEFORE UPDATE ON public.temp_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX idx_temp_users_email ON public.temp_users(email);
CREATE INDEX idx_temp_users_username ON public.temp_users(username);
CREATE INDEX idx_temp_users_created_at ON public.temp_users(created_at DESC);