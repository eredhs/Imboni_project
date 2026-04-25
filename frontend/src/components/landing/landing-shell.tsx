"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CirclePlay,
  Clock3,
  LayoutGrid,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Logo from "@/components/Logo";

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type StepItem = {
  number: string;
  title: string;
  description: string;
};

type StatItem = {
  value: string;
  label: string;
};

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

const featureCards: FeatureCard[] = [
  {
    icon: Search,
    title: "AI Candidate Screening",
    description:
      "Parse resumes, extract structured signals, and surface evidence-backed matches beyond raw keywords.",
  },
  {
    icon: Target,
    title: "Shortlist Confidence",
    description:
      "Compare role fit, skill depth, and hiring rationale in one disciplined workflow for faster decisions.",
  },
  {
    icon: BarChart3,
    title: "Interview Intelligence",
    description:
      "Bring recruiter notes, evaluation patterns, and final recommendations into a single decision layer.",
  },
  {
    icon: LayoutGrid,
    title: "Recruiter Workspace",
    description:
      "Manage jobs, applicants, screening, and collaboration in one professional platform built for HR teams.",
  },
];

const steps: StepItem[] = [
  {
    number: "01",
    title: "Open the role",
    description:
      "Post a vacancy, define what strong talent looks like, and align your hiring criteria from the start.",
  },
  {
    number: "02",
    title: "Let TalentLens screen",
    description:
      "The platform reviews profiles, surfaces fit scores, and explains why each candidate belongs on the shortlist.",
  },
  {
    number: "03",
    title: "Decide with clarity",
    description:
      "Move into interviews, compare finalists, and approve the right person with less noise and better evidence.",
  },
];

const stats: StatItem[] = [
  { value: "10,000+", label: "candidate profiles indexed" },
  { value: "500+", label: "teams growing with TalentLens" },
  { value: "94.2%", label: "screening confidence benchmark" },
  { value: "3x", label: "faster recruiter decision cycles" },
];

const testimonials: TestimonialItem[] = [
  {
    quote:
      "TalentLens helped our hiring team move from a pile of resumes to a clean shortlist in days, not weeks.",
    name: "Jonathan Reeves",
    role: "Head of Talent at NeoTech",
  },
  {
    quote:
      "The strongest part is the clarity. Recruiters can explain why a candidate advanced instead of relying on instinct alone.",
    name: "Alicia Torres",
    role: "HR Director at GlobalFlow",
  },
  {
    quote:
      "We needed a platform that feels serious, modern, and accountable. This finally gave our hiring process structure.",
    name: "Sanjay Gupta",
    role: "CEO at SparkStart",
  },
];

type ParsedStat = {
  target: number;
  suffix: string;
  decimals: number;
  useGrouping: boolean;
};

