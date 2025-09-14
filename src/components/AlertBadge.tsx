import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface AlertBadgeProps {
  type: "urgent" | "warning" | "compliant" | "pending";
  children: React.ReactNode;
  className?: string;
}

export const AlertBadge = ({ type, children, className }: AlertBadgeProps) => {
  const variants = {
    urgent: {
      className: "bg-destructive text-destructive-foreground shadow-alert border-destructive/50",
      icon: AlertTriangle
    },
    warning: {
      className: "bg-warning text-warning-foreground border-warning/50",
      icon: Clock
    },
    compliant: {
      className: "bg-success text-success-foreground shadow-success border-success/50",
      icon: CheckCircle
    },
    pending: {
      className: "bg-muted text-muted-foreground border-border",
      icon: Clock
    }
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Badge 
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-smooth",
          "hover:shadow-sm cursor-pointer",
          variant.className,
          className
        )}
      >
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ 
            repeat: type === "urgent" ? Infinity : 0, 
            repeatDelay: 2,
            duration: 0.5 
          }}
        >
          <Icon className="h-3 w-3" />
        </motion.div>
        <span className="relative">
          {children}
          {type === "urgent" && (
            <motion.span 
              className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-destructive"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5 
              }}
            />
          )}
        </span>
      </Badge>
    </motion.div>
  );
};