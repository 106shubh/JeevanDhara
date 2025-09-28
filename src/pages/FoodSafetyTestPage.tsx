import React from "react";
import FoodSafetyTest from "@/components/FoodSafetyTest";
import { useAuth } from "@/contexts/AuthContext";

const FoodSafetyTestPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Please sign in to access the food safety test.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Food Safety Database Test</h1>
        <FoodSafetyTest />
      </div>
    </div>
  );
};

export default FoodSafetyTestPage;