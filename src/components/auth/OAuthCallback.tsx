import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Add a small delay to ensure Supabase has processed the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we have a session after the OAuth flow
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("OAuth callback error:", error);
          toast.error("Authentication failed. Please try again.");
          navigate("/auth/login");
          return;
        }
        
        if (session?.user) {
          // User is authenticated, redirect to dashboard
          toast.success("Login successful!");
          navigate("/dashboard", { replace: true });
        } else {
          // No session, redirect to login
          toast.error("Authentication failed. Please try again.");
          navigate("/auth/login");
        }
      } catch (err) {
        console.error("Unexpected error during OAuth callback:", err);
        toast.error("An unexpected error occurred. Please try again.");
        navigate("/auth/login");
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;