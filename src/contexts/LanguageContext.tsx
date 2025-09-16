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
  
  // Dashboard translations
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
    hindi: 'एमआरएल अनुपालन',
    bengali: 'এমআরএল কমপ্লায়েন্স'
  },
  pendingAlerts: {
    english: 'Pending Alerts',
    hindi: 'लंबित अलर्ट',
    bengali: 'অপেক্ষমান সতর্কতা'
  },
  amuTrends: {
    english: 'AMU Trends & Compliance',
    hindi: 'एएमयू ट्रेंड्स और अनुपालन',
    bengali: 'এএমইউ ট্রেন্ডস এবং কমপ্লায়েন্স'
  },
  amuBySpecies: {
    english: 'AMU by Species',
    hindi: 'प्रजाति के अनुसार एएमयू',
    bengali: 'প্রজাতি অনুসারে এএমইউ'
  },
  withdrawalPeriods: {
    english: 'Withdrawal Periods',
    hindi: 'वापसी अवधि',
    bengali: 'প্রত্যাহার সময়কাল'
  },
  filter: {
    english: 'Filter',
    hindi: 'फ़िल्टर',
    bengali: 'ফিল্টার'
  },
  export: {
    english: 'Export',
    hindi: 'निर्यात',
    bengali: 'রপ্তানি'
  },
  cattle: {
    english: 'Cattle',
    hindi: 'मवेशी',
    bengali: 'গবাদি পশু'
  },
  sheep: {
    english: 'Sheep',
    hindi: 'भेड़',
    bengali: 'ভেড়া'
  },
  goats: {
    english: 'Goats',
    hindi: 'बकरियां',
    bengali: 'ছাগল'
  },
  pigs: {
    english: 'Pigs',
    hindi: 'सूअर',
    bengali: 'শূকর'
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
  },
  dashboard: {
    english: 'Dashboard',
    hindi: 'डैशबोर्ड',
    bengali: 'ড্যাশবোর্ড'
  },
  logAMU: {
    english: 'Log AMU',
    hindi: 'एएमयू लॉग',
    bengali: 'এএমইউ লগ'
  },
  alerts: {
    english: 'Alerts',
    hindi: 'अलर्ट',
    bengali: 'সতর্কতা'
  },
  scripts: {
    english: 'Scripts',
    hindi: 'स्क्रिप्ट',
    bengali: 'স্ক্রিপ্ট'
  },
  assistant: {
    english: 'Assistant',
    hindi: 'सहायक',
    bengali: 'সহকারী'
  },
  scanPrescription: {
    english: 'Scan Prescription',
    hindi: 'नुस्खा स्कैन करें',
    bengali: 'প্রেসক্রিপশন স্ক্যান করুন'
  },
  uploadFile: {
    english: 'Upload File',
    hindi: 'फ़ाइल अपलोड करें',
    bengali: 'ফাইল আপলোড করুন'
  },
  uploadInstructions: {
    english: 'Upload veterinary prescriptions (PDF, JPG, PNG) or use camera to scan',
    hindi: 'पशु चिकित्सा नुस्खे अपलोड करें (PDF, JPG, PNG) या स्कैन करने के लिए कैमरा का उपयोग करें',
    bengali: 'পশুচিকিৎসা প্রেসক্রিপশন আপলোড করুন (PDF, JPG, PNG) অথবা স্ক্যান করতে ক্যামেরা ব্যবহার করুন'
  },
  searchPrescriptions: {
    english: 'Search prescriptions by animal ID, drug name, or veterinarian',
    hindi: 'पशु आईडी, दवा का नाम, या पशु चिकित्सक द्वारा नुस्खे खोजें',
    bengali: 'পশু আইডি, ওষুধের নাম, বা পশুচিকিৎসক দ্বারা প্রেসক্রিপশন খুঁজুন'
  },
  prescriptions: {
    english: 'Prescription Management',
    hindi: 'नुस्खा प्रबंधन',
    bengali: 'প্রেসক্রিপশন ম্যানেজমেন্ট'
  },
  verified: {
    english: 'Verified',
    hindi: 'सत्यापित',
    bengali: 'যাচাই করা'
  },
  pending: {
    english: 'Pending',
    hindi: 'लंबित',
    bengali: 'বিচারাধীন'
  },
  expired: {
    english: 'Expired',
    hindi: 'समाप्त',
    bengali: 'মেয়াদ শেষ'
  },
  prescribedBy: {
    english: 'Prescribed by',
    hindi: 'द्वारा निर्धारित',
    bengali: 'দ্বারা নির্ধারিত'
  },
  date: {
    english: 'Date',
    hindi: 'तारीख',
    bengali: 'তারিখ'
  },
  medication: {
    english: 'Medication',
    hindi: 'दवा',
    bengali: 'ঔষধ'
  },
  dosage: {
    english: 'Dosage',
    hindi: 'खुराक',
    bengali: 'মাত্রা'
  },
  viewDetails: {
    english: 'View Details',
    hindi: 'विवरण देखें',
    bengali: 'বিস্তারিত দেখুন'
  },
  veterinarian: {
    english: 'Veterinarian',
    hindi: 'पशु चिकित्सक',
    bengali: 'পশুচিকিৎসক'
  },
  drug: {
    english: 'Drug',
    hindi: 'दवा',
    bengali: 'ঔষধ'
  },
  issueDate: {
    english: 'Issue Date',
    hindi: 'जारी करने की तारीख',
    bengali: 'ইস্যু তারিখ'
  },
  view: {
    english: 'View',
    hindi: 'देखें',
    bengali: 'দেখুন'
  },
  download: {
    english: 'Download',
    hindi: 'डाउनलोड',
    bengali: 'ডাউনলোড'
  },
  verify: {
    english: 'Verify',
    hindi: 'सत्यापित करें',
    bengali: 'যাচাই করুন'
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