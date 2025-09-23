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
                <p className="text-xs text-muted-foreground">AMU Score</p>
                <p className="text-lg font-bold">8.2</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-success mr-1" />
                  <span className="text-xs text-success">-30%</span>
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
                  <CheckCircle className="h-3 w-3 text-success mr-1" />
                  <span className="text-xs text-success">+5%</span>
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
              <div className="h-4 w-4 bg-primary/20 rounded-sm flex items-center justify-center">
                <LineChart className="h-2.5 w-2.5 text-primary" />
              </div>
              <div className="h-4 w-4 bg-muted/50 rounded-sm flex items-center justify-center">
                <BarChart2 className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
              <div className="h-4 w-4 bg-muted/50 rounded-sm flex items-center justify-center">
                <PieChart className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-24 w-full bg-muted/20 rounded-md relative overflow-hidden">
            {/* Chart Lines */}
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
              <div className="flex-1 h-[30%] border-t border-primary/30"></div>
              <div className="flex-1 h-[60%] border-t border-primary/30"></div>
              <div className="flex-1 h-[40%] border-t border-primary/30"></div>
              <div className="flex-1 h-[20%] border-t border-primary/30"></div>
              <div className="flex-1 h-[50%] border-t border-primary/30"></div>
              <div className="flex-1 h-[70%] border-t border-primary/30"></div>
            </div>
            
            {/* Chart Line */}
            <div className="absolute bottom-0 left-0 w-full h-full">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d="M0,24 L40,12 L80,18 L120,6 L160,15 L200,9 L240,3" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            {/* Data Points */}
            <div className="absolute bottom-0 left-0 w-full h-full flex justify-between items-end px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-24px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-12px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-18px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-6px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-15px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-9px]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary transform translate-y-[-3px]"></div>
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-between mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-primary rounded-sm mr-1"></div>
                <span className="text-xs text-muted-foreground">AMU</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-success rounded-sm mr-1"></div>
                <span className="text-xs text-muted-foreground">Target</span>
              </div>
            </div>
            <div className="flex items-center">
              <ArrowUpRight className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs text-primary">Details</span>
            </div>
          </div>
        </motion.div>

        {/* Alerts Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-card border rounded-lg p-3 shadow-sm"
        >
          <p className="text-sm font-medium mb-2">Recent Alerts</p>
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