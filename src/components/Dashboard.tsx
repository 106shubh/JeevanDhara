import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Users,
  Calendar,
  ArrowUpRight,
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  RefreshCw,
  Shield
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import { AlertBadge } from "./AlertBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AMUForm } from "./AMUForm";
import { AlertCenter } from "./AlertCenter";

export const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAMUDialog, setShowAMUDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  
  // Weather Integration States
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState<any[]>([]);
  const [showWeatherCard, setShowWeatherCard] = useState(true);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize weather data
  useEffect(() => {
    requestLocationPermission();
  }, []);
  
  // Request location permission and initialize weather
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services. Using default location.",
        variant: "destructive"
      });
      setLocationName("Delhi, India (Default)");
      fetchWeatherData(28.6139, 77.2090); // Default to Delhi
      return;
    }

    toast({
      title: "🌍 Location Permission Required",
      description: "Allow location access to get accurate weather data for your farm.",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationPermission('granted');
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setUserLocation(location);
        
        // Get location name from coordinates
        await getLocationName(location.lat, location.lon);
        
        fetchWeatherData(location.lat, location.lon);
        
        // Set up auto-refresh interval
        const interval = setInterval(() => {
          fetchWeatherData(location.lat, location.lon);
        }, 300000); // Update every 5 minutes
        
        toast({
          title: "📍 Location Detected",
          description: "Weather data will now show conditions for your area.",
        });
        
        return () => clearInterval(interval);
      },
      (error) => {
        setLocationPermission('denied');
        toast({
          title: "Location Access Denied",
          description: "Using default location for weather data. You can manually refresh later.",
          variant: "destructive"
        });
        setLocationName("Delhi, India (Default)");
        fetchWeatherData(28.6139, 77.2090); // Default to Delhi
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  // Get location name from coordinates using reverse geocoding
  const getLocationName = async (lat: number, lon: number) => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Construct a meaningful location name
        let placeName = '';
        
        if (data.locality) {
          placeName = data.locality;
        } else if (data.city) {
          placeName = data.city;
        } else if (data.principalSubdivision) {
          placeName = data.principalSubdivision;
        }
        
        if (data.countryName) {
          placeName += placeName ? `, ${data.countryName}` : data.countryName;
        }
        
        // Fallback to coordinates if no meaningful name found
        if (!placeName) {
          placeName = `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
        }
        
        setLocationName(placeName);
        
        toast({
          title: "📍 Location Identified",
          description: `Weather data for ${placeName}`,
        });
      } else {
        // Fallback if geocoding fails
        setLocationName(`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to coordinates
      setLocationName(`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`);
    }
  };

  const fetchWeatherData = async (lat: number = 28.6139, lon: number = 77.2090) => {
    setIsLoadingWeather(true);
    try {
      // Mock real-time weather data with realistic variations
      const currentTime = new Date();
      const hour = currentTime.getHours();
      
      // Simulate temperature variations throughout the day
      const baseTemp = 25;
      const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 8; // Peak at 2 PM
      const temperature = Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 4);
      
      const conditions = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Sunny"];
      const currentCondition = hour < 6 || hour > 19 ? "Clear" : conditions[Math.floor(Math.random() * conditions.length)];
      
      // Use the stored location name or get it if not available
      let currentLocationName = locationName;
      if (!currentLocationName) {
        if (lat === 28.6139 && lon === 77.2090) {
          currentLocationName = "Delhi, India (Default)";
          setLocationName(currentLocationName);
        } else {
          // If we have coordinates but no name yet, fetch it
          await getLocationName(lat, lon);
          currentLocationName = locationName || `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
        }
      }
      
      const newWeatherData = {
        location: currentLocationName,
        coordinates: { lat, lon },
        temperature,
        condition: currentCondition,
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 5) + 10,
        uvIndex: Math.max(0, Math.floor((hour - 6) / 2) + Math.random() * 3),
        timestamp: currentTime,
        lastUpdated: currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        forecast: [
          { day: "Today", temp: temperature, condition: currentCondition, humidity: 65 },
          { day: "Tomorrow", temp: temperature + Math.floor(Math.random() * 6) - 3, condition: conditions[Math.floor(Math.random() * conditions.length)], humidity: 60 },
          { day: "Wed", temp: temperature + Math.floor(Math.random() * 8) - 4, condition: conditions[Math.floor(Math.random() * conditions.length)], humidity: 70 },
          { day: "Thu", temp: temperature + Math.floor(Math.random() * 6) - 3, condition: conditions[Math.floor(Math.random() * conditions.length)], humidity: 55 },
          { day: "Fri", temp: temperature + Math.floor(Math.random() * 8) - 4, condition: conditions[Math.floor(Math.random() * conditions.length)], humidity: 68 }
        ]
      };
      
      setWeatherData(newWeatherData);
      
      // Update weather history for the single chart
      setWeatherHistory(prev => {
        const newHistory = [...prev, {
          time: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: newWeatherData.temperature,
          humidity: newWeatherData.humidity,
          windSpeed: newWeatherData.windSpeed
        }];
        return newHistory.slice(-8); // Keep last 8 readings only
      });
      
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rain':
      case 'light rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  const getWeatherAdvice = (weather) => {
    if (!weather) return "";
    const { temperature, condition, humidity } = weather;
    
    if (condition.toLowerCase().includes('rain')) {
      return "🌧️ Rainy conditions - Avoid irrigation, check drainage";
    } else if (temperature > 35) {
      return "🌡️ High temperature - Increase watering, provide shade";
    } else if (humidity > 80) {
      return "💧 High humidity - Monitor for fungal diseases";
    } else {
      return "☀️ Good farming conditions - Ideal for field work";
    }
  };
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
  // Handle quick actions
  const handleLogAMU = () => {
    setShowAMUDialog(true);
  };

  const handleGenerateReport = () => {
    setShowReportDialog(true);
  };

  const handleCheckAlerts = () => {
    setShowAlertsDialog(true);
  };

  const handleWithdrawalClick = (animal: string, drug: string, daysLeft: number) => {
    // Find the withdrawal data to get more details
    const withdrawalItem = withdrawalData.find(item => item.animal === animal && item.drug === drug);
    
    toast({
      title: `Withdrawal Period Details`,
      description: `${animal} treated with ${drug} has ${daysLeft} days remaining until clearance.`,
      duration: 5000
    });
  };

  const handleWeatherRefresh = () => {
    fetchWeatherData();
    toast({
      title: "Weather Updated",
      description: "Real-time weather data has been refreshed.",
    });
  };

  const toggleWeatherCard = () => {
    setShowWeatherCard(!showWeatherCard);
    toast({
      title: showWeatherCard ? "Weather Card Hidden" : "Weather Card Shown",
      description: showWeatherCard ? "Weather information is now hidden from dashboard." : "Weather information is now visible on dashboard.",
    });
  };

  const exportReport = (format: string) => {
    toast({
      title: "Report Export Started",
      description: `Generating ${format.toUpperCase()} report for download...`,
    });
    
    // Simulate report generation
    setTimeout(() => {
      const data = {
        totalAnimals: 247,
        activeTreatments: 8,
        complianceRate: 98.5,
        pendingAlerts: 3,
        amuData: amuTrendData,
        speciesData: speciesData,
        withdrawalData: withdrawalData,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jeevan-dhara-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Downloaded",
        description: `${format.toUpperCase()} report has been downloaded successfully.`,
      });
    }, 2000);
  };

  // Sample data for charts
  const amuTrendData = [
    { month: 'Jan', usage: 12, compliance: 95 },
    { month: 'Feb', usage: 8, compliance: 98 },
    { month: 'Mar', usage: 15, compliance: 92 },
    { month: 'Apr', usage: 10, compliance: 96 },
    { month: 'May', usage: 6, compliance: 100 },
    { month: 'Jun', usage: 14, compliance: 94 }
  ];

  const speciesData = [
    { name: 'Cattle', usage: 45, fill: 'hsl(var(--primary))' },
    { name: 'Sheep', usage: 25, fill: 'hsl(var(--success))' },
    { name: 'Goats', usage: 20, fill: 'hsl(var(--warning))' },
    { name: 'Pigs', usage: 10, fill: 'hsl(var(--muted))' }
  ];

  // Withdrawal period calculation function
  const calculateWithdrawalPeriod = (drugName: string, dosage: string, species: string) => {
    // Parse dosage value (e.g., "5mg/kg" -> 5)
    const dosageMatch = dosage.match(/(\d*\.?\d+)/);
    const dosageValue = dosageMatch ? parseFloat(dosageMatch[1]) : 1;
    
    // Base withdrawal periods for each drug (in days)
    const basePeriods: Record<string, number> = {
      "amoxicillin": 14,
      "oxytetracycline": 21,
      "florfenicol": 28,
      "tulathromycin": 35,
      "ceftiofur": 10,
      "enrofloxacin": 15
    };
    
    // Species multipliers
    const speciesMultipliers: Record<string, number> = {
      "cattle": 1.0,
      "sheep": 0.8,
      "goat": 0.9,
      "pig": 0.7,
      "poultry": 0.5
    };
    
    // Dosage multipliers (higher dosage = longer withdrawal)
    const dosageMultiplier = dosageValue > 0 ? Math.max(0.5, Math.min(2.0, dosageValue / 5)) : 1;
    
    // Calculate withdrawal period
    const drugBase = basePeriods[drugName.toLowerCase()] || 28;
    const speciesFactor = speciesMultipliers[species.toLowerCase()] || 1.0;
    
    const withdrawalPeriod = Math.round(drugBase * speciesFactor * dosageMultiplier);
    
    // Ensure minimum withdrawal period of 3 days
    return Math.max(3, withdrawalPeriod);
  };

  const withdrawalData = [
    { animal: 'COW-023', drug: 'Amoxicillin', daysLeft: calculateWithdrawalPeriod('amoxicillin', '5mg/kg', 'cattle'), status: 'urgent' },
    { animal: 'GOAT-015', drug: 'Oxytetracycline', daysLeft: calculateWithdrawalPeriod('oxytetracycline', '10mg/kg', 'goat'), status: 'warning' },
    { animal: 'SHEEP-008', drug: 'Florfenicol', daysLeft: calculateWithdrawalPeriod('florfenicol', '3mg/kg', 'sheep'), status: 'normal' },
    { animal: 'PIG-012', drug: 'Enrofloxacin', daysLeft: calculateWithdrawalPeriod('enrofloxacin', '2.5mg/kg', 'pig'), status: 'normal' }
  ];

  return (
    <motion.div 
      className="space-y-4 md:space-y-6 px-2 md:px-0 max-w-full overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}>
      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <DashboardCard
            title={t("dashboard.totalAnimals") || "Total Animals"}
            value="247"
            change="+12 this month"
            changeType="positive"
            icon={<Stethoscope className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title={t("dashboard.activeTreatments") || "Active Treatments"}
            value="8"
            change="-3 from last week"
            changeType="positive"
            icon={<Activity className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title={t("dashboard.mrlCompliance") || "MRL Compliance"}
            value="98.5%"
            change="+2.1% improvement"
            changeType="positive"
            icon={<CheckCircle className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title={t("dashboard.pendingAlerts") || "Pending Alerts"}
            value="3"
            change="2 urgent"
            changeType="negative"
            icon={<AlertTriangle className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
          <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <span>{t("dashboard.quickActions") || "Quick Actions"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-6 mt-1 md:mt-2">
            <Dialog open={showAMUDialog} onOpenChange={setShowAMUDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleLogAMU}
                  className="bg-gradient-primary h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-elevated transition-all duration-300"
                >
                  <div className="text-left flex items-center gap-2 md:gap-3">
                    <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
                      <Activity className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">{t("action.logAMU") || "Log New AMU"}</div>
                      <div className="text-xs opacity-80 group-hover:translate-x-1 transition-transform duration-300">Record antimicrobial usage</div>
                    </div>
                    <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("action.logAMU") || "Log New AMU Entry"}</DialogTitle>
                </DialogHeader>
                <AMUForm />
              </DialogContent>
            </Dialog>

            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleGenerateReport}
                  variant="outline" 
                  className="h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-card hover:border-primary/30 transition-all duration-300"
                >
                  <div className="text-left flex items-center gap-2 md:gap-3">
                    <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                      <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">{t("dashboard.generateReport") || "Generate Report"}</div>
                      <div className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">{t("dashboard.exportCompliance") || "Export compliance report"}</div>
                    </div>
                    <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t("dashboard.generateReport") || "Generate Report"}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="compliance" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="amu">AMU Report</TabsTrigger>
                    <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="compliance" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">MRL Compliance Report</h3>
                          <p className="text-sm text-muted-foreground mb-4">Comprehensive compliance status and regulatory requirements</p>
                          <div className="space-y-2">
                            <Button onClick={() => exportReport('pdf')} className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button onClick={() => exportReport('excel')} variant="outline" className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Excel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="amu" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">AMU Usage Report</h3>
                          <p className="text-sm text-muted-foreground mb-4">Detailed antimicrobial usage patterns and trends</p>
                          <div className="space-y-2">
                            <Button onClick={() => exportReport('pdf')} className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button onClick={() => exportReport('csv')} variant="outline" className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="withdrawal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Withdrawal Period Report</h3>
                          <p className="text-sm text-muted-foreground mb-4">Current and upcoming withdrawal period compliance</p>
                          <div className="space-y-2">
                            <Button onClick={() => exportReport('pdf')} className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button onClick={() => exportReport('json')} variant="outline" className="w-full" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download JSON
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={toggleWeatherCard}
              variant="outline" 
              className="h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-card hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="text-left flex items-center gap-2 md:gap-3">
                <div className="bg-blue-500/10 p-1.5 md:p-2 rounded-full">
                  <Cloud className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">
                    {showWeatherCard ? "Hide Weather" : "Show Weather"}
                  </div>
                  <div className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
                    {showWeatherCard ? "Hide weather dashboard" : "Display weather information"}
                  </div>
                </div>
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-500" />
              </div>
            </Button>
          </div>
        </CardContent>
        </Card>
      </motion.div>

      {/* Location Permission Prompt */}
      {locationPermission === 'pending' && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Cloud className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enable Location for Weather Data</h3>
                  <p className="text-muted-foreground mb-4">
                    Allow location access to get accurate weather information for your farm area.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={requestLocationPermission} className="bg-blue-500 hover:bg-blue-600">
                      <Cloud className="h-4 w-4 mr-2" />
                      Allow Location Access
                    </Button>
                    <Button 
                      onClick={() => {
                        setLocationPermission('denied');
                        setLocationName("Delhi, India (Default)");
                        fetchWeatherData(28.6139, 77.2090);
                      }} 
                      variant="outline"
                    >
                      Use Default Location
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Real-Time Weather Card */}
      {locationPermission !== 'pending' && showWeatherCard && weatherData && (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card overflow-hidden group hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
                    {getWeatherIcon(weatherData.condition)}
                    <span className="font-semibold">{weatherData.location}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {locationPermission === 'granted' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                        📍 Live Location
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Last updated: {weatherData.lastUpdated}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (userLocation) {
                        fetchWeatherData(userLocation.lat, userLocation.lon);
                      } else {
                        fetchWeatherData();
                      }
                    }}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingWeather}
                    className="h-7 md:h-8"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    onClick={() => setShowWeatherCard(false)}
                    variant="outline"
                    size="sm"
                    className="h-7 md:h-8"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Wind className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{weatherData.windSpeed}</p>
                    <p className="text-xs text-muted-foreground">Wind km/h</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{weatherData.visibility}</p>
                    <p className="text-xs text-muted-foreground">Visibility km</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Farming Advice */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  📍 {getWeatherAdvice(weatherData)}
                </p>
              </div>
              
              {/* 5-Day Forecast */}
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast.map((day: any, index: number) => (
                  <motion.div 
                    key={index}
                    className="text-center p-2 rounded-lg bg-white/30 dark:bg-gray-800/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs font-medium">{day.day}</p>
                    <div className="my-1 flex justify-center">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <p className="text-sm font-bold">{day.temp}°</p>
                    <p className="text-xs text-muted-foreground">{day.humidity}%</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8"
        variants={containerVariants}>
        {/* AMU Trend Chart */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card overflow-hidden group hover:shadow-elevated transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
              <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span>{isMobile ? t("dashboard.amuTrends").split(" ")[0] || "AMU Trends" : t("dashboard.amuTrends") || "AMU Trends & Compliance"}</span>
            </CardTitle>
            <div className="flex space-x-1 md:space-x-2">
              <Button variant="outline" size="sm" className="h-7 md:h-8 text-xs md:text-sm">
                <Filter className="h-3 w-3 mr-0.5 md:mr-1" />
                {!isMobile && "Filter"}
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "sm"} className="h-7 md:h-8 text-xs md:text-sm">
                <Download className="h-3 w-3 mr-0.5 md:mr-1" />
                {!isMobile && "Export"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 300} className="mt-1 md:mt-2">
              <LineChart data={amuTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="AMU Count"
                />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Compliance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>
        </motion.div>

        {/* Single Weather Trend Chart */}
        {locationPermission !== 'pending' && weatherHistory.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="shadow-card overflow-hidden group hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
              <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
                <Cloud className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <span>Weather Trends</span>
                {locationPermission === 'granted' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                    Live Data
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
              <ResponsiveContainer width="100%" height={isMobile ? 180 : 300} className="mt-1 md:mt-2">
                <LineChart data={weatherHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Humidity (%)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="windSpeed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Wind Speed (km/h)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Species Distribution */}
        {!weatherHistory.length && (
          <motion.div variants={itemVariants}>
            <Card className="shadow-card overflow-hidden group hover:shadow-elevated transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
              <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
                <PieChartIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span>{t("dashboard.amuBySpecies") || "AMU by Species"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
              <ResponsiveContainer width="100%" height={isMobile ? 180 : 300} className="mt-1 md:mt-2">
                <PieChart>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 60 : 100}
                    dataKey="usage"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {speciesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Withdrawal Periods Table with click handler */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
          <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <span>{t("dashboard.withdrawalPeriods") || "Active Withdrawal Periods"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
          <div className="space-y-3">
            {withdrawalData.map((item) => (
              <div 
                key={item.animal} 
                onClick={() => handleWithdrawalClick(item.animal, item.drug, item.daysLeft)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border hover:shadow-card transition-smooth hover:bg-accent/10 transform hover:scale-[1.01] cursor-pointer gap-2"
              >
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div>
                    <p className="font-medium text-foreground">{item.animal}</p>
                    <p className="text-sm text-muted-foreground">{item.drug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-foreground">{item.daysLeft} {t("dashboard.daysLeft") || "days left"}</p>
                    <p className="text-xs text-muted-foreground">{t("dashboard.untilClearance") || "Until clearance"}</p>
                  </div>
                  {item.status === 'urgent' && <AlertBadge type="urgent">Urgent</AlertBadge>}
                  {item.status === 'warning' && <AlertBadge type="warning">Soon</AlertBadge>}
                  {item.status === 'normal' && <AlertBadge type="compliant">Normal</AlertBadge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};