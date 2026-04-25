"use client";

import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Upload,
  X,
  XCircle,
  FileUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CandidateDrawer } from "@/components/drawer/candidate-drawer";
import {
  useGetApplicantsQuery,
  useGetJobsQuery,
  useUploadApplicantsMutation,
} from "@/store/api/jobs-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import { getScoreColor, getScoreBg } from "@/lib/score-color";

type ExperienceFilter = "all" | "0-2" | "3-5" | "5+";
type ScoreFilter = "any" | "90+" | "70-90" | "below-70";

export function ApplicantsShell({ initialJobId = "" }: { initialJobId?: string }) {
  const router = useRouter();
  const { data: jobsData } = useGetJobsQuery();
  const jobs = jobsData?.items ?? [];
  const [manualJobId, setManualJobId] = useState("");
  const selectedJobId = manualJobId || initialJobId || jobs[0]?.id || "";
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetApplicantsQuery(selectedJobId, {
    skip: !selectedJobId,
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [uploadApplicants, { isLoading: isUploading }] = useUploadApplicantsMutation();

  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("any");
  const [drawerCandidateId, setDrawerCandidateId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [lastUploadPreview, setLastUploadPreview] = useState<
    Array<{
      id: string;
      fullName: string;
      email?: string;
      yearsExperience: number;
      skills: string[];
    }>
  >([]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      return;
    }

    if (!selectedJobId) {
      toast.error("Select a job before uploading resumes");
      return;
    }

    setSelectedFiles(acceptedFiles);

    try {
      const result = await uploadApplicants({
        jobId: selectedJobId,
        files: acceptedFiles,
      }).unwrap();
      setLastUploadPreview(result.preview ?? []);
      toast.success("Resumes uploaded successfully");
      void refetch();
    } catch (error) {
      setLastUploadPreview([]);
      const message =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : undefined;
      toast.error(message || "Upload failed");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    disabled: !selectedJobId || isUploading,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const visibleApplicants = useMemo(() => {
    const items = [...(data?.items ?? [])];
    
    return items.filter((applicant) => {
      if (search && !applicant.fullName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (experienceFilter !== "all") {
        const exp = applicant.yearsExperience || 0;
        if (experienceFilter === "0-2" && exp > 2) return false;
        if (experienceFilter === "3-5" && (exp < 3 || exp > 5)) return false;
        if (experienceFilter === "5+" && exp < 5) return false;
      }
      if (scoreFilter !== "any") {
        const score = applicant.score || 0;
        if (scoreFilter === "90+" && score < 90) return false;
        if (scoreFilter === "70-90" && (score < 70 || score >= 90)) return false;
        if (scoreFilter === "below-70" && score >= 70) return false;
      }
      return true;
    });
  }, [data?.items, search, experienceFilter, scoreFilter]);

  const getStatusBadge = (status: string) => {
    const normalized = status.trim().toLowerCase();
    const badgeConfig: Record<string, { bg: string; text: string; label: string }> = {
      shortlisted: { bg: "bg-imboni-primary-lt", text: "text-imboni-primary", label: "Shortlisted" },
      review: { bg: "bg-amber-100", text: "text-amber-700", label: "In Review" },
      pending: { bg: "bg-gray-100", text: "text-gray-600", label: "Pending" },
      rejected: { bg: "bg-red-100", text: "text-red-600", label: "Rejected" },
      screened: { bg: "bg-imboni-primary-lt", text: "text-imboni-primary", label: "Screened" },
      interviewing: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Interviewing" },
      new: { bg: "bg-gray-100", text: "text-gray-600", label: "New" },
    };
    const config = badgeConfig[normalized] || badgeConfig.new;
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 min-h-screen bg-white px-8 py-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <select
            value={selectedJobId}
            onChange={(e) => setManualJobId(e.target.value)}
            className="mt-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#312E81]/20 focus:border-[#312E81]"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 hover:border-[#312E81] text-gray-700 hover:text-[#312E81] rounded-lg text-sm font-medium transition-colors">
            Export Pool
          </button>
          <button
            onClick={() => router.push(`/screening?jobId=${selectedJobId}`)}
            className="px-4 py-2 bg-[#312E81] hover:bg-[#4338CA] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Run AI Screening
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all bg-[#0B1220] ${
          !selectedJobId || isUploading ? "cursor-not-allowed opacity-80" : "cursor-pointer"
        } ${
          isDragActive
            ? "border-[#10B981] bg-[#0B1220]/80"
            : "border-gray-600 hover:border-[#10B981]"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-3">
          <FileUp size={28} className="text-white" />
        </div>
        <p className="font-bold text-white text-lg mt-3">Bulk Resume Upload</p>
        <p className="text-sm text-gray-400 mt-1">
          Drag and drop CSV, PDF, or DOCX files here to start AI analysis
        </p>
        {!selectedJobId ? (
          <p className="text-sm text-amber-300 mt-2">
            Select a job first to enable resume upload.
          </p>
        ) : null}
        <div className="inline-flex items-center gap-2 border border-[#10B981] text-[#10B981] text-xs rounded-full px-3 py-1 mt-3">
          <span>Supports up to 500 resumes per batch</span>
        </div>

        {selectedFiles.length > 0 ? (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">
                Selected files ({selectedFiles.length})
              </p>
              {isUploading ? (
                <span className="text-xs font-medium text-[#10B981]">Uploading...</span>
              ) : null}
            </div>
            <div className="mt-3 space-y-2">
              {selectedFiles.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-100">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {lastUploadPreview.length > 0 ? (
          <div className="mt-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-left">
            <p className="text-sm font-semibold text-emerald-300">
              Uploaded applicant preview
            </p>
            <div className="mt-3 space-y-2">
              {lastUploadPreview.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-emerald-900/30 bg-slate-950/50 px-3 py-2"
                >
                  <p className="text-sm text-white">{item.fullName || "Unnamed applicant"}</p>
                  <p className="text-xs text-slate-400">
                    {item.email || "No email"} • {item.yearsExperience} yrs exp
                  </p>
                </div>
              ))}
              {lastUploadPreview.length > 5 ? (
                <p className="text-xs text-slate-400">
                  +{lastUploadPreview.length - 5} more applicants processed
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, skill, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#312E81]/20 focus:border-[#312E81] transition-all"
          />
        </div>

        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value as ExperienceFilter)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm w-36 text-gray-700"
        >
          <option value="all">Any Exp.</option>
          <option value="0-2">0-2 yrs</option>
          <option value="3-5">3-5 yrs</option>
          <option value="5+">5+ yrs</option>
        </select>

        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value as ScoreFilter)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm w-44 text-gray-700"
        >
          <option value="any">Top (80%+)</option>
          <option value="90+">90+</option>
          <option value="70-90">70-90</option>
          <option value="below-70">Below 70</option>
        </select>

        <button className="px-3 py-2 border border-gray-200 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingState key={i} lines={1} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load applicants"
          description="We encountered an error. Try again."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : !selectedJobId ? (
        <EmptyState title="Select a job to view applicants" description="Choose a job to view its applicants" />
      ) : visibleApplicants.length === 0 && !data?.items?.length ? (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Upload size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600 font-medium">No applicants yet</p>
          <p className="text-sm text-gray-500">Upload resumes to get started</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Exp.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    onClick={() => setDrawerCandidateId(applicant.id)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#312E81]">
                          {applicant.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{applicant.fullName}</p>
                          <p className="text-xs text-gray-400">
                            📍 {applicant.location || "Location TBD"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {applicant.currentRole || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(applicant.skills || []).slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {(applicant.skills || []).length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{applicant.skills!.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {applicant.yearsExperience} yrs
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-bold text-sm"
                        style={{ color: getScoreColor(applicant.score || 0) }}
                      >
                        {applicant.score ? `${applicant.score}%` : "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(applicant.status || "new")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawerCandidateId(applicant.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Eye size={15} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition">
                          <XCircle size={15} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition">
                          <MoreHorizontal size={15} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500">
              Showing 1-{Math.min(5, visibleApplicants.length)} of {visibleApplicants.length}{" "}
              candidates
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-[#312E81] text-white rounded-lg text-sm font-semibold">1</button>
              <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Drawer */}
      <CandidateDrawer
        candidateId={drawerCandidateId}
        open={!!drawerCandidateId}
        onClose={() => setDrawerCandidateId(null)}
      />
    </div>
  );
}
