import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  X
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";

interface Alert {
  id: string;
  type: "urgent" | "warning" | "compliant" | "pending";
  title: string;
  message: string;
  animalId?: string;
  date: string;
  actionRequired?: string;
  canDismiss?: boolean;
}

export const AlertCenter = () => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "urgent",
      title: "Withdrawal Period Violation Risk",
      message: "COW-023 scheduled for slaughter in 2 days but withdrawal period ends in 5 days",
      animalId: "COW-023",
      date: "2024-01-15",
      actionRequired: "Delay slaughter until Jan 20th",
      canDismiss: false
    },
    {
      id: "2", 
      type: "warning",
      title: "Upcoming Withdrawal End",
      message: "Milk withdrawal period for GOAT-015 ends tomorrow",
      animalId: "GOAT-015",
      date: "2024-01-16",
      actionRequired: "Resume milk collection after 24h",
      canDismiss: true
    },
    {
      id: "3",
      type: "compliant",
      title: "Successful AMU Logging",
      message: "AMU entry for PIG-008 submitted successfully. MRL compliance verified.",
      animalId: "PIG-008", 
      date: "2024-01-14",
      canDismiss: true
    },
    {
      id: "4",
      type: "pending",
      title: "Prescription Verification Pending",
      message: "Veterinary prescription for SHEEP-012 requires verification",
      animalId: "SHEEP-012",
      date: "2024-01-13",
      actionRequired: "Contact veterinarian",
      canDismiss: false
    },
    {
      id: "5",
      type: "warning", 
      title: "High AMU Frequency Alert",
      message: "COW-007 has received 3 antimicrobial treatments this month",
      animalId: "COW-007",
      date: "2024-01-12",
      actionRequired: "Review treatment protocol",
      canDismiss: true
    }
  ];

  const groupedAlerts = {
    urgent: alerts.filter(a => a.type === "urgent"),
    warning: alerts.filter(a => a.type === "warning"),
    pending: alerts.filter(a => a.type === "pending"),
    compliant: alerts.filter(a => a.type === "compliant")
  };

  const AlertItem = ({ alert }: { alert: Alert }) => (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <AlertBadge type={alert.type}>
                {alert.type.toUpperCase()}
              </AlertBadge>
              {alert.animalId && (
                <Badge variant="outline" className="text-xs">
                  {alert.animalId}
                </Badge>
              )}
            </div>
            
            <h4 className="font-medium text-foreground">{alert.title}</h4>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            
            {alert.actionRequired && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-primary font-medium">Action: {alert.actionRequired}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(alert.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {alert.actionRequired && (
              <Button size="sm" variant="outline">
                Take Action
              </Button>
            )}
            {alert.canDismiss && (
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Alert Center</span>
            <Badge className="bg-destructive text-destructive-foreground">
              {groupedAlerts.urgent.length + groupedAlerts.warning.length + groupedAlerts.pending.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Urgent Alerts */}
      {groupedAlerts.urgent.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold text-destructive">Urgent Alerts</h3>
          </div>
          {groupedAlerts.urgent.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {groupedAlerts.warning.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-warning" />
            <h3 className="font-semibold text-warning">Warnings</h3>
          </div>
          {groupedAlerts.warning.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Pending Items */}
      {groupedAlerts.pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-muted-foreground">Pending</h3>
          </div>
          {groupedAlerts.pending.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Recent Success */}
      {groupedAlerts.compliant.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <h3 className="font-semibold text-success">Recent Activity</h3>
          </div>
          {groupedAlerts.compliant.slice(0, 2).map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};