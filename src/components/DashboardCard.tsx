import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        {icon && (
          <motion.div 
            whileHover={{ rotate: isMobile ? 10 : 15, scale: isMobile ? 1.1 : 1.2 }}
            className="text-primary bg-primary/10 p-1.5 md:p-2 rounded-full"
          >
            {icon}
          </motion.div>
        )}
      </CardHeader>
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
        <motion.div 
          initial={{ scale: 1 }}
          whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="text-lg md:text-2xl font-bold text-foreground"
        >
          {value}
        </motion.div>
        {change && (
          <div className="flex items-center gap-0.5 md:gap-1 mt-0.5 md:mt-1">
            {changeIcon}
            <p className={cn("text-[10px] md:text-xs", changeColorClass)}>
              {change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};