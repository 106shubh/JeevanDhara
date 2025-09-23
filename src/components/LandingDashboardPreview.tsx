import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Stethoscope,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { DashboardCard } from "./DashboardCard";
import { AlertBadge } from "./AlertBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

export const LandingDashboardPreview = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeChart, setActiveChart] = useState(0);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
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

  // Sample data matching the main dashboard
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

  const withdrawalData = [
    { animal: 'COW-023', drug: 'Amoxicillin', daysLeft: 2, status: 'urgent' },
    { animal: 'GOAT-015', drug: 'Oxytetracycline', daysLeft: 1, status: 'warning' },
    { animal: 'SHEEP-008', drug: 'Florfenicol', daysLeft: 7, status: 'normal' }
  ];

  // Auto-rotate charts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChart((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle preview interactions
  const handlePreviewAction = (action: string) => {
    toast({
      title: "Demo Mode",
      description: `This is a preview. In the full app, "${action}" would be fully functional.`,
    });
  };

  return (
    <motion.div 
      className="bg-card border border-border rounded-lg md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl mx-2 md:mx-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Header */}
      <div className="p-2 md:p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-destructive/60"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-warning/60"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-success/60"></div>
            <div className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-foreground">JeevanDhara Dashboard</div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-5 md:h-6 text-[10px] md:text-xs px-1 md:px-2">
              <Filter className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-5 md:h-6 text-[10px] md:text-xs px-1 md:px-2">
              <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-4 space-y-3 md:space-y-4">
        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Total Animals"
              value="247"
              change="+12 this month"
              changeType="positive"
              icon={<Stethoscope className="h-3 w-3 md:h-4 md:w-4" />}
              className="transform transition-all duration-300 hover:scale-105 text-xs md:text-sm"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Active Treatments"
              value="8"
              change="-3 from last week"
              changeType="positive"
              icon={<Activity className="h-3 w-3 md:h-4 md:w-4" />}
              className="transform transition-all duration-300 hover:scale-105 text-xs md:text-sm"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="MRL Compliance"
              value="98.5%"
              change="+2.1% improvement"
              changeType="positive"
              icon={<CheckCircle className="h-3 w-3 md:h-4 md:w-4" />}
              className="transform transition-all duration-300 hover:scale-105 text-xs md:text-sm"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Pending Alerts"
              value="3"
              change="2 urgent"
              changeType="negative"
              icon={<AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />}
              className="transform transition-all duration-300 hover:scale-105 text-xs md:text-sm"
            />
          </motion.div>
        </motion.div>

        {/* Dynamic Charts Section */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-transparent to-accent/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {activeChart === 0 ? (
                    <>
                      <BarChart2 className="h-5 w-5 text-primary" />
                      <span>AMU Trends & Compliance</span>
                    </>
                  ) : (
                    <>
                      <PieChartIcon className="h-5 w-5 text-primary" />
                      <span>AMU by Species</span>
                    </>
                  )}
                </CardTitle>
                <div className="flex space-x-1">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      onClick={() => setActiveChart(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeChart ? 'bg-primary' : 'bg-primary/20'
                      }`}
                      aria-label={`View chart ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative h-48 lg:h-64">
                <motion.div
                  key={activeChart}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {activeChart === 0 ? (
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
                        <Line 
                          type="monotone" 
                          dataKey="usage" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="AMU Count"
                          dot={{ fill: 'hsl(var(--primary))' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="compliance" 
                          stroke="hsl(var(--success))" 
                          strokeWidth={2}
                          name="Compliance %"
                          dot={{ fill: 'hsl(var(--success))' }}
                        />
                      </LineChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={speciesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="usage"
                          label={({name, value}) => `${name}: ${value}`}
                        >
                          {speciesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdrawal Periods */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-transparent to-accent/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Active Withdrawal Periods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {withdrawalData.map((item, index) => (
                  <motion.div 
                    key={item.animal}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:shadow-card transition-all duration-300 hover:bg-accent/10 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <div>
                        <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                          {item.animal}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.drug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{item.daysLeft} days</p>
                        <p className="text-xs text-muted-foreground">left</p>
                      </div>
                      {item.status === 'urgent' && <AlertBadge type="urgent">Urgent</AlertBadge>}
                      {item.status === 'warning' && <AlertBadge type="warning">Soon</AlertBadge>}
                      {item.status === 'normal' && <AlertBadge type="compliant">Normal</AlertBadge>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            <Button 
              onClick={() => handlePreviewAction("Log AMU")}
              className="bg-gradient-primary h-auto p-2 md:p-3 justify-start group relative overflow-hidden hover:shadow-elevated transition-all duration-300"
            >
              <div className="text-left flex items-center gap-1 md:gap-2 w-full">
                <div className="bg-white/20 p-1 md:p-1.5 rounded-full">
                  <Activity className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs md:text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">{t("action.logAMU") || "Log AMU"}</div>
                  <div className="text-[10px] md:text-xs opacity-80 group-hover:translate-x-1 transition-transform duration-300">Quick entry</div>
                </div>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Button>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Button 
                onClick={() => handlePreviewAction("Generate Reports")}
                variant="outline" 
                className="h-auto p-2 md:p-3 justify-start group hover:shadow-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-left flex flex-col items-start gap-1 w-full">
                  <div className="flex items-center gap-1 md:gap-2 w-full">
                    <div className="bg-primary/10 p-1 md:p-1.5 rounded-full">
                      <BarChart2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs md:text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">{t("action.reports") || "Reports"}</div>
                    </div>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">{t("action.exportData") || "Export data"}</div>
                </div>
              </Button>
              <Button 
                onClick={() => handlePreviewAction("Check Alerts")}
                variant="outline" 
                className="h-auto p-2 md:p-3 justify-start group hover:shadow-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-left flex flex-col items-start gap-1 w-full">
                  <div className="flex items-center gap-1 md:gap-2 w-full">
                    <div className="bg-primary/10 p-1 md:p-1.5 rounded-full">
                      <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs md:text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">{t("alerts") || "Alerts"}</div>
                    </div>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">3 pending</div>
                </div>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating indicators */}
      <div className="absolute -top-2 -right-2 transform rotate-6 bg-card p-2 rounded-lg shadow-lg border border-border">
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-success" />
          </div>
          <div>
            <p className="text-xs font-medium">Live Status</p>
            <p className="text-xs font-bold text-success">98% Compliant</p>
          </div>
        </div>
      </div>

      {/* Pulse effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-8 w-1 h-1 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-warning rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </motion.div>
  );
};