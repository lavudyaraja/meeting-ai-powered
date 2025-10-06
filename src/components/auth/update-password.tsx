import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Brain, Loader2, CheckCircle2, X, Check, Eye, EyeOff, Shield, AlertCircle, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Check if user has a valid session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setValidSession(!!session);
      } catch (err) {
        console.error("Session check error:", err);
        setValidSession(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    // Check password criteria
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const getPasswordStrength = () => {
    const criteriaCount = Object.values(passwordCriteria).filter(Boolean).length;
    if (criteriaCount <= 2) return { label: "Weak", color: "text-red-500", bg: "bg-red-500" };
    if (criteriaCount <= 3) return { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500" };
    if (criteriaCount <= 4) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500" };
    return { label: "Strong", color: "text-green-500", bg: "bg-green-500" };
  };

  const strength = getPasswordStrength();
  const strengthPercentage = (Object.values(passwordCriteria).filter(Boolean).length / 5) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      toast.error("Please meet all password requirements");
      return;
    }

    setLoading(true);
    
    try {
      // First, verify the current password by signing in
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        console.error("Current password verification error:", signInError);
        toast.error("Current password is incorrect");
        setLoading(false);
        return;
      }

      // If current password is correct, update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        toast.error(updateError.message || "Failed to update password. Please try again.");
        setLoading(false);
      } else {
        toast.success("Password updated successfully!");
        setUpdateComplete(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  // Loading state
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800 border border-slate-700 p-10 rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-9 h-9 text-slate-100" />
              </div>
            </div>
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto text-indigo-400 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Verifying Session</h2>
              <p className="text-slate-400">Please wait while we verify your session...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Invalid session state
  if (!validSession) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800 border border-slate-700 p-10 rounded-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center">
                  <X className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Invalid Session</h2>
                <p className="text-slate-400">You must be signed in to update your password.</p>
              </div>
              <Button
                onClick={handleSignIn}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all"
              >
                Sign In
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (updateComplete) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800 border border-slate-700 p-10 rounded-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-600/20 border-2 border-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Password Updated!</h2>
                <p className="text-slate-400">Your password has been successfully updated. Your account is now more secure.</p>
              </div>
              
              <div className="bg-slate-750 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>Your account security has been enhanced</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>You'll remain signed in on this device</p>
                </div>
              </div>

              <Button
                onClick={handleBackToDashboard}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all"
              >
                Continue to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Update form
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          
          {/* Back to Dashboard Button */}
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <Card className="bg-slate-800 border border-slate-700 p-8 lg:p-10 rounded-2xl">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-9 h-9 text-slate-100" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Update Password</h1>
              <p className="text-slate-400">Enhance your account security with a new password</p>
            </div>

            {/* Security Notice */}
            <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-medium mb-1">Security Tip</p>
                <p className="text-slate-400">Use a strong, unique password that you don't use on other websites.</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Current Password Field */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-slate-300 font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pl-11 pr-11 h-12 bg-slate-750 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-slate-800 text-slate-500 font-medium uppercase tracking-wide">
                    New Password
                  </span>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 pr-11 h-12 bg-slate-750 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${strength.bg} transition-all duration-300`}
                      style={{ width: `${strengthPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-slate-750 border border-slate-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 font-medium">Password must contain:</span>
                </div>
                <div className="space-y-2 ml-6">
                  <div className={`flex items-center gap-2 text-sm transition-colors ${passwordCriteria.length ? 'text-green-500' : 'text-slate-500'}`}>
                    {passwordCriteria.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${passwordCriteria.uppercase ? 'text-green-500' : 'text-slate-500'}`}>
                    {passwordCriteria.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${passwordCriteria.lowercase ? 'text-green-500' : 'text-slate-500'}`}>
                    {passwordCriteria.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${passwordCriteria.number ? 'text-green-500' : 'text-slate-500'}`}>
                    {passwordCriteria.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${passwordCriteria.special ? 'text-green-500' : 'text-slate-500'}`}>
                    {passwordCriteria.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>One special character</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-11 pr-11 h-12 bg-slate-750 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-100 font-semibold rounded-xl transition-all mt-6"
                disabled={loading || !currentPassword || !Object.values(passwordCriteria).every(Boolean) || password !== confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-slate-500 text-center mt-6">
              After updating, you'll remain signed in on this device
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;