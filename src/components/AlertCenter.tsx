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
import { useRealTimeAlerts } from "@/hooks/useRealTimeAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const AlertCenter = () => {
  const { alerts, loading, dismissAlert } = useRealTimeAlerts();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const groupedAlerts = {
    urgent: alerts.filter(a => a.type === "urgent"),
    warning: alerts.filter(a => a.type === "warning"),
    pending: alerts.filter(a => a.type === "pending"),
    compliant: alerts.filter(a => a.type === "compliant")
  };

  const AlertItem = ({ alert }: { alert: any }) => (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <AlertBadge type={alert.type}>
                {alert.type.toUpperCase()}
              </AlertBadge>
              {alert.animals?.animal_id && (
                <Badge variant="outline" className="text-xs">
                  {alert.animals.animal_id}
                </Badge>
              )}
            </div>
            
            <h4 className="font-medium text-foreground">{alert.title}</h4>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            
            {alert.action_required && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-primary font-medium">Action: {alert.action_required}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(alert.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {alert.action_required && (
              <Button size="sm" variant="outline">
                Take Action
              </Button>
            )}
            {alert.can_dismiss && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => dismissAlert(alert.id)}
              >
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
            <span>{t('alerts')}</span>
            <Badge className="bg-destructive text-destructive-foreground">
              {groupedAlerts.urgent.length + groupedAlerts.warning.length + groupedAlerts.pending.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {alerts.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Alerts</h3>
            <p className="text-muted-foreground">All your animals are compliant with withdrawal periods.</p>
          </CardContent>
        </Card>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};