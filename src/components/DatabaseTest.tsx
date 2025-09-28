import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const DatabaseTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runDatabaseTests = async () => {
      try {
        // Test 1: Check if we can access the food safety contaminants table
        const { data: contaminants, error: contaminantsError } = await supabase
          .from('food_safety_contaminants')
          .select('id, name, contaminant_type, mrl_limit, unit')
          .limit(3);
        
        if (contaminantsError) throw new Error(`Contaminants error: ${contaminantsError.message}`);
        
        // Test 2: Check if we can access the food safety samples table (should be empty for new users)
        const { data: samples, error: samplesError } = await supabase
          .from('food_safety_samples')
          .select('id')
          .eq('user_id', user?.id)
          .limit(1);
        
        if (samplesError) throw new Error(`Samples error: ${samplesError.message}`);
        
        // Test 3: Check if we can access the food safety test results table (should be empty for new users)
        const { data: testResults, error: testResultsError } = await supabase
          .from('food_safety_test_results')
          .select('id')
          .limit(1);
        
        if (testResultsError) throw new Error(`Test results error: ${testResultsError.message}`);
        
        setTestResults({
          contaminants: contaminants || [],
          samples: samples || [],
          testResults: testResults || [],
          success: true
        });
      } catch (err) {
        setError(err.message);
        console.error('Database test error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      runDatabaseTests();
    }
  }, [user]);

  if (loading) return <div className="p-4">Running database tests...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Database Integration Test Results</h2>
      
      {testResults?.success ? (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">✅ All tests passed!</h3>
            <p className="text-green-700">Database integration is working correctly.</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Test Details:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Food Safety Contaminants:</span> 
                Found {testResults.contaminants.length} sample records
                {testResults.contaminants.length > 0 && (
                  <ul className="list-circle pl-5 mt-1 text-sm">
                    {testResults.contaminants.map((contaminant: any) => (
                      <li key={contaminant.id}>
                        {contaminant.name} ({contaminant.contaminant_type}) - MRL: {contaminant.mrl_limit} {contaminant.unit}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <span className="font-medium">Food Safety Samples:</span> 
                Found {testResults.samples.length} user records
              </li>
              <li>
                <span className="font-medium">Food Safety Test Results:</span> 
                Found {testResults.testResults.length} records
              </li>
            </ul>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">ℹ️ Next Steps</h3>
            <p className="text-blue-700">
              The food safety monitoring feature is ready to use. You can now test the full functionality 
              by navigating to the Food Safety Monitor in the main dashboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-800">❌ Tests failed</h3>
          <p className="text-red-700">There was an issue with the database integration.</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;