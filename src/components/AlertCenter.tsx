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
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export const AlertCenter = () => {
  const { alerts, loading, dismissAlert } = useRealTimeAlerts();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Animation variants
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

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 px-2 md:px-0">
        <div className="text-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary mx-auto mb-2 md:mb-4"></div>
          <p className="text-xs md:text-sm text-muted-foreground">{t('loading')}</p>
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
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge type={alert.type}>
                {alert.type.toUpperCase()}
              </AlertBadge>
              {alert.animals?.animal_id && (
                <Badge variant="outline" className="text-[10px] md:text-xs">
                  {alert.animals.animal_id}
                </Badge>
              )}
            </div>
            
            <h4 className="font-medium text-sm md:text-base text-foreground">{alert.title}</h4>
            <p className="text-xs md:text-sm text-muted-foreground">{alert.message}</p>
            
            {alert.action_required && (
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-primary font-medium">Action: {alert.action_required}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-[10px] md:text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(alert.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            {alert.action_required && (
              <Button size="sm" variant="outline" className="text-xs md:text-sm py-1 h-7 md:h-8">
                Take Action
              </Button>
            )}
            {alert.can_dismiss && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground h-7 md:h-8"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-4 md:space-y-6 px-2 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
          <CardHeader className="px-3 md:px-6 py-3 md:py-4">
            <CardTitle className="flex items-center gap-1 md:gap-2">
              <motion.div 
                whileHover={{ rotate: isMobile ? 180 : 360 }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </motion.div>
              <span className="text-sm md:text-base">{t('alerts')}</span>
              <Badge className="bg-destructive text-destructive-foreground text-[10px] md:text-xs py-0 md:py-0.5 h-5 md:h-6">
                {groupedAlerts.urgent.length + groupedAlerts.warning.length + groupedAlerts.pending.length}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {alerts.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
            <CardContent className="p-4 md:p-8 text-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              >
                <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-success mx-auto mb-2 md:mb-4" />
              </motion.div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">No Active Alerts</h3>
              <p className="text-xs md:text-sm text-muted-foreground">All your animals are compliant with withdrawal periods.</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Urgent Alerts */}
          {groupedAlerts.urgent.length > 0 && (
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <motion.div 
                  whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-destructive" />
                </motion.div>
                <h3 className="font-semibold text-destructive text-xs md:text-sm">Urgent Alerts</h3>
              </div>
              {groupedAlerts.urgent.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </motion.div>
          )}

          {/* Warning Alerts */}
          {groupedAlerts.warning.length > 0 && (
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <motion.div 
                  whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-warning" />
                </motion.div>
                <h3 className="font-semibold text-warning text-xs md:text-sm">Warnings</h3>
              </div>
              {groupedAlerts.warning.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </motion.div>
          )}

          {/* Pending Items */}
          {groupedAlerts.pending.length > 0 && (
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <motion.div 
                  whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                </motion.div>
                <h3 className="font-semibold text-muted-foreground text-xs md:text-sm">Pending</h3>
              </div>
              {groupedAlerts.pending.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </motion.div>
          )}

          {/* Recent Success */}
          {groupedAlerts.compliant.length > 0 && (
            <motion.div className="space-y-3" variants={itemVariants}>
              <div className="flex items-center gap-1 md:gap-2">
                <motion.div 
                  whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-success" />
                </motion.div>
                <h3 className="font-semibold text-success text-xs md:text-sm">Recent Activity</h3>
              </div>
              {groupedAlerts.compliant.slice(0, 2).map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};