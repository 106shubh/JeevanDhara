import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { AMUForm } from "@/components/AMUForm";
import { AlertCenter } from "@/components/AlertCenter";
import { PrescriptionManager } from "@/components/PrescriptionManager";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock user data - in real app this would come from authentication
  const userData = {
    role: "farmer" as const,
    name: "John Smith", 
    farmName: "Green Valley Farm",
    isOnline: true,
    alertCount: 3
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "log-amu":
        return <AMUForm />;
      case "alerts":
        return <AlertCenter />;
      case "prescriptions":
        return <PrescriptionManager />;
      case "analytics":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground">Feature coming soon - detailed AMU analytics and insights</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userData.role}
        userName={userData.name}
        farmName={userData.farmName}
        isOnline={userData.isOnline}
        alertCount={userData.alertCount}
      />
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userData.role}
      />
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {renderContent()}
      </main>
      
      {/* Hero section for landing state */}
      {activeTab === "dashboard" && (
        <div className="fixed inset-0 -z-10 opacity-5">
          <img 
            src={heroImage} 
            alt="Digital farm management" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Index;