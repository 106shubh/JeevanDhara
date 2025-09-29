import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  Camera, 
  FileText,
  Plus,
  Stethoscope,
  Upload,
  Milk,
  Apple,
  Beef,
  Fish,
  Wheat,
  Droplets,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Tesseract from 'tesseract.js';

// Food categories with their contaminants
const FOOD_CATEGORIES = [
  { id: "milk", name: "Milk", icon: Milk },
  { id: "honey", name: "Honey", icon: Droplets },
  { id: "meat", name: "Meat", icon: Beef },
  { id: "fish", name: "Fish", icon: Fish },
  { id: "cereals", name: "Cereals", icon: Wheat },
  { id: "fruits", name: "Fruits/Vegetables", icon: Apple },
  { id: "beverages", name: "Packaged Beverages", icon: Droplets }
];

// Contaminants mapping for each food category with FSSAI MRL values
const CONTAMINANTS_MAP: Record<string, any[]> = {
  milk: [
    { name: "Amoxicillin", type: "Antibiotic", mrl: 0.004, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Penicillin G", type: "Antibiotic", mrl: 0.004, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Tetracycline", type: "Antibiotic", mrl: 0.06, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Chloramphenicol", type: "Antibiotic", mrl: 0.0001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "DDE", type: "Pesticide", mrl: 0.01, unit: "mg/kg", method: "GC-MS" },
    { name: "Lead", type: "Heavy Metal", mrl: 0.02, unit: "mg/kg", method: "ICP-MS" }
  ],
  honey: [
    { name: "Chloramphenicol", type: "Antibiotic", mrl: 0.0001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Nitrofurans", type: "Antibiotic", mrl: 0.001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "HMF", type: "Chemical", mrl: 40, unit: "mg/kg", method: "HPLC" },
    { name: "Ciprofloxacin", type: "Antibiotic", mrl: 0.01, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Lead", type: "Heavy Metal", mrl: 0.1, unit: "mg/kg", method: "ICP-MS" }
  ],
  meat: [
    { name: "Florfenicol", type: "Antibiotic", mrl: 0.03, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Enrofloxacin", type: "Antibiotic", mrl: 0.01, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Clenbuterol", type: "Beta-Agonist", mrl: 0.0001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "DDT", type: "Pesticide", mrl: 0.01, unit: "mg/kg", method: "GC-MS" },
    { name: "Cadmium", type: "Heavy Metal", mrl: 0.05, unit: "mg/kg", method: "ICP-MS" }
  ],
  fish: [
    { name: "Malachite Green", type: "Dye", mrl: 0.0001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Nitrofurazone", type: "Antibiotic", mrl: 0.001, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Oxytetracycline", type: "Antibiotic", mrl: 0.06, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Mercury", type: "Heavy Metal", mrl: 0.5, unit: "mg/kg", method: "ICP-MS" },
    { name: "Lead", type: "Heavy Metal", mrl: 0.1, unit: "mg/kg", method: "ICP-MS" }
  ],
  cereals: [
    { name: "Aflatoxin B1", type: "Mycotoxin", mrl: 0.002, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Ochratoxin A", type: "Mycotoxin", mrl: 0.005, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Glyphosate", type: "Herbicide", mrl: 0.01, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Chlorpyrifos", type: "Pesticide", mrl: 0.01, unit: "mg/kg", method: "GC-MS" },
    { name: "Cadmium", type: "Heavy Metal", mrl: 0.1, unit: "mg/kg", method: "ICP-MS" }
  ],
  fruits: [
    { name: "Carbendazim", type: "Fungicide", mrl: 0.1, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Chlorpyrifos", type: "Pesticide", mrl: 0.01, unit: "mg/kg", method: "GC-MS" },
    { name: "Carbofuran", type: "Insecticide", mrl: 0.01, unit: "mg/kg", method: "LC-MS/MS" },
    { name: "Lead", type: "Heavy Metal", mrl: 0.01, unit: "mg/kg", method: "ICP-MS" },
    { name: "Cadmium", type: "Heavy Metal", mrl: 0.02, unit: "mg/kg", method: "ICP-MS" }
  ],
  beverages: [
    { name: "Acesulfame", type: "Sweetener", mrl: 0.4, unit: "mg/kg", method: "HPLC" },
    { name: "Aspartame", type: "Sweetener", mrl: 0.4, unit: "mg/kg", method: "HPLC" },
    { name: "Saccharin", type: "Sweetener", mrl: 0.15, unit: "mg/kg", method: "HPLC" },
    { name: "Lead", type: "Heavy Metal", mrl: 0.01, unit: "mg/kg", method: "ICP-MS" },
    { name: "Aflatoxin M1", type: "Mycotoxin", mrl: 0.0005, unit: "mg/kg", method: "LC-MS/MS" }
  ]
};

// Default MRL rule: if no specific value exists, apply 0.01 mg/kg tolerance
const DEFAULT_MRL = 0.01;

// AMU inference mapping
const AMU_INFERENCE_MAP: Record<string, string[]> = {
  "Amoxicillin": ["Cattle", "Sheep", "Goat", "Pig"],
  "Penicillin G": ["Cattle", "Sheep", "Goat"],
  "Tetracycline": ["Cattle", "Sheep", "Goat", "Pig", "Poultry"],
  "Chloramphenicol": ["Cattle", "Sheep", "Goat", "Pig", "Poultry"],
  "Florfenicol": ["Cattle", "Sheep", "Goat", "Pig"],
  "Enrofloxacin": ["Cattle", "Sheep", "Goat", "Pig", "Poultry"],
  "Oxytetracycline": ["Cattle", "Sheep", "Goat", "Pig"]
};

// Withdrawal period calculation function
const calculateWithdrawalPeriod = (drugName: string, dosage: string, species: string) => {
  // Parse dosage value (e.g., "5mg/kg" -> 5)
  const dosageMatch = dosage.match(/(\d*\.?\d+)/);
  const dosageValue = dosageMatch ? parseFloat(dosageMatch[1]) : 1;
  
  // Base withdrawal periods for each drug (in days)
  const basePeriods: Record<string, number> = {
    "amoxicillin": 14,
    "oxytetracycline": 21,
    "florfenicol": 28,
    "tulathromycin": 35,
    "ceftiofur": 10,
    "enrofloxacin": 15
  };
  
  // Species multipliers
  const speciesMultipliers: Record<string, number> = {
    "cattle": 1.0,
    "sheep": 0.8,
    "goat": 0.9,
    "pig": 0.7,
    "poultry": 0.5
  };
  
  // Dosage multipliers (higher dosage = longer withdrawal)
  const dosageMultiplier = dosageValue > 0 ? Math.max(0.5, Math.min(2.0, dosageValue / 5)) : 1;
  
  // Calculate withdrawal period
  const drugBase = basePeriods[drugName.toLowerCase()] || 28;
  const speciesFactor = speciesMultipliers[species.toLowerCase()] || 1.0;
  
  const withdrawalPeriod = Math.round(drugBase * speciesFactor * dosageMultiplier);
  
  // Ensure minimum withdrawal period of 3 days
  return Math.max(3, withdrawalPeriod);
};

export const AMUForm = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    animalId: '',
    species: '',
    drugName: '',
    dosage: '',
    frequency: '',
    reason: '',
    veterinarianId: '',
    notes: ''
  });
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });
  // Food safety state
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>("");
  const [labData, setLabData] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [sampleId, setSampleId] = useState<string>("");
  const [collectionDate, setCollectionDate] = useState<string>("");
  const [farmLocation, setFarmLocation] = useState<string>("");
  
  // Prescription scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [extractedPrescriptionData, setExtractedPrescriptionData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate withdrawal period based on current form data
  const withdrawalPeriod = calculateWithdrawalPeriod(
    formData.drugName, 
    formData.dosage, 
    formData.species
  );
  
  // Check for screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 640,
        isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const steps = [
    { id: 1, title: t("form.animalDetails") || "Animal Details", icon: Stethoscope },
    { id: 2, title: t("form.drugInformation") || "Drug Information", icon: Plus },
    { id: 3, title: t("form.prescription") || "Prescription", icon: FileText },
    { id: 4, title: t("form.review") || "Review", icon: Calendar }
  ];

  const antimicrobials = [
    "Amoxicillin",
    "Oxytetracycline", 
    "Florfenicol",
    "Tulathromycin",
    "Ceftiofur",
    "Enrofloxacin"
  ];

  const species = ["Cattle", "Sheep", "Goat", "Pig", "Poultry"];
  const reasons = ["Treatment", "Prevention", "Metaphylaxis", "Growth Promotion"];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("AMU Entry Submitted:", formData);
    // Reset form or show success message
  };

  // Handle file upload simulation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUploaded(true);
      // Simulate file processing
      setTimeout(() => {
        // Generate mock lab data based on selected category
        if (selectedFoodCategory) {
          const contaminants = CONTAMINANTS_MAP[selectedFoodCategory] || [];
          const mockData = contaminants.map(contaminant => ({
            name: contaminant.name,
            type: contaminant.type,
            detectedLevel: (Math.random() * (contaminant.mrl * 3)).toFixed(5),
            mrl: contaminant.mrl,
            unit: contaminant.unit,
            method: contaminant.method,
            status: "pending"
          }));
          setLabData(mockData);
        }
      }, 1000);
    }
  };

  // Analyze the data and compare with MRL values
  const analyzeData = () => {
    if (labData.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      const results = labData.map(item => {
        const detected = parseFloat(item.detectedLevel);
        const mrl = item.mrl;
        let status = "safe";
        
        if (detected > mrl) {
          status = "unsafe";
        } else if (detected > mrl * 0.8) {
          status = "warning";
        }
        
        return {
          ...item,
          status
        };
      });
      
      setTestResults(results);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Reset the form
  const resetForm = () => {
    setSelectedFoodCategory("");
    setLabData([]);
    setTestResults([]);
    setFileUploaded(false);
    setSampleId("");
    setCollectionDate("");
    setFarmLocation("");
  };

  // Get AMU inference for a contaminant
  const getAMUInference = (contaminant: string) => {
    return AMU_INFERENCE_MAP[contaminant] || ["General livestock"];
  };
  
  // Handle file upload for prescription scanning
  const handlePrescriptionFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setScannedImage(result);
      scanPrescriptionImage(result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle camera capture for prescription scanning
  const handleCameraCapture = async () => {
    try {
      // This is a simplified implementation
      // In a real app, you would use a proper camera API or library
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // For demo purposes, we'll just show an alert
      alert('Camera access would be requested here. For this demo, please use the file upload option.');
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please use file upload instead.');
    }
  };
  
  // Scan prescription image with Tesseract.js
  const scanPrescriptionImage = async (imageData: string) => {
    if (!imageData) return;
    
    setIsScanning(true);
    
    try {
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        { 
          logger: (m) => console.log(m)
        }
      );
      
      setScannedText(result.data.text);
      
      // Extract structured data from OCR text
      extractPrescriptionData(result.data.text);
    } catch (error) {
      console.error('Error scanning prescription:', error);
      alert('Could not extract text from image. Please try another image.');
    } finally {
      setIsScanning(false);
    }
  };
  
  // Extract structured data from OCR text
  const extractPrescriptionData = (text: string) => {
    if (!text) return;
    
    // Enhanced extraction with more robust regex patterns
    const extractVeterinarian = /(?:veterinarian|doctor|dr\.?|vet\.?)[\s\S]*?:?\s*([A-Z][a-zA-Z\s\.]+(?:[A-Z]\.?\s*){1,3})/i;
    const extractAnimalId = /(?:animal|patient|id)[\s\S]*?:?\s*([A-Z0-9\-_]+)/i;
    const extractDrug = /(?:medication|prescription|drug)[\s\S]*?:?\s*([A-Z][a-zA-Z\s]+(?:[A-Z][a-zA-Z]*)?)/i;
    const extractDosage = /(?:dosage|dose)[\s\S]*?:?\s*([\d\s\w\/\.]+)/i;
    const extractFrequency = /(?:frequency|times)[\s\S]*?:?\s*([\d\w\s]+)/i;
    const extractDate = /(?:date|issued)[\s\S]*?:?\s*(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    
    // Try multiple patterns for each field
    const veterinarianMatch = text.match(extractVeterinarian) || 
                            text.match(/(?:Dr\.?|Doctor)[\s\.]+([A-Z][a-zA-Z\s\.]+)/i) ||
                            text.match(/([A-Z][a-zA-Z\s\.]+,\s*(?:DVM|VMD|BVSc))/i);
    
    const animalIdMatch = text.match(extractAnimalId) || 
                         text.match(/(?:ID|Animal)[\s#]*([A-Z0-9\-_]+)/i);
    
    const drugMatch = text.match(extractDrug) || 
                     text.match(/(?:Amoxicillin|Penicillin|Tetracycline|Florfenicol|Oxytetracycline)[\s\w]*/i);
    
    const dosageMatch = text.match(extractDosage) || 
                       text.match(/(\d+\s*(?:mg|ml|g|capsules|tablets))/i);
    
    const frequencyMatch = text.match(extractFrequency) || 
                          text.match(/(?:once|twice|thrice|\d+)\s*(?:daily|weekly|monthly)/i) ||
                          text.match(/(\d+\s*(?:times\s*per\s*day|t\.?p\.?d\.?))/i);
    
    const dateMatch = text.match(extractDate) || 
                     text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g);
    
    const extracted = {
      veterinarianName: veterinarianMatch?.[1] ? String(veterinarianMatch[1]).trim() : '',
      animalId: animalIdMatch?.[1] ? String(animalIdMatch[1]).trim() : '',
      drugName: drugMatch?.[1] ? String(drugMatch[1]).trim() : '',
      dosage: dosageMatch?.[1] ? String(dosageMatch[1]).trim() : '',
      frequency: frequencyMatch?.[1] ? String(frequencyMatch[1]).trim() : '',
      issueDate: dateMatch?.[0] ? String(dateMatch[0]).trim() : new Date().toISOString().split('T')[0],
    };
    
    setExtractedPrescriptionData(extracted);
    
    // Auto-fill the form with extracted data
    if (extracted.animalId) {
      setFormData(prev => ({ ...prev, animalId: extracted.animalId }));
    }
    if (extracted.drugName) {
      setFormData(prev => ({ ...prev, drugName: extracted.drugName }));
    }
    if (extracted.dosage) {
      setFormData(prev => ({ ...prev, dosage: extracted.dosage }));
    }
    if (extracted.frequency) {
      setFormData(prev => ({ ...prev, frequency: extracted.frequency }));
    }
  };
  
  // Reset prescription scanning state
  const resetPrescriptionScan = () => {
    setScannedImage(null);
    setScannedText(null);
    setExtractedPrescriptionData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-4 px-2 sm:px-4 md:px-6 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
          <CardContent className="pt-4 sm:pt-5 md:pt-6 px-3 sm:px-4 md:px-6 w-full overflow-hidden">
            <div className="flex justify-between items-center w-full overflow-x-auto pb-2 sm:pb-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center min-w-0 flex-shrink-0 relative">
                    <div className={`
                      flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 transition-smooth flex-shrink-0 z-10
                      ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                        isCompleted ? 'bg-success border-success text-success-foreground' :
                        'border-muted text-muted-foreground'}
                    `}>
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    </div>
                    <span className={`text-[8px] xs:text-[9px] sm:text-xs md:text-sm mt-1 md:mt-2 text-center min-w-0 max-w-[60px] sm:max-w-[70px] md:max-w-[90px] truncate px-1 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {screenSize.isMobile ? step.title.split(' ')[0] : step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`absolute w-full h-0.5 -z-0 top-1/2 transform -translate-y-1/2 ${isCompleted ? 'bg-success' : 'bg-muted'}`} 
                           style={{ left: '50%', width: '100%', marginLeft: 'calc(50% - 20px)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Content */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
          <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 w-full overflow-hidden">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg w-full min-w-0">
              <motion.div 
                whileHover={{ rotate: screenSize.isMobile ? 90 : 180 }}
                transition={{ duration: 0.3 }}
                className="text-primary flex-shrink-0"
              >
                <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-primary" />
              </motion.div>
              <span className="truncate">Log Antimicrobial Usage - Step {currentStep}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 md:space-y-5 px-4 sm:px-5 md:px-6 w-full overflow-hidden">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="animalId" className="text-xs sm:text-sm md:text-base">Animal ID *</Label>
                  <Input
                    id="animalId"
                    placeholder="e.g., COW-001"
                    value={formData.animalId}
                    onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="species" className="text-xs sm:text-sm md:text-base">Species *</Label>
                  <Select value={formData.species} onValueChange={(value) => setFormData({...formData, species: value})}>
                    <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()} className="text-xs sm:text-sm md:text-base">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertBadge type="pending" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5">
                Ensure animal identification is accurate for traceability
              </AlertBadge>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="drugName" className="text-xs sm:text-sm md:text-base">Antimicrobial Drug *</Label>
                  <Select value={formData.drugName} onValueChange={(value) => setFormData({...formData, drugName: value})}>
                    <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full">
                      <SelectValue placeholder="Select drug" />
                    </SelectTrigger>
                    <SelectContent>
                      {antimicrobials.map(drug => (
                        <SelectItem key={drug} value={drug.toLowerCase()} className="text-xs sm:text-sm md:text-base">{drug}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="dosage" className="text-xs sm:text-sm md:text-base">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 5mg/kg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="frequency" className="text-xs sm:text-sm md:text-base">Frequency *</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Once daily for 5 days"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="reason" className="text-xs sm:text-sm md:text-base">Reason for Use *</Label>
                  <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
                    <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map(reason => (
                        <SelectItem key={reason} value={reason.toLowerCase()} className="text-xs sm:text-sm md:text-base">{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertBadge type="warning" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5">
                Proper dosage calculations are crucial for effective treatment
              </AlertBadge>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2 w-full">
                <Label htmlFor="veterinarianId" className="text-xs sm:text-sm md:text-base">Veterinarian License ID</Label>
                <Input
                  id="veterinarianId"
                  placeholder="Vet license number (if prescribed)"
                  value={formData.veterinarianId}
                  onChange={(e) => setFormData({...formData, veterinarianId: e.target.value})}
                  className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base w-full"
                />
              </div>
              
              <div className="space-y-3 w-full">
                <Label className="text-xs sm:text-sm md:text-base">Prescription Upload</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-3 sm:p-4 md:p-5 text-center space-y-2 sm:space-y-3 w-full">
                  {isScanning ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <p className="text-muted-foreground text-xs sm:text-sm">Scanning prescription...</p>
                    </div>
                  ) : scannedImage ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img 
                          src={scannedImage} 
                          alt="Scanned prescription" 
                          className="max-h-40 sm:max-h-52 w-auto mx-auto rounded border"
                        />
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="absolute top-1 right-1 h-6 w-6 sm:h-7 sm:w-7"
                          onClick={resetPrescriptionScan}
                        >
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      {extractedPrescriptionData && (
                        <div className="text-left text-xs sm:text-sm p-2 bg-muted/50 rounded">
                          <p><strong>Veterinarian:</strong> {extractedPrescriptionData.veterinarianName || 'Not found'}</p>
                          <p><strong>Animal ID:</strong> {extractedPrescriptionData.animalId || 'Not found'}</p>
                          <p><strong>Drug:</strong> {extractedPrescriptionData.drugName || 'Not found'}</p>
                          <p><strong>Dosage:</strong> {extractedPrescriptionData.dosage || 'Not found'}</p>
                          <p><strong>Frequency:</strong> {extractedPrescriptionData.frequency || 'Not found'}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 w-full">
                      <Button 
                        variant="outline" 
                        size={screenSize.isMobile ? "sm" : "default"} 
                        className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 flex-1"
                        onClick={handleCameraCapture}
                      >
                        <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1 sm:mr-1.5" />
                        {screenSize.isMobile ? "Photo" : "Take Photo"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size={screenSize.isMobile ? "sm" : "default"} 
                        className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1 sm:mr-1.5" />
                        {screenSize.isMobile ? "Upload" : "Upload File"}
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*,.pdf"
                        onChange={handlePrescriptionFileUpload}
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base w-full break-words px-2">
                    Upload veterinary prescription or take a photo
                  </p>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="notes" className="text-xs sm:text-sm md:text-base">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the treatment"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="text-xs sm:text-sm md:text-base min-h-[80px] sm:min-h-[100px] md:min-h-[120px] resize-none w-full"
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="space-y-3 sm:space-y-4 w-full">
              <h3 className="font-semibold text-foreground text-sm sm:text-base md:text-lg">Review AMU Entry</h3>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm md:text-base w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Animal ID:</span> 
                  <span className="font-medium truncate sm:text-right mt-1 sm:mt-0">{formData.animalId || 'Not specified'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Species:</span> 
                  <span className="font-medium capitalize truncate sm:text-right mt-1 sm:mt-0">{formData.species || 'Not specified'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Drug:</span> 
                  <span className="font-medium capitalize truncate sm:text-right mt-1 sm:mt-0">{formData.drugName || 'Not specified'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Dosage:</span> 
                  <span className="font-medium truncate sm:text-right mt-1 sm:mt-0">{formData.dosage || 'Not specified'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Frequency:</span> 
                  <span className="font-medium truncate sm:text-right mt-1 sm:mt-0">{formData.frequency || 'Not specified'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-3 sm:p-4 bg-muted/30 rounded w-full">
                  <span className="font-medium text-muted-foreground">Reason:</span> 
                  <span className="font-medium capitalize truncate sm:text-right mt-1 sm:mt-0">{formData.reason || 'Not specified'}</span>
                </div>
              </div>
              
              <Separator />
              
              <AlertBadge type="warning" className="text-xs sm:text-sm md:text-base py-2.5 sm:py-3">
                Withdrawal Period: {withdrawalPeriod} days - Do not sell milk/meat until this date
              </AlertBadge>
              
              {/* Food Safety Monitoring Section */}
              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-foreground text-sm sm:text-base md:text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Food Safety Monitoring
                </h3>
                
                {/* Food Category Selection */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm md:text-base">Select Food Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {FOOD_CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedFoodCategory === category.id ? "default" : "outline"}
                          className={`flex flex-col items-center justify-center h-16 p-2 rounded-lg ${
                            selectedFoodCategory === category.id 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-accent"
                          }`}
                          onClick={() => setSelectedFoodCategory(category.id)}
                        >
                          <Icon className="h-6 w-6 mb-1" />
                          <span className="text-[10px] text-center">{category.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Sample Information */}
                {selectedFoodCategory && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="sampleId" className="text-xs sm:text-sm">Sample ID</Label>
                      <Input
                        id="sampleId"
                        placeholder="e.g., FS-2023-001"
                        value={sampleId}
                        onChange={(e) => setSampleId(e.target.value)}
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectionDate" className="text-xs sm:text-sm">Collection Date</Label>
                      <Input
                        id="collectionDate"
                        type="date"
                        value={collectionDate}
                        onChange={(e) => setCollectionDate(e.target.value)}
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmLocation" className="text-xs sm:text-sm">Farm Location</Label>
                      <Input
                        id="farmLocation"
                        placeholder="e.g., Village Name, District"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                
                {/* Lab Data Upload */}
                {selectedFoodCategory && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center space-y-3">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Label 
                        htmlFor="lab-data-upload" 
                        className="cursor-pointer flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 text-xs font-medium transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        {fileUploaded ? "File Uploaded" : "Upload Lab Data"}
                      </Label>
                      <Input 
                        id="lab-data-upload" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".csv,.xlsx,.xls,.json,.txt"
                      />
                      <Button 
                        variant="outline" 
                        className="h-9 text-xs"
                        onClick={() => document.getElementById('lab-data-upload')?.click()}
                      >
                        Sample Data
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Upload LC-MS/MS, ELISA, GC-MS or other lab test results
                    </p>
                  </div>
                )}
                
                {/* Uploaded Contaminants Data */}
                {labData.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Uploaded Contaminants Data</h4>
                      <Button 
                        onClick={analyzeData} 
                        disabled={isAnalyzing}
                        className="h-8 text-xs"
                      >
                        {isAnalyzing ? (
                          <>
                            <Upload className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Analyze Data
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Contaminant</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Method</TableHead>
                            <TableHead className="text-xs">Detected Level</TableHead>
                            <TableHead className="text-xs">MRL (FSSAI)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {labData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-xs font-medium">{item.name}</TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="outline" className="text-[8px]">
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">{item.method}</TableCell>
                              <TableCell className="text-xs">{item.detectedLevel} {item.unit}</TableCell>
                              <TableCell className="text-xs">{item.mrl} {item.unit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                
                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Compliance Report</h4>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Food Item</TableHead>
                            <TableHead className="text-xs">Contaminant</TableHead>
                            <TableHead className="text-xs">Detected Level</TableHead>
                            <TableHead className="text-xs">MRL</TableHead>
                            <TableHead className="text-xs">Result</TableHead>
                            <TableHead className="text-xs">AMU Inference</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-xs font-medium">
                                {FOOD_CATEGORIES.find(c => c.id === selectedFoodCategory)?.name}
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="flex flex-col">
                                  <span>{item.name}</span>
                                  <Badge variant="outline" className="text-[8px] w-fit mt-1">
                                    {item.type}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs">{item.detectedLevel} {item.unit}</TableCell>
                              <TableCell className="text-xs">{item.mrl} {item.unit}</TableCell>
                              <TableCell className="text-xs">
                                {item.status === "safe" && (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px]">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Safe ✅
                                  </Badge>
                                )}
                                {item.status === "warning" && (
                                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-[10px]">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Warning ⚠️
                                  </Badge>
                                )}
                                {item.status === "unsafe" && (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-[10px]">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Unsafe ❌
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="flex flex-wrap gap-1">
                                  {getAMUInference(item.name).map((animal, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-[8px]">
                                      {animal}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <div>
                              <p className="text-xs font-medium text-green-800 dark:text-green-200">Safe Items</p>
                              <p className="text-lg font-bold text-green-800 dark:text-green-200">
                                {testResults.filter(r => r.status === "safe").length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            <div>
                              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Warnings</p>
                              <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                                {testResults.filter(r => r.status === "warning").length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-600 mr-2" />
                            <div>
                              <p className="text-xs font-medium text-red-800 dark:text-red-200">Unsafe Items</p>
                              <p className="text-lg font-bold text-red-800 dark:text-red-200">
                                {testResults.filter(r => r.status === "unsafe").length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommendations */}
                    {testResults.some(r => r.status !== "safe") && (
                      <Card className="border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-sm mb-2 text-destructive flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Recommended Actions
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-destructive">
                            {testResults.filter(r => r.status === "unsafe").map((item, index) => (
                              <li key={index}>
                                <span className="font-medium">{item.name}</span> exceeds MRL by {((parseFloat(item.detectedLevel) / item.mrl * 100) - 100).toFixed(1)}%. 
                                Immediate withdrawal of product and investigation of AMU practices required.
                              </li>
                            ))}
                            {testResults.filter(r => r.status === "warning").map((item, index) => (
                              <li key={index}>
                                <span className="font-medium">{item.name}</span> is close to MRL limit. 
                                Review AMU protocols and increase monitoring frequency.
                              </li>
                            ))}
                            <li>Implement stricter withdrawal periods for all antimicrobial usage</li>
                            <li>Conduct farm-level surveys to correlate detected residues with veterinary drug usage</li>
                            <li>Review and update AMU tracking procedures</li>
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* AMU Correlation Insights */}
                    <Card className="border-primary/50 bg-primary/5 dark:bg-primary/10">
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          AMU Correlation Insights
                        </h4>
                        <div className="space-y-2 text-xs text-primary">
                          <p>
                            Based on detected contaminants, the following animals may have been treated with antimicrobials:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(testResults.flatMap(r => getAMUInference(r.name)))).map((animal, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[10px]">
                                {animal}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-2">
                            Recommend reviewing AMU records for these animals and implementing stricter withdrawal periods.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-5 md:pt-6 w-full gap-3 sm:gap-4">
            <motion.div whileHover={currentStep === 1 ? {} : { scale: 1.02 }} whileTap={currentStep === 1 ? {} : { scale: 0.98 }} className="flex-shrink-0 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="transition-all duration-300 hover:shadow-md hover:border-primary h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base px-3 sm:px-4 w-full"
                size={screenSize.isMobile ? "sm" : "default"}
              >
                {t("previous") || "Previous"}
              </Button>
            </motion.div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              {currentStep < 4 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleNext} 
                    className="bg-gradient-primary transition-all duration-300 hover:shadow-md h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base px-3 sm:px-4 w-full"
                    size={screenSize.isMobile ? "sm" : "default"}
                  >
                    {t("next") || "Next"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-gradient-primary transition-all duration-300 hover:shadow-md h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base px-3 sm:px-4 w-full"
                    size={screenSize.isMobile ? "sm" : "default"}
                  >
                    <span className="truncate">{t("submit") || "Submit AMU Entry"}</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};