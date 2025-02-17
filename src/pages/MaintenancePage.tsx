import { Button } from "@/components/ui/button";

interface MaintenancePageProps {
  message?: string;
}

export function MaintenancePage({ message = "Site is under maintenance. Please check back later." }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <img
            src="/lovable-uploads/8ab86c2e-aa15-4f34-83bb-77020393dbea.png"
            alt="Maintenance"
            className="w-48 h-48 mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-900">Under Maintenance</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}