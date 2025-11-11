import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Mail } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  avatarUrl: string;
  location: string;
  joinDate: string;
}

const ProfileHeader = ({ fullName, email, avatarUrl, location, joinDate }: ProfileHeaderProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 border-4 border-cyan-400/50">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
            {getUserInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">{fullName || "User"}</h1>
          <p className="text-cyan-300 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" />
            {email}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-300">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Joined {formatDate(joinDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;