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
  Loader2
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, Variants } from "framer-motion";

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
  const [isScanning, setIsScanning] = useState(false);
  const [showScannedDialog, setShowScannedDialog] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<Prescription> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Animation variants for staggered animations
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
  
  // Handler for saving prescription
  const handleSavePrescription = () => {
    if (!extractedData) return;
    
    // In a real app, you would save this to your database
    alert('Prescription saved successfully!');
    setShowScannedDialog(false);
    
    // Reset states
    setScannedImage(null);
    setScannedText(null);
    setExtractedData(null);
  };
  
  const prescriptions: Prescription[] = [
    {
      id: "RX001",
      veterinarianName: "Dr. Sarah Johnson",
      animalId: "COW-023",
      drugName: "Amoxicillin",
      issueDate: "2024-01-10",
      status: "verified",
      fileName: "prescription_cow023.pdf"
    },
    {
      id: "RX002", 
      veterinarianName: "Dr. Michael Chen",
      animalId: "GOAT-015",
      drugName: "Oxytetracycline",
      issueDate: "2024-01-12",
      status: "pending",
      fileName: "prescription_goat015.jpg"
    },
    {
      id: "RX003",
      veterinarianName: "Dr. Emily Rodriguez",
      animalId: "PIG-008",
      drugName: "Florfenicol", 
      issueDate: "2023-12-20",
      status: "expired"
    }
  ];

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
                    <Button className="bg-gradient-primary" onClick={handleSavePrescription}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Prescription
                    </Button>
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

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prescriptions by animal ID, drug name, or veterinarian"
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Verified</Button>
              <Button variant="outline" size="sm">Pending</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} className="shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="font-mono">
                      {prescription.id}
                    </Badge>
                    <AlertBadge 
                      type={prescription.status === "verified" ? "compliant" : 
                           prescription.status === "pending" ? "warning" : "urgent"}
                    >
                      {prescription.status.toUpperCase()}
                    </AlertBadge>
                    <Badge variant="secondary">
                      {prescription.animalId}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Veterinarian:</span>
                      <br />
                      <span className="text-muted-foreground">{prescription.veterinarianName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Drug:</span>
                      <br />
                      <span className="text-muted-foreground">{prescription.drugName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Issue Date:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {new Date(prescription.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {prescription.fileName && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{prescription.fileName}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 md:ml-4">
                  <Button variant="outline" size="sm" className="w-full md:w-auto">
                    <Eye className="h-3 w-3 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full md:w-auto">
                    <Download className="h-3 w-3 mr-2" />
                    Download
                  </Button>
                  {prescription.status === "pending" && (
                    <Button size="sm" className="w-full md:w-auto bg-gradient-primary">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">12</div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">1</div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};