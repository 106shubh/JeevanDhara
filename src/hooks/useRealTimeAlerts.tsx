import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'compliant' | 'pending';
  title: string;
  message: string;
  action_required?: string;
  can_dismiss: boolean;
  is_dismissed: boolean;
  created_at: string;
  animal_id?: string;
  animals?: {
    animal_id: string;
  };
}

export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setAlerts([]);
      return;
    }

    const loadAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          animals (
            animal_id
          )
        `)
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading alerts:', error);
      } else {
        setAlerts(data || []);
      }
      setLoading(false);
    };

    loadAlerts();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('user_alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const newAlert = payload.new as Alert;
        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast notification for new alerts
        if (newAlert.type === 'urgent') {
          toast.error(newAlert.title, {
            description: newAlert.message,
            duration: 10000,
          });
        } else if (newAlert.type === 'warning') {
          toast.warning(newAlert.title, {
            description: newAlert.message,
            duration: 7000,
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'alerts',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const updatedAlert = payload.new as Alert;
        setAlerts(prev => prev.map(alert => 
          alert.id === updatedAlert.id ? updatedAlert : alert
        ).filter(alert => !alert.is_dismissed));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const dismissAlert = async (alertId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('alerts')
      .update({ is_dismissed: true })
      .eq('id', alertId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error dismissing alert:', error);
      toast.error('Failed to dismiss alert');
    } else {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert dismissed');
    }
  };

  return {
    alerts,
    loading,
    dismissAlert
  };
};