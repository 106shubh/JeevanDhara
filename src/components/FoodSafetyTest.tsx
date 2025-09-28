import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const FoodSafetyTest = () => {
  const [contaminants, setContaminants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContaminants = async () => {
      try {
        const { data, error } = await supabase
          .from('food_safety_contaminants')
          .select('*')
          .limit(5);
        
        if (error) throw error;
        
        setContaminants(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching contaminants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContaminants();
  }, []);

  if (loading) return <div>Loading contaminants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Food Safety Contaminants Test</h2>
      <p className="mb-4">This component tests the food safety database integration.</p>
      
      {contaminants.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-2">Sample Contaminants:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {contaminants.map((contaminant) => (
              <li key={contaminant.id}>
                {contaminant.name} - {contaminant.contaminant_type} - MRL: {contaminant.mrl_limit} {contaminant.unit}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No contaminants found in the database.</p>
      )}
    </div>
  );
};

export default FoodSafetyTest;