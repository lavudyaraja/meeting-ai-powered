import { UserPlus, Mail, Trash2, Shield, Users, Building2, Crown, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const TeamSettings = () => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", avatar: "JD", status: "active", lastActive: "2 hours ago", permissions: ["full_access"] },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager", avatar: "JS", status: "active", lastActive: "5 minutes ago", permissions: ["manage_team", "view_analytics"] },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Member", avatar: "BJ", status: "away", lastActive: "1 day ago", permissions: ["view_meetings"] },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Member", avatar: "AW", status: "active", lastActive: "30 minutes ago", permissions: ["view_meetings"] },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "Member", avatar: "CB", status: "inactive", lastActive: "3 days ago", permissions: ["view_meetings"] },
  ]);
  
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, email: "sarah@example.com", role: "Member", sentDate: "2 days ago" },
    { id: 2, email: "mike@example.com", role: "Manager", sentDate: "5 hours ago" },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [orgName, setOrgName] = useState("Acme Corporation");
  const [department, setDepartment] = useState("Engineering, Sales, Marketing, HR");
  const [teamSize, setTeamSize] = useState("10-50");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");

  const [teamStats] = useState({
    totalMembers: 5,
    activeNow: 2,
    pendingInvites: 2,
    admins: 1,
    managers: 1
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl font-semibold text-white z-50 animate-slideIn ${
      type === 'success' 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
        : 'bg-gradient-to-r from-rose-500 to-red-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const inviteMember = () => {
    if (!inviteEmail) {
      showToast("Please enter an email address", "error");
      return;
    }
    setPendingInvites(prev => [...prev, {
      id: prev.length + 1,
      email: inviteEmail,
      role: inviteRole,
      sentDate: "Just now"
    }]);
    showToast(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  const removeMember = (memberId: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    showToast("Team member removed");
  };

  const cancelInvite = (inviteId: number) => {
    setPendingInvites(prev => prev.filter(invite => invite.id !== inviteId));
    showToast("Invitation cancelled");
  };

  const saveTeamSettings = () => {
    showToast("Team settings saved successfully");
  };

  const getRoleIcon = (role: string) => {
    if (role === "Admin") return <Crown className="w-5 h-5 text-amber-400" />;
    if (role === "Manager") return <Shield className="w-5 h-5 text-blue-400" />;
    return <Users className="w-5 h-5 text-slate-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-emerald-500";
    if (status === "away") return "bg-amber-500";
    return "bg-slate-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="">
        <div className="max-w-6xl mx-auto p-8">
          <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Team Settings
              </h1>
              <p className="text-cyan-300 text-xl font-semibold">Manage your team members and organization</p>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: "Total Members", value: teamStats.totalMembers, icon: Users, color: "from-cyan-400 to-blue-500" },
                { label: "Active Now", value: teamStats.activeNow, icon: CheckCircle, color: "from-emerald-400 to-teal-500" },
                { label: "Pending Invites", value: teamStats.pendingInvites, icon: Mail, color: "from-orange-400 to-red-500" },
                { label: "Admins", value: teamStats.admins, icon: Crown, color: "from-amber-400 to-orange-500" },
                { label: "Managers", value: teamStats.managers, icon: Shield, color: "from-violet-400 to-purple-500" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-5 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-semibold">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Team Members */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-8 hover:border-cyan-300/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    Team Members
                  </h2>
                  <p className="text-cyan-300 text-lg font-semibold">{teamMembers.length} active members</p>
                </div>
                <button className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-400/50">
                  <UserPlus className="w-6 h-6" />
                  Invite Member
                </button>
              </div>
              
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl hover:border-cyan-400/60 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black text-xl">
                          {member.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-slate-800`}></div>
                      </div>
                      <div>
                        <p className="text-slate-100 font-bold text-xl mb-1">{member.name}</p>
                        <p className="text-slate-400 text-base font-medium mb-2">{member.email}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>Last active {member.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border-2 border-slate-600 rounded-xl">
                        {getRoleIcon(member.role)}
                        <span className="text-slate-200 font-bold">{member.role}</span>
                      </div>
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="w-12 h-12 bg-slate-700/50 border-2 border-slate-600 hover:border-rose-400/60 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invites */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-orange-400/40 rounded-3xl p-8 hover:border-orange-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-8">
                Pending Invites
              </h2>
              
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl hover:border-orange-400/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-400/30 border-2 border-orange-400/50 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-slate-100 font-bold text-lg mb-1">{invite.email}</p>
                        <p className="text-slate-400 text-sm font-medium">Sent {invite.sentDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-2 bg-orange-500/20 text-orange-300 border-2 border-orange-400/60 rounded-xl font-bold">
                        {invite.role}
                      </span>
                      <button 
                        onClick={() => cancelInvite(invite.id)}
                        className="w-12 h-12 bg-slate-700/50 border-2 border-slate-600 hover:border-rose-400/60 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <XCircle className="w-5 h-5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Team Members */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl p-8 hover:border-emerald-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
                Invite Team Members
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Email Address
                  </label>
                  <div className="flex gap-3 items-center">
                    <Mail className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="flex-1 px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-medium text-lg focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-semibold text-lg focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <button 
                  onClick={inviteMember}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xl py-5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-emerald-400/50"
                >
                  <Mail className="w-6 h-6" />
                  Send Invitation
                </button>
              </div>
            </div>

            {/* Organization Settings */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-violet-400/40 rounded-3xl p-8 hover:border-violet-300/70 transition-all duration-300">
              <h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-8">
                Organization Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Organization Name
                  </label>
                  <div className="flex gap-3 items-center">
                    <Building2 className="w-6 h-6 text-violet-400 flex-shrink-0" />
                    <input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="flex-1 px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-medium text-lg focus:outline-none focus:border-violet-400/60 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Department Structure
                  </label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering, Sales, Marketing..."
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-medium text-lg focus:outline-none focus:border-violet-400/60 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-semibold text-lg focus:outline-none focus:border-violet-400/60 transition-all duration-300"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="10-50">10-50 employees</option>
                    <option value="50-200">50-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-200 font-bold text-xl block mb-4">
                    Default Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-slate-200 font-semibold text-lg focus:outline-none focus:border-violet-400/60 transition-all duration-300"
                  >
                    <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                    <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                    <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                    <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                    <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveTeamSettings}
              className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-2xl py-6 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-cyan-400/50"
            >
              <Star className="w-7 h-7" />
              Save Team Settings
            </button>
          </div>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }

          .overflow-y-auto::-webkit-scrollbar {
            width: 8px;
          }

          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 10px;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, rgb(34, 211, 238), rgb(59, 130, 246));
            border-radius: 10px;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, rgb(6, 182, 212), rgb(37, 99, 235));
          }
        `}</style>
      </div>
    </div>
  );
};

export default TeamSettings;