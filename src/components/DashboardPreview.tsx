import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Stethoscope,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpRight
} from "lucide-react";

export const DashboardPreview = () => {
  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="space-y-4 p-1">
        {/* Search Bar */}
        <div className="flex items-center bg-muted/30 rounded-md p-1.5 mb-2">
          <div className="h-3 w-3/4 bg-muted rounded-sm"></div>
          <div className="ml-auto flex space-x-1">
            <div className="h-3 w-3 bg-muted rounded-full"></div>
            <div className="h-3 w-3 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-card border rounded-lg p-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Total Animals</p>
                <p className="text-lg font-bold">247</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                  <span className="text-xs text-success">+12%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-card border rounded-lg p-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">AMU Reduction</p>
                <p className="text-lg font-bold">24%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-success mr-1" />
                  <span className="text-xs text-success">-8%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-card border rounded-lg p-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Compliance</p>
                <p className="text-lg font-bold">98%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                  <span className="text-xs text-success">+2%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-card border rounded-lg p-3 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">AMU Trend</p>
            <div className="flex space-x-1">
              <div className="h-2 w-4 bg-primary/20 rounded-sm"></div>
              <div className="h-2 w-4 bg-primary/40 rounded-sm"></div>
              <div className="h-2 w-4 bg-primary/60 rounded-sm"></div>
            </div>
          </div>
          <div className="h-[80px] w-full relative">
            <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
              <path 
                d="M0,40 C60,10 140,60 300,30" 
                fill="none" 
                stroke="hsl(var(--primary) / 0.2)" 
                strokeWidth="2"
              />
              <path 
                d="M0,60 C100,30 200,50 300,40" 
                fill="none" 
                stroke="hsl(var(--primary) / 0.4)" 
                strokeWidth="2"
              />
              <path 
                d="M0,50 C50,30 250,10 300,20" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-[20px] bg-gradient-to-t from-card to-transparent"></div>
          </div>
        </motion.div>

        {/* Alerts Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-card border rounded-lg p-3 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Recent Alerts</p>
            <Badge className="text-[10px] h-4">2 New</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 text-warning mr-2" />
                <span className="text-xs">Withdrawal period: COW-023</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-4">2 days left</Badge>
            </div>
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-3.5 w-3.5 text-success mr-2" />
                <span className="text-xs">Treatment completed: GOAT-015</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-4 bg-success/10 text-success">Done</Badge>
            </div>
          </div>
        </motion.div>

        {/* Tasks Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-card border rounded-lg p-3 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Upcoming Tasks</p>
            <Badge className="text-[10px] h-4">3 New</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-primary/20 rounded-sm mr-2 flex-shrink-0"></div>
              <div className="h-2 w-full bg-muted/50 rounded-sm"></div>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-primary/20 rounded-sm mr-2 flex-shrink-0"></div>
              <div className="h-2 w-4/5 bg-muted/50 rounded-sm"></div>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-primary/20 rounded-sm mr-2 flex-shrink-0"></div>
              <div className="h-2 w-2/3 bg-muted/50 rounded-sm"></div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Stethoscope className="h-3 w-3 text-primary mr-1" />
            <span className="text-xs text-primary">View Details</span>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
};