import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type Language = 'english' | 'hindi' | 'bengali' | 'hinglish';

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
  
  
  // Authentication Pages
  'auth.signIn': {
    english: 'Sign In',
    hindi: 'साइन इन करें',
    bengali: 'সাইন ইন করুন'
  },
  'auth.signUp': {
    english: 'Sign Up',
    hindi: 'साइन अप करें',
    bengali: 'সাইন আপ করুন'
  },
  'auth.createAccount': {
    english: 'Create your farm management account',
    hindi: 'अपना खेत प्रबंধन खाता बनाएं',
    bengali: 'আপনার খামার ব্যবস্থাপনা অ্যাকাউন্ট তৈরি করুন'
  },
  'auth.accessPortal': {
    english: 'Access your farm management portal',
    hindi: 'अपने खेत प्रबंধन पोर्टल में प्रवेश करें',
    bengali: 'আপনার খামার ব্যবস্থাপনা পোর্টালে প্রবেশ করুন'
  },
  'auth.language': {
    english: 'Language',
    hindi: 'भाষা',
    bengali: 'ভাষা'
  },
  'auth.alreadyHaveAccount': {
    english: 'Already have an account? Sign in',
    hindi: 'पहলे से খाता है? साइन इन करें',
    bengali: 'আগে থেকেই অ্যাকাউন্ট আছে? সাইন ইন করুন'
  },
  'auth.noAccount': {
    english: "Don't have an account? Sign up",
    hindi: 'कोई खाता नहीं है? साइन अप करें',
    bengali: 'কোনো অ্যাকাউন্ট নেই? সাইন আপ করুন'
  },
  'auth.emailVerification': {
    english: 'After signing up, please check your email for a verification link before signing in.',
    hindi: 'साइन अप करने के बाद, साइन इन करने से पहলे वेরिफिकेशन लिंक के लिए अपने ईमेल की जांच करें।',
    bengali: 'সাইন আপ করার পর, সাইন ইন করার আগে ভেরিফিকেশন লিঙ্কের জন্য আপনার ইমেইল চেক করুন।'
  },
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
  },
  
  // Landing Page
  GetStarted: {
    english: 'Get Started',
    hindi: 'शुरू करें',
    bengali: 'শুরু করুন'
  },
  'hero.badge': {
    english: "India's #1 Farm Compliance Platform",
    hindi: 'भारत का #1 कृषि अनुपालन प्लेटफॉर्म',
    bengali: 'ভারতের #১ কৃষি সম্মতি প্ল্যাটফর্ম'
  },
  'hero.title': {
    english: 'Smart Farming with JeevanDhara',
    hindi: 'जीवनधारा के साथ स्मार्ट खेती',
    bengali: 'জীবনধারার সাথে স্মার্ট কৃষি'
  },
  'hero.subtitle': {
    english: 'Simplify your farm management, monitor antimicrobial usage, and ensure compliance with regulations - all in one powerful platform.',
    hindi: 'अपने खेत प्रबंधन को सरल बनाएं, एंटीमाइक्रोबायल उपयोग की निगरानी करें, और नियमों के साथ अनुपालन सुनिश्चित करें - सब कुछ एक शक्तिशाली प्लेटफॉर्म में।',
    bengali: 'আপনার খামার ব্যবস্থাপনা সহজ করুন, অ্যান্টিমাইক্রোবিয়াল ব্যবহার নিরীক্ষণ করুন, এবং নিয়মাবলীর সাথে সম্মতি নিশ্চিত করুন - সবকিছু একটি শক্তিশালী প্ল্যাটফর্মে।'
  },
  'pricing.button': {
    english: 'Check For Pricing',
    hindi: 'मूल्य निर्धारण देखें',
    bengali: 'মূল্য নির্ধারণ দেখুন'
  },
  'stats.farmers': {
    english: 'Farmers',
    hindi: 'किसान',
    bengali: 'কৃষক'
  },
  'stats.compliance': {
    english: 'Compliance Rate',
    hindi: 'अनुपालन दर',
    bengali: 'সম্মতির হার'
  },
  'stats.reduction': {
    english: 'AMU Reduction',
    hindi: 'AMU कमी',
    bengali: 'AMU হ্রাস'
  },
  'stats.support': {
    english: 'Support',
    hindi: 'सहायता',
    bengali: 'সহায়তা'
  },
  'features.title': {
    english: 'Powerful Features for Modern Farming',
    hindi: 'आधुনिक खेती के लिए शक्तिशाली सुविधाएं',
    bengali: 'আধুনিক কৃষির জন্য শক্তিশালী বৈশিষ্ট্য'
  },
  'features.subtitle': {
    english: 'Everything you need to manage your farm efficiently and comply with regulations',
    hindi: 'अपने खेत का कुशलतापूর्वक प्रबंधन करने और नियমों का पालन करने के लिए आपको जो कुछ भी चाहिए',
    bengali: 'আপনার খামার দক্ষতার সাথে পরিচালনা করতে এবং নিয়মাবলী মেনে চলতে আপনার যা কিছু প্রয়োজন'
  },
  'feature.amuMonitoring.title': {
    english: 'AMU Monitoring',
    hindi: 'AMU निगরানी',
    bengali: 'AMU পর্যবেক্ষণ'
  },
  'feature.amuMonitoring.desc': {
    english: 'Track and monitor antimicrobial usage with detailed analytics and reporting. Get insights on usage patterns and identify areas for improvement.',
    hindi: 'विस्तृत विश्लेषण और रिपोर्टिंग के साथ एंटीमाइक्रोबायल उपयोग को ट्रैक और मॉनिटर करें। उपयोग पैटर्न पर अंतर्दृष्टि प्राप्त करें और सुधार के क्षेत्रों की पहचान करें।',
    bengali: 'বিস্তৃত বিশ্লেষণ এবং রিপোর্টিংয়ের সাথে অ্যান্টিমাইক্রোবিয়াল ব্যবহার ট্র্যাক এবং মনিটর করুন। ব্যবহারের ধরন সম্পর্কে অন্তর্দৃষ্টি পান এবং উন্নতির ক্ষেত্রগুলি চিহ্নিত করুন।'
  },
  'feature.compliance.title': {
    english: 'Compliance Management',
    hindi: 'अनुपालन प्रबंধन',
    bengali: 'সম্মতি ব্যবস্থাপনা'
  },
  'feature.compliance.desc': {
    english: 'Stay compliant with regulations and maintain proper documentation. Automated alerts ensure you never miss important deadlines.',
    hindi: 'नियमों के साथ अनुपालन बनाए रखें और उचित दस्तावेज़ीकरण बनाए रखें। स्वचालित अलर्ट सुनिश्चित करते हैं कि आप कभी भी महत्वपूर्ण समय सीमा नहीं चूकते।',
    bengali: 'নিয়মাবলীর সাথে সম্মত থাকুন এবং যথাযথ ডকুমেন্টেশন বজায় রাখুন। স্বয়ংক্রিয় সতর্কতা নিশ্চিত করে যে আপনি কখনও গুরুত্বপূর্ণ সময়সীমা মিস করবেন না।'
  },
  'feature.assistant.title': {
    english: 'AI Assistant',
    hindi: 'AI सहायক',
    bengali: 'AI সহায়ক'
  },
  'feature.assistant.desc': {
    english: 'Get instant answers to your farming and compliance questions. Our AI assistant is trained on the latest agricultural regulations and best practices.',
    hindi: 'अपने खेती और अनुपालन प्रश्नों के तत्काल उत्तर प्राप्त करें। हमारा AI सहायक नवीनतम कृषि नियमों और सर्वोत्तम प्रथाओं पर प्रशिक्षित है।',
    bengali: 'আপনার কৃষি এবং সম্মতি প্রশ্নের তাৎক্ষণিক উত্তর পান। আমাদের AI সহায়ক সর্বশেষ কৃষি নিয়মাবলী এবং সর্বোত্তম অনুশীলনে প্রশিক্ষিত।'
  },
  'feature.withdrawal.title': {
    english: 'Withdrawal Period Tracking',
    hindi: 'विद্राওয়াল পিরিয়ড ট্র্যাকিং',
    bengali: 'প্রত্যাহার সময়কাল ট্র্যাকিং'
  },
  'feature.withdrawal.desc': {
    english: 'Automatically track withdrawal periods for all medications. Receive timely alerts when animals are approaching clearance dates.',
    hindi: 'सभी दवाओं के लिए विद्राওয়াল সময়কাল স্বয়ংক্রিয়ভাবে ট্র্যাক করুন। পশুরা নিষ্কাশনের তারিখের কাছাকাছি আসার সময় সময়মত সতর্কতা পান।',
    bengali: 'সমস্ত ওষুধের জন্য প্রত্যাহার সময়কাল স্বয়ংক্রিয়ভাবে ট্র্যাক করুন। পশুরা ক্লিয়ারেন্স তারিখের কাছাকাছি আসার সময় সময়মত সতর্কতা পান।'
  },
  'feature.export.title': {
    english: 'Export & Reporting',
    hindi: 'निर्यात और रিপোর্টিং',
    bengali: 'রপ্তানি এবং রিপোর্টিং'
  },
  'feature.export.desc': {
    english: 'Generate comprehensive reports for regulatory submissions. Export data in multiple formats for easy sharing with authorities.',
    hindi: 'नियामক प্রस্তুতির জন্য বিস্তৃত রিপোর্ট তৈরি করুন। কর্তৃপক্ষের সাথে সহজ শেয়ারিংয়ের জন্য একাধিক বিন্যাসে ডেটা রপ্তানি করুন।',
    bengali: 'নিয়ন্ত্রক জমা দেওয়ার জন্য ব্যাপক রিপোর্ট তৈরি করুন। কর্তৃপক্ষের সাথে সহজ ভাগাভাগির জন্য একাধিক ফরম্যাটে ডেটা রপ্তানি করুন।'
  },
  'feature.team.title': {
    english: 'Team Collaboration',
    hindi: 'দল सহযোগিতা',
    bengali: 'দলীয় সহযোগিতা'
  },
  'feature.team.desc': {
    english: 'Collaborate with your team members, veterinarians, and consultants. Assign tasks and share important information securely.',
    hindi: 'আপনার দলের সদস্য, পশুচিকিৎসক এবং পরামর্শদাতাদের সাথে সহযোগিতা করুন। কাজ বরাদ্দ করুন এবং গুরুত্বপূর্ণ তথ্য নিরাপদে ভাগ করুন।',
    bengali: 'আপনার দলের সদস্য, পশুচিকিৎসক এবং পরামর্শদাতাদের সাথে সহযোগিতা করুন। কাজ বরাদ্দ করুন এবং গুরুত্বপূর্ণ তথ্য নিরাপদে ভাগ করুন।'
  },
  
  // Common Actions
  'action.logAMU': {
    english: 'Log AMU',
    hindi: 'AMU লগ করুন',
    bengali: 'AMU লগ করুন'
  },
  'action.reports': {
    english: 'Reports',
    hindi: 'रिपोर্ট',
    bengali: 'রিপোর্ট'
  },
  'action.exportData': {
    english: 'Export data',
    hindi: 'ডেটা রপ্তানি',
    bengali: 'ডেটা রপ্তানি'
  },
  'action.checkAlerts': {
    english: 'Check Alerts',
    hindi: 'सतর্কতা চেক করুন',
    bengali: 'সতর্কতা চেক করুন'
  },
  
  // Dashboard Cards
  'dashboard.totalAnimals': {
    english: 'Total Animals',
    hindi: 'कुल पशु',
    bengali: 'মোট পশু'
  },
  'dashboard.activeTreatments': {
    english: 'Active Treatments',
    hindi: 'सक्रिय उपचार',
    bengali: 'সক্রিয় চিকিৎসা'
  },
  'dashboard.mrlCompliance': {
    english: 'MRL Compliance',
    hindi: 'MRL अनुपालन',
    bengali: 'MRL সম্মতি'
  },
  'dashboard.pendingAlerts': {
    english: 'Pending Alerts',
    hindi: 'लंबित अलर्ट',
    bengali: 'অমীমাংসিত সতর্কতা'
  },
  'dashboard.amuTrends': {
    english: 'AMU Trends & Compliance',
    hindi: 'AMU रुझान और अनुपालन',
    bengali: 'AMU প্রবণতা এবং সম্মতি'
  },
  'dashboard.amuBySpecies': {
    english: 'AMU by Species',
    hindi: 'प्रजातियों के अनुसार AMU',
    bengali: 'প্রজাতি অনুযায়ী AMU'
  },
  'dashboard.withdrawalPeriods': {
    english: 'Active Withdrawal Periods',
    hindi: 'सक्रिय निकासी अवधि',
    bengali: 'সক্রিয় প্রত্যাহার সময়কাল'
  },
  'dashboard.quickActions': {
    english: 'Quick Actions',
    hindi: 'त्वरित कार्य',
    bengali: 'দ্রুত কার্যক্রম'
  },
  'dashboard.generateReport': {
    english: 'Generate Report',
    hindi: 'रिपोर्ट जेनरेट करें',
    bengali: 'রিপোর্ট তৈরি করুন'
  },
  'dashboard.exportCompliance': {
    english: 'Export compliance report',
    hindi: 'अनुपालन रिपोर्ट निर्यात करें',
    bengali: 'সম্মতি রিপোর্ট রপ্তানি করুন'
  },
  'dashboard.viewNotifications': {
    english: 'View all notifications',
    hindi: 'सभी सूचनाएं देखें',
    bengali: 'সমস্ত বিজ্ঞপ্তি দেখুন'
  },
  'dashboard.daysLeft': {
    english: 'days left',
    hindi: 'दिन बचे',
    bengali: 'দিন বাকি'
  },
  'dashboard.untilClearance': {
    english: 'Until clearance',
    hindi: 'क्लीयरेंस तक',
    bengali: 'ক্লিয়ারেন্স পর্যন্ত'
  },
  
  // Alert badges
  'alert.urgent': {
    english: 'Urgent',
    hindi: 'तत्काल',
    bengali: 'জরুরি'
  },
  'alert.soon': {
    english: 'Soon',
    hindi: 'जल्द',
    bengali: 'শীঘ্রই'
  },
  'alert.normal': {
    english: 'Normal',
    hindi: 'सामान्य',
    bengali: 'স্বাভাবিক'
  },
  'form.animalDetails': {
    english: 'Animal Details',
    hindi: 'पশু विवरण',
    bengali: 'পশুর বিবরণ'
  },
  'form.drugInformation': {
    english: 'Drug Information',
    hindi: 'ওষুধের তথ্য',
    bengali: 'ওষুধের তথ্য'
  },
  'form.prescription': {
    english: 'Prescription',
    hindi: 'नुस्खा',
    bengali: 'প্রেসক্রিপশন'
  },
  'form.review': {
    english: 'Review',
    hindi: 'समीक্ষা',
    bengali: 'পর্যালোচনা'
  },
  
  // Footer
  'footer.empowering': {
    english: 'Empowering farmers with smart technology for better compliance and sustainable farming practices.',
    hindi: 'बेहतर अनुपालन और टिकाऊ खेती प्रथाओं के लिए स्मार्ट तकनीक के साथ किसानों को सशक्त बनाना।',
    bengali: 'ভাল সম্মতি এবং স্থায়ী কৃষি অনুশীলনের জন্য স্মার্ট প্রযুক্তির সাথে কৃষকদের ক্ষমতায়ন।'
  },
  'footer.product': {
    english: 'Product',
    hindi: 'उत्पाद',
    bengali: 'পণ্য'
  },
  'footer.features': {
    english: 'Features',
    hindi: 'विशेষতাएं',
    bengali: 'বৈশিষ্ট্য'
  },
  'footer.pricing': {
    english: 'Pricing',
    hindi: 'मूল্য নির্ধারণ',
    bengali: 'মূল্য'
  },
  'footer.caseStudies': {
    english: 'Case Studies',
    hindi: 'केस स्टডীজ',
    bengali: 'কেস স্টাডি'
  },
  'footer.integrations': {
    english: 'Integrations',
    hindi: 'एकीकরণ',
    bengali: 'একীকরণ'
  },
  'footer.resources': {
    english: 'Resources',
    hindi: 'संসাধন',
    bengali: 'সম্পদ'
  },
  'footer.documentation': {
    english: 'Documentation',
    hindi: 'दস্তাবেज়ीकরণ',
    bengali: 'নথিপত্র'
  },
  'footer.blog': {
    english: 'Blog',
    hindi: 'ब্লগ',
    bengali: 'ব্লগ'
  },
  'footer.webinars': {
    english: 'Webinars',
    hindi: '঵েবিনার',
    bengali: 'ওয়েবিনার'
  },
  'footer.faq': {
    english: 'FAQ',
    hindi: 'अक্সর পূছে জানে প্রশ্ন',
    bengali: 'সাধারণ জিজ্ঞাসা'
  },
  'footer.company': {
    english: 'Company',
    hindi: 'কম্পানী',
    bengali: 'কোম্পানী'
  },
  'footer.aboutUs': {
    english: 'About Us',
    hindi: 'হমারে বারে মেं',
    bengali: 'আমাদের সম্পর্কে'
  },
  'footer.careers': {
    english: 'Careers',
    hindi: 'ক্যারিয়র',
    bengali: 'ক্যারিয়ার'
  },
  'footer.contact': {
    english: 'Contact',
    hindi: 'সংপর্ক',
    bengali: 'যোগাযোগ'
  },
  'footer.privacy': {
    english: 'Privacy Policy',
    hindi: 'গোপনীয়তা নীতি',
    bengali: 'গোপনীয়তা নীতি'
  },
  'footer.allRights': {
    english: 'All rights reserved.',
    hindi: 'সभী অধিকার সুরক্ষিত।',
    bengali: 'সমস্ত অধিকার সংরক্ষিত।'
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