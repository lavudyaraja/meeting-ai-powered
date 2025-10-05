import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        // We just need to wait for the session to be established
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("OAuth callback error:", error);
          alert("Authentication failed. Please try again.");
          navigate("/auth");
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          navigate("/dashboard");
        } else {
          // No session, redirect to login
          navigate("/auth");
        }
      } catch (err) {
        console.error("Unexpected error during OAuth callback:", err);
        alert("An unexpected error occurred. Please try again.");
        navigate("/auth");
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