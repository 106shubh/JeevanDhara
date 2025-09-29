import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Search,
  Upload,
  Camera,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";
import { useLanguage } from "@/contexts/LanguageContext";

interface Prescription {
  id: string;
  veterinarianName: string;
  animalId: string;
  drugName: string;
  issueDate: string;
  status: "verified" | "pending" | "expired";
  fileName?: string;
}

export const PrescriptionManager = () => {
  const { t } = useLanguage();
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
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>{t('prescriptions')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-primary">
                <Camera className="h-4 w-4 mr-2" />
                {t('scanPrescription')}
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                {t('uploadFile')}
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('uploadInstructions')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('searchPrescriptions')}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
                <Button variant="outline" size="sm">{t('all')}</Button>
                <Button variant="outline" size="sm">{t('verified')}</Button>
                <Button variant="outline" size="sm">{t('pending')}</Button>
                <Button variant="outline" size="sm">{t('expired')}</Button>
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
                      <span className="font-medium text-foreground">{t('veterinarian')}:</span>
                      <br />
                      <span className="text-muted-foreground">{prescription.veterinarianName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{t('drug')}:</span>
                      <br />
                      <span className="text-muted-foreground">{prescription.drugName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{t('issueDate')}:</span>
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
                    {t('view')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full md:w-auto">
                    <Download className="h-3 w-3 mr-2" />
                    {t('download')}
                  </Button>
                  {prescription.status === "pending" && (
                    <Button size="sm" className="w-full md:w-auto bg-gradient-primary">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      {t('verify')}
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
            <div className="text-sm text-muted-foreground">{t('verified')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">{t('pending')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">1</div>
            <div className="text-sm text-muted-foreground">{t('expired')}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};