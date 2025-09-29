import React from "react";
import DatabaseTest from "@/components/DatabaseTest";
import { useAuth } from "@/contexts/AuthContext";

const DatabaseTestPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Please sign in to access the database test.</p>
          <a href="/auth" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Database Integration Test</h1>
          <a 
            href="/" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <DatabaseTest />
        </div>
        
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About This Test</h2>
          <p className="mb-3">
            This test verifies that the application is properly integrated with the database.
            It checks:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Connection to the Supabase database</li>
            <li>Access to animals data</li>
            <li>Access to antimicrobials data</li>
            <li>Access to prescriptions data</li>
          </ul>
          <p>
            If all tests pass, the application is ready for use with real data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;