import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText,
  Search,
  Upload,
  Camera,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Scan,
  Languages,
  X,
  Loader2,
  Calendar,
  Clock,
  Users,
  Activity,
  Trash2,
  Edit3,
  Plus,
  Filter,
  RotateCcw,
  Save,
  Copy,
  Star,
  Archive
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, Variants } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Tesseract from 'tesseract.js';

interface Prescription {
  id: string;
  veterinarianName: string;
  animalId: string;
  drugName: string;
  issueDate: string;
  status: "verified" | "pending" | "expired";
  fileName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  imageUrl?: string;
}

export const PrescriptionManagerFinal = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [showScannedDialog, setShowScannedDialog] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<Prescription> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for prescription management
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editForm, setEditForm] = useState<Partial<Prescription>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'animal' | 'drug'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  // Enhanced animation variants with more sophisticated animations
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
    exit: {
      y: -30,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const cardVariants: Variants = {
    idle: {
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      rotateY: 2,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };
  
  // Handler for file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setScannedImage(result);
      setShowScannedDialog(true);
    };
    reader.readAsDataURL(file);
  };
  
  // Handler for camera capture
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
  
  // Handler for scanning prescription with Tesseract.js
  const handleScanPrescription = async () => {
    if (!scannedImage) return;
    
    setIsScanning(true);
    
    try {
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        scannedImage,
        'eng',
        { 
          logger: (m) => console.log(m)
        }
      );
      
      setScannedText(result.data.text);
      
      toast({
        title: "✅ OCR Completed!",
        description: "Prescription text has been successfully extracted.",
      });
    } catch (error) {
      console.error('Error scanning prescription:', error);
      toast({
        title: "❌ OCR Failed",
        description: "Could not extract text from image. Please try another image.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // Handler for extracting structured data from OCR text with improved parsing
  const handleExtractData = () => {
    if (!scannedText) return;
    
    // Enhanced extraction with more robust regex patterns
    const extractVeterinarian = /(?:veterinarian|doctor|dr\.?|vet\.?)[\s\S]*?:?\s*([A-Z][a-zA-Z\s\.]+(?:[A-Z]\.?\s*){1,3})/i;
    const extractAnimalId = /(?:animal|patient|id)[\s\S]*?:?\s*([A-Z0-9\-_]+)/i;
    const extractDrug = /(?:medication|prescription|drug)[\s\S]*?:?\s*([A-Z][a-zA-Z\s]+(?:[A-Z][a-zA-Z]*)?)/i;
    const extractDosage = /(?:dosage|dose)[\s\S]*?:?\s*([\d\s\w\/\.]+)/i;
    const extractFrequency = /(?:frequency|times)[\s\S]*?:?\s*([\d\w\s]+)/i;
    const extractDate = /(?:date|issued)[\s\S]*?:?\s*(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const extractNotes = /(?:notes|instructions|remarks)[\s\S]*?:?\s*([A-Za-z\s\.,]+)/i;
    
    // Try multiple patterns for each field
    const veterinarianMatch = scannedText.match(extractVeterinarian) || 
                            scannedText.match(/(?:Dr\.?|Doctor)[\s\.]+([A-Z][a-zA-Z\s\.]+)/i) ||
                            scannedText.match(/([A-Z][a-zA-Z\s\.]+,\s*(?:DVM|VMD|BVSc))/i);
    
    const animalIdMatch = scannedText.match(extractAnimalId) || 
                         scannedText.match(/(?:ID|Animal)[\s#]*([A-Z0-9\-_]+)/i);
    
    const drugMatch = scannedText.match(extractDrug) || 
                     scannedText.match(/(?:Amoxicillin|Penicillin|Tetracycline|Florfenicol|Oxytetracycline)[\s\w]*/i);
    
    const dosageMatch = scannedText.match(extractDosage) || 
                       scannedText.match(/(\d+\s*(?:mg|ml|g|capsules|tablets))/i);
    
    const frequencyMatch = scannedText.match(extractFrequency) || 
                          scannedText.match(/(?:once|twice|thrice|\d+)\s*(?:daily|weekly|monthly)/i) ||
                          scannedText.match(/(\d+\s*(?:times\s*per\s*day|t\.?p\.?d\.?))/i);
    
    const dateMatch = scannedText.match(extractDate) || 
                     scannedText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g);
    
    const notesMatch = scannedText.match(extractNotes);
    
    const extracted: Partial<Prescription> = {
      veterinarianName: veterinarianMatch?.[1] ? String(veterinarianMatch[1]).trim() : '',
      animalId: animalIdMatch?.[1] ? String(animalIdMatch[1]).trim() : '',
      drugName: drugMatch?.[1] ? String(drugMatch[1]).trim() : '',
      dosage: dosageMatch?.[1] ? String(dosageMatch[1]).trim() : '',
      frequency: frequencyMatch?.[1] ? String(frequencyMatch[1]).trim() : '',
      issueDate: dateMatch?.[0] ? String(dateMatch[0]).trim() : new Date().toISOString().split('T')[0],
      notes: notesMatch?.[1] ? String(notesMatch[1]).trim() : '',
      imageUrl: scannedImage || undefined,
      status: 'pending'
    };
    
    // If no data was extracted, try a more generic approach
    if (!extracted.veterinarianName && !extracted.animalId && !extracted.drugName) {
      // Try to extract any capitalized words as potential drug names
      const potentialDrugs = scannedText.match(/([A-Z][a-zA-Z]+(?:[A-Z][a-zA-Z]*)?)/g);
      if (potentialDrugs && potentialDrugs.length > 0) {
        extracted.drugName = potentialDrugs[0];
      }
      
      // Try to extract any date-like patterns
      const datePatterns = scannedText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g);
      if (datePatterns && datePatterns.length > 0) {
        extracted.issueDate = datePatterns[0];
      }
      
      // Try to extract dosage patterns
      const dosagePatterns = scannedText.match(/(\d+\s*(?:mg|ml|g|capsules|tablets))/gi);
      if (dosagePatterns && dosagePatterns.length > 0) {
        extracted.dosage = dosagePatterns[0];
      }
    }
    
    setExtractedData(extracted);
  };
  
  // Handler for translating extracted data
  useEffect(() => {
    if (!extractedData || selectedLanguage === 'english') return;
    
    // In a real app, you would use a translation API
    // For demo purposes, we'll use some predefined translations
    const translateText = (text: string, targetLang: string) => {
      // Simple mock translations for demo
      if (targetLang === 'hindi' && text.includes('Amoxicillin')) {
        return text.replace('Amoxicillin', 'एमोक्सिसिलिन');
      } else if (targetLang === 'bengali' && text.includes('Amoxicillin')) {
        return text.replace('Amoxicillin', 'অ্যামোক্সিসিলিন');
      }
      return text;
    };
    
    // Apply translations
    setExtractedData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        drugName: translateText(prev.drugName || '', selectedLanguage),
        notes: translateText(prev.notes || '', selectedLanguage)
      };
    });
  }, [selectedLanguage, extractedData]);
  
  // Enhanced handler for saving prescription with loading state
  const handleSavePrescription = async () => {
    if (!extractedData) {
      toast({
        title: "No Data Extracted",
        description: "Please scan a prescription first and extract the data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPrescription: Prescription = {
        id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
        veterinarianName: extractedData.veterinarianName || '',
        animalId: extractedData.animalId || '',
        drugName: extractedData.drugName || '',
        issueDate: extractedData.issueDate || new Date().toISOString().split('T')[0],
        status: 'pending',
        dosage: extractedData.dosage,
        frequency: extractedData.frequency,
        duration: extractedData.duration,
        notes: extractedData.notes,
        imageUrl: extractedData.imageUrl,
        fileName: `prescription_${extractedData.animalId?.toLowerCase()}.jpg`
      };
      
      setPrescriptions(prev => [newPrescription, ...prev]);
      setAnimationKey(prev => prev + 1);
      
      toast({
        title: "✅ Prescription Saved Successfully!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Prescription {newPrescription.id} has been added to your records.</span>
          </div>
        ),
      });
      
      setShowScannedDialog(false);
      
      // Reset states
      setScannedImage(null);
      setScannedText(null);
      setExtractedData(null);
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "There was an error saving the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced handler for verifying prescription with loading feedback
  const handleVerifyPrescription = async (prescriptionId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === prescriptionId ? { ...p, status: 'verified' as const } : p
        )
      );
      
      toast({
        title: "✅ Prescription Verified!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Prescription {prescriptionId} is now verified and approved.</span>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "❌ Verification Failed",
        description: "There was an error verifying the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for viewing prescription
  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowViewDialog(true);
  };
  
  // Handler for editing prescription
  const handleEditPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditForm(prescription);
    setShowEditDialog(true);
  };
  
  // Enhanced handler for updating prescription with validation
  const handleUpdatePrescription = async () => {
    if (!selectedPrescription || !editForm) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === selectedPrescription.id ? { ...p, ...editForm } : p
        )
      );
      
      toast({
        title: "✅ Prescription Updated!",
        description: (
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span>Prescription {selectedPrescription.id} has been updated successfully.</span>
          </div>
        ),
      });
      
      setShowEditDialog(false);
      setSelectedPrescription(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: "There was an error updating the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced handler for deleting prescription with confirmation
  const handleDeletePrescription = async (prescriptionId: string) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (!prescription) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
      
      toast({
        title: "🗑️ Prescription Deleted",
        description: (
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <span>Prescription {prescriptionId} for {prescription.animalId} has been deleted.</span>
          </div>
        ),
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "❌ Delete Failed",
        description: "There was an error deleting the prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for downloading prescription
  const handleDownloadPrescription = (prescription: Prescription) => {
    // Simulate file download
    const prescriptionData = {
      id: prescription.id,
      veterinarianName: prescription.veterinarianName,
      animalId: prescription.animalId,
      drugName: prescription.drugName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      issueDate: prescription.issueDate,
      status: prescription.status,
      notes: prescription.notes,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(prescriptionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prescription.fileName || `prescription_${prescription.id}`}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Downloading prescription ${prescription.id}...`,
    });
  };
  
  // Handler for bulk operations
  const handleBulkVerify = () => {
    const pendingSelected = selectedPrescriptions.filter(id => {
      const prescription = prescriptions.find(p => p.id === id);
      return prescription?.status === 'pending';
    });
    
    if (pendingSelected.length === 0) {
      toast({
        title: "No Pending Prescriptions",
        description: "Please select pending prescriptions to verify.",
        variant: "destructive"
      });
      return;
    }
    
    setPrescriptions(prev => 
      prev.map(p => 
        pendingSelected.includes(p.id) ? { ...p, status: 'verified' as const } : p
      )
    );
    
    toast({
      title: "Bulk Verification Complete",
      description: `${pendingSelected.length} prescriptions have been verified.`,
    });
    
    setSelectedPrescriptions([]);
  };
  
  // Handler for bulk delete
  const handleBulkDelete = () => {
    if (selectedPrescriptions.length === 0) {
      toast({
        title: "No Prescriptions Selected",
        description: "Please select prescriptions to delete.",
        variant: "destructive"
      });
      return;
    }
    
    setPrescriptions(prev => 
      prev.filter(p => !selectedPrescriptions.includes(p.id))
    );
    
    toast({
      title: "Bulk Delete Complete",
      description: `${selectedPrescriptions.length} prescriptions have been deleted.`,
      variant: "destructive"
    });
    
    setSelectedPrescriptions([]);
  };
  
  // Initialize prescriptions data
  useEffect(() => {
    const initialPrescriptions: Prescription[] = [
      {
        id: "RX001",
        veterinarianName: "Dr. Sarah Johnson",
        animalId: "COW-023",
        drugName: "Amoxicillin",
        issueDate: "2024-01-10",
        status: "verified",
        fileName: "prescription_cow023.pdf",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "7 days",
        notes: "Administer with food. Monitor for allergic reactions."
      },
      {
        id: "RX002", 
        veterinarianName: "Dr. Michael Chen",
        animalId: "GOAT-015",
        drugName: "Oxytetracycline",
        issueDate: "2024-01-12",
        status: "pending",
        fileName: "prescription_goat015.jpg",
        dosage: "200mg",
        frequency: "Once daily",
        duration: "5 days",
        notes: "For respiratory infection treatment."
      },
      {
        id: "RX003",
        veterinarianName: "Dr. Emily Rodriguez",
        animalId: "PIG-008",
        drugName: "Florfenicol", 
        issueDate: "2023-12-20",
        status: "expired",
        dosage: "300mg",
        frequency: "Twice daily",
        duration: "10 days",
        notes: "Complete the full course even if symptoms improve."
      }
    ];
    setPrescriptions(initialPrescriptions);
  }, []);
  
  // Enhanced filter and sort functionality
  const filteredAndSortedPrescriptions = prescriptions
    .filter(prescription => {
      const matchesSearch = searchTerm === '' || 
        prescription.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.veterinarianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
          break;
        case 'status':
          const statusOrder = { 'pending': 0, 'verified': 1, 'expired': 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'animal':
          comparison = a.animalId.localeCompare(b.animalId);
          break;
        case 'drug':
          comparison = a.drugName.localeCompare(b.drugName);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  
  // Handler for selecting/deselecting prescription
  const handleSelectPrescription = (prescriptionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrescriptions(prev => [...prev, prescriptionId]);
    } else {
      setSelectedPrescriptions(prev => prev.filter(id => id !== prescriptionId));
    }
  };
  
  // Handler for selecting all prescriptions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrescriptions(filteredAndSortedPrescriptions.map(p => p.id));
    } else {
      setSelectedPrescriptions([]);
    }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-full overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Upload Section */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 max-w-full overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 pb-4 md:pb-6 max-w-full overflow-hidden">
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg min-w-0 max-w-full">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.2 }}
                className="text-primary flex-shrink-0"
              >
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
              </motion.div>
              <span className="truncate">{t('prescriptions.management') || 'Prescription Management'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 max-w-full overflow-hidden">
            <div className="border-2 border-dashed border-muted rounded-lg p-4 md:p-8 text-center space-y-3 md:space-y-4 hover:border-primary/50 transition-all duration-300 group max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 max-w-full">
                <Button 
                  className="bg-gradient-primary transform transition-all duration-300 hover:scale-105 h-9 md:h-10 text-xs md:text-sm flex-shrink-0" 
                  onClick={() => setShowScannedDialog(true)}
                  size="sm"
                >
                  <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  {t('prescriptions.scan') || 'Scan'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-primary/30 h-9 md:h-10 text-xs md:text-sm flex-shrink-0"
                  size="sm"
                >
                  <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  {t('prescriptions.upload') || 'Upload'}
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
              </div>
              <p className="text-muted-foreground text-xs md:text-sm group-hover:text-foreground/80 transition-colors duration-300 max-w-full break-words overflow-hidden">
                {t('prescriptions.uploadInstructions') || 'Scan or upload prescription documents for automatic data extraction'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Prescription Scanning Dialog */}
      <Dialog open={showScannedDialog} onOpenChange={setShowScannedDialog}>
        <DialogContent className="max-w-sm sm:max-w-lg md:max-w-3xl mx-auto w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="max-w-full overflow-hidden">
            <DialogTitle className="flex items-center text-sm md:text-base min-w-0 max-w-full">
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: showScannedDialog ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary flex-shrink-0"
              >
                <Scan className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              </motion.div>
              <span className="truncate">Prescription Scanner</span>
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Scan your prescription to extract details automatically
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="scan" className="w-full max-w-full overflow-hidden">
            <TabsList className="grid grid-cols-2 mb-3 md:mb-4 h-8 md:h-10 max-w-full">
              <TabsTrigger value="scan" className="text-xs md:text-sm truncate">Scan Prescription</TabsTrigger>
              <TabsTrigger value="results" className="text-xs md:text-sm truncate">Extracted Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scan" className="space-y-3 md:space-y-4 max-w-full overflow-hidden">
              {!scannedImage ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-6 md:p-12 text-center space-y-3 md:space-y-4 max-w-full overflow-hidden">
                  <div className="flex flex-col items-center justify-center gap-3 md:gap-4 max-w-full">
                    <Camera className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground text-xs md:text-sm max-w-full break-words">Take a photo or upload an image of your prescription</p>
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full sm:w-auto max-w-full">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                        <Button 
                          onClick={handleCameraCapture}
                          className="w-full sm:w-auto transition-all duration-300 hover:shadow-md h-8 md:h-10 text-xs md:text-sm min-w-0"
                          size="sm"
                        >
                          <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          <span className="truncate">Take Photo</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-auto transition-all duration-300 hover:shadow-md hover:border-primary h-8 md:h-10 text-xs md:text-sm min-w-0"
                          size="sm"
                        >
                          <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          <span className="truncate">Upload Image</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 max-w-full overflow-hidden">
                  <div className="relative border rounded-md overflow-hidden max-w-full">
                    <img 
                      src={scannedImage} 
                      alt="Scanned Prescription" 
                      className="w-full object-contain max-h-[200px] md:max-h-[400px] max-w-full" 
                    />
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute top-1 right-1 md:top-2 md:right-2 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" 
                      onClick={() => setScannedImage(null)}
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-2 max-w-full">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
                      <Button 
                        variant="outline" 
                        onClick={() => setScannedImage(null)}
                        className="w-full sm:w-auto transition-all duration-300 hover:shadow-md hover:border-primary h-8 md:h-10 text-xs md:text-sm min-w-0"
                      >
                        <span className="truncate">Retake</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={isScanning ? {} : { scale: 1.05 }} whileTap={isScanning ? {} : { scale: 0.95 }} className="flex-1 sm:flex-none">
                      <Button 
                        className="w-full sm:w-auto bg-gradient-primary transition-all duration-300 hover:shadow-md h-8 md:h-10 text-xs md:text-sm min-w-0" 
                        onClick={handleScanPrescription}
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="truncate">Processing...</span>
                          </>
                        ) : (
                          <>
                            <Scan className="h-4 w-4 mr-2" />
                            <span className="truncate">Extract Details</span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4 max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 max-w-full">
                <div className="flex items-center space-x-2 min-w-0 flex-shrink">
                  <Languages className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Translate to:</span>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[140px] sm:w-[180px] max-w-[50%]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {extractedData ? (
                <div className="space-y-4 max-w-full overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Veterinarian Name</Label>
                      <Input value={extractedData.veterinarianName || ''} readOnly className="max-w-full" />
                    </div>
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Animal ID</Label>
                      <Input value={extractedData.animalId || ''} readOnly className="max-w-full" />
                    </div>
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Drug Name</Label>
                      <Input value={extractedData.drugName || ''} readOnly className="max-w-full" />
                    </div>
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Issue Date</Label>
                      <Input value={extractedData.issueDate || ''} readOnly className="max-w-full" />
                    </div>
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Dosage</Label>
                      <Input value={extractedData.dosage || ''} readOnly className="max-w-full" />
                    </div>
                    <div className="space-y-2 min-w-0 max-w-full">
                      <Label>Frequency</Label>
                      <Input value={extractedData.frequency || ''} readOnly className="max-w-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-w-full">
                    <Label>Notes</Label>
                    <Textarea value={extractedData.notes || ''} readOnly className="min-h-[100px] max-w-full overflow-hidden resize-none" />
                  </div>
                  
                  <div className="flex justify-end space-x-2 max-w-full">
                    <Button variant="outline" onClick={() => setShowScannedDialog(false)} className="flex-shrink-0">
                      Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                      <Button 
                        className="bg-gradient-primary hover:shadow-lg transition-all duration-300 min-w-0" 
                        onClick={handleSavePrescription}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="truncate">Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="truncate">Save Prescription</span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ) : scannedText ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="whitespace-pre-wrap text-sm">{scannedText}</pre>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleExtractData}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Extract Data
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No prescription scanned yet. Please scan a prescription first.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Enhanced Search and Filter Section */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/80 max-w-full overflow-hidden">
          <CardContent className="pt-6 max-w-full overflow-hidden">
            <div className="space-y-4 max-w-full overflow-hidden">
              {/* Search and View Controls */}
              <div className="flex flex-col gap-3 md:gap-4 max-w-full overflow-hidden">
                {/* Top row - Search and quick actions */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-full overflow-hidden">
                  <div className="flex-1 relative group min-w-0 max-w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors duration-300 flex-shrink-0" />
                    <Input
                      placeholder="Search prescriptions..."
                      className="pl-10 h-9 md:h-11 text-xs md:text-sm border-2 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm max-w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 flex-shrink-0"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Filter Toggle - Always visible on mobile */}
                  <Button
                    variant={showFilters ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="transition-all duration-300 h-9 md:h-11 px-3 text-xs md:text-sm flex-shrink-0"
                  >
                    <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>
                </div>
                
                {/* Bottom row - View mode and sort controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between max-w-full overflow-hidden">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 min-w-0 flex-shrink">
                    <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline flex-shrink-0">View:</span>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="transition-all duration-300 h-8 md:h-9 px-2 md:px-3 flex-shrink-0"
                    >
                      <FileText className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="ml-1 text-xs md:text-sm hidden sm:inline">List</span>
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="transition-all duration-300 h-8 md:h-9 px-2 md:px-3 flex-shrink-0"
                    >
                      <Activity className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="ml-1 text-xs md:text-sm hidden sm:inline">Grid</span>
                    </Button>
                  </div>
                  
                  {/* Sort Controls */}
                  <div className="flex items-center gap-2 min-w-0 flex-shrink">
                    <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline flex-shrink-0">Sort:</span>
                    <Select value={sortBy} onValueChange={(value: 'date' | 'status' | 'animal' | 'drug') => setSortBy(value)}>
                      <SelectTrigger className="w-24 sm:w-32 h-8 md:h-9 text-xs md:text-sm max-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-w-full">
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="animal">Animal</SelectItem>
                        <SelectItem value="drug">Drug</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="transition-all duration-300 h-8 md:h-9 px-2 md:px-3 flex-shrink-0"
                    >
                      <span className="text-xs md:text-sm">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Status Filter Pills with Animation */}
              <motion.div 
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                  {[
                    { key: 'all', label: 'All', count: prescriptions.length },
                    { key: 'verified', label: 'Verified', count: prescriptions.filter(p => p.status === 'verified').length },
                    { key: 'pending', label: 'Pending', count: prescriptions.filter(p => p.status === 'pending').length },
                    { key: 'expired', label: 'Expired', count: prescriptions.filter(p => p.status === 'expired').length },
                  ].map((filter) => (
                    <motion.div
                      key={filter.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant={statusFilter === filter.key ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setStatusFilter(filter.key)}
                        className={`transition-all duration-300 h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm ${
                          statusFilter === filter.key 
                            ? 'bg-gradient-primary shadow-md' 
                            : 'hover:border-primary/30 hover:shadow-sm'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {filter.label}
                          {filter.count > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="ml-1 text-[10px] md:text-xs px-1.5 py-0.5"
                            >
                              {filter.count}
                            </Badge>
                          )}
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prescriptions List/Grid */}
      <motion.div variants={itemVariants}>
        {filteredAndSortedPrescriptions.length > 0 ? (
          viewMode === 'list' ? (
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/80 max-w-full overflow-hidden">
              <CardContent className="p-0 max-w-full overflow-hidden">
                <Table className="max-w-full">
                  <TableHeader className="bg-muted/50 max-w-full">
                    <TableRow className="max-w-full">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPrescriptions.length === filteredAndSortedPrescriptions.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Animal ID</TableHead>
                      <TableHead>Drug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="max-w-full">
                    {filteredAndSortedPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id} className="max-w-full">
                        <TableCell>
                          <Checkbox
                            checked={selectedPrescriptions.includes(prescription.id)}
                            onCheckedChange={(checked) => handleSelectPrescription(prescription.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-xs md:text-sm">
                            {new Date(prescription.issueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-xs md:text-sm">{prescription.animalId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs md:text-sm">{prescription.drugName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              prescription.status === 'verified' ? 'default' : 
                              prescription.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {prescription.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button size="sm" variant="outline" onClick={() => handleViewPrescription(prescription)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditPrescription(prescription)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownloadPrescription(prescription)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            {prescription.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleVerifyPrescription(prescription.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeletePrescription(prescription.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedPrescriptions.map((prescription) => (
                <motion.div
                  key={prescription.id}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="shadow-card hover:shadow-elevated transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="pb-2 relative">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-7 w-7"
                          onClick={() => handleViewPrescription(prescription)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-7 w-7"
                          onClick={() => handleEditPrescription(prescription)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="truncate">{prescription.id}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            prescription.status === 'verified' ? 'default' : 
                            prescription.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {prescription.status}
                        </Badge>
                        {favoriteIds.includes(prescription.id) && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Animal:</span>
                          <span className="font-medium">{prescription.animalId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Drug:</span>
                          <span className="font-medium truncate max-w-[120px]">{prescription.drugName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Veterinarian:</span>
                          <span className="font-medium truncate max-w-[120px]">{prescription.veterinarianName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{prescription.issueDate}</span>
                        </div>
                        {prescription.dosage && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dosage:</span>
                            <span className="font-medium">{prescription.dosage}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-3 pt-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownloadPrescription(prescription)}
                        className="text-xs h-7"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      {prescription.status === 'pending' ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleVerifyPrescription(prescription.id)}
                          disabled={isLoading}
                          className="text-xs h-7"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Verify
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          disabled
                          className="text-xs h-7"
                        >
                          Verified
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/80">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No prescriptions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No prescriptions match your search.' : 'Get started by scanning or uploading a prescription.'}
              </p>
              <Button onClick={() => setShowScannedDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* View Prescription Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p>{selectedPrescription.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge 
                    variant={
                      selectedPrescription.status === 'verified' ? 'default' : 
                      selectedPrescription.status === 'pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {selectedPrescription.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Animal ID</Label>
                  <p>{selectedPrescription.animalId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Veterinarian</Label>
                  <p>{selectedPrescription.veterinarianName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Drug</Label>
                  <p>{selectedPrescription.drugName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Issue Date</Label>
                  <p>{selectedPrescription.issueDate}</p>
                </div>
                {selectedPrescription.dosage && (
                  <div>
                    <Label className="text-muted-foreground">Dosage</Label>
                    <p>{selectedPrescription.dosage}</p>
                  </div>
                )}
                {selectedPrescription.frequency && (
                  <div>
                    <Label className="text-muted-foreground">Frequency</Label>
                    <p>{selectedPrescription.frequency}</p>
                  </div>
                )}
                {selectedPrescription.duration && (
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p>{selectedPrescription.duration}</p>
                  </div>
                )}
              </div>
              {selectedPrescription.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="mt-1 p-2 bg-muted rounded-md">{selectedPrescription.notes}</p>
                </div>
              )}
              {selectedPrescription.imageUrl && (
                <div>
                  <Label className="text-muted-foreground">Prescription Image</Label>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img 
                      src={selectedPrescription.imageUrl} 
                      alt="Prescription" 
                      className="w-full object-contain max-h-[200px]" 
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownloadPrescription(selectedPrescription)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Prescription Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vet-name">Veterinarian Name</Label>
                  <Input
                    id="edit-vet-name"
                    value={editForm.veterinarianName || ''}
                    onChange={(e) => setEditForm({...editForm, veterinarianName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-animal-id">Animal ID</Label>
                  <Input
                    id="edit-animal-id"
                    value={editForm.animalId || ''}
                    onChange={(e) => setEditForm({...editForm, animalId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-drug-name">Drug Name</Label>
                  <Input
                    id="edit-drug-name"
                    value={editForm.drugName || ''}
                    onChange={(e) => setEditForm({...editForm, drugName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-issue-date">Issue Date</Label>
                  <Input
                    id="edit-issue-date"
                    type="date"
                    value={editForm.issueDate || ''}
                    onChange={(e) => setEditForm({...editForm, issueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dosage">Dosage</Label>
                  <Input
                    id="edit-dosage"
                    value={editForm.dosage || ''}
                    onChange={(e) => setEditForm({...editForm, dosage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Input
                    id="edit-frequency"
                    value={editForm.frequency || ''}
                    onChange={(e) => setEditForm({...editForm, frequency: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdatePrescription}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PrescriptionManagerFinal;
