import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Brain, Loader2, Mail, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        toast.error(error.message || "Failed to send reset instructions. Please try again.");
        setLoading(false);
      } else {
        toast.success("Password reset instructions sent! Check your email.");
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  const handleResendEmail = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        console.error("Resend error:", error);
        toast.error(error.message || "Failed to resend email. Please try again.");
        setLoading(false);
      } else {
        toast.success("Reset email resent! Check your inbox.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Failed to resend email. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Grid Background - Full visibility */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>

      {/* Accent elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          
          {/* Back to Login Button */}
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Sign In</span>
          </button>

          <Card className="bg-slate-800 border border-slate-700 p-8 lg:p-10 rounded-2xl">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-9 h-9 text-slate-100" />
              </div>
            </div>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-100 mb-3">Forgot Password?</h1>
                  <p className="text-slate-400 leading-relaxed">
                    No worries! Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {/* Info Alert */}
                <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    The reset link will be valid for 1 hour. Make sure to check your spam folder if you don't see the email.
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
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

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Instructions...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>

                {/* Additional Help */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <p className="text-center text-sm text-slate-400">
                    Remember your password?{" "}
                    <button
                      onClick={handleBackToLogin}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-600/20 border-2 border-green-600 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-3">Check Your Email</h2>
                    <p className="text-slate-400 leading-relaxed">
                      We've sent password reset instructions to
                    </p>
                    <p className="text-indigo-400 font-semibold mt-2">{email}</p>
                  </div>

                  {/* Instructions Card */}
                  <div className="bg-slate-750 border border-slate-700 rounded-xl p-6 text-left space-y-4">
                    <h3 className="font-semibold text-slate-200 mb-3">What to do next:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-400">1</span>
                        </div>
                        <p className="text-sm text-slate-300">Check your inbox for an email from Meetings AI</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-400">2</span>
                        </div>
                        <p className="text-sm text-slate-300">Click the reset password link in the email</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-400">3</span>
                        </div>
                        <p className="text-sm text-slate-300">Create a new password for your account</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleBackToLogin}
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all"
                    >
                      Back to Sign In
                    </Button>
                    
                    <button
                      onClick={handleResendEmail}
                      disabled={loading}
                      className="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Resending..." : "Didn't receive the email? Resend"}
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="pt-6 border-t border-slate-700">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      If you don't receive an email within 5 minutes, check your spam folder or contact support for assistance.
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Footer Note */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Need help? Contact us at{" "}
            <a href="mailto:support@meetingsai.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              support@meetingsai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;