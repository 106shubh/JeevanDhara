import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

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
    <Badge 
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-smooth",
        variant.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </Badge>
  );
};