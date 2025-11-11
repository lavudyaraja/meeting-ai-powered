import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Brain, Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Failed to sign in. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Login successful!");
        // Navigate to the intended page or dashboard
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
    setOauthLoading(provider);
    
    try {
      // Determine the redirect URL based on the environment
      // Use a more flexible approach that works for both localhost and deployed environments
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      console.log("OAuth redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'azure',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("OAuth error:", error);
        toast.error(error.message || `Failed to sign in with ${provider}.`);
        setOauthLoading(null);
        return;
      }

      // The OAuth flow will redirect the user, so we don't need to do anything here
    } catch (error) {
      console.error("Unexpected OAuth error:", error);
      toast.error(`An unexpected error occurred with ${provider} sign in.`);
      setOauthLoading(null);
    }
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/auth/register");
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-slate-100" />
                  </div>
                  <span className="text-2xl font-bold text-slate-100">
                    Meetings AI
                  </span>
                </div>

                <h1 className="text-5xl font-bold text-slate-100 leading-tight">
                  Transform Your
                  <span className="block text-indigo-400 mt-2">
                    Meetings Experience
                  </span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                  Intelligent meeting management powered by AI. Record, transcribe, and extract insights from every conversation automatically.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 max-w-md">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors">
                    <div className="text-3xl font-bold text-slate-100 mb-1">10K+</div>
                    <div className="text-sm text-slate-400">Active Users</div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors">
                    <div className="text-3xl font-bold text-slate-100 mb-1">50K+</div>
                    <div className="text-sm text-slate-400">Meetings Recorded</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="bg-slate-800 border border-slate-700 p-8 lg:p-10 rounded-2xl">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-750 border border-slate-700 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-slate-100" />
                    </div>
                    <span className="text-xl font-bold text-slate-100">
                      Meetings AI
                    </span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-100 mb-2">Welcome Back</h2>
                  <p className="text-slate-400">Sign in to continue to your account</p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={oauthLoading !== null}
                    className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-650 border border-slate-600 text-slate-100 font-medium h-12 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading === 'google' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('microsoft')}
                    disabled={oauthLoading !== null}
                    className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-650 border border-slate-600 text-slate-100 font-medium h-12 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading === 'microsoft' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                    )}
                    Continue with Microsoft
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-slate-400 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-11 h-12 bg-slate-750 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-slate-300 font-medium">
                        Password
                      </Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-11 h-12 bg-slate-750 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all"
                    disabled={loading || oauthLoading !== null}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-3">
                  <p className="text-slate-400 text-sm">
                    Don't have an account?{" "}
                    <button 
                      onClick={handleSignUp}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                  <button 
                    onClick={handleForgotPassword}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;