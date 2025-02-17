import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
type Toast = ReturnType<typeof useToast>["toast"];

export const handleAdminUserCreation = async (
  user: User,
  setState: React.Dispatch<React.SetStateAction<any>>,
  toast: Toast
) => {
  try {
    toast({
      title: "Success",
      description: "Account created successfully. Please check your email to confirm your account before logging in.",
    });
    setState(prev => ({ ...prev, isSigningUp: false }));
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
  }
};