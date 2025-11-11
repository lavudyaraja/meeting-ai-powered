import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ParticipantBioProps {
  participantId: string;
  fallbackName?: string;
}

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
}

const ParticipantBio: React.FC<ParticipantBioProps> = ({ participantId, fallbackName }) => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>(fallbackName || "");

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .eq("id", participantId)
          .maybeSingle<ProfileRow>();

        if (!isMounted) return;
        if (!error && data) {
          setEmail(data.email);
          setFullName(data.full_name || fallbackName || data.email);
        }
      } catch {
        // Ignore; keep fallback values
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [participantId, fallbackName]);

  return (
    <div className="flex flex-col">
      {fullName && (
        <p className="font-semibold text-sm text-purple-900 dark:text-purple-100 truncate">{fullName}</p>
      )}
      {email && (
        <p className="text-xs text-purple-700 dark:text-purple-300 truncate">{email}</p>
      )}
    </div>
  );
};

export default ParticipantBio;