export function LandingShell() {
  const statsRef = useRef<HTMLElement | null>(null);
  const hasAnimatedStats = useRef(false);

  const parsedStats = useMemo(() => {
    return stats.map((stat) => parseStatValue(stat.value));
  }, []);

  const [animatedValues, setAnimatedValues] = useState(
    parsedStats.map(() => 0)
  );

  useEffect(() => {
    const element = statsRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || hasAnimatedStats.current) {
          return;
        }

        hasAnimatedStats.current = true;
        const duration = 1600;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = easeOutCubic(progress);
          setAnimatedValues(
            parsedStats.map((stat) => stat.target * eased)
          );

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [parsedStats]);

  return (
    <main className="min-h-screen bg-[#121925] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,214,125,0.1),transparent_26%),radial-gradient(circle_at_top_right,rgba(49,176,255,0.12),transparent_28%),linear-gradient(180deg,rgba(7,13,23,0.96),rgba(18,25,37,1))]" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-18 pt-4 sm:px-5 lg:px-6">
          <div className="overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(135deg,rgba(29,38,50,0.96),rgba(24,34,45,0.94)_48%,rgba(21,58,49,0.9)_100%)] shadow-[0_28px_110px_rgba(3,8,20,0.45)]">
            <header className="border-b border-white/7">
              <div className="mx-auto flex max-w-[1340px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10 lg:py-5">
                <Logo size="md" theme="dark" showTagline />

                <nav className="hidden items-center gap-6 text-sm font-semibold text-white/70 lg:flex">
                  <a href="#features" className="transition hover:text-white">
                    Features
                  </a>
                  <a href="#how-it-works" className="transition hover:text-white">
                    How It Works
                  </a>
                  <a href="#testimonials" className="transition hover:text-white">
                    Reviews
                  </a>
                  <a href="#stats" className="transition hover:text-white">
                    Stats
                  </a>
                  <a href="#access" className="transition hover:text-white">
                    Get Started
                  </a>
                </nav>

                <div className="flex items-center gap-3">
                  <Link
                    href="/auth"
                    className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.04] hover:text-white md:inline-flex"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 rounded-[18px] bg-[#2FD67D] px-5 py-3 text-sm font-semibold text-[#0B1D13] shadow-[0_18px_44px_rgba(47,214,125,0.22)] transition hover:bg-[#43E58E]"
                  >
                    Join Platform
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </header>

            <section className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(47,214,125,0.09),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(102,126,234,0.12),transparent_20%)]" />

              <div className="mx-auto grid max-w-[1340px] gap-8 px-5 pb-6 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(430px,0.98fr)] lg:items-center lg:px-10 lg:pb-8 lg:pt-6 xl:gap-12">
                <div className="relative z-10">
                  <h1 className="mt-4 max-w-[700px] text-[clamp(2.85rem,6vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-white">
                    Hire Smarter.
                    <span className="mt-2 block text-[#2FD67D]">Get Hired Faster.</span>
                  </h1>

                  <p className="mt-5 max-w-[640px] text-[0.98rem] leading-7 text-white/68 sm:text-[1.05rem] sm:leading-8">
                    TalentLens AI helps HR teams move from raw applications to explainable
                    shortlist decisions with speed, structure, and confidence. It is the
                    recruiter workspace for modern hiring.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href="/auth"
                      className="inline-flex items-center gap-2 rounded-[18px] bg-[#2FD67D] px-7 py-4 text-base font-semibold text-[#0B1D13] shadow-[0_20px_50px_rgba(47,214,125,0.24)] transition hover:bg-[#43E58E]"
                    >
                      Join Platform
                      <ArrowRight className="h-5 w-5" strokeWidth={2} />
                    </Link>
                    <Link
                      href="/auth"
                      className="inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-4 text-base font-semibold text-white/88 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <CirclePlay className="h-5 w-5 text-[#2FD67D]" strokeWidth={1.9} />
                      View Access Portal
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="h-3 w-20 rounded-full bg-white/10" />
                    <div className="h-3 w-24 rounded-full bg-white/10" />
                    <div className="h-3 w-16 rounded-full bg-white/10" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="relative mx-auto max-w-[720px] lg:-mt-6">
                    <div className="absolute inset-7 rounded-[36px] border border-white/8 bg-white/[0.03] blur-[2px]" />

                    <div className="absolute -left-3 top-5 z-20 rounded-[24px] border border-white/12 bg-[#1D2733]/88 px-5 py-4 shadow-[0_20px_48px_rgba(10,17,27,0.32)] backdrop-blur-md sm:-left-7 sm:top-8 sm:px-6 sm:py-5">
                      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                        <ShieldCheck className="h-4 w-4 text-[#2FD67D]" strokeWidth={1.9} />
                        Hiring accuracy
                      </div>
                      <p className="mt-2 text-[2.5rem] font-semibold leading-none tracking-[-0.06em] text-white sm:text-[3rem]">
                        94.2%
                      </p>
                    </div>

                    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_34px_100px_rgba(10,17,27,0.3)]">
                      <div className="relative overflow-hidden rounded-[26px]">
                        <Image
                          src="/landing/colleagues-reading-documents-office.jpg"
                          alt="Colleagues reading documents in office"
                          width={1200}
                          height={900}
                          priority
                          className="auth-hero-zoom h-[320px] w-full object-cover object-top sm:h-[380px]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,19,30,0.34),rgba(14,26,40,0.08)_50%,rgba(4,12,22,0.3))]" />
                      </div>
                    </div>

                    <div className="absolute bottom-7 left-4 z-20 rounded-[24px] border border-white/12 bg-[#1D2733]/88 px-5 py-4 shadow-[0_20px_48px_rgba(10,17,27,0.32)] backdrop-blur-md sm:left-10">
                      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                        <Clock3 className="h-4 w-4 text-[#2FD67D]" strokeWidth={1.9} />
                        Avg time to interview
                      </div>
                      <p className="mt-2 text-[1.9rem] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[2.1rem]">
                        48 Hours
                      </p>
                    </div>

                    <div className="absolute bottom-16 right-0 z-20 rounded-[24px] border border-white/12 bg-[#1D2733]/88 px-5 py-4 shadow-[0_20px_48px_rgba(10,17,27,0.32)] backdrop-blur-md sm:-right-5 sm:px-6">
                      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                        <Users className="h-4 w-4 text-[#2FD67D]" strokeWidth={1.9} />
                        AI shortlisted
                      </div>
                      <p className="mt-2 text-[1.9rem] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[2.1rem]">
                        128 Candidates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section
            id="features"
            className="mx-auto max-w-[1340px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7EF0AE]">
                Platform strengths
              </p>
              <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.06em] text-white sm:text-[3.3rem]">
                Why TalentLens AI feels built for serious hiring teams
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/60">
                The platform combines speed, transparency, and recruiter control so hiring
                decisions remain efficient without losing context.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-[28px] border border-white/7 bg-white/[0.03] p-7 shadow-[0_16px_42px_rgba(5,11,20,0.14)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/12 hover:bg-white/[0.05]"
                >
                  <div className="inline-flex rounded-[18px] border border-[#2FD67D]/20 bg-[#2FD67D]/10 p-3.5 text-[#2FD67D]">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </div>
                  <h3 className="mt-5 text-[1.28rem] font-semibold text-white">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/60">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="stats"
            ref={statsRef}
            className="mx-auto max-w-[1340px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            <div className="grid gap-5 lg:grid-cols-4">
              {stats.map((item, index) => (
                <article
                  key={item.label}
                  className="rounded-[26px] border border-white/7 bg-white/[0.03] px-6 py-7 text-center shadow-[0_16px_40px_rgba(5,11,20,0.14)]"
                >
                  <p className="text-[3.2rem] font-semibold leading-none tracking-[-0.07em] text-[#2FD67D]">
                    {formatStatValue(animatedValues[index] ?? 0, parsedStats[index])}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="how-it-works"
            className="mx-auto max-w-[1340px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7EF0AE]">
                Recruiter journey
              </p>
              <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.06em] text-white sm:text-[3.3rem]">
                The hiring flow in three focused moves
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Structured enough for professional HR teams, fast enough for modern growth
                companies.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[28px] border border-white/7 bg-white/[0.03] px-7 py-8 shadow-[0_16px_42px_rgba(5,11,20,0.14)]"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#2FD67D]/50 bg-[#2FD67D]/8 text-lg font-semibold text-[#2FD67D] shadow-[0_0_24px_rgba(47,214,125,0.12)]">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/60">{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="testimonials"
            className="mx-auto max-w-[1340px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7EF0AE]">
                Recruiter proof
              </p>
              <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.06em] text-white sm:text-[3.3rem]">
                Trusted by teams that want clarity before they hire
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Product teams, startups, and growing businesses use TalentLens to make hiring
                decisions feel more accountable and more precise.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article
                  key={item.name}
                  className="rounded-[28px] border border-white/7 bg-white/[0.03] px-7 py-8 shadow-[0_16px_42px_rgba(5,11,20,0.14)]"
                >
                  <div className="inline-flex items-center gap-1 text-[#2FD67D]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CheckCircle2
                        key={item.name + index}
                        className="h-4 w-4"
                        strokeWidth={1.9}
                      />
                    ))}
                  </div>
                  <p className="mt-6 text-base leading-8 text-white/74">{item.quote}</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2FD67D]/14 text-sm font-semibold text-[#2FD67D]">
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-white/46">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="access"
            className="mx-auto max-w-[1340px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
          >
            <div className="overflow-hidden rounded-[34px] border border-white/7 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(47,214,125,0.06))] px-6 py-14 text-center shadow-[0_20px_60px_rgba(5,11,20,0.18)] sm:px-10 lg:px-16">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7EF0AE]">
                Ready to enter the platform
              </p>
              <h2 className="mx-auto mt-4 max-w-[820px] text-[2.6rem] font-semibold leading-tight tracking-[-0.06em] text-white sm:text-[3.8rem]">
                Open the TalentLens access portal and start with the right role
              </h2>
              <p className="mx-auto mt-6 max-w-[760px] text-lg leading-8 text-white/62">
                Recruiters, candidates, and system controllers all begin from one clean entry
                point with the right access options.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-[18px] bg-[#2FD67D] px-7 py-4 text-base font-semibold text-[#0B1D13] transition hover:bg-[#43E58E]"
                >
                  Join Platform Now
                  <ArrowRight className="h-5 w-5" strokeWidth={2} />
                </Link>
                <Link
                  href="/auth"
                  className="rounded-[18px] border border-white/10 bg-white/[0.05] px-7 py-4 text-base font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Login
                </Link>
              </div>

              <p className="mt-7 text-sm text-white/48">
                Demo access is available for recruiter review with the seeded HR account.
              </p>
            </div>
          </section>

          <footer className="mx-auto max-w-[1340px] px-4 pt-20 sm:px-6 lg:px-8">
            <div className="grid gap-12 border-t border-white/7 pt-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
              <div>
                <Logo size="sm" theme="dark" showTagline={false} />
                <p className="mt-5 max-w-[330px] text-sm leading-7 text-white/56">
                  Professional hiring software for teams that want faster screening, better
                  evidence, and cleaner recruiter decisions.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/44">
                  Access
                </p>
                <div className="mt-5 space-y-3 text-sm text-white/58">
                  <Link href="/auth" className="block hover:text-white">
                    Login
                  </Link>
                  <Link href="/auth" className="block hover:text-white">
                    Join Platform
                  </Link>
                  <Link href="/auth" className="block hover:text-white">
                    Recruiter / HR
                  </Link>
                  <Link href="/auth" className="block hover:text-white">
                    System Controller
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/44">
                  Platform
                </p>
                <div className="mt-5 space-y-3 text-sm text-white/58">
                  <span className="block">AI Screening</span>
                  <span className="block">Candidate Comparison</span>
                  <span className="block">Recruiter Insights</span>
                  <span className="block">Structured Talent Profiles</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/44">
                  Stay informed
                </p>
                <p className="mt-5 text-sm leading-7 text-white/56">
                  Get product and hiring updates from TalentLens in your inbox.
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-[20px] border border-white/7 bg-white/[0.03] p-2">
                  <Mail className="ml-2 h-4 w-4 text-white/38" strokeWidth={1.9} />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/28"
                  />
                  <button
                    type="button"
                    className="rounded-[14px] bg-[#2FD67D] px-4 py-2 text-sm font-semibold text-[#0B1D13] transition hover:bg-[#43E58E]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/7 py-6 text-sm text-white/42 sm:flex-row sm:items-center sm:justify-between">
              <p>(c) 2026 TalentLens AI. All rights reserved.</p>
              <div className="flex gap-6">
                <span>Security</span>
                <span>GDPR</span>
                <span>Platform Status</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseStatValue(value: string): ParsedStat {
  let suffix = "";
  let numericPart = value.trim();

  if (numericPart.endsWith("+")) {
    suffix = "+";
    numericPart = numericPart.slice(0, -1);
  } else if (numericPart.endsWith("%")) {
    suffix = "%";
    numericPart = numericPart.slice(0, -1);
  } else if (numericPart.toLowerCase().endsWith("x")) {
    suffix = "x";
    numericPart = numericPart.slice(0, -1);
  }

  const cleaned = numericPart.replace(/,/g, "");
  const decimals = cleaned.includes(".") ? cleaned.split(".")[1]?.length ?? 0 : 0;
  const target = Number(cleaned);
  const useGrouping = numericPart.includes(",") || target >= 1000;

  return { target, suffix, decimals, useGrouping };
}

function formatStatValue(value: number, stat?: ParsedStat) {
  if (!stat || !Number.isFinite(stat.target)) {
    return "0";
  }

  const rounded = stat.decimals === 0 ? Math.round(value) : Number(value.toFixed(stat.decimals));
  const formatted = stat.useGrouping
    ? rounded.toLocaleString("en-US", {
        minimumFractionDigits: stat.decimals,
        maximumFractionDigits: stat.decimals,
      })
    : rounded.toFixed(stat.decimals);

  return formatted + stat.suffix;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
