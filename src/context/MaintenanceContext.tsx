import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceState {
  enabled: boolean;
  message: string;
}

interface MaintenanceContextType {
  maintenance: MaintenanceState;
  setMaintenance: (state: MaintenanceState) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const DEFAULT_MAINTENANCE_STATE = {
  enabled: false,
  message: "Site is under maintenance. Please check back later."
};

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenanceState] = useState<MaintenanceState>(DEFAULT_MAINTENANCE_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const fetchMaintenanceState = async (retry = false) => {
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'maintenance_mode')
        .single();

      if (error) {
        throw error;
      }

      if (data?.value) {
        setMaintenanceState(data.value as MaintenanceState);
      }
      
      setError(null);
    } catch (error: any) {
      console.error('Error fetching maintenance state:', error);
      
      if (retry && retryCount < MAX_RETRIES) {
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMaintenanceState(true);
        }, delay);
      } else {
        setError(error);
        // Fallback to default state on error
        setMaintenanceState(DEFAULT_MAINTENANCE_STATE);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceState(true);
    
    // Subscribe to changes
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'secrets',
          filter: 'name=eq.maintenance_mode'
        },
        () => {
          fetchMaintenanceState(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setMaintenance = async (state: MaintenanceState) => {
    try {
      const { error } = await supabase
        .from('secrets')
        .update({ value: state })
        .eq('name', 'maintenance_mode');

      if (error) throw error;
      setMaintenanceState(state);
      setError(null);
    } catch (error: any) {
      console.error('Error updating maintenance state:', error);
      setError(error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{ maintenance, setMaintenance, isLoading, error }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}