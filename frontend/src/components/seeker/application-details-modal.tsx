import React from "react";
import { X, MapPin, DollarSign, Briefcase, Calendar, User, ArrowRight } from "lucide-react";
import type { Application } from "@/lib/application-tracker-types";

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, onClose }: ApplicationDetailsModalProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysInProcess = application.daysInProcess;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{application.jobTitle}</h2>
            <p className="text-slate-400">{application.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <p className="text-white font-medium">{application.location}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Job Type</p>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <p className="text-white font-medium">{application.jobType}</p>
              </div>
            </div>

            {application.salary && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Salary Range</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <p className="text-white font-medium">
                    {(application.salary.min / 1000000).toFixed(1)}M - {(application.salary.max / 1000000).toFixed(1)}M RWF
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">In Process</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <p className="text-white font-medium">{daysInProcess} days</p>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          {application.contactPerson && (
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-purple-300 font-semibold">{application.contactPerson.name}</p>
                  <p className="text-purple-200/70">{application.contactPerson.role}</p>
                  <p className="text-xs text-purple-200/50 mt-1">Hiring manager – feel free to connect on LinkedIn</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Application Timeline</h3>

            <div className="space-y-4">
              {application.timeline.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {step.icon}
                    </div>
                    {index < application.timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-gradient-to-b from-purple-500/50 to-purple-500/0 mt-2" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="pb-4 pt-1 flex-1">
                    <p className="text-white font-semibold">{step.message}</p>
                    <p className="text-slate-400 text-sm mt-1">{formatDate(step.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Action */}
          {application.nextAction && (
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-300 font-semibold">Next Action Required</p>
                  <p className="text-blue-200/90 mt-1">{application.nextAction.text}</p>
                  <p className="text-blue-200/70 text-sm mt-2">
                    Due: {new Date(application.nextAction.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Rate Info */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Success Probability</p>
                <p className="text-white font-bold text-lg">{application.successRate}%</p>
              </div>
              <div className="w-20 h-20 rounded-full relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${282.6 * (application.successRate / 100)} 282.6`}
                    className="text-purple-500"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-3">
              Based on your profile strength, experience match, and current stage in the hiring process.
            </p>
          </div>

          {/* PRo Tips */}
          {application.currentStage.includes("Under Review") && (
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <span className="font-semibold">💡 Tip:</span> Most companies respond within 3-5 business days. If you
                haven't heard back after a week, feel free to send a polite follow-up email.
              </p>
            </div>
          )}

          {application.status === "rejected" && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <p className="text-red-200 text-sm">
                <span className="font-semibold">💡 Next Step:</span> Don't get discouraged! Learn from this experience,
                refine your resume, and apply to similar positions. Your next opportunity might be just around the
                corner.
              </p>
            </div>
          )}

          {application.status === "accepted" && (
            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4">
              <p className="text-emerald-200 text-sm">
                <span className="font-semibold">🎉 Congratulations!</span> You've received an offer. Take time to review
                the terms, negotiate if needed, and make your decision. Best of luck in your new role!
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="bg-slate-900/50 border-t border-slate-700 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/25"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
