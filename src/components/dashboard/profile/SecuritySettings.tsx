import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Key, Shield } from "lucide-react";

const SecuritySettings = () => {
  const { toast } = useToast();

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "2FA setup would be implemented here",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-cyan-400" />
          Password
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              className="glass-effect"
            />
          </div>
          
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              className="glass-effect"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="glass-effect"
            />
          </div>
          
          <Button onClick={handleChangePassword} className="mt-4">
            Change Password
          </Button>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          Two-Factor Authentication
        </h2>
        
        <div className="space-y-4">
          <p className="text-slate-300">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">Authenticator App</h3>
              <p className="text-sm text-slate-400">Use an authenticator app to generate codes</p>
            </div>
            <Button onClick={handleEnable2FA} variant="outline">
              Enable
            </Button>
          </div>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Key className="w-6 h-6 text-cyan-400" />
          Active Sessions
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Current Session</h3>
                <p className="text-sm text-slate-400">This device - Active now</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Current</span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Chrome on Windows</h3>
                <p className="text-sm text-slate-400">Last active: 2 hours ago</p>
              </div>
              <Button variant="destructive" size="sm">Revoke</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettings;