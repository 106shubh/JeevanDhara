import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { AMUForm } from "@/components/AMUForm";
import { AlertCenter } from "@/components/AlertCenter";
import { PrescriptionManager } from "@/components/PrescriptionManager";

const Index = () => {
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-64 hidden md:block">
          <Navigation activeView={activeView} setActiveView={setActiveView} />
        </div>
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 p-2">
        <div className="flex justify-around">
          {[
            { id: 'dashboard', icon: "📊", label: "Dashboard" },
            { id: 'log-amu', icon: "➕", label: "Log AMU" },
            { id: 'alerts', icon: "🔔", label: "Alerts" },
            { id: 'prescriptions', icon: "📋", label: "Scripts" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeView === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;