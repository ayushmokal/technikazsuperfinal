import { useLocation } from "react-router-dom";
import { useMaintenance } from "@/context/MaintenanceContext";
import { MaintenancePage } from "@/pages/MaintenancePage";

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { maintenance, isLoading } = useMaintenance();
  const location = useLocation();

  // Don't show maintenance page for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isLoading) {
    return null;
  }

  if (maintenance.enabled && !isAdminRoute) {
    return <MaintenancePage message={maintenance.message} />;
  }

  return <>{children}</>;
}