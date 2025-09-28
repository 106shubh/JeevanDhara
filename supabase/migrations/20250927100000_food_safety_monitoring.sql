-- Create enum types for food safety
CREATE TYPE public.food_category AS ENUM ('milk', 'honey', 'meat', 'fish', 'cereals', 'fruits', 'beverages');
CREATE TYPE public.contaminant_type AS ENUM ('Antibiotic', 'Pesticide', 'Heavy Metal', 'Mycotoxin', 'Chemical', 'Dye', 'Beta-Agonist', 'Sweetener', 'Herbicide', 'Fungicide', 'Insecticide');
CREATE TYPE public.test_status AS ENUM ('safe', 'warning', 'unsafe');
CREATE TYPE public.test_method AS ENUM ('LC-MS/MS', 'GC-MS', 'HPLC', 'ICP-MS', 'ELISA');

-- Create food safety samples table
CREATE TABLE public.food_safety_samples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sample_id TEXT NOT NULL,
  food_category food_category NOT NULL,
  collection_date DATE NOT NULL,
  farm_location TEXT,
  lab_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food safety contaminants table
CREATE TABLE public.food_safety_contaminants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contaminant_type contaminant_type NOT NULL,
  mrl_limit DECIMAL(10,5), -- Maximum Residue Limit in mg/kg
  unit TEXT DEFAULT 'mg/kg',
  test_method test_method,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food safety test results table
CREATE TABLE public.food_safety_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sample_id UUID NOT NULL REFERENCES public.food_safety_samples(id) ON DELETE CASCADE,
  contaminant_id UUID NOT NULL REFERENCES public.food_safety_contaminants(id) ON DELETE CASCADE,
  detected_level DECIMAL(10,5),
  status test_status NOT NULL,
  notes TEXT,
  tested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_food_safety_samples_user_id ON public.food_safety_samples(user_id);
CREATE INDEX idx_food_safety_samples_sample_id ON public.food_safety_samples(sample_id);
CREATE INDEX idx_food_safety_samples_category ON public.food_safety_samples(food_category);
CREATE INDEX idx_food_safety_test_results_sample_id ON public.food_safety_test_results(sample_id);
CREATE INDEX idx_food_safety_test_results_contaminant_id ON public.food_safety_test_results(contaminant_id);
CREATE INDEX idx_food_safety_test_results_status ON public.food_safety_test_results(status);

-- Enable Row Level Security
ALTER TABLE public.food_safety_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_safety_contaminants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_safety_test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for food safety samples
CREATE POLICY "Users can view their own food safety samples" ON public.food_safety_samples FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own food safety samples" ON public.food_safety_samples FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own foodz safety samples" ON public.food_safety_samples FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own food safety samples" ON public.food_safety_samples FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for food safety contaminants (public read access)
CREATE POLICY "Everyone can view food safety contaminants" ON public.food_safety_contaminants FOR SELECT USING (true);

-- Create RLS policies for food safety test results
CREATE POLICY "Users can view their own food safety test results" ON public.food_safety_test_results FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.food_safety_samples WHERE id = sample_id));
CREATE POLICY "Users can create their own food safety test results" ON public.food_safety_test_results FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.food_safety_samples WHERE id = sample_id));
CREATE POLICY "Users can update their own food safety test results" ON public.food_safety_test_results FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.food_safety_samples WHERE id = sample_id));
CREATE POLICY "Users can delete their own food safety test results" ON public.food_safety_test_results FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.food_safety_samples WHERE id = sample_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_food_safety_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_food_safety_samples_updated_at BEFORE UPDATE ON public.food_safety_samples FOR EACH ROW EXECUTE FUNCTION public.update_food_safety_updated_at_column();
CREATE TRIGGER update_food_safety_test_results_updated_at BEFORE UPDATE ON public.food_safety_test_results FOR EACH ROW EXECUTE FUNCTION public.update_food_safety_updated_at_column();

-- Insert sample food safety contaminants data based on FSSAI standards
INSERT INTO public.food_safety_contaminants (name, contaminant_type, mrl_limit, unit, test_method) VALUES
-- Milk contaminants
('Amoxicillin', 'Antibiotic', 0.004, 'mg/kg', 'LC-MS/MS'),
('Penicillin G', 'Antibiotic', 0.004, 'mg/kg', 'LC-MS/MS'),
('Tetracycline', 'Antibiotic', 0.06, 'mg/kg', 'LC-MS/MS'),
('Chloramphenicol', 'Antibiotic', 0.0001, 'mg/kg', 'LC-MS/MS'),
('DDE', 'Pesticide', 0.01, 'mg/kg', 'GC-MS'),
('Lead', 'Heavy Metal', 0.02, 'mg/kg', 'ICP-MS'),
-- Honey contaminants
('Nitrofurans', 'Antibiotic', 0.001, 'mg/kg', 'LC-MS/MS'),
('HMF', 'Chemical', 40, 'mg/kg', 'HPLC'),
('Ciprofloxacin', 'Antibiotic', 0.01, 'mg/kg', 'LC-MS/MS'),
-- Meat contaminants
('Florfenicol', 'Antibiotic', 0.03, 'mg/kg', 'LC-MS/MS'),
('Enrofloxacin', 'Antibiotic', 0.01, 'mg/kg', 'LC-MS/MS'),
('Clenbuterol', 'Beta-Agonist', 0.0001, 'mg/kg', 'LC-MS/MS'),
('DDT', 'Pesticide', 0.01, 'mg/kg', 'GC-MS'),
('Cadmium', 'Heavy Metal', 0.05, 'mg/kg', 'ICP-MS'),
-- Fish contaminants
('Malachite Green', 'Dye', 0.0001, 'mg/kg', 'LC-MS/MS'),
('Nitrofurazone', 'Antibiotic', 0.001, 'mg/kg', 'LC-MS/MS'),
('Oxytetracycline', 'Antibiotic', 0.06, 'mg/kg', 'LC-MS/MS'),
('Mercury', 'Heavy Metal', 0.5, 'mg/kg', 'ICP-MS'),
-- Cereals contaminants
('Aflatoxin B1', 'Mycotoxin', 0.002, 'mg/kg', 'LC-MS/MS'),
('Ochratoxin A', 'Mycotoxin', 0.005, 'mg/kg', 'LC-MS/MS'),
('Glyphosate', 'Herbicide', 0.01, 'mg/kg', 'LC-MS/MS'),
('Chlorpyrifos', 'Pesticide', 0.01, 'mg/kg', 'GC-MS'),
-- Fruits/Vegetables contaminants
('Carbendazim', 'Fungicide', 0.1, 'mg/kg', 'LC-MS/MS'),
('Carbofuran', 'Insecticide', 0.01, 'mg/kg', 'LC-MS/MS'),
-- Beverages contaminants
('Acesulfame', 'Sweetener', 0.4, 'mg/kg', 'HPLC'),
('Aspartame', 'Sweetener', 0.4, 'mg/kg', 'HPLC'),
('Saccharin', 'Sweetener', 0.15, 'mg/kg', 'HPLC'),
('Aflatoxin M1', 'Mycotoxin', 0.0005, 'mg/kg', 'LC-MS/MS');