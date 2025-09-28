import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { AMUForm } from "@/components/AMUForm";
import { AlertCenter } from "@/components/AlertCenter";
import { PrescriptionManager } from "@/components/PrescriptionManager";
import { Chatbot } from "@/components/FunctionalChatbot";
import VeterinarianNetwork from "@/components/VeterinarianNetwork";
import FarmerCommunity from "@/components/FarmerCommunity";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import { FoodSafetyMonitor } from "@/components/FoodSafetyMonitor";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "log-amu":
        return <AMUForm />;
      case "alerts":
        return <AlertCenter />;
      case "prescriptions":
        return <PrescriptionManager />;
      case "chatbot":
        return <Chatbot />;
      case "veterinarians":
        return <VeterinarianNetwork />;
      case "community":
        return <FarmerCommunity />;
      case "analytics":
        return <AdvancedAnalytics />;
      case "food-safety":
        return <FoodSafetyMonitor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="flex h-[calc(100vh-80px)] pb-[60px] md:pb-0">
        <div className="w-56 lg:w-64 hidden md:block">
          <Navigation activeView={activeView} setActiveView={setActiveView} />
        </div>
        <main className="flex-1 overflow-auto p-2 md:p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 p-1 pb-safe">
        <div className="grid grid-cols-5 gap-0.5">
          {[
            { id: 'dashboard', icon: "📊", label: t("dashboard") || "Dashboard" },
            { id: 'log-amu', icon: "➕", label: t("logAMU") || "Log" },
            { id: 'alerts', icon: "🔔", label: t("alerts") || "Alerts" },
            { id: 'prescriptions', icon: "📋", label: "Rx" },
            { id: 'chatbot', icon: "💬", label: "Chat" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeView === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-0.5 mt-0.5">
          {[
            { id: 'veterinarians', icon: "🩺", label: "Vets" },
            { id: 'community', icon: "👥", label: "Community" },
            { id: 'analytics', icon: "📈", label: "Analytics" },
            { id: 'food-safety', icon: "🛡️", label: "Safety" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeView === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;