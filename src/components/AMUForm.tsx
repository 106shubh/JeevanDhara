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
import { useState } from "react";
import { AlertBadge } from "./AlertBadge";

export const AMUForm = () => {
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

  const steps = [
    { id: 1, title: "Animal Details", icon: Stethoscope },
    { id: 2, title: "Drug Information", icon: Plus },
    { id: 3, title: "Prescription", icon: FileText },
    { id: 4, title: "Review", icon: Calendar }
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth
                    ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                      isCompleted ? 'bg-success border-success text-success-foreground' :
                      'border-muted text-muted-foreground'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute w-full h-0.5 -z-10 ${isCompleted ? 'bg-success' : 'bg-muted'}`} 
                         style={{ left: '50%', top: '20px', width: '100%', marginLeft: '20px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Log Antimicrobial Usage - Step {currentStep}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animalId">Animal ID *</Label>
                  <Input
                    id="animalId"
                    placeholder="e.g., COW-001"
                    value={formData.animalId}
                    onChange={(e) => setFormData({...formData, animalId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Select value={formData.species} onValueChange={(value) => setFormData({...formData, species: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertBadge type="pending">
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
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="bg-gradient-primary">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-gradient-primary">
                Submit AMU Entry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};