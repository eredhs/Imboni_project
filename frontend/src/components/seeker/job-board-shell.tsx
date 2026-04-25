"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { JobFilterPanel } from "@/components/seeker/job-filter-panel";
import { JobApplicationModal } from "@/components/seeker/job-application-modal";
import { JobResults } from "@/components/seeker/job-results";
import type { FilterState } from "@/lib/job-board-types";
import { useApplyToJobMutation } from "@/store/api/applications-api";
import { useGetSeekerJobsQuery } from "@/store/api/jobs-api";

export function JobBoardShell() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { data: jobsData, isLoading } = useGetSeekerJobsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const allJobs = (jobsData?.items ?? []) as Array<Record<string, any>>;
  const requestedJobId = searchParams.get("jobId") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    locations: new Set(),
    industries: new Set(),
    experienceLevels: new Set(),
    employmentTypes: new Set(),
    searchQuery: "",
    sortBy: "most-recent",
  });
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [selectedJobId, setSelectedJobId] = useState(requestedJobId);
  const [jobToApply, setJobToApply] = useState<Record<string, any> | null>(null);

  const savedProfile = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawProfile = window.localStorage.getItem("talentlens_job_seeker_profile");
    if (!rawProfile) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawProfile) as {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        location?: string;
        headline?: string;
        bio?: string;
        linkedinProfile?: string;
        portfolio?: string;
      };

      return {
        fullName: `${parsed.firstName ?? ""} ${parsed.lastName ?? ""}`.trim(),
        email: parsed.email ?? "",
        phone: parsed.phone ?? "",
        location: parsed.location ?? "",
        currentRole: parsed.headline ?? "",
        professionalSummary: parsed.bio ?? "",
        linkedinUrl: parsed.linkedinProfile ?? "",
        portfolioUrl: parsed.portfolio ?? "",
      };
    } catch {
      return null;
    }
  }, [user?.email, user?.id, user?.name]);

  const filteredJobs = useMemo(() => {
    let result = [...allJobs];

    if (filters.locations.size > 0) {
      result = result.filter((job) => filters.locations.has(job.location));
    }

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          String(job.title ?? "").toLowerCase().includes(query) ||
          String(job.department ?? "").toLowerCase().includes(query) ||
          String(job.location ?? "").toLowerCase().includes(query) ||
          (job.requiredSkills ?? []).some((skill: string) => skill.toLowerCase().includes(query)),
      );
    }

    if (filters.experienceLevels.size > 0) {
      result = result.filter((job) => filters.experienceLevels.has(job.seniority));
    }

    if (filters.employmentTypes.size > 0) {
      result = result.filter((job) => filters.employmentTypes.has(job.type));
    }

    switch (filters.sortBy) {
      case "closing-soon":
        result.sort(
          (left, right) =>
            new Date(left.applicationDeadline).getTime() - new Date(right.applicationDeadline).getTime(),
        );
        break;
      default:
        result.sort(
          (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [allJobs, filters]);

  useEffect(() => {
    if (requestedJobId) {
      setSelectedJobId(requestedJobId);
      return;
    }

    if (!selectedJobId && filteredJobs[0]?.id) {
      setSelectedJobId(filteredJobs[0].id as string);
    }
  }, [filteredJobs, requestedJobId, selectedJobId]);

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) ??
    allJobs.find((job) => job.id === selectedJobId) ??
    filteredJobs[0] ??
    null;

  const handleBookmark = (jobId: string) => {
    const next = new Set(bookmarkedJobs);
    if (next.has(jobId)) {
      next.delete(jobId);
    } else {
      next.add(jobId);
    }
    setBookmarkedJobs(next);
  };

  const handleApply = async (jobId: string) => {
    if (!user?.id) {
      toast.error("Sign in again before applying.");
      return;
    }

    const selectedJob = allJobs.find((job) => job.id === jobId);
    if (!selectedJob?.hrId) {
      toast.error("This job is not ready for applications yet.");
      return;
    }

    setJobToApply(selectedJob);
  };

  const submitApplication = async (values: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    currentRole: string;
    yearsOfExperience: string;
    linkedinUrl: string;
    portfolioUrl: string;
    expectedSalary: string;
    availableFrom: string;
    workAuthorization: string;
    professionalSummary: string;
    coverLetter: string;
    cv: File | null;
  }) => {
    if (!user?.id || !jobToApply?.id || !jobToApply?.hrId) {
      toast.error("The application could not be prepared.");
      return;
    }

    try {
      await applyToJob({
        jobId: jobToApply.id,
        userId: user.id,
        hrId: jobToApply.hrId,
        ...values,
      }).unwrap();
      toast.success(`Application sent for ${jobToApply.title}.`);
      setSelectedJobId(jobToApply.id);
      setJobToApply(null);
    } catch (error: any) {
      toast.error(error?.data?.error ?? "Could not submit your application.");
    }
  };

  const displayJobs = filteredJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.department || "Hiring Team",
    location: job.location,
    type: job.type,
    level: job.seniority,
    description: job.description,
    skills: job.requiredSkills || [],
    postedAt: new Date(job.createdAt).toLocaleDateString(),
    deadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No deadline",
    applicationStatus: job.applicationStatus,
  }));

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 bg-slate-950 p-6">
      <div className="w-full flex-shrink-0 md:w-80">
        <JobFilterPanel filters={filters} onFilterChange={setFilters} jobCount={filteredJobs.length} />
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto lg:max-w-[44%]">
        <JobResults
          jobs={displayJobs}
          isLoading={isLoading || isApplying}
          bookmarkedJobs={bookmarkedJobs}
          selectedJobId={selectedJob?.id}
          onBookmark={handleBookmark}
          onSelect={setSelectedJobId}
          onApply={handleApply}
        />
      </div>

      <aside className="hidden min-w-0 flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/80 p-6 lg:block">
        {selectedJob ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  {selectedJob.department || "Hiring Team"}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">{selectedJob.title}</h2>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-emerald-400" />
                    {selectedJob.type}
                  </span>
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-emerald-400" />
                    Closes {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={selectedJob.applicationStatus === "applied" || isApplying}
                className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
              >
                {selectedJob.applicationStatus === "applied" ? "Already applied" : isApplying ? "Applying..." : "Apply now"}
              </button>
            </div>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Overview</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                {selectedJob.description}
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Required skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(selectedJob.requiredSkills ?? []).length > 0 ? (
                    selectedJob.requiredSkills.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No required skills listed yet.</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Preferred skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(selectedJob.preferredSkills ?? []).length > 0 ? (
                    selectedJob.preferredSkills.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No extra preferences listed.</span>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experience</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedJob.minExperienceYears ?? 0}+ years
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Education</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedJob.educationLevel || "Not specified"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Applicants</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedJob.applicantCount ?? 0}
                </p>
              </div>
            </section>

            <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <p className="font-semibold text-emerald-200">This role is live for job seekers</p>
                  <p className="mt-1 text-sm text-emerald-100/80">
                    Once you apply, the recruiter can review your application from the applicants workspace for this job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="font-semibold text-white">No job selected</p>
            <p className="mt-2 text-sm text-slate-400">
              Pick a job from the list to see the full description and apply.
            </p>
          </div>
        )}
      </aside>

      <JobApplicationModal
        open={Boolean(jobToApply)}
        jobTitle={jobToApply?.title ?? "Job"}
        isSubmitting={isApplying}
        onClose={() => setJobToApply(null)}
        onSubmit={submitApplication}
        initialValues={{
          fullName: savedProfile?.fullName || user?.name || "",
          email: savedProfile?.email || user?.email || "",
          phone: savedProfile?.phone || "",
          location: savedProfile?.location || "",
          currentRole: savedProfile?.currentRole || "",
          yearsOfExperience: "",
          linkedinUrl: savedProfile?.linkedinUrl || "",
          portfolioUrl: savedProfile?.portfolioUrl || "",
          expectedSalary: "",
          availableFrom: "",
          workAuthorization: "",
          professionalSummary: savedProfile?.professionalSummary || "",
          coverLetter: "",
        }}
      />
    </div>
  );
}
