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
        // Test 1: Check if we can access the animals table
        const { data: animals, error: animalsError } = await supabase
          .from('animals')
          .select('id, animal_id, species')
          .limit(3);
        
        if (animalsError) throw new Error(`Animals error: ${animalsError.message}`);
        
        // Test 2: Check if we can access the antimicrobials table
        const { data: antimicrobials, error: antimicrobialsError } = await supabase
          .from('antimicrobials')
          .select('id, name, active_ingredient')
          .limit(3);
        
        if (antimicrobialsError) throw new Error(`Antimicrobials error: ${antimicrobialsError.message}`);
        
        // Test 3: Check if we can access the prescriptions table
        const { data: prescriptions, error: prescriptionsError } = await supabase
          .from('prescriptions')
          .select('id')
          .limit(1);
        
        if (prescriptionsError) throw new Error(`Prescriptions error: ${prescriptionsError.message}`);
        
        setTestResults({
          animals: animals || [],
          antimicrobials: antimicrobials || [],
          prescriptions: prescriptions || [],
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
                <span className="font-medium">Animals:</span> 
                Found {testResults.animals.length} sample records
                {testResults.animals.length > 0 && (
                  <ul className="list-circle pl-5 mt-1 text-sm">
                    {testResults.animals.map((animal: any) => (
                      <li key={animal.id}>
                        {animal.animal_id} ({animal.species})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <span className="font-medium">Antimicrobials:</span> 
                Found {testResults.antimicrobials.length} sample records
                {testResults.antimicrobials.length > 0 && (
                  <ul className="list-circle pl-5 mt-1 text-sm">
                    {testResults.antimicrobials.map((antimicrobial: any) => (
                      <li key={antimicrobial.id}>
                        {antimicrobial.name} ({antimicrobial.active_ingredient})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <span className="font-medium">Prescriptions:</span> 
                Found {testResults.prescriptions.length} records
              </li>
            </ul>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">ℹ️ Next Steps</h3>
            <p className="text-blue-700">
              The database is properly configured. You can now use all features of the application.
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