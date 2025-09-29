import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Filter
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
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
  
  // Handler for extracting structured data from OCR text
  const handleExtractData = () => {
    if (!scannedText) return;
    
    // Simple extraction with regex patterns
    const extractVeterinarian = /(?:veterinarian|doctor|dr\.?|vet\.?)[\s\S]*?:?\s*([A-Z][a-zA-Z\s\.]+)/i;
    const extractAnimalId = /(?:animal|patient|id)[\s\S]*?:?\s*([A-Z0-9\-_]+)/i;
    const extractDrug = /(?:medication|prescription|drug)[\s\S]*?:?\s*([A-Z][a-zA-Z\s]+)/i;
    const extractDosage = /(?:dosage|dose)[\s\S]*?:?\s*([\d\s\w\/\.]+)/i;
    const extractFrequency = /(?:frequency|times)[\s\S]*?:?\s*([\d\w\s]+)/i;
    const extractDate = /(?:date|issued)[\s\S]*?:?\s*(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    
    const veterinarianMatch = scannedText.match(extractVeterinarian);
    const animalIdMatch = scannedText.match(extractAnimalId);
    const drugMatch = scannedText.match(extractDrug);
    const dosageMatch = scannedText.match(extractDosage);
    const frequencyMatch = scannedText.match(extractFrequency);
    const dateMatch = scannedText.match(extractDate);
    
    const extracted: Partial<Prescription> = {
      veterinarianName: veterinarianMatch?.[1] ? String(veterinarianMatch[1]).trim() : '',
      animalId: animalIdMatch?.[1] ? String(animalIdMatch[1]).trim() : '',
      drugName: drugMatch?.[1] ? String(drugMatch[1]).trim() : '',
      dosage: dosageMatch?.[1] ? String(dosageMatch[1]).trim() : '',
      frequency: frequencyMatch?.[1] ? String(frequencyMatch[1]).trim() : '',
      issueDate: dateMatch?.[1] ? String(dateMatch[1]).trim() : new Date().toISOString().split('T')[0],
      imageUrl: scannedImage || undefined,
      status: 'pending'
    };
    
    setExtractedData(extracted);
  };
  
  // Handler for saving prescription
  const handleSavePrescription = async () => {
    if (!extractedData) {
      toast({
        title: "No Data Extracted",
        description: "Please scan a prescription first and extract the data.",
        variant: "destructive"
      });
      return;
    }
    
    try {
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
      
      toast({
        title: "✅ Prescription Saved Successfully!",
        description: `Prescription ${newPrescription.id} has been added to your records.`,
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
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Upload Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Prescription Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => setShowScannedDialog(true)}
                size="sm"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Scan or upload prescription documents for automatic data extraction
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Prescription Scanning Dialog */}
      <Dialog open={showScannedDialog} onOpenChange={setShowScannedDialog}>
        <DialogContent className="max-w-3xl mx-auto w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Scan className="h-5 w-5 mr-2" />
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
                <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Take a photo or upload an image of your prescription</p>
                    <div className="flex gap-4">
                      <Button 
                        onClick={handleCameraCapture}
                        size="sm"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
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
                    <Button 
                      variant="outline" 
                      onClick={() => setScannedImage(null)}
                    >
                      Retake
                    </Button>
                    <Button 
                      className="bg-gradient-primary" 
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
                    <Button 
                      className="bg-gradient-primary" 
                      onClick={handleSavePrescription}
                    >
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
    </div>
  );
};