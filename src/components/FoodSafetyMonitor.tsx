import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Database,
  Zap,
  Eye
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Food categories with their contaminants
const FOOD_CATEGORIES = [
  { id: "milk", name: "Milk", icon: "🥛" },
  { id: "honey", name: "Honey", icon: "🍯" },
  { id: "meat", name: "Meat", icon: "🥩" },
  { id: "fish", name: "Fish", icon: "🐟" },
  { id: "cereals", name: "Cereals", icon: "🌾" },
  { id: "fruits", name: "Fruits/Vegetables", icon: "🍎" },
  { id: "beverages", name: "Packaged Beverages", icon: "🥤" }
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

export const FoodSafetyMonitor = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [labData, setLabData] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });
  const [sampleId, setSampleId] = useState<string>("");
  const [collectionDate, setCollectionDate] = useState<string>("");
  const [farmLocation, setFarmLocation] = useState<string>("");

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

  // Handle file upload simulation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUploaded(true);
      // Simulate file processing
      setTimeout(() => {
        // Generate mock lab data based on selected category
        if (selectedCategory) {
          const contaminants = CONTAMINANTS_MAP[selectedCategory] || [];
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
    setSelectedCategory("");
    setLabData([]);
    setTestResults([]);
    setFileUploaded(false);
    setSampleId("");
    setCollectionDate("");
    setFarmLocation("");
  };

  // Export results
  const exportResults = () => {
    // In a real implementation, this would export to PDF/Excel
    const dataStr = JSON.stringify({
      sampleId,
      collectionDate,
      foodCategory: selectedCategory,
      farmLocation,
      results: testResults,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `food-safety-report-${sampleId || 'sample'}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Get AMU inference for a contaminant
  const getAMUInference = (contaminant: string) => {
    return AMU_INFERENCE_MAP[contaminant] || ["General livestock"];
  };

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto space-y-4 px-2 sm:px-4 md:px-6 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
          <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 w-full overflow-hidden">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg w-full min-w-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
              <span className="truncate">{t("foodSafety.title") || "Food Safety Monitoring System"}</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Sample Information */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
          <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 w-full">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Database className="h-4 w-4 text-primary" />
              <span>{t("foodSafety.sampleInfo") || "Sample Information"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="sampleId" className="text-xs sm:text-sm">{t("foodSafety.sampleId") || "Sample ID"}</Label>
                <Input
                  id="sampleId"
                  placeholder={t("foodSafety.sampleIdPlaceholder") || "e.g., FS-2023-001"}
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="collectionDate" className="text-xs sm:text-sm">{t("foodSafety.collectionDate") || "Collection Date"}</Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="farmLocation" className="text-xs sm:text-sm">{t("foodSafety.farmLocation") || "Farm Location"}</Label>
                <Input
                  id="farmLocation"
                  placeholder={t("foodSafety.locationPlaceholder") || "e.g., Village Name, District"}
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Food Category Selection */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
          <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 w-full">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Search className="h-4 w-4 text-primary" />
              <span>{t("foodSafety.category") || "Select Food Category"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 w-full">
              {FOOD_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-16 sm:h-20 md:h-24 p-2 rounded-lg transition-all ${
                    selectedCategory === category.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="text-lg sm:text-xl md:text-2xl mb-1">{category.icon}</span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-center truncate w-full">
                    {t(`foodSafety.${category.id}`) || category.name}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lab Data Upload */}
      {selectedCategory && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
            <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 w-full">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Upload className="h-4 w-4 text-primary" />
                <span>{t("foodSafety.upload") || "Upload Lab Test Data"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 w-full">
              <div className="space-y-4 w-full">
                <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 w-full">
                    <Label 
                      htmlFor="lab-data-upload" 
                      className="cursor-pointer flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 sm:h-10 rounded-md px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {fileUploaded ? t("fileUploaded") || "File Uploaded" : t("uploadFile") || "Upload File"}
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
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                      onClick={() => document.getElementById('lab-data-upload')?.click()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("sampleData") || "Sample Data"}
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm w-full">
                    {t("foodSafety.uploadInstructions") || `Upload LC-MS/MS, ELISA, GC-MS or other lab test results for ${FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
                  </p>
                </div>

                {labData.length > 0 && (
                  <div className="space-y-3 w-full">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="font-semibold text-sm sm:text-base">{t("foodSafety.uploadedData") || "Uploaded Contaminants Data"}</h3>
                      <Button 
                        onClick={analyzeData} 
                        disabled={isAnalyzing}
                        className="h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            {t("loading") || "Analyzing..."}
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            {t("foodSafety.analyze") || "Analyze Data"}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">{t("foodSafety.contaminant") || "Contaminant"}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("type") || "Type"}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("foodSafety.method") || "Method"}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("foodSafety.detected") || "Detected Level"}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("foodSafety.mrl") || "MRL (FSSAI)"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {labData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-xs sm:text-sm font-medium">{item.name}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge variant="outline" className="text-[8px] sm:text-[10px]">
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">{item.method}</TableCell>
                              <TableCell className="text-xs sm:text-sm">{item.detectedLevel} {item.unit}</TableCell>
                              <TableCell className="text-xs sm:text-sm">{item.mrl} {item.unit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
            <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{t("foodSafety.compliance") || "Compliance Report"}</span>
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={exportResults}
                    variant="outline" 
                    size={screenSize.isMobile ? "sm" : "default"}
                    className="h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("foodSafety.export") || "Export"}
                  </Button>
                  <Button 
                    onClick={resetForm}
                    variant="outline" 
                    size={screenSize.isMobile ? "sm" : "default"}
                    className="h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("newTest") || "New Test"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 w-full">
              <div className="space-y-4 w-full">
                <div className="border rounded-lg overflow-hidden w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">{t("foodItem") || "Food Item"}</TableHead>
                        <TableHead className="text-xs sm:text-sm">{t("foodSafety.contaminant") || "Contaminant"}</TableHead>
                        <TableHead className="text-xs sm:text-sm">{t("foodSafety.detected") || "Detected Level"}</TableHead>
                        <TableHead className="text-xs sm:text-sm">{t("foodSafety.mrl") || "MRL"}</TableHead>
                        <TableHead className="text-xs sm:text-sm">{t("foodSafety.result") || "Result"}</TableHead>
                        <TableHead className="text-xs sm:text-sm">{t("foodSafety.inference") || "AMU Inference"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs sm:text-sm font-medium">
                            {t(`foodSafety.${selectedCategory}`) || FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <Badge variant="outline" className="text-[8px] sm:text-[10px] w-fit mt-1">
                                {item.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.detectedLevel} {item.unit}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.mrl} {item.unit}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {item.status === "safe" && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px] sm:text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t("foodSafety.safe") || "Safe ✅"}
                              </Badge>
                            )}
                            {item.status === "warning" && (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-[10px] sm:text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t("foodSafety.warning") || "Warning ⚠️"}
                              </Badge>
                            )}
                            {item.status === "unsafe" && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-[10px] sm:text-xs">
                                <XCircle className="h-3 w-3 mr-1" />
                                {t("foodSafety.unsafe") || "Unsafe ❌"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex flex-wrap gap-1">
                              {getAMUInference(item.name).map((animal, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[8px] sm:text-[10px]">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                  <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">{t("foodSafety.safe") || "Safe Items"}</p>
                          <p className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200">
                            {testResults.filter(r => r.status === "safe").length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-200">{t("foodSafety.warning") || "Warnings"}</p>
                          <p className="text-lg sm:text-xl font-bold text-yellow-800 dark:text-yellow-200">
                            {testResults.filter(r => r.status === "warning").length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-200">{t("foodSafety.unsafe") || "Unsafe Items"}</p>
                          <p className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200">
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
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-semibold text-sm sm:text-base mb-2 text-destructive flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {t("foodSafety.recommendations") || "Recommended Actions"}
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-destructive">
                        {testResults.filter(r => r.status === "unsafe").map((item, index) => (
                          <li key={index}>
                            <span className="font-medium">{item.name}</span> {t("foodSafety.exceedsMRL") || "exceeds MRL by"} {((parseFloat(item.detectedLevel) / item.mrl * 100) - 100).toFixed(1)}%. 
                            {t("foodSafety.immediateWithdrawal") || " Immediate withdrawal of product and investigation of AMU practices required."}
                          </li>
                        ))}
                        {testResults.filter(r => r.status === "warning").map((item, index) => (
                          <li key={index}>
                            <span className="font-medium">{item.name}</span> {t("foodSafety.closeToLimit") || "is close to MRL limit."} 
                            {t("foodSafety.reviewAMU") || " Review AMU protocols and increase monitoring frequency."}
                          </li>
                        ))}
                        <li>{t("foodSafety.implementStricter") || "Implement stricter withdrawal periods for all antimicrobial usage"}</li>
                        <li>{t("foodSafety.conductSurveys") || "Conduct farm-level surveys to correlate detected residues with veterinary drug usage"}</li>
                        <li>{t("foodSafety.reviewProcedures") || "Review and update AMU tracking procedures"}</li>
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* AMU Correlation Insights */}
                <Card className="border-primary/50 bg-primary/5 dark:bg-primary/10">
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold text-sm sm:text-base mb-2 text-primary flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {t("foodSafety.amuInsights") || "AMU Correlation Insights"}
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm text-primary">
                      <p>
                        {t("foodSafety.insightText1") || "Based on detected contaminants, the following animals may have been treated with antimicrobials:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(testResults.flatMap(r => getAMUInference(r.name)))).map((animal, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs">
                            {animal}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2">
                        {t("foodSafety.insightText2") || "Recommend reviewing AMU records for these animals and implementing stricter withdrawal periods."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};