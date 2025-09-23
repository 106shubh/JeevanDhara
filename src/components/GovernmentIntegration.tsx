import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send,
  Download,
  Shield,
  Building2,
  Users,
  Globe
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  type: string;
  title: string;
  agency: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitDate: Date;
  dueDate: Date;
  description: string;
}

export default function GovernmentIntegration() {
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      type: "AMU Report",
      title: "Monthly Antimicrobial Usage Report - June 2024",
      agency: "Department of Animal Husbandry",
      status: "submitted",
      submitDate: new Date(Date.now() - 86400000 * 5),
      dueDate: new Date(Date.now() + 86400000 * 10),
      description: "Monthly usage report for all antimicrobial treatments administered to livestock"
    },
    {
      id: "2",
      type: "Health Certificate",
      title: "Livestock Health Certification Request",
      agency: "Veterinary Council",
      status: "under_review",
      submitDate: new Date(Date.now() - 86400000 * 12),
      dueDate: new Date(Date.now() + 86400000 * 3),
      description: "Health certification for livestock transportation and trade"
    }
  ]);

  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'submitted': return Send;
      case 'under_review': return Clock;
      case 'rejected': return AlertTriangle;
      default: return FileText;
    }
  };

  const createNewSubmission = () => {
    toast({
      title: "Submission Created",
      description: "Your regulatory submission has been prepared and is ready for review."
    });
    setShowSubmissionDialog(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 p-2 md:p-4">
      <motion.div 
        className="text-center space-y-1 md:space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Government Integration</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Direct submission to regulatory bodies and compliance management
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9 md:h-10">
          <TabsTrigger value="submissions" className="text-xs md:text-sm px-1 md:px-3">My Submissions</TabsTrigger>
          <TabsTrigger value="requirements" className="text-xs md:text-sm px-1 md:px-3">Compliance</TabsTrigger>
          <TabsTrigger value="agencies" className="text-xs md:text-sm px-1 md:px-3">Gov Agencies</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <div className="flex flex-col gap-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                      <p className="text-sm md:text-base font-semibold">{submissions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                      <p className="text-sm md:text-base font-semibold">{submissions.filter(s => s.status === 'under_review').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Approved</p>
                      <p className="text-sm md:text-base font-semibold">{submissions.filter(s => s.status === 'approved').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Issues</p>
                      <p className="text-sm md:text-base font-semibold">{submissions.filter(s => s.status === 'rejected').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* New Submission Button */}
            <div className="flex justify-center sm:justify-end">
              <Button onClick={() => setShowSubmissionDialog(true)} className="w-full sm:w-auto h-9 md:h-10 text-xs md:text-sm">
                <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                New Submission
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {submissions.map((submission, index) => {
              const StatusIcon = getStatusIcon(submission.status);
              return (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col gap-3 md:gap-4">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <StatusIcon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div className="space-y-1 md:space-y-2 flex-1 min-w-0">
                            <div>
                              <h3 className="font-semibold text-sm md:text-lg leading-tight">{submission.title}</h3>
                              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{submission.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate">{submission.agency}</span>
                              </span>
                              <span className="hidden sm:inline">Submitted: {submission.submitDate.toLocaleDateString()}</span>
                              <span className="hidden sm:inline">Due: {submission.dueDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex sm:hidden flex-col gap-1 text-xs text-muted-foreground">
                              <span>Submitted: {submission.submitDate.toLocaleDateString()}</span>
                              <span>Due: {submission.dueDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                            {submission.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-8 text-xs">
                              <Download className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                            <Button size="sm" className="flex-1 sm:flex-none h-8 text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AMU Reporting</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Health Certificates</span>
                    <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Withdrawal Records</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Review Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feed Safety</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Quarterly AMU Report</p>
                      <p className="text-sm text-muted-foreground">Due in 7 days</p>
                    </div>
                    <Button size="sm">
                      Start Report
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Annual Health Audit</p>
                      <p className="text-sm text-muted-foreground">Due in 21 days</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Department of Animal Husbandry",
                type: "Federal Agency",
                description: "Primary regulatory body for livestock health and welfare",
                contact: "contact@animalhusbandry.gov.in",
                status: "Connected"
              },
              {
                name: "Food Safety Authority",
                type: "Regulatory Body",
                description: "Food safety and standards for animal products",
                contact: "info@foodsafety.gov.in",
                status: "Connected"
              },
              {
                name: "Veterinary Council",
                type: "Professional Body",
                description: "Veterinary practice regulation and licensing",
                contact: "support@vetcouncil.org.in",
                status: "Pending"
              }
            ].map((agency, index) => (
              <motion.div
                key={agency.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant={agency.status === 'Connected' ? 'default' : 'secondary'}>
                          {agency.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold">{agency.name}</h3>
                        <p className="text-sm text-muted-foreground">{agency.type}</p>
                      </div>
                      <p className="text-sm">{agency.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Submit Report
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Submission Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span className="text-xs">AMU Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span className="text-xs">Health Certificate</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-xs">Compliance Audit</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Globe className="h-6 w-6" />
                <span className="text-xs">Export License</span>
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createNewSubmission}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}