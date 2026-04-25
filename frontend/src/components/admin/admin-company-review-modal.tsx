import React, { useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Users,
  Globe,
  Clock,
} from "lucide-react";
import type { CompanyApplication, AdminAction } from "@/lib/admin-types";

interface AdminCompanyReviewModalProps {
  company: CompanyApplication;
  onClose: () => void;
  onApprove?: (companyId: string, notes?: string) => void;
  onReject?: (companyId: string, reason: string) => void;
  onRequestChanges?: (companyId: string, feedback: string) => void;
}

export default function AdminCompanyReviewModal({
  company,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}: AdminCompanyReviewModalProps) {
  const [action, setAction] = useState<AdminAction | null>(null);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onApprove?.(company.id, notes);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onReject?.(company.id, notes);
    setIsProcessing(false);
  };

  const handleRequestChanges = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onRequestChanges?.(company.id, notes);
    setIsProcessing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysPending = Math.floor(
    (new Date(2026, 3, 10).getTime() - company.applicantDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-b border-slate-700 p-6 flex items-start justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{company.companyName}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Applied {daysPending} day{daysPending !== 1 ? "s" : ""} ago
              </span>
              <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-xs font-semibold">
                {company.status.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm mb-1">Contact Person</p>
                  <p className="text-white font-semibold">{company.contactPerson}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm mb-1">Company Email</p>
                  <p className="text-white font-semibold">{company.companyEmail}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm mb-1">Contact Phone</p>
                  <p className="text-white font-semibold">{company.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm mb-1">Industry</p>
                  <p className="text-white font-semibold">{company.industry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Company Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Registration Number</p>
                  <p className="text-white font-mono font-semibold">{company.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tax ID</p>
                  <p className="text-white font-mono font-semibold">{company.taxId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Company Size</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <p className="text-white font-semibold">{company.companySize} employees</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Website</p>
                  {company.website ? (
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      {company.website}
                    </a>
                  ) : (
                    <p className="text-slate-500">Not provided</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-2">Company Description</p>
                <p className="text-slate-300 leading-relaxed">{company.description}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Submitted Documents</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 flex-1">{company.documents.businessLicense}</span>
                <span className="text-xs text-emerald-400 font-semibold">✓ Verified</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 flex-1">{company.documents.taxCertificate}</span>
                <span className="text-xs text-emerald-400 font-semibold">✓ Verified</span>
              </div>
            </div>
          </div>

          {/* Admin Notes/Action */}
          <div>
            <label className="block text-white font-semibold mb-2">
              {action === "reject" ? "Rejection Reason *" : "Admin Notes"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                action === "reject"
                  ? "Please explain why this application is being rejected..."
                  : "Add any notes or feedback about this company (optional)..."
              }
              rows={4}
              className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-slate-400 text-sm mt-2">
              {action === "reject" ? "This will be sent to the company" : "Internal notes only"}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-semibold text-sm mb-1">Review Checklist</p>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>✓ Company documents verified</li>
                <li>✓ Registration number valid</li>
                <li>✓ Tax ID matches government records</li>
                <li>✓ No compliance issues found</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900/50 border-t border-slate-700 p-6 sticky bottom-0 space-y-3">
          {!action ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setAction("approve")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Company
              </button>

              <button
                onClick={() => setAction("request_changes")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Request Changes
              </button>

              <button
                onClick={() => setAction("reject")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Reject Application
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-semibold">
                {action === "approve"
                  ? "Approve this company?"
                  : action === "reject"
                    ? "Reject this application?"
                    : "Request changes?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAction(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    action === "approve"
                      ? handleApprove
                      : action === "reject"
                        ? handleReject
                        : handleRequestChanges
                  }
                  disabled={isProcessing || (action === "reject" && !notes.trim())}
                  className={`flex-1 font-semibold py-2 rounded-lg transition-colors ${
                    action === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                      : action === "reject"
                        ? "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
