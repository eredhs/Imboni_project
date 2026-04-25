import React, { useEffect, useState } from "react";
import { 
  CheckCircle, X, Calendar, Clock, Phone, Laptop, 
  Briefcase, User, Trophy, Users, Sparkles 
} from "lucide-react";
import type { InterviewInvitation } from "@/lib/interview-invitation-types";

interface InterviewNotificationToastProps {
  invitation: InterviewInvitation;
  onDismiss: () => void;
  onViewDetails: () => void;
  autoCloseDuration?: number;
}

export default function InterviewNotificationToast({
  invitation,
  onDismiss,
  onViewDetails,
  autoCloseDuration = 8000,
}: InterviewNotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onDismiss]);

  if (!isVisible) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInterviewTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      phone_screen: <Phone size={24} className="text-white" />,
      technical: <Laptop size={24} className="text-white" />,
      hr: <Briefcase size={24} className="text-white" />,
      manager_round: <User size={24} className="text-white" />,
      final_round: <Trophy size={24} className="text-white" />,
      group_discussion: <Users size={24} className="text-white" />,
    };
    return icons[type] || <Sparkles size={24} className="text-white" />;
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-500">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-2xl shadow-emerald-500/20 overflow-hidden max-w-md border border-emerald-500/30">
        {/* Progress Bar */}
        <div className="h-1 bg-emerald-600/50">
          <div
            className="h-full bg-white/60 animate-pulse"
            style={{
              animation: `shrink ${autoCloseDuration}ms linear forwards`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              {getInterviewTypeIcon(invitation.interviewType)}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                <h3 className="text-white font-bold truncate">Interview Invitation!</h3>
              </div>
              <p className="text-emerald-50/90 text-sm mb-1 truncate">
                {invitation.companyName} • {invitation.jobTitle}
              </p>
              <div className="flex items-center gap-2 text-emerald-100 text-xs mb-3">
                <Calendar size={12} />
                <span>{formatDate(invitation.scheduledDate)}</span>
                <span>•</span>
                <Clock size={12} />
                <span>{invitation.scheduledTime}</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onViewDetails}
                  className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={onDismiss}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
