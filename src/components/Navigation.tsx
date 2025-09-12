import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Bell, 
  FileText, 
  Home, 
  Plus, 
  Stethoscope,
  Users,
  Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: "farmer" | "veterinarian" | "regulator";
}

export const Navigation = ({ activeTab, onTabChange, userRole = "farmer" }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "log-amu", label: "Log AMU", icon: Plus },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    ...(userRole === "veterinarian" ? [{ id: "patients", label: "Patients", icon: Stethoscope }] : []),
    ...(userRole === "regulator" ? [{ id: "oversight", label: "Oversight", icon: Users }] : []),
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-card border-b border-border px-6 py-4">
        <div className="flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 transition-smooth",
                  isActive && "bg-gradient-primary text-primary-foreground shadow-md"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">Farm Portal</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full justify-start gap-2 transition-smooth",
                    isActive && "bg-gradient-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
        <div className="flex justify-around">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 h-auto transition-smooth",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};