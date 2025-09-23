import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
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
  
  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'log-amu', label: t('logAMU'), icon: Plus },
    { id: 'alerts', label: t('alerts'), icon: Bell },
    { id: 'prescriptions', label: t('prescriptions'), icon: FileText },
    { id: 'chatbot', label: t('chatbot'), icon: MessageCircle },
  ];

  return (
    <nav className="bg-card border-r border-border h-full p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeView === item.id ? "bg-gradient-primary text-white" : ""
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};