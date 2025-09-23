import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Camera, 
  FileText,
  Plus,
  Stethoscope,
  Upload
} from "lucide-react";
import { useState, useEffect } from "react";
import { AlertBadge } from "./AlertBadge";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
          <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
            <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-smooth
                    ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                      isCompleted ? 'bg-success border-success text-success-foreground' :
                      'border-muted text-muted-foreground'}
                  `}>
                    <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                  <span className={`text-[10px] md:text-xs mt-1 md:mt-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {isMobile ? step.title.split(' ')[0] : step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute w-full h-0.5 -z-10 ${isCompleted ? 'bg-success' : 'bg-muted'}`} 
                         style={{ left: '50%', top: isMobile ? '16px' : '20px', width: '100%', marginLeft: isMobile ? '16px' : '20px' }} />
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
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
          <CardHeader className="px-4 md:px-6 py-4 md:py-6">
            <CardTitle className="flex items-center gap-1.5 md:gap-2 text-base md:text-lg">
              <motion.div 
                whileHover={{ rotate: isMobile ? 90 : 180 }}
                transition={{ duration: 0.3 }}
                className="text-primary"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </motion.div>
              Log Antimicrobial Usage - Step {currentStep}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="animalId" className="text-xs md:text-sm">Animal ID *</Label>
                  <Input
                    id="animalId"
                    placeholder="e.g., COW-001"
                    value={formData.animalId}
                    onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                    className="h-8 md:h-10 text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="species" className="text-xs md:text-sm">Species *</Label>
                  <Select value={formData.species} onValueChange={(value) => setFormData({...formData, species: value})}>
                    <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()} className="text-xs md:text-sm">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertBadge type="pending" className="text-xs md:text-sm py-1.5 md:py-2">
                Ensure animal identification is accurate for traceability
              </AlertBadge>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drugName">Antimicrobial Drug *</Label>
                  <Select value={formData.drugName} onValueChange={(value) => setFormData({...formData, drugName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drug" />
                    </SelectTrigger>
                    <SelectContent>
                      {antimicrobials.map(drug => (
                        <SelectItem key={drug} value={drug.toLowerCase()}>{drug}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 5mg/kg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Once daily for 5 days"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Use *</Label>
                  <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map(reason => (
                        <SelectItem key={reason} value={reason.toLowerCase()}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="veterinarianId">Veterinarian License ID</Label>
                <Input
                  id="veterinarianId"
                  placeholder="Vet license number (if prescribed)"
                  value={formData.veterinarianId}
                  onChange={(e) => setFormData({...formData, veterinarianId: e.target.value})}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Prescription Upload</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center space-y-4">
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Upload veterinary prescription or take a photo
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the treatment"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Review AMU Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Animal ID:</strong> {formData.animalId}
                </div>
                <div>
                  <strong>Species:</strong> {formData.species}
                </div>
                <div>
                  <strong>Drug:</strong> {formData.drugName}
                </div>
                <div>
                  <strong>Dosage:</strong> {formData.dosage}
                </div>
                <div>
                  <strong>Frequency:</strong> {formData.frequency}
                </div>
                <div>
                  <strong>Reason:</strong> {formData.reason}
                </div>
              </div>
              
              <Separator />
              
              <AlertBadge type="warning">
                Withdrawal Period: 28 days - Do not sell milk/meat until this date
              </AlertBadge>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 md:pt-6">
            <motion.div whileHover={currentStep === 1 ? {} : { scale: isMobile ? 1.02 : 1.05 }} whileTap={currentStep === 1 ? {} : { scale: 0.95 }}>
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="transition-all duration-300 hover:shadow-md hover:border-primary h-8 md:h-10 text-xs md:text-sm px-3 md:px-4"
                size={isMobile ? "sm" : "default"}
              >
                {t("previous") || "Previous"}
              </Button>
            </motion.div>
            {currentStep < 4 ? (
              <motion.div whileHover={{ scale: isMobile ? 1.02 : 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleNext} 
                  className="bg-gradient-primary transition-all duration-300 hover:shadow-md h-8 md:h-10 text-xs md:text-sm px-3 md:px-4"
                  size={isMobile ? "sm" : "default"}
                >
                  {t("next") || "Next"}
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: isMobile ? 1.02 : 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-gradient-primary transition-all duration-300 hover:shadow-md h-8 md:h-10 text-xs md:text-sm px-3 md:px-4"
                  size={isMobile ? "sm" : "default"}
                >
                  {t("submit") || "Submit AMU Entry"}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};