"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ArrowLeft, Briefcase, ChevronRight, Shield, Users } from "lucide-react";
import RecruiterLoginForm from "./recruiter-login-form";
import RecruiterSignupForm from "./recruiter-signup-form";
import CandidateLoginForm from "./candidate-login-form";
import CandidateSignupForm from "./candidate-signup-form";
import Logo from "@/components/Logo";

type Role = "recruiter" | "candidate" | "system_controller" | null;
type AuthMode =
  | "selection"
  | "recruiter_login"
  | "recruiter_signup"
  | "candidate_login"
  | "candidate_signup";

export default function AuthLandingShellV2() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("selection");

  const handleRoleSelect = (role: Role, flow: "login" | "signup") => {
    if (role === "recruiter") {
      setMode(flow === "login" ? "recruiter_login" : "recruiter_signup");
    } else if (role === "candidate") {
      setMode(flow === "login" ? "candidate_login" : "candidate_signup");
    } else if (role === "system_controller") {
      // Navigate to dedicated admin login page
      router.push("/auth/admin/login");
    }
  };

  const handleBack = () => {
    setMode("selection");
  };

  if (mode === "selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span>Back to Landing Page</span>
          </Link>

          <div className="mb-8 flex justify-center">
            <Logo size="lg" theme="dark" showTagline />
          </div>

          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Welcome to TalentLens
            </h1>
            <p className="mt-3 text-lg text-slate-400">
              Find your perfect match in Rwanda&apos;s talent ecosystem
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={<Briefcase className="text-purple-400" size={32} />}
              title="Recruiter / HR"
              description="Post jobs and manage hiring with AI"
              primaryLabel="Login"
              secondaryLabel="Create Account"
              primaryClassName="bg-purple-600 text-white hover:bg-purple-700"
              secondaryClassName="border border-purple-600/50 text-purple-300 hover:bg-purple-600/10"
              accentClassName="border-purple-700/30 from-purple-950/50 hover:border-purple-600/60 hover:shadow-purple-500/10"
              onPrimaryClick={() => handleRoleSelect("recruiter", "login")}
              onSecondaryClick={() => handleRoleSelect("recruiter", "signup")}
              bulletPoints={[
                "Post unlimited jobs",
                "AI-powered screening",
                "Interview management",
              ]}
            />

            <RoleCard
              icon={<Users className="text-emerald-400" size={32} />}
              title="Job Seeker / Candidate"
              description="Find jobs and track your applications"
              primaryLabel="Login"
              secondaryLabel="Create Account"
              primaryClassName="bg-emerald-600 text-white hover:bg-emerald-700"
              secondaryClassName="border border-emerald-600/50 text-emerald-300 hover:bg-emerald-600/10"
              accentClassName="border-emerald-700/30 from-emerald-950/50 hover:border-emerald-600/60 hover:shadow-emerald-500/10"
              onPrimaryClick={() => handleRoleSelect("candidate", "login")}
              onSecondaryClick={() => handleRoleSelect("candidate", "signup")}
              bulletPoints={[
                "Search Rwanda jobs",
                "Track applications",
                "Interview scheduling",
              ]}
            />

            <div className="group relative rounded-2xl border-2 border-amber-700/50 bg-gradient-to-br from-amber-950/40 to-slate-900 p-8 shadow-lg shadow-amber-950/20 transition hover:border-amber-600/80 hover:shadow-amber-500/20">
              <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-amber-600/30 px-3 py-1 text-xs font-medium text-amber-100">
                <Shield size={12} />
                <span>Restricted</span>
              </div>

              <div className="mb-4 inline-flex rounded-lg bg-amber-600/20 p-3">
                <Shield className="text-amber-400" size={32} />
              </div>

              <h2 className="text-2xl font-bold text-white">System Controller</h2>
              <p className="mt-2 text-slate-400">
                Platform administration and moderation
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("system_controller", "login")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-amber-700 bg-amber-950/20 px-4 py-2 font-medium text-amber-100 transition hover:bg-amber-950/40"
                >
                  <span>System Access</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p>Locked access only</p>
                <p>All access logged</p>
                <p>No public registration</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>© 2026 TalentLens. Made for Rwanda&apos;s talent ecosystem.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderAuthForm = () => {
    switch (mode) {
      case "recruiter_login":
        return (
          <AuthFormWrapper
            title="Recruiter Login"
            subtitle="Sign in to your TalentLens recruiter account"
            onBack={handleBack}
          >
            <RecruiterLoginForm />
          </AuthFormWrapper>
        );
      case "recruiter_signup":
        return (
          <AuthFormWrapper
            title="Create Recruiter Account"
            subtitle="Register your company on TalentLens"
            onBack={handleBack}
          >
            <RecruiterSignupForm />
          </AuthFormWrapper>
        );
      case "candidate_login":
        return (
          <AuthFormWrapper
            title="Job Seeker Login"
            subtitle="Sign in to find your next opportunity"
            onBack={handleBack}
          >
            <CandidateLoginForm />
          </AuthFormWrapper>
        );
      case "candidate_signup":
        return (
          <AuthFormWrapper
            title="Create Job Seeker Account"
            subtitle="Start your journey to your dream job"
            onBack={handleBack}
          >
            <CandidateSignupForm />
          </AuthFormWrapper>
        );
      default:
        return null;
    }
  };

  return renderAuthForm();
}

function RoleCard({
  icon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryClassName,
  secondaryClassName,
  accentClassName,
  onPrimaryClick,
  onSecondaryClick,
  bulletPoints,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryClassName: string;
  secondaryClassName: string;
  accentClassName: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  bulletPoints: string[];
}) {
  return (
    <div
      className={
        "group relative rounded-2xl border bg-gradient-to-br to-slate-900 p-8 transition hover:shadow-lg " +
        accentClassName
      }
    >
      <div className="mb-4 inline-flex rounded-lg bg-white/5 p-3">{icon}</div>

      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-slate-400">{description}</p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onPrimaryClick}
          className={"w-full rounded-lg px-4 py-2 font-medium transition " + primaryClassName}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onSecondaryClick}
          className={"w-full rounded-lg px-4 py-2 font-medium transition " + secondaryClassName}
        >
          {secondaryLabel}
        </button>
      </div>

      <div className="mt-4 space-y-1 text-xs text-slate-500">
        {bulletPoints.map((item) => (
          <p key={item}>✓ {item}</p>
        ))}
      </div>
    </div>
  );
}

function AuthFormWrapper({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span>Back to Landing Page</span>
          </Link>

          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            All Access Options
          </button>
        </div>

        <div className="rounded-2xl border border-slate-700/30 bg-gradient-to-br from-slate-900/50 to-slate-900 p-8">
          <div className="mb-6 flex justify-center">
            <Logo size="lg" theme="dark" showTagline />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-slate-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © 2026 TalentLens. Proud to power Rwanda&apos;s talent ecosystem.
        </p>
      </div>
    </div>
  );
}
