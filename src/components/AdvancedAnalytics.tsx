import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  BarChart3, 
  Calendar,
  Target,
  ArrowUp,
  ArrowDown,
  Brain,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Bell,
  Thermometer
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface PredictionData {
  disease: string;
  probability: number;
  timeframe: string;
  confidence: number;
  riskFactors: string[];
  preventionSteps: string[];
}

interface CostAnalysis {
  category: string;
  currentMonth: number;
  previousMonth: number;
  yearToDate: number;
  budget: number;
  roi: number;
}

interface BenchmarkData {
  metric: string;
  yourFarm: number;
  regional: number;
  national: number;
  performance: 'above' | 'below' | 'average';
}

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState("predictions");
  const [timeFrame, setTimeFrame] = useState("30days");
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [costData, setCostData] = useState<CostAnalysis[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const { toast } = useToast();

  // Sample data initialization
  useEffect(() => {
    const samplePredictions: PredictionData[] = [
      {
        disease: "Mastitis Outbreak",
        probability: 78,
        timeframe: "Next 2 weeks",
        confidence: 85,
        riskFactors: ["High humidity", "Poor ventilation", "Stress indicators"],
        preventionSteps: ["Improve hygiene protocols", "Enhance ventilation", "Monitor udder health"]
      },
      {
        disease: "Respiratory Issues",
        probability: 45,
        timeframe: "Next month",
        confidence: 72,
        riskFactors: ["Temperature fluctuations", "Dust levels", "Overcrowding"],
        preventionSteps: ["Climate control", "Air filtration", "Space management"]
      }
    ];
    setPredictions(samplePredictions);

    const sampleCosts: CostAnalysis[] = [
      {
        category: "Feed Costs",
        currentMonth: 45000,
        previousMonth: 42000,
        yearToDate: 520000,
        budget: 550000,
        roi: 2.8
      },
      {
        category: "Veterinary Care",
        currentMonth: 12000,
        previousMonth: 15000,
        yearToDate: 145000,
        budget: 160000,
        roi: 4.2
      }
    ];
    setCostData(sampleCosts);

    const sampleBenchmarks: BenchmarkData[] = [
      {
        metric: "Milk Yield (L/cow/day)",
        yourFarm: 28.5,
        regional: 25.2,
        national: 22.8,
        performance: 'above'
      },
      {
        metric: "Feed Conversion Ratio",
        yourFarm: 1.35,
        regional: 1.42,
        national: 1.48,
        performance: 'above'
      }
    ];
    setBenchmarks(sampleBenchmarks);
  }, []);

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Comprehensive analytics report has been generated and will be downloaded shortly."
    });
  };

  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information."
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-foreground">Advanced Analytics & Insights</h2>
        <p className="text-muted-foreground">
          AI-powered analytics for predictive insights, cost optimization, and performance benchmarking
        </p>
      </motion.div>

      {/* Control Panel */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-lg border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarking</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6 mt-6">
          {/* Predictions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600">AI Predictions</p>
                    <p className="text-2xl font-bold">{predictions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-600">High Risk Alerts</p>
                    <p className="text-2xl font-bold">{predictions.filter(p => p.probability > 70).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Prevention Actions</p>
                    <p className="text-2xl font-bold">{predictions.reduce((acc, p) => acc + p.preventionSteps.length, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Predictions */}
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-300 ${
                  prediction.probability > 70 ? 'border-red-200' : 
                  prediction.probability > 50 ? 'border-orange-200' : 'border-green-200'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          prediction.probability > 70 ? 'bg-red-100' : 
                          prediction.probability > 50 ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          <AlertTriangle className={`h-6 w-6 ${
                            prediction.probability > 70 ? 'text-red-600' : 
                            prediction.probability > 50 ? 'text-orange-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{prediction.disease}</h3>
                          <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            prediction.probability > 70 ? 'destructive' : 
                            prediction.probability > 50 ? 'default' : 'secondary'
                          }>
                            {prediction.probability}% Risk
                          </Badge>
                          <Badge variant="outline">
                            {prediction.confidence}% Confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-red-700">Risk Factors:</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.riskFactors.map((factor, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-700">Prevention Steps:</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.preventionSteps.map((step, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Prevention
                      </Button>
                      <Button size="sm" variant="outline">
                        <Bell className="h-4 w-4 mr-2" />
                        Set Alert
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6 mt-6">
          {/* Cost Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costData.map((cost, index) => (
              <motion.div
                key={cost.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{cost.category}</p>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">₹{cost.currentMonth.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        {cost.currentMonth > cost.previousMonth ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`text-sm ${
                          cost.currentMonth > cost.previousMonth ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {Math.abs(((cost.currentMonth - cost.previousMonth) / cost.previousMonth * 100)).toFixed(1)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs last month</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ROI</span>
                          <span className="font-medium text-green-600">{cost.roi}x</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Cost Breakdown Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Cost Breakdown Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive cost analysis chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6 mt-6">
          <div className="space-y-4">
            {benchmarks.map((benchmark, index) => (
              <motion.div
                key={benchmark.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{benchmark.metric}</h3>
                      <Badge variant={
                        benchmark.performance === 'above' ? 'default' : 
                        benchmark.performance === 'below' ? 'destructive' : 'secondary'
                      }>
                        {benchmark.performance === 'above' ? 'Above Average' : 
                         benchmark.performance === 'below' ? 'Below Average' : 'Average'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Your Farm</p>
                        <p className="text-2xl font-bold text-primary">{benchmark.yourFarm}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Regional Avg</p>
                        <p className="text-xl font-semibold">{benchmark.regional}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">National Avg</p>
                        <p className="text-xl font-semibold">{benchmark.national}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Performance vs Regional</span>
                        <span className={`font-medium ${
                          benchmark.yourFarm > benchmark.regional ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {benchmark.yourFarm > benchmark.regional ? '+' : ''}
                          {((benchmark.yourFarm - benchmark.regional) / benchmark.regional * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Trend Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Milk Production</p>
                    <p className="font-semibold">↑ 12.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Profitability</p>
                    <p className="font-semibold">↑ 8.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="font-semibold">↑ 3.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Feed Efficiency</p>
                    <p className="font-semibold">↓ 2.1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Performance Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive trend analysis chart would appear here</p>
                  <p className="text-sm text-muted-foreground mt-1">Showing milk production, costs, health scores, and profitability trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seasonal Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700">Current Season Insights</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Increase protein content in feed for better milk production
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Monitor for heat stress in dairy cattle
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Prepare for monsoon season disease prevention
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-700">Upcoming Season Preparation</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      Stock up on mineral supplements before price increase
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      Schedule breeding activities for optimal calving timing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      Plan infrastructure improvements during dry season
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}