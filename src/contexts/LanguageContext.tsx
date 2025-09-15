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
  'prescriptions.management': {
    english: 'Prescription Management',
    hindi: 'नुस्खे प्रबंधन',
    bengali: 'প্রেসক্রিপশন ম্যানেজমেন্ট'
  },
  'prescriptions.scan': {
    english: 'Scan Prescription',
    hindi: 'नुस्खे स्कैन करें',
    bengali: 'প্রেসক্রিপশন স্ক্যান করুন'
  },
  'prescriptions.upload': {
    english: 'Upload',
    hindi: 'अपलोड करें',
    bengali: 'আপলোড করুন'
  },
  'prescriptions.camera': {
    english: 'Camera',
    hindi: 'कैमरा',
    bengali: 'ক্যামেরা'
  },
  'prescriptions.uploadInstructions': {
    english: 'Upload veterinary prescriptions (PDF, JPG, PNG) or use camera to scan',
    hindi: 'पशु चिकित्सा नुस्खे अपलोड करें (PDF, JPG, PNG) या स्कैन करने के लिए कैमरा का उपयोग करें',
    bengali: 'পশুচিকিৎসা প্রেসক্রিপশন আপলোড করুন (PDF, JPG, PNG) বা স্ক্যান করতে ক্যামেরা ব্যবহার করুন'
  },
  'prescriptions.scanResults': {
    english: 'Prescription Scan Results',
    hindi: 'नुस्खे स्कैन परिणाम',
    bengali: 'প্রেসক্রিপশন স্ক্যান ফলাফল'
  },
  'prescriptions.scanDescription': {
    english: 'Review the scanned prescription and extract information',
    hindi: 'स्कैन किए गए नुस्खे की समीक्षा करें और जानकारी निकालें',
    bengali: 'স্ক্যান করা প্রেসক্রিপশন পর্যালোচনা করুন এবং তথ্য বের করুন'
  },
  'prescriptions.scanTab': {
    english: 'Scan',
    hindi: 'स्कैन',
    bengali: 'স্ক্যান'
  },
  'prescriptions.resultsTab': {
    english: 'Results',
    hindi: 'परिणाम',
    bengali: 'ফলাফল'
  },
  'prescriptions.scanning': {
    english: 'Scanning...',
    hindi: 'स्कैन हो रहा है...',
    bengali: 'স্ক্যান হচ্ছে...'
  },
  'prescriptions.scanNow': {
    english: 'Scan Now',
    hindi: 'अभी स्कैन करें',
    bengali: 'এখন স্ক্যান করুন'
  },
  'prescriptions.extractData': {
    english: 'Extract Data',
    hindi: 'डेटा निकालें',
    bengali: 'ডাটা বের করুন'
  },
  'prescriptions.scannedText': {
    english: 'Scanned Text',
    hindi: 'स्कैन किया गया टेक्स्ट',
    bengali: 'স্ক্যান করা টেক্সট'
  },
  'prescriptions.extractedData': {
    english: 'Extracted Data',
    hindi: 'निकाला गया डेटा',
    bengali: 'বের করা ডাটা'
  },
  'prescriptions.language': {
    english: 'Language',
    hindi: 'भाषा',
    bengali: 'ভাষা'
  },
  'prescriptions.veterinarian': {
    english: 'Veterinarian',
    hindi: 'पशु चिकित्सक',
    bengali: 'পশুচিকিৎসক'
  },
  'prescriptions.frequency': {
    english: 'Frequency',
    hindi: 'आवृत्ति',
    bengali: 'ফ্রিকোয়েন্সি'
  },
  'prescriptions.issueDate': {
    english: 'Issue Date',
    hindi: 'जारी करने की तारीख',
    bengali: 'ইস্যু তারিখ'
  },
  'prescriptions.notes': {
    english: 'Notes',
    hindi: 'नोट्स',
    bengali: 'নোট'
  },
  'prescriptions.savePrescription': {
    english: 'Save Prescription',
    hindi: 'नुस्खा सहेजें',
    bengali: 'প্রেসক্রিপশন সংরক্ষণ করুন'
  },
  'prescriptions.noDataExtracted': {
    english: 'No Data Extracted',
    hindi: 'कोई डेटा नहीं निकाला गया',
    bengali: 'কোন ডাটা বের করা হয়নি'
  },
  'prescriptions.scanFirst': {
    english: 'Please scan a prescription first and extract the data',
    hindi: 'कृपया पहले एक नुस्खा स्कैन करें और डेटा निकालें',
    bengali: 'অনুগ্রহ করে প্রথমে একটি প্রেসক্রিপশন স্ক্যান করুন এবং ডাটা বের করুন'
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