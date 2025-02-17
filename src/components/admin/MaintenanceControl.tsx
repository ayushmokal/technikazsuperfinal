import { useState } from "react";
import { useMaintenance } from "@/context/MaintenanceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function MaintenanceControl() {
  const { maintenance, setMaintenance } = useMaintenance();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(maintenance.message);
  const { toast } = useToast();

  const handleToggle = async (enabled: boolean) => {
    try {
      setIsUpdating(true);
      await setMaintenance({ ...maintenance, enabled });
      
      toast({
        title: "Success",
        description: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update maintenance mode",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMessageUpdate = async () => {
    try {
      setIsUpdating(true);
      await setMaintenance({ ...maintenance, message });
      
      toast({
        title: "Success",
        description: "Maintenance message updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update maintenance message",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>
          Enable maintenance mode to temporarily disable public access to the site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Maintenance Status</h4>
            <p className="text-sm text-muted-foreground">
              {maintenance.enabled ? 'Site is in maintenance mode' : 'Site is live'}
            </p>
          </div>
          <Switch
            checked={maintenance.enabled}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Maintenance Message</h4>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter maintenance message"
              disabled={isUpdating}
            />
            <Button 
              onClick={handleMessageUpdate}
              disabled={isUpdating || message === maintenance.message}
            >
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}