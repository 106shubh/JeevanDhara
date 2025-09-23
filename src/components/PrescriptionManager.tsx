import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export const PrescriptionManager = () => {
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
  
  // Handler for scanning prescription
  const handleScanPrescription = async () => {
    if (!scannedImage) return;
    
    setIsScanning(true);
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR result
      const mockOcrText = `VETERINARY PRESCRIPTION

Date: 2024-09-15
Veterinarian: Dr. Rajesh Kumar
License: VET-2023-45678

Animal ID: COW-042
Species: Cattle
Breed: Holstein

Prescription:
- Amoxicillin 500mg
- Dosage: 10mg/kg body weight
- Frequency: Twice daily
- Duration: 7 days

Notes: Administer with food. Monitor for allergic reactions.
Withdrawal period: 7 days for milk, 14 days for meat.`;
      
      setScannedText(mockOcrText);
    } catch (error) {
      console.error('Error scanning prescription:', error);
      alert('Error scanning prescription. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };
  
  // Handler for extracting structured data from OCR text
  const handleExtractData = () => {
    if (!scannedText) return;
    
    // In a real app, you would use NLP or a more sophisticated parsing algorithm
    // This is a simple regex-based extraction for demo purposes
    const extractVeterinarian = /Veterinarian:\s*([^\n]+)/i;
    const extractAnimalId = /Animal ID:\s*([^\n]+)/i;
    const extractDrug = /Prescription:[\s\S]*?-\s*([^\n]+)/i;
    const extractDosage = /Dosage:\s*([^\n]+)/i;
    const extractFrequency = /Frequency:\s*([^\n]+)/i;
    const extractDate = /Date:\s*([^\n]+)/i;
    const extractNotes = /Notes:\s*([^\n]+)/i;
    
    const veterinarianMatch = scannedText.match(extractVeterinarian);
    const animalIdMatch = scannedText.match(extractAnimalId);
    const drugMatch = scannedText.match(extractDrug);
    const dosageMatch = scannedText.match(extractDosage);
    const frequencyMatch = scannedText.match(extractFrequency);
    const dateMatch = scannedText.match(extractDate);
    const notesMatch = scannedText.match(extractNotes);
    
    const extracted: Partial<Prescription> = {
      veterinarianName: veterinarianMatch?.[1] || '',
      animalId: animalIdMatch?.[1] || '',
      drugName: drugMatch?.[1] || '',
      dosage: dosageMatch?.[1] || '',
      frequency: frequencyMatch?.[1] || '',
      issueDate: dateMatch?.[1] || '',
      notes: notesMatch?.[1] || '',
      imageUrl: scannedImage || undefined,
      status: 'pending'
    };
    
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
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Upload Section */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300">
            <CardTitle className="flex items-center space-x-2">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.2 }}
                className="text-primary"
              >
                <FileText className="h-5 w-5" />
              </motion.div>
              <span>{t('prescriptions.management')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex justify-center space-x-4">
                <Button 
                  className="bg-gradient-primary transform transition-all duration-300 hover:scale-105" 
                  onClick={() => setShowScannedDialog(true)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {t('prescriptions.scan')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-primary/30"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('prescriptions.upload')}
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
              </div>
              <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors duration-300">
                {t('prescriptions.uploadInstructions')}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Prescription Scanning Dialog */}
      <Dialog open={showScannedDialog} onOpenChange={setShowScannedDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: showScannedDialog ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                <Scan className="h-5 w-5 mr-2" />
              </motion.div>
              Prescription Scanner
            </DialogTitle>
            <DialogDescription>
              Scan your prescription to extract details automatically
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="scan">Scan Prescription</TabsTrigger>
              <TabsTrigger value="results">Extracted Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scan" className="space-y-4">
              {!scannedImage ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center space-y-4">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Take a photo or upload an image of your prescription</p>
                    <div className="flex gap-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={handleCameraCapture}
                          className="transition-all duration-300 hover:shadow-md"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="transition-all duration-300 hover:shadow-md hover:border-primary"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative border rounded-md overflow-hidden">
                    <img 
                      src={scannedImage} 
                      alt="Scanned Prescription" 
                      className="w-full object-contain max-h-[400px]" 
                    />
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute top-2 right-2" 
                      onClick={() => setScannedImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        onClick={() => setScannedImage(null)}
                        className="transition-all duration-300 hover:shadow-md hover:border-primary"
                      >
                        Retake
                      </Button>
                    </motion.div>
                    <motion.div whileHover={isScanning ? {} : { scale: 1.05 }} whileTap={isScanning ? {} : { scale: 0.95 }}>
                      <Button 
                        className="bg-gradient-primary transition-all duration-300 hover:shadow-md" 
                        onClick={handleScanPrescription}
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Scan className="h-4 w-4 mr-2" />
                            Extract Details
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4" />
                  <span className="text-sm font-medium">Translate to:</span>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {extractedData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Veterinarian Name</Label>
                      <Input value={extractedData.veterinarianName || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Animal ID</Label>
                      <Input value={extractedData.animalId || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Drug Name</Label>
                      <Input value={extractedData.drugName || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input value={extractedData.issueDate || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input value={extractedData.dosage || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input value={extractedData.frequency || ''} readOnly />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea value={extractedData.notes || ''} readOnly className="min-h-[100px]" />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowScannedDialog(false)}>
                      Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        className="bg-gradient-primary hover:shadow-lg transition-all duration-300" 
                        onClick={handleSavePrescription}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Save Prescription
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
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/80">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search and View Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors duration-300" />
                  <Input
                    placeholder="Search prescriptions by ID, animal, drug, or veterinarian..."
                    className="pl-10 h-11 border-2 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="transition-all duration-300"
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(value: 'date' | 'status' | 'animal' | 'drug') => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                    className="transition-all duration-300"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
                
                {/* Filter Toggle */}
                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="transition-all duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              {/* Status Filter Pills with Animation */}
              <motion.div 
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
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
                        className={`transition-all duration-300 ${
                          statusFilter === filter.key 
                            ? 'bg-gradient-primary shadow-md' 
                            : 'hover:border-primary/30 hover:shadow-sm'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {filter.label}
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {filter.count}
                          </Badge>
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredAndSortedPrescriptions.length} of {prescriptions.length} prescriptions
                  {searchTerm && ` for "${searchTerm}"`}
                </span>
                {filteredAndSortedPrescriptions.length > 0 && (
                  <span>Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})</span>
                )}
              </div>
              
              {/* Bulk Actions with Enhanced UI */}
              {selectedPrescriptions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-foreground">
                          {selectedPrescriptions.length} prescription{selectedPrescriptions.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedPrescriptions([])}
                        className="h-6 w-6 p-0 hover:bg-destructive/20"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          onClick={handleBulkVerify}
                          className="bg-gradient-primary hover:shadow-md transition-all duration-300"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Verify Selected
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={handleBulkDelete}
                          disabled={isLoading}
                          className="hover:shadow-md transition-all duration-300"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete Selected
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Prescriptions List */}
      <motion.div variants={itemVariants} key={animationKey}>
        <div className="space-y-4">
          {/* Enhanced Header with select all */}
          {filteredAndSortedPrescriptions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-primary/20"
            >
              <Checkbox
                checked={selectedPrescriptions.length === filteredAndSortedPrescriptions.length && filteredAndSortedPrescriptions.length > 0}
                onCheckedChange={handleSelectAll}
                className="border-2"
              />
              <span className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {selectedPrescriptions.length === filteredAndSortedPrescriptions.length && filteredAndSortedPrescriptions.length > 0 ? 'Deselect All' : 'Select All'} 
                <Badge variant="outline" className="ml-1">
                  {filteredAndSortedPrescriptions.length} prescription{filteredAndSortedPrescriptions.length !== 1 ? 's' : ''}
                </Badge>
              </span>
              
              {/* Quick Stats */}
              <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{filteredAndSortedPrescriptions.filter(p => p.status === 'verified').length} verified</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>{filteredAndSortedPrescriptions.filter(p => p.status === 'pending').length} pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{filteredAndSortedPrescriptions.filter(p => p.status === 'expired').length} expired</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {filteredAndSortedPrescriptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-card border-2 border-dashed border-muted-foreground/20">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No Matching Prescriptions' : 'No Prescriptions Yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search terms or filter criteria to find what you\'re looking for.' 
                        : 'Get started by scanning or uploading your first prescription using the tools above.'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button 
                        onClick={() => setShowScannedDialog(true)}
                        className="bg-gradient-primary hover:shadow-lg transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Prescription
                      </Button>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            }`}>
              {filteredAndSortedPrescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription.id}
                  variants={cardVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  layout
                  layoutId={prescription.id}
                >
                  <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 overflow-hidden group relative">
                    {/* Status Indicator Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      prescription.status === 'verified' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      prescription.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`} />
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedPrescriptions.includes(prescription.id)}
                            onCheckedChange={(checked) => handleSelectPrescription(prescription.id, checked as boolean)}
                            className="mt-1 border-2"
                          />
                          
                          {/* Favorite Toggle */}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const isFavorite = favoriteIds.includes(prescription.id);
                              if (isFavorite) {
                                setFavoriteIds(prev => prev.filter(id => id !== prescription.id));
                              } else {
                                setFavoriteIds(prev => [...prev, prescription.id]);
                              }
                            }}
                            className="mt-1"
                          >
                            <Star 
                              className={`h-4 w-4 transition-colors duration-200 ${
                                favoriteIds.includes(prescription.id) 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-muted-foreground hover:text-yellow-500'
                              }`} 
                            />
                          </motion.button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 flex-wrap mb-3">
                              <Badge variant="outline" className="font-mono text-xs">
                                {prescription.id}
                              </Badge>
                              <AlertBadge 
                                type={prescription.status === "verified" ? "compliant" : 
                                     prescription.status === "pending" ? "warning" : "urgent"}
                              >
                                {prescription.status.toUpperCase()}
                              </AlertBadge>
                              <Badge variant="secondary" className="text-xs">
                                {prescription.animalId}
                              </Badge>
                              {favoriteIds.includes(prescription.id) && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Favorite
                                </Badge>
                              )}
                            </div>
                            
                            <div className={`grid gap-3 text-sm ${
                              viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            }`}>
                              <div className="space-y-1">
                                <span className="font-medium text-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Veterinarian
                                </span>
                                <p className="text-muted-foreground truncate">{prescription.veterinarianName}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-foreground flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  Drug
                                </span>
                                <p className="text-muted-foreground truncate">{prescription.drugName}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Dosage
                                </span>
                                <p className="text-muted-foreground">{prescription.dosage || 'Not specified'}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium text-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Issue Date
                                </span>
                                <p className="text-muted-foreground">
                                  {new Date(prescription.issueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {prescription.notes && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground"
                              >
                                <span className="font-medium">Notes: </span>
                                <span className="line-clamp-2">{prescription.notes}</span>
                              </motion.div>
                            )}
                            
                            {prescription.fileName && (
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                                <FileText className="h-3 w-3" />
                                <span className="truncate">{prescription.fileName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:border-primary/30 hover:shadow-sm transition-all duration-300 text-xs"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:border-primary/30 hover:shadow-sm transition-all duration-300 text-xs"
                            onClick={() => handleDownloadPrescription(prescription)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-1" />
                            )}
                            Download
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:border-primary/30 hover:shadow-sm transition-all duration-300 text-xs"
                            onClick={() => handleEditPrescription(prescription)}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </motion.div>
                        
                        {prescription.status === "pending" && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary hover:shadow-md transition-all duration-300 text-xs"
                              onClick={() => handleVerifyPrescription(prescription.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Verify
                            </Button>
                          </motion.div>
                        )}
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="hover:shadow-sm transition-all duration-300 text-xs ml-auto"
                            onClick={() => handleDeletePrescription(prescription.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 mr-1" />
                            )}
                            Delete
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{prescriptions.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{prescriptions.filter(p => p.status === 'verified').length}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{prescriptions.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{prescriptions.filter(p => p.status === 'expired').length}</div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* View Prescription Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              View Prescription - {selectedPrescription?.id}
            </DialogTitle>
            <DialogDescription>
              Complete prescription details and information
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Prescription ID</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.id}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="p-2">
                    <AlertBadge 
                      type={selectedPrescription.status === "verified" ? "compliant" : 
                           selectedPrescription.status === "pending" ? "warning" : "urgent"}
                    >
                      {selectedPrescription.status.toUpperCase()}
                    </AlertBadge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Veterinarian Name</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.veterinarianName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Animal ID</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.animalId}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Drug Name</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.drugName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Issue Date</Label>
                  <div className="p-2 bg-muted rounded border text-sm">
                    {new Date(selectedPrescription.issueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dosage</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.dosage || 'Not specified'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frequency</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.frequency || 'Not specified'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Duration</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.duration || 'Not specified'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">File Name</Label>
                  <div className="p-2 bg-muted rounded border text-sm">{selectedPrescription.fileName || 'No file'}</div>
                </div>
              </div>
              
              {selectedPrescription.notes && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <div className="p-3 bg-muted rounded border text-sm">{selectedPrescription.notes}</div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => handleDownloadPrescription(selectedPrescription)}
                  className="bg-gradient-primary"
                >
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Edit Prescription - {selectedPrescription?.id}
            </DialogTitle>
            <DialogDescription>
              Update prescription details and information
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-veterinarian">Veterinarian Name *</Label>
                  <Input
                    id="edit-veterinarian"
                    value={editForm.veterinarianName || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, veterinarianName: e.target.value }))}
                    placeholder="Enter veterinarian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-animal">Animal ID *</Label>
                  <Input
                    id="edit-animal"
                    value={editForm.animalId || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, animalId: e.target.value }))}
                    placeholder="Enter animal ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-drug">Drug Name *</Label>
                  <Input
                    id="edit-drug"
                    value={editForm.drugName || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, drugName: e.target.value }))}
                    placeholder="Enter drug name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Issue Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editForm.issueDate || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dosage">Dosage</Label>
                  <Input
                    id="edit-dosage"
                    value={editForm.dosage || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Input
                    id="edit-frequency"
                    value={editForm.frequency || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 7 days"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status || ''}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as 'verified' | 'pending' | 'expired' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdatePrescription}
                  className="bg-gradient-primary hover:shadow-lg transition-all duration-300"
                  disabled={!editForm.veterinarianName || !editForm.animalId || !editForm.drugName || !editForm.issueDate || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Prescription
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