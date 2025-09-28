import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Database,
  Zap,
  Eye,
  Plus,
  Save
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

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
  const { user } = useAuth();
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
  const [labReference, setLabReference] = useState<string>("");
  const [contaminants, setContaminants] = useState<Tables<"food_safety_contaminants">[]>([]);
  const [sampleIdError, setSampleIdError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSampleId, setSavedSampleId] = useState<string | null>(null);

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

  // Load contaminants for the selected category
  useEffect(() => {
    if (selectedCategory && user) {
      loadContaminantsForCategory(selectedCategory);
    }
  }, [selectedCategory, user]);

  // Log when labData changes
  useEffect(() => {
    console.log('Lab data updated:', labData);
    console.log('Lab data length:', labData.length);
  }, [labData]);

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

  // Load contaminants for a specific food category
  const loadContaminantsForCategory = async (category: string) => {
    try {
      console.log('Loading contaminants for category:', category);
      
      // For now, we'll load all contaminants since we don't have category-specific filtering in the database
      // In a production implementation, this would filter by category
      const { data, error } = await supabase
        .from('food_safety_contaminants')
        .select('*')
        .limit(20);
      
      if (error) throw error;
      
      setContaminants(data || []);
      
      // Initialize lab data with values for each contaminant
      const initialLabData = data?.map(contaminant => ({
        id: contaminant.id,
        name: contaminant.name,
        type: contaminant.contaminant_type,
        mrl: contaminant.mrl_limit,
        unit: contaminant.unit || "mg/kg",
        method: contaminant.test_method,
        detectedLevel: "",
        status: "pending"
      })) || [];
      
      setLabData(initialLabData);
      
      // Log for debugging
      console.log('Loaded contaminants:', data);
      console.log('Initialized lab data:', initialLabData);
      console.log('Lab data length:', initialLabData.length);
    } catch (error) {
      console.error('Error loading contaminants:', error);
    }
  };

  // Handle manual data entry
  const handleDetectedLevelChange = (contaminantId: string, value: string) => {
    setLabData(prev => prev.map(item => 
      item.id === contaminantId 
        ? { ...item, detectedLevel: value } 
        : item
    ));
  };

  // Analyze the data and compare with MRL values
  const analyzeData = () => {
    if (labData.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Process the data
    const results = labData.map(item => {
      if (!item.detectedLevel || item.detectedLevel === "") {
        return {
          ...item,
          status: "pending"
        };
      }
      
      const detected = parseFloat(item.detectedLevel);
      const mrl = item.mrl;
      
      if (isNaN(detected) || mrl === null) {
        return {
          ...item,
          status: "pending"
        };
      }
      
      let status: "safe" | "warning" | "unsafe" = "safe";
      
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
  };

  // Save the sample and test results to the database
  const saveSample = async () => {
    if (!user || !sampleId || !collectionDate || !selectedCategory) {
      setSampleIdError("Please fill in all required fields");
      return;
    }
    
    setSampleIdError("");
    setIsSaving(true);
    
    try {
      // First, create the sample record
      const { data: sampleData, error: sampleError } = await supabase
        .from('food_safety_samples')
        .insert({
          user_id: user.id,
          sample_id: sampleId,
          food_category: selectedCategory as any,
          collection_date: collectionDate,
          farm_location: farmLocation,
          lab_reference: labReference
        })
        .select()
        .single();
      
      if (sampleError) throw sampleError;
      
      // Then, create test results for each contaminant with detected levels
      const resultsToSave = testResults
        .filter(result => result.detectedLevel && result.detectedLevel !== "")
        .map(result => ({
          sample_id: sampleData.id,
          contaminant_id: result.id,
          detected_level: parseFloat(result.detectedLevel),
          status: result.status,
          notes: `Detected level: ${result.detectedLevel} ${result.unit}`
        }));
      
      if (resultsToSave.length > 0) {
        const { error: resultsError } = await supabase
          .from('food_safety_test_results')
          .insert(resultsToSave);
        
        if (resultsError) throw resultsError;
      }
      
      setSavedSampleId(sampleData.id);
      
      // Show success message
      alert("Sample and test results saved successfully!");
    } catch (error) {
      console.error('Error saving sample:', error);
      alert("Error saving sample. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
    setLabReference("");
    setSampleIdError("");
    setSavedSampleId(null);
  };

  // Export results
  const exportResults = () => {
    // In a real implementation, this would export to PDF/Excel
    const dataStr = JSON.stringify({
      sampleId,
      collectionDate,
      foodCategory: selectedCategory,
      farmLocation,
      labReference,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="sampleId" className="text-xs sm:text-sm">
                  {t("foodSafety.sampleId") || "Sample ID"} *
                </Label>
                <Input
                  id="sampleId"
                  placeholder={t("foodSafety.sampleIdPlaceholder") || "e.g., FS-2023-001"}
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
                {sampleIdError && (
                  <p className="text-red-500 text-xs">{sampleIdError}</p>
                )}
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="collectionDate" className="text-xs sm:text-sm">
                  {t("foodSafety.collectionDate") || "Collection Date"} *
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="farmLocation" className="text-xs sm:text-sm">
                  {t("foodSafety.farmLocation") || "Farm Location"}
                </Label>
                <Input
                  id="farmLocation"
                  placeholder={t("foodSafety.locationPlaceholder") || "e.g., Village Name, District"}
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="labReference" className="text-xs sm:text-sm">
                  {t("foodSafety.labReference") || "Lab Reference"}
                </Label>
                <Input
                  id="labReference"
                  placeholder={t("foodSafety.labReferencePlaceholder") || "e.g., LAB-2023-001"}
                  value={labReference}
                  onChange={(e) => setLabReference(e.target.value)}
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
              <span>{t("foodSafety.category") || "Select Food Category"} *</span>
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

      {/* Lab Data Entry */}
      {selectedCategory && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20 w-full overflow-hidden">
            <CardHeader className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 w-full">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Plus className="h-4 w-4 text-primary" />
                <span>{t("foodSafety.enterData") || "Enter Lab Test Data"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 w-full">
              <div className="space-y-4 w-full">
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {t("foodSafety.contaminantsData") || "Contaminants Data"}
                    </h3>
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
                          <TableHead className="text-xs sm:text-sm">{t("foodSafety.mrl") || "MRL (FSSAI)"}</TableHead>
                          <TableHead className="text-xs sm:text-sm">{t("foodSafety.detected") || "Detected Level"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {labData.length > 0 ? (
                          labData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-xs sm:text-sm font-medium">{item.name}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge variant="outline" className="text-[8px] sm:text-[10px]">
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">{item.method || "N/A"}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                {item.mrl !== null ? `${item.mrl} ${item.unit}` : "N/A"}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Input
                                  type="number"
                                  step="0.00001"
                                  placeholder="Enter value"
                                  value={item.detectedLevel}
                                  onChange={(e) => handleDetectedLevelChange(item.id, e.target.value)}
                                  className="h-8 text-xs w-24"
                                />
                                <span className="ml-1 text-xs">{item.unit}</span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {contaminants.length > 0 
                                ? "Loading contaminants data..." 
                                : "No contaminants data available. If this persists, please contact support."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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
                    onClick={saveSample}
                    disabled={isSaving}
                    className="h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t("saving") || "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("foodSafety.save") || "Save Sample"}
                      </>
                    )}
                  </Button>
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
                      {testResults
                        .filter(result => result.detectedLevel && result.detectedLevel !== "")
                        .map((item, index) => (
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
                          <TableCell className="text-xs sm:text-sm">
                            {item.mrl !== null ? `${item.mrl} ${item.unit}` : "N/A"}
                          </TableCell>
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
                            {item.status === "pending" && (
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-[10px] sm:text-xs">
                                {t("pending") || "Pending"}
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
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