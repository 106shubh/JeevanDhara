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
  TrendingUp
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { AlertBadge } from "./AlertBadge";

export const Dashboard = () => {
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
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Animals"
          value="247"
          change="+12 this month"
          changeType="positive"
          icon={<Stethoscope className="h-4 w-4" />}
        />
        <DashboardCard
          title="Active Treatments"
          value="8"
          change="-3 from last week"
          changeType="positive"
          icon={<Activity className="h-4 w-4" />}
        />
        <DashboardCard
          title="MRL Compliance"
          value="98.5%"
          change="+2.1% improvement"
          changeType="positive"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <DashboardCard
          title="Pending Alerts"
          value="3"
          change="2 urgent"
          changeType="negative"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AMU Trend Chart */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">AMU Trends & Compliance</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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

        {/* Species Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">AMU by Species</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      {/* Withdrawal Periods Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Active Withdrawal Periods</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {withdrawalData.map((item) => (
              <div key={item.animal} className="flex items-center justify-between p-3 rounded-lg border border-border hover:shadow-card transition-smooth">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-foreground">{item.animal}</p>
                    <p className="text-sm text-muted-foreground">{item.drug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
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

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-primary h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Log New AMU</div>
                <div className="text-xs opacity-80">Record antimicrobial usage</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Generate Report</div>
                <div className="text-xs text-muted-foreground">Export compliance report</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Check Alerts</div>
                <div className="text-xs text-muted-foreground">View all notifications</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};