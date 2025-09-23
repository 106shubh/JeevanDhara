import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Phone, 
  MapPin, 
  Star, 
  Clock, 
  Video, 
  Calendar, 
  Stethoscope,
  Heart,
  Award
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Veterinarian {
  id: string;
  name: string;
  specialization: string[];
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  experience: number;
  availability: {
    emergency: boolean;
    consultationHours: string;
    nextAvailable: string;
  };
  consultationFee: number;
  isOnline: boolean;
  responseTime: string;
  successRate: number;
}

export default function VeterinarianNetwork() {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showVetDetails, setShowVetDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("find");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { toast } = useToast();

  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data initialization
  useEffect(() => {
    const sampleVets: Veterinarian[] = [
      {
        id: "1",
        name: "Dr. Rajesh Kumar",
        specialization: ["Large Animals", "Dairy Cattle", "Emergency Care"],
        location: "Punjab, India",
        distance: 15.2,
        rating: 4.8,
        reviewCount: 127,
        phone: "+91-9876543210",
        email: "dr.rajesh@vetcare.com",
        experience: 12,
        availability: {
          emergency: true,
          consultationHours: "9 AM - 8 PM",
          nextAvailable: "Today 2:00 PM"
        },
        consultationFee: 500,
        isOnline: true,
        responseTime: "< 5 min",
        successRate: 94
      },
      {
        id: "2",
        name: "Dr. Priya Sharma",
        specialization: ["Small Animals", "Poultry", "Nutrition"],
        location: "Haryana, India",
        distance: 22.8,
        rating: 4.6,
        reviewCount: 89,
        phone: "+91-9876543211",
        email: "dr.priya@animalcare.com",
        experience: 8,
        availability: {
          emergency: false,
          consultationHours: "10 AM - 6 PM",
          nextAvailable: "Tomorrow 11:00 AM"
        },
        consultationFee: 400,
        isOnline: false,
        responseTime: "< 15 min",
        successRate: 91
      },
      {
        id: "3",
        name: "Dr. Mohammed Ali",
        specialization: ["Livestock", "Disease Prevention", "Surgery"],
        location: "Uttar Pradesh, India",
        distance: 45.1,
        rating: 4.9,
        reviewCount: 203,
        phone: "+91-9876543212",
        email: "dr.ali@livestockcare.com",
        experience: 15,
        availability: {
          emergency: true,
          consultationHours: "8 AM - 9 PM",
          nextAvailable: "Today 4:30 PM"
        },
        consultationFee: 600,
        isOnline: true,
        responseTime: "< 3 min",
        successRate: 97
      }
    ];
    setVeterinarians(sampleVets);
  }, []);

  const filteredVeterinarians = veterinarians.filter(vet => {
    const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vet.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter === "all" || vet.location.includes(locationFilter);
    const matchesSpecialization = specializationFilter === "all" || 
                                 vet.specialization.some(spec => spec.toLowerCase().includes(specializationFilter.toLowerCase()));

    return matchesSearch && matchesLocation && matchesSpecialization;
  });

  const bookConsultation = (type: 'video' | 'phone' | 'chat') => {
    setShowBookingDialog(false);
    toast({
      title: "Consultation Booked!",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} consultation scheduled with ${selectedVet?.name}`,
    });
  };

  const initiateEmergencyCall = (vet: Veterinarian) => {
    toast({
      title: "🚨 Emergency Contact",
      description: `Calling ${vet.name} for emergency consultation...`,
      variant: "destructive"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 p-2 md:p-4">
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-3xl font-bold text-foreground">Veterinarian Network</h2>
        <p className="text-sm md:text-base text-muted-foreground px-4">
          Connect with qualified veterinarians for expert consultation and emergency care
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-10 md:h-12">
          <TabsTrigger value="find" className="text-xs md:text-sm px-2">
            {isMobile ? "Find" : "Find Veterinarians"}
          </TabsTrigger>
          <TabsTrigger value="consultations" className="text-xs md:text-sm px-2">
            {isMobile ? "Consults" : "My Consultations"}
          </TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs md:text-sm px-2">
            {isMobile ? "Emergency" : "Emergency Services"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          {/* Search and Filters */}
          <div className="bg-card rounded-lg p-3 md:p-4 border">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isMobile ? "Search vets..." : "Search by name or specialization..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="large animals">Large Animals</SelectItem>
                  <SelectItem value="small animals">Small Animals</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Veterinarians Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredVeterinarians.map((vet, index) => (
                <motion.div
                  key={vet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>
                            {vet.isOnline && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{vet.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{vet.rating}</span>
                              <span>({vet.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                        {vet.availability.emergency && (
                          <Badge variant="destructive" className="text-xs">Emergency</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {vet.specialization.slice(0, 2).map(spec => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{vet.distance} km away</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{vet.availability.nextAvailable}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">₹{vet.consultationFee}</span>
                          <span className="text-muted-foreground">/ consultation</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedVet(vet);
                            setShowVetDetails(true);
                          }}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedVet(vet);
                            setShowBookingDialog(true);
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        {vet.availability.emergency && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => initiateEmergencyCall(vet)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Consultations Yet</h3>
            <p className="text-muted-foreground mb-4">Book your first consultation to get started</p>
            <Button onClick={() => setActiveTab("find")}>
              Find Veterinarians
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6 mt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-600">Emergency Veterinary Services</h3>
              <p className="text-muted-foreground">24/7 emergency support for critical animal health situations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {veterinarians.filter(vet => vet.availability.emergency).map((vet, index) => (
              <motion.div
                key={vet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-red-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{vet.name}</h3>
                        <p className="text-sm text-muted-foreground">{vet.experience} years experience</p>
                      </div>
                      <Badge variant="destructive" className="ml-auto">
                        24/7 Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <p className="font-medium">{vet.responseTime}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <p className="font-medium">{vet.successRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700" 
                        onClick={() => initiateEmergencyCall(vet)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Emergency Call
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedVet(vet);
                          setShowVetDetails(true);
                        }}
                      >
                        Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Veterinarian Details Dialog */}
      <Dialog open={showVetDetails} onOpenChange={setShowVetDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              {selectedVet?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedVet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <p>{selectedVet.phone}</p>
                  <p>{selectedVet.email}</p>
                  <p>{selectedVet.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <p>Experience: {selectedVet.experience} years</p>
                  <p>Success Rate: {selectedVet.successRate}%</p>
                  <p>Response: {selectedVet.responseTime}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVet.specialization.map(spec => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowVetDetails(false);
                    setShowBookingDialog(true);
                  }}
                >
                  Book Consultation
                </Button>
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Consultation</DialogTitle>
          </DialogHeader>
          {selectedVet && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{selectedVet.name}</p>
                  <p className="text-sm text-muted-foreground">₹{selectedVet.consultationFee} / consultation</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={() => bookConsultation('video')}
                >
                  <Video className="h-4 w-4" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={() => bookConsultation('phone')}
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">Phone</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={() => bookConsultation('chat')}
                >
                  <span className="text-xs">Chat</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}