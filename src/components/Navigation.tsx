import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Plus, 
  Bell, 
  FileText,
  MessageCircle,
  Home,
  Stethoscope,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
  const { t } = useLanguage();
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      // This component is only used in desktop view, so we don't need to track mobile state here
    };
    
    // No need to add/remove event listeners since we're not tracking mobile state
    return () => {};
  }, []);
  
  const navItems = [
    { id: 'dashboard', label: t('dashboard') || 'Dashboard', icon: BarChart3 },
    { id: 'log-amu', label: t('logAMU') || 'Log AMU', icon: Plus },
    { id: 'alerts', label: t('alerts') || 'Alerts', icon: Bell },
    { id: 'prescriptions', label: t('prescriptions') || 'Prescriptions', icon: FileText },
    { id: 'food-safety', label: 'Food Safety', icon: Shield },
    { id: 'veterinarians', label: 'Veterinarians', icon: Stethoscope },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'chatbot', label: t('chatbot') || 'Chatbot', icon: MessageCircle },
  ];

  return (
    <nav className="bg-card border-r border-border h-full p-1 md:p-4">
      <div className="space-y-0.5 md:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start text-xs md:text-sm h-8 md:h-10 px-2 md:px-3 ${
                activeView === item.id ? "bg-gradient-primary text-white" : ""
              } transition-all duration-200`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate hidden md:inline">{item.label}</span>
              <span className="truncate md:hidden">{item.label.length > 8 ? item.label.slice(0, 8) + '...' : item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};