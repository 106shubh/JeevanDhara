import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Plus, 
  Bell, 
  FileText,
  MessageCircle,
  Home
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
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
  
  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'log-amu', label: t('logAMU'), icon: Plus },
    { id: 'alerts', label: t('alerts'), icon: Bell },
    { id: 'prescriptions', label: t('prescriptions'), icon: FileText },
    { id: 'chatbot', label: t('chatbot'), icon: MessageCircle },
  ];

  return (
    <nav className="bg-card border-r border-border h-full p-2 md:p-4">
      <div className="space-y-1 md:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start text-xs md:text-sm h-8 md:h-10 ${
                activeView === item.id ? "bg-gradient-primary text-white" : ""
              }`}
              onClick={() => setActiveView(item.id)}
              size={isMobile ? "sm" : "default"}
            >
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};