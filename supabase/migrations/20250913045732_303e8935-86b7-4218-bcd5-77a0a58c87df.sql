-- Create enum types
CREATE TYPE public.animal_species AS ENUM ('cattle', 'sheep', 'goat', 'pig', 'poultry');
CREATE TYPE public.alert_type AS ENUM ('urgent', 'warning', 'compliant', 'pending');
CREATE TYPE public.amu_reason AS ENUM ('treatment', 'prevention', 'metaphylaxis', 'growth_promotion');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'farmer',
  language TEXT DEFAULT 'english',
  farm_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create animals table
CREATE TABLE public.animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id TEXT NOT NULL UNIQUE,
  species animal_species NOT NULL,
  breed TEXT,
  age_months INTEGER,
  weight_kg DECIMAL(8,2),
  status TEXT DEFAULT 'healthy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create antimicrobials table
CREATE TABLE public.antimicrobials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active_ingredient TEXT,
  withdrawal_period_days INTEGER NOT NULL,
  mrl_limit_mg_kg DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prescription_id TEXT NOT NULL UNIQUE,
  veterinarian_name TEXT NOT NULL,
  veterinarian_license TEXT,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  antimicrobial_id UUID NOT NULL REFERENCES public.antimicrobials(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  reason amu_reason NOT NULL,
  notes TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AMU entries table
CREATE TABLE public.amu_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  antimicrobial_id UUID NOT NULL REFERENCES public.antimicrobials(id) ON DELETE CASCADE,
  administration_date DATE NOT NULL,
  dosage_given TEXT NOT NULL,
  withdrawal_end_date DATE NOT NULL,
  batch_number TEXT,
  notes TEXT,
  administered_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  amu_entry_id UUID REFERENCES public.amu_entries(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_required TEXT,
  is_dismissed BOOLEAN DEFAULT false,
  can_dismiss BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.antimicrobials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amu_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for animals
CREATE POLICY "Users can view their own animals" ON public.animals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own animals" ON public.animals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own animals" ON public.animals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own animals" ON public.animals FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for antimicrobials (public read access)
CREATE POLICY "Everyone can view antimicrobials" ON public.antimicrobials FOR SELECT USING (true);

-- Create RLS policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own prescriptions" ON public.prescriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own prescriptions" ON public.prescriptions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for AMU entries
CREATE POLICY "Users can view their own AMU entries" ON public.amu_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own AMU entries" ON public.amu_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own AMU entries" ON public.amu_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own AMU entries" ON public.amu_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON public.animals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_amu_entries_updated_at BEFORE UPDATE ON public.amu_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample antimicrobials data
INSERT INTO public.antimicrobials (name, active_ingredient, withdrawal_period_days, mrl_limit_mg_kg) VALUES
('Amoxicillin', 'Amoxicillin', 28, 0.1),
('Oxytetracycline', 'Oxytetracycline', 21, 0.2),
('Florfenicol', 'Florfenicol', 35, 0.3),
('Tulathromycin', 'Tulathromycin', 42, 0.1),
('Ceftiofur', 'Ceftiofur', 14, 0.2),
('Enrofloxacin', 'Enrofloxacin', 28, 0.1);

-- Create function to automatically create alerts for withdrawal periods
CREATE OR REPLACE FUNCTION public.create_withdrawal_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Create urgent alert if withdrawal period ends within 3 days
    IF NEW.withdrawal_end_date <= CURRENT_DATE + INTERVAL '3 days' AND NEW.withdrawal_end_date > CURRENT_DATE THEN
        INSERT INTO public.alerts (user_id, animal_id, amu_entry_id, type, title, message, action_required, can_dismiss)
        VALUES (
            NEW.user_id,
            NEW.animal_id,
            NEW.id,
            'urgent',
            'Withdrawal Period Ending Soon',
            'Animal ' || (SELECT animal_id FROM public.animals WHERE id = NEW.animal_id) || ' withdrawal period ends in ' || (NEW.withdrawal_end_date - CURRENT_DATE) || ' day(s)',
            'Do not sell milk/meat until withdrawal period ends',
            false
        );
    -- Create warning alert if withdrawal period ends within 7 days
    ELSIF NEW.withdrawal_end_date <= CURRENT_DATE + INTERVAL '7 days' AND NEW.withdrawal_end_date > CURRENT_DATE + INTERVAL '3 days' THEN
        INSERT INTO public.alerts (user_id, animal_id, amu_entry_id, type, title, message, action_required, can_dismiss)
        VALUES (
            NEW.user_id,
            NEW.animal_id,
            NEW.id,
            'warning',
            'Upcoming Withdrawal End',
            'Animal ' || (SELECT animal_id FROM public.animals WHERE id = NEW.animal_id) || ' withdrawal period ends on ' || NEW.withdrawal_end_date,
            'Prepare for resuming milk/meat production',
            true
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic alert creation
CREATE TRIGGER create_withdrawal_alerts_trigger
    AFTER INSERT ON public.amu_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.create_withdrawal_alerts();

-- Enable realtime for tables
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.amu_entries REPLICA IDENTITY FULL;
ALTER TABLE public.animals REPLICA IDENTITY FULL;
ALTER TABLE public.prescriptions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.amu_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.animals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;