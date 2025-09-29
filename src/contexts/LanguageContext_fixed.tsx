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

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
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
  'foodSafety': {
    english: 'Food Safety',
    hindi: 'खाद्य सुरक्षा',
    bengali: 'খাদ্য নিরাপত্তা'
  },
  veterinarians: {
    english: 'Veterinarians',
    hindi: 'पशु चिकित्सक',
    bengali: 'পশুচিকিৎসক'
  },
  community: {
    english: 'Community',
    hindi: 'समुदाय',
    bengali: 'সম্প্রদায়'
  },
  chatbot: {
    english: 'Farm Assistant',
    hindi: 'कृषि सहायक',
    bengali: 'কৃষি সহায়ক'
  },
  
  // Dashboard
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
  'dashboard.quickActions': {
    english: 'Quick Actions',
    hindi: 'त्वरित कार्य',
    bengali: 'দ্রুত কাজ'
  },
  'dashboard.generateReport': {
    english: 'Generate Report',
    hindi: 'रिपोर्ट उत्पन्न करें',
    bengali: 'রিপোর্ট তৈরি করুন'
  },
  'dashboard.exportCompliance': {
    english: 'Export compliance report',
    hindi: 'अनुपालन रिपोर्ट निर्यात करें',
    bengali: 'সম্মতি রিপোর্ট রপ্তানি করুন'
  },
  'dashboard.amuTrends': {
    english: 'AMU Trends & Compliance',
    hindi: 'AMU प्रवृत्तियाँ और अनुपालन',
    bengali: 'AMU প্রবণতা এবং সম্মতি'
  },
  'dashboard.amuBySpecies': {
    english: 'AMU by Species',
    hindi: 'प्रजाति के अनुसार AMU',
    bengali: 'প্রজাতি অনুযায়ী AMU'
  },
  'dashboard.withdrawalPeriods': {
    english: 'Active Withdrawal Periods',
    hindi: 'सक्रिय निष्कासन अवधि',
    bengali: 'সক্রিয় উত্তোলন সময়কাল'
  },
  'dashboard.daysLeft': {
    english: 'days left',
    hindi: 'दिन शेष',
    bengali: 'দিন বাকি'
  },
  'dashboard.untilClearance': {
    english: 'Until clearance',
    hindi: 'रिक्तीकरण तक',
    bengali: 'পরিষ্কার হওয়া পর্যন্ত'
  },
  
  // Actions
  'action.logAMU': {
    english: 'Log New AMU',
    hindi: 'नया AMU लॉग करें',
    bengali: 'নতুন AMU লগ করুন'
  },
  
  // Prescription Management
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
    bengali: 'স্ক্যান করা টেক্ট'
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
  
  // Veterinarian Network
  'veterinarianNetwork.title': {
    english: 'Veterinarian Network',
    hindi: 'पशु चिकित्सक नेटवर्क',
    bengali: 'পশুচিকিৎসক নেটওয়ার্ক'
  },
  'veterinarianNetwork.description': {
    english: 'Connect with qualified veterinarians for expert consultation and emergency care',
    hindi: 'विशेषज्ञ परामर्श और आपातकालीन देखभाल के लिए योग्य पशु चिकित्सकों से जुड़ें',
    bengali: 'বিশেষজ্ঞ পরামর্শ এবং জরুরি পরিচর্যার জন্য দক্ষ পশুচিকিৎসকদের সাথে সংযোগ করুন'
  },
  'veterinarianNetwork.findTab': {
    english: 'Find Veterinarians',
    hindi: 'पशु चिकित्सक खोजें',
    bengali: 'পশুচিকিৎসক খুঁজুন'
  },
  'veterinarianNetwork.consultationsTab': {
    english: 'My Consultations',
    hindi: 'मेरे परामर्श',
    bengali: 'আমার পরামর্শ'
  },
  'veterinarianNetwork.emergencyTab': {
    english: 'Emergency Services',
    hindi: 'आपातकालीन सेवाएं',
    bengali: 'জরুরি সেবা'
  },
  'veterinarianNetwork.findTabMobile': {
    english: 'Find',
    hindi: 'खोजें',
    bengali: 'খুঁজুন'
  },
  'veterinarianNetwork.consultationsTabMobile': {
    english: 'Consults',
    hindi: 'परामर्श',
    bengali: 'পরামর্শ'
  },
  'veterinarianNetwork.emergencyTabMobile': {
    english: 'Emergency',
    hindi: 'आपातकालीन',
    bengali: 'জরুরি'
  },
  'veterinarianNetwork.searchPlaceholder': {
    english: 'Search by name or specialization...',
    hindi: 'नाम या विशेषज्ञता के आधार पर खोजें...',
    bengali: 'নাম বা বিশেষায়ন অনুসারে অনুসন্ধান করুন...'
  },
  'veterinarianNetwork.searchPlaceholderMobile': {
    english: 'Search vets...',
    hindi: 'पशु चिकित्सक खोजें...',
    bengali: 'পশুচিকিৎসক খুঁজুন...'
  },
  'veterinarianNetwork.locationFilter': {
    english: 'Location',
    hindi: 'स्थान',
    bengali: 'অবস্থান'
  },
  'veterinarianNetwork.allLocations': {
    english: 'All Locations',
    hindi: 'सभी स्थान',
    bengali: 'সমস্ত অবস্থান'
  },
  'veterinarianNetwork.specializationFilter': {
    english: 'Specialization',
    hindi: 'विशेषज्ञता',
    bengali: 'বিশেষায়ন'
  },
  'veterinarianNetwork.allSpecializations': {
    english: 'All Specializations',
    hindi: 'सभी विशेषज्ञता',
    bengali: 'সমস্ত বিশেষায়ন'
  },
  'veterinarianNetwork.largeAnimals': {
    english: 'Large Animals',
    hindi: 'बड़े पशु',
    bengali: 'বড় পশু'
  },
  'veterinarianNetwork.smallAnimals': {
    english: 'Small Animals',
    hindi: 'छोटे पशु',
    bengali: 'ছোট পশু'
  },
  'veterinarianNetwork.poultry': {
    english: 'Poultry',
    hindi: 'पक्षि',
    bengali: 'পাখি'
  },
  'veterinarianNetwork.emergency': {
    english: 'Emergency',
    hindi: 'आपातकालीन',
    bengali: 'জরুরি'
  },
  'veterinarianNetwork.away': {
    english: 'away',
    hindi: 'दूर',
    bengali: 'দূরে'
  },
  'veterinarianNetwork.consultation': {
    english: 'consultation',
    hindi: 'परामर्श',
    bengali: 'পরামর্শ'
  },
  'veterinarianNetwork.viewProfile': {
    english: 'View Profile',
    hindi: 'प्रोफ़ाइल देखें',
    bengali: 'প্রোফাইল দেখুন'
  },
  'veterinarianNetwork.noConsultationsTitle': {
    english: 'No Consultations Yet',
    hindi: 'अभी तक कोई परामर्श नहीं',
    bengali: 'এখনও কোন পরামর্শ নেই'
  },
  'veterinarianNetwork.noConsultationsDescription': {
    english: 'Book your first consultation to get started',
    hindi: 'आरंभ करने के लिए अपना पहला परामर्श बुक करें',
    bengali: 'শুরু করতে আপনার প্রথম পরামর্শ বুক করুন'
  },
  'veterinarianNetwork.findVeterinarians': {
    english: 'Find Veterinarians',
    hindi: 'पशु चिकित्सक खोजें',
    bengali: 'পশুচিকিৎসক খুঁজুন'
  },
  'veterinarianNetwork.emergencyServices': {
    english: 'Emergency Veterinary Services',
    hindi: 'आपातकालीन पशु चिकित्सा सेवाएं',
    bengali: 'জরুরি পশুচিকিৎসা সেবা'
  },
  'veterinarianNetwork.emergencyDescription': {
    english: '24/7 emergency support for critical animal health situations',
    hindi: 'गंभीर पशु स्वास्थ्य स्थितियों के लिए 24/7 आपातकालीन समर्थन',
    bengali: 'গুরুতর পশু স্বাস্থ্য পরিস্থিতির জন্য 24/7 জরুরি সহায়তা'
  },
  'veterinarianNetwork.yearsExperience': {
    english: 'years experience',
    hindi: 'वर्षों का अनुभव',
    bengali: 'বছরের অভিজ্ঞতা'
  },
  'veterinarianNetwork.available247': {
    english: '24/7 Available',
    hindi: '24/7 उपलब्ध',
    bengali: '24/7 উপলব্ধ'
  },
  'veterinarianNetwork.responseTime': {
    english: 'Response Time:',
    hindi: 'प्रतिक्रिया समय:',
    bengali: 'প্রতিক্রিয়া সময়:'
  },
  'veterinarianNetwork.successRate': {
    english: 'Success Rate:',
    hindi: 'सफलता दर:',
    bengali: 'সাফল্যের হার:'
  },
  'veterinarianNetwork.emergencyCall': {
    english: 'Emergency Call',
    hindi: 'आपातकालीन कॉल',
    bengali: 'জরুরি কল'
  },
  'veterinarianNetwork.profile': {
    english: 'Profile',
    hindi: 'प्रोफ़ाइल',
    bengali: 'প্রোফাইল'
  },
  'veterinarianNetwork.contact': {
    english: 'Contact',
    hindi: 'संपर्क',
    bengali: 'যোগাযোগ'
  },
  'veterinarianNetwork.details': {
    english: 'Details',
    hindi: 'विवरण',
    bengali: 'বিবরণ'
  },
  'veterinarianNetwork.experience': {
    english: 'Experience:',
    hindi: 'अनुभव:',
    bengali: 'অভিজ্ঞতা:'
  },
  'veterinarianNetwork.years': {
    english: 'years',
    hindi: 'वर्ष',
    bengali: 'বছর'
  },
  'veterinarianNetwork.response': {
    english: 'Response:',
    hindi: 'प्रतिक्रिया:',
    bengali: 'প্রতিক্রিয়া:'
  },
  'veterinarianNetwork.specializations': {
    english: 'Specializations',
    hindi: 'विशेषज्ञता',
    bengali: 'বিশেষায়ন'
  },
  'veterinarianNetwork.bookConsultation': {
    english: 'Book Consultation',
    hindi: 'परामर्श बुक करें',
    bengali: 'পরামর্শ বুক করুন'
  },
  'veterinarianNetwork.sendMessage': {
    english: 'Send Message',
    hindi: 'संदेश भेजें',
    bengali: 'বার্তা পাঠান'
  },
  'veterinarianNetwork.video': {
    english: 'Video',
    hindi: 'वीडियो',
    bengali: 'ভিডিও'
  },
  'veterinarianNetwork.phone': {
    english: 'Phone',
    hindi: 'फ़ोन',
    bengali: 'ফোন'
  },
  'veterinarianNetwork.chat': {
    english: 'Chat',
    hindi: 'चैट',
    bengali: 'চ্যাট'
  },
  
  // Farmer Community
  'farmerCommunity.title': {
    english: 'Farmer Community',
    hindi: 'किसान समुदाय',
    bengali: 'কৃষক সম্প্রদায়'
  },
  'farmerCommunity.description': {
    english: 'Connect, share experiences, and learn from fellow farmers',
    hindi: 'जुड़ें, अनुभव साझा करें और सहकर्मी किसानों से सीखें',
    bengali: 'সংযোগ করুন, অভিজ্ঞতা ভাগ করুন এবং সহকর্মী কৃষকদের কাছ থেকে শিখুন'
  },
  'farmerCommunity.feedTab': {
    english: 'Community Feed',
    hindi: 'समुदाय फ़ीड',
    bengali: 'সম্প্রদায় ফিড'
  },
  'farmerCommunity.forumTab': {
    english: 'Discussion Forum',
    hindi: 'चर्चा मंच',
    bengali: 'আলোচনা ফোরাম'
  },
  'farmerCommunity.knowledgeTab': {
    english: 'Knowledge Base',
    hindi: 'ज्ञानकोष',
    bengali: 'জ্ঞানভিত্তি'
  },
  'farmerCommunity.eventsTab': {
    english: 'Events & Groups',
    hindi: 'कार्यक्रम और समूह',
    bengali: 'ইভেন্ট এবং গ্রুপ'
  },
  'farmerCommunity.searchPlaceholder': {
    english: 'Search posts and discussions...',
    hindi: 'पोस्ट और चर्चाएं खोजें...',
    bengali: 'পোস্ট এবং আলোচনা অনুসন্ধান করুন...'
  },
  'farmerCommunity.filterButton': {
    english: 'Filter',
    hindi: 'फ़िल्टर',
    bengali: 'ফিল্টার'
  },
  'farmerCommunity.newPostButton': {
    english: 'New Post',
    hindi: 'नई पोस्ट',
    bengali: 'নতুন পোস্ট'
  },
  'farmerCommunity.postImageAlt': {
    english: 'Post image',
    hindi: 'पोस्ट छवि',
    bengali: 'পোস্ট ছবি'
  },
  'farmerCommunity.pinnedBadge': {
    english: 'Pinned',
    hindi: 'पिन किया गया',
    bengali: 'পিন করা হয়েছে'
  },
  'farmerCommunity.answeredBadge': {
    english: 'Answered',
    hindi: 'उत्तर दिया गया',
    bengali: 'উত্তর দেওয়া হয়েছে'
  },
  'farmerCommunity.byAuthor': {
    english: 'by',
    hindi: 'द्वारा',
    bengali: 'দ্বারা'
  },
  'farmerCommunity.replies': {
    english: 'replies',
    hindi: 'उत्तर',
    bengali: 'উত্তর'
  },
  'farmerCommunity.views': {
    english: 'views',
    hindi: 'दृश्य',
    bengali: 'দৃশ্য'
  },
  'farmerCommunity.verifiedBadge': {
    english: 'Verified',
    hindi: 'सत्यापित',
    bengali: 'যাচাই করা হয়েছে'
  },
  'farmerCommunity.minRead': {
    english: 'min read',
    hindi: 'मिनट पढ़ें',
    bengali: 'মিনিট পড়ুন'
  },
  'farmerCommunity.votes': {
    english: 'votes',
    hindi: 'वोट',
    bengali: 'ভোট'
  },
  'farmerCommunity.eventsComingSoonTitle': {
    english: 'Events & Groups Coming Soon',
    hindi: 'कार्यक्रम और समूह जल्द आ रहे हैं',
    bengali: 'ইভেন্ট এবং গ্রুপ শীঘ্রই আসছে'
  },
  'farmerCommunity.eventsComingSoonDescription': {
    english: 'Join local farmer groups and attend agricultural events in your area',
    hindi: 'स्थानीय किसान समूहों में शामिल हों और अपने क्षेत्र में कृषि कार्यक्रमों में शामिल हों',
    bengali: 'স্থানীয় কৃষক গ্রুপে যোগ দিন এবং আপনার এলাকার কৃষি ইভেন্টগুলিতে যোগ দিন'
  },
  'farmerCommunity.shareWithCommunity': {
    english: 'Share with the Community',
    hindi: 'समुदाय के साथ साझा करें',
    bengali: 'সম্প্রদায়ের সাথে ভাগ করুন'
  },
  'farmerCommunity.categoryLabel': {
    english: 'Category',
    hindi: 'श्रेणी',
    bengali: 'বিভাগ'
  },
  'farmerCommunity.generalDiscussion': {
    english: 'General Discussion',
    hindi: 'सामान्य चर्चा',
    bengali: 'সাধারণ আলোচনা'
  },
  'farmerCommunity.technologyInnovation': {
    english: 'Technology & Innovation',
    hindi: 'प्रौद्योगिकी और नवाचार',
    bengali: 'প্রযুক্তি এবং উদ্ভাবন'
  },
  'farmerCommunity.healthDisease': {
    english: 'Health & Disease',
    hindi: 'स्वास्थ्य और रोग',
    bengali: 'স্বাস্থ্য এবং রোগ'
  },
  'farmerCommunity.nutritionFeed': {
    english: 'Nutrition & Feed',
    hindi: 'पोषण और चारा',
    bengali: 'পুষ্টি এবং