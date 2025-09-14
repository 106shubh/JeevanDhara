import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className
}: DashboardCardProps) => {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-destructive", 
    neutral: "text-muted-foreground"
  }[changeType];
  
  const changeIcon = {
    positive: <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }} className="text-success">↑</motion.div>,
    negative: <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }} className="text-destructive">↓</motion.div>,
    neutral: null
  }[changeType];

  return (
    <Card className={cn("shadow-card hover:shadow-elevated transition-all duration-300 relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        {icon && (
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.2 }}
            className="text-primary bg-primary/10 p-2 rounded-full"
          >
            {icon}
          </motion.div>
        )}
      </CardHeader>
      <CardContent>
        <motion.div 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="text-2xl font-bold text-foreground"
        >
          {value}
        </motion.div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {changeIcon}
            <p className={cn("text-xs", changeColorClass)}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};