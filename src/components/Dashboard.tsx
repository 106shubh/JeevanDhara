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
  ArrowUpRight
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import { AlertBadge } from "./AlertBadge";

export const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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

  const withdrawalData = [
    { animal: 'COW-023', drug: 'Amoxicillin', daysLeft: 2, status: 'urgent' },
    { animal: 'GOAT-015', drug: 'Oxytetracycline', daysLeft: 1, status: 'warning' },
    { animal: 'SHEEP-008', drug: 'Florfenicol', daysLeft: 7, status: 'normal' },
    { animal: 'PIG-012', drug: 'Enrofloxacin', daysLeft: 14, status: 'normal' }
  ];

  return (
    <motion.div 
      className="space-y-4 md:space-y-6 px-2 md:px-0"
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
            title="Total Animals"
            value="247"
            change="+12 this month"
            changeType="positive"
            icon={<Stethoscope className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title="Active Treatments"
            value="8"
            change="-3 from last week"
            changeType="positive"
            icon={<Activity className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title="MRL Compliance"
            value="98.5%"
            change="+2.1% improvement"
            changeType="positive"
            icon={<CheckCircle className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DashboardCard
            title="Pending Alerts"
            value="3"
            change="2 urgent"
            changeType="negative"
            icon={<AlertTriangle className="h-4 w-4" />}
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-elevated"
          />
        </motion.div>
      </motion.div>

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
              <span>{isMobile ? "AMU Trends" : "AMU Trends & Compliance"}</span>
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
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300} className="mt-1 md:mt-2">
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

        {/* Species Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card overflow-hidden group hover:shadow-elevated transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
            <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
              <PieChartIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span>AMU by Species</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300} className="mt-1 md:mt-2">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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
      </motion.div>

      {/* Withdrawal Periods Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
          <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <span>Active Withdrawal Periods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
          <div className="space-y-3">
            {withdrawalData.map((item) => (
              <div key={item.animal} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border hover:shadow-card transition-smooth hover:bg-accent/10 transform hover:scale-[1.01]">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div>
                    <p className="font-medium text-foreground">{item.animal}</p>
                    <p className="text-sm text-muted-foreground">{item.drug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-foreground">{item.daysLeft} days left</p>
                    <p className="text-xs text-muted-foreground">Until clearance</p>
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

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-transparent to-accent/20 transition-all duration-300 px-3 md:px-6 py-3 md:py-4">
          <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-1 md:mt-2">
            <Button className="bg-gradient-primary h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-elevated transition-all duration-300">
              <div className="text-left flex items-center gap-2 md:gap-3">
                <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
                  <Activity className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">Log New AMU</div>
                  <div className="text-xs opacity-80 group-hover:translate-x-1 transition-transform duration-300">Record antimicrobial usage</div>
                </div>
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-card hover:border-primary/30 transition-all duration-300">
              <div className="text-left flex items-center gap-2 md:gap-3">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">Generate Report</div>
                  <div className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">Export compliance report</div>
                </div>
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-3 md:p-4 justify-start group relative overflow-hidden hover:shadow-card hover:border-primary/30 transition-all duration-300">
              <div className="text-left flex items-center gap-2 md:gap-3">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">Check Alerts</div>
                  <div className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">View all notifications</div>
                </div>
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
              </div>
            </Button>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};