import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";

interface EndCallButtonProps {
  handleEndCall: () => void;
}

export const EndCallButton: React.FC<EndCallButtonProps> = ({
  handleEndCall
}) => {
  return (
    <Button
      variant="destructive"
      onClick={handleEndCall}
      className="gap-2 h-12 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-500 transition-all shadow-lg font-medium"
    >
      <PhoneOff className="w-5 h-5" />
      <span className="hidden xs:inline">End</span>
    </Button>
  );
};