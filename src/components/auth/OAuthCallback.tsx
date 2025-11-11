import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state change:", event, session?.user);
          
          if (session?.user) {
            // User is authenticated, redirect to dashboard
            toast.success("Login successful!");
            // Check if there's a redirect URL in the location state
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
          } else if (event === 'SIGNED_OUT') {
            // No session, redirect to login
            toast.error("Authentication failed. Please try again.");
            navigate("/auth/login");
          }
        });

        // Also check current session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session?.user);
        
        if (session?.user) {
          // User is already authenticated, redirect to dashboard
          toast.success("Login successful!");
          // Check if there's a redirect URL in the location state
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }

        // Clean up subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Unexpected error during OAuth callback:", err);
        toast.error("An unexpected error occurred. Please try again.");
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Completing authentication...</p>
        </div>
      </div>
    );
  }

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