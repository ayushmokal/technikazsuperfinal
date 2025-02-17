import { useToast } from "@/hooks/use-toast";
type Toast = ReturnType<typeof useToast>["toast"];

export const handleAuthError = (error: any, toast: Toast) => {
  console.log("Auth error details:", error);

  if (error.message.includes('rate_limit')) {
    toast({
      variant: "destructive",
      title: "Rate Limit Exceeded",
      description: "Please wait a moment before trying again.",
    });
    return;
  }

  if (error.message.includes('invalid_credentials') || error.message.includes('Invalid login credentials')) {
    toast({
      variant: "destructive",
      title: "Invalid Credentials",
      description: "The email or password you entered is incorrect. Please try again.",
    });
    return;
  }

  if (error.message.includes('email_not_confirmed') || error.message.includes('Email not confirmed')) {
    toast({
      variant: "destructive",
      title: "Email Not Confirmed",
      description: "Please check your email and confirm your account, or contact the system administrator.",
    });
    return;
  }

  // Generic error handler
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message || "An unexpected error occurred",
  });
};