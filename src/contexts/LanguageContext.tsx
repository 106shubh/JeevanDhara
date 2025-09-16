import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type Language = 'english' | 'hindi' | 'bengali';

interface Translations {
  [key: string]: {
    english: string;
    hindi: string;
    bengali: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: {
    english: 'Dashboard',
    hindi: 'डैशबोर्ड',
    bengali: 'ড্যাশবোর্ড'
  },
  logAMU: {
    english: 'Log AMU',
    hindi: 'AMU लॉग करें',
    bengali: 'AMU লগ করুন'
  },
  alerts: {
    english: 'Alerts',
    hindi: 'अलर्ट',
    bengali: 'সতর্কতা'
  },
  prescriptions: {
    english: 'Prescriptions',
    hindi: 'नुस्खे',
    bengali: 'প্রেসক্রিপশন'
  },
  chatbot: {
    english: 'Farm Assistant',
    hindi: 'कृषि सहायक',
    bengali: 'কৃষি সহায়ক'
  },
  
  // Authentication
  signIn: {
    english: 'Sign In',
    hindi: 'साइन इन करें',
    bengali: 'সাইন ইন করুন'
  },
  signUp: {
    english: 'Sign Up',
    hindi: 'साइन अप करें',
    bengali: 'সাইন আপ করুন'
  },
  email: {
    english: 'Email',
    hindi: 'ईमेल',
    bengali: 'ইমেইল'
  },
  password: {
    english: 'Password',
    hindi: 'पासवर्ड',
    bengali: 'পাসওয়ার্ড'
  },
  fullName: {
    english: 'Full Name',
    hindi: 'पूरा नाम',
    bengali: 'পূর্ণ নাম'
  },
  
  // Dashboard
  totalAnimals: {
    english: 'Total Animals',
    hindi: 'कुल पशु',
    bengali: 'মোট পশু'
  },
  activeTreatments: {
    english: 'Active Treatments',
    hindi: 'सक्रिय उपचार',
    bengali: 'সক্রিয় চিকিৎসা'
  },
  mrlCompliance: {
    english: 'MRL Compliance',
    hindi: 'MRL अनुपालन',
    bengali: 'MRL সম্মতি'
  },
  pendingAlerts: {
    english: 'Pending Alerts',
    hindi: 'लंबित अलर्ट',
    bengali: 'অমীমাংসিত সতর্কতা'
  },
  
  // Forms
  animalId: {
    english: 'Animal ID',
    hindi: 'पशु ID',
    bengali: 'পশুর আইডি'
  },
  species: {
    english: 'Species',
    hindi: 'प्रजाति',
    bengali: 'প্রজাতি'
  },
  drugName: {
    english: 'Drug Name',
    hindi: 'दवा का नाम',
    bengali: 'ওষুধের নাম'
  },
  dosage: {
    english: 'Dosage',
    hindi: 'खुराक',
    bengali: 'ডোজ'
  },
  
  // Common
  submit: {
    english: 'Submit',
    hindi: 'सबमिट करें',
    bengali: 'জমা দিন'
  },
  cancel: {
    english: 'Cancel',
    hindi: 'रद्द करें',
    bengali: 'বাতিল করুন'
  },
  save: {
    english: 'Save',
    hindi: 'सेव करें',
    bengali: 'সংরক্ষণ করুন'
  },
  next: {
    english: 'Next',
    hindi: 'आगे',
    bengali: 'পরবর্তী'
  },
  previous: {
    english: 'Previous',
    hindi: 'पिछला',
    bengali: 'পূর্ববর্তী'
  },
  loading: {
    english: 'Loading...',
    hindi: 'लोड हो रहा है...',
    bengali: 'লোড হচ্ছে...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('english');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load user's preferred language
      const loadLanguage = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('language')
          .eq('user_id', user.id)
          .single();
        
        if (data?.language) {
          setLanguageState(data.language as Language);
        }
      };
      
      loadLanguage();
    }
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    if (user) {
      // Update user's language preference
      await supabase
        .from('profiles')
        .update({ language: lang })
        .eq('user_id', user.id);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.english;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};