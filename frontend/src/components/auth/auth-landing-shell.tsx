"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useLoginMutation, useRegisterMutation } from "@/store/api/auth-api";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  organization: z.string().min(2, "Enter your organization."),
  email: z.email("Enter a valid email address."),
  location: z.string().min(1, "Please select a location."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const typedPhrases = [
  "explainable hiring intelligence.",
  "fair and accountable screening.",
  "confident recruiter decisions.",
];

const rwandaDistricts = [
  "Bugesera",
  "Gatsibo",
  "Kayonza",
  "Kirehe",
  "Ngoma",
  "Nyagatare",
  "Rwamagana",
  "Nyaruguru",
  "Nyungwe",
  "Ruhango",
  "Huye",
  "Gisagara",
  "Nyamagabe",
  "Karongi",
  "Rutsiro",
  "Rubavu",
  "Nyabihu",
  "Gakenke",
  "Kigali City - Gasabo",
  "Kigali City - Kicukiro",
  "Kigali City - Nyarugenge",
];

const scenes = [
  {
    src: "/auth-scenes/interview.jpg",
    alt: "Candidate speaking in an interview",
    title: "Put reasoning beside every candidate score.",
    text: "TalentLens helps HR teams screen faster while keeping every recommendation visible, contextual, and easy to defend.",
    nav: "Explainable screening",
    detail: "See why someone stands out, not only the score.",
    chips: ["Transparent scoring", "Human-readable rationale"],
  },
  {
    src: "/auth-scenes/onboarding.jpg",
    alt: "Recruiter onboarding a colleague",
    title: "Make first access feel worthy of the platform.",
    text: "The first screen should already tell recruiters they are entering a trusted, structured, international-grade hiring tool.",
    nav: "Recruiter onboarding",
    detail: "From first visit to first login, the experience stays intentional.",
    chips: ["Multi-recruiter ready", "Structured workspace access"],
  },
  {
    src: "/auth-scenes/collaboration.jpg",
    alt: "Recruiters reviewing documents together",
    title: "Keep every hiring discussion anchored in evidence.",
    text: "Comparison, reasoning, and recruiter collaboration belong in one disciplined environment when the decision matters.",
    nav: "Shared hiring insight",
    detail: "Review, compare, and justify every move together.",
    chips: ["Candidate comparison", "Decision-ready alignment"],
  },
];

const insights = [
  {
    icon: Sparkles,
    title: "Immediate clarity",
    text: "Recruiters understand the value of the platform before the first form appears.",
  },
  {
    icon: ShieldCheck,
    title: "Brand-led motion",
    text: "Three HR scenes crossfade with controlled zoom and disciplined gradients.",
  },
  {
    icon: Users,
    title: "Recruiter confidence",
    text: "Explainable AI, comparison, and access are visible from the first second.",
  },
];

type AuthMode = "login" | "register";
type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthLandingShell({
  initialMode = "login",
  initialPanelOpen = false,
}: {
  initialMode?: AuthMode;
  initialPanelOpen?: boolean;
}) {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [typedText, setTypedText] = useState(typedPhrases[0].slice(0, 1));
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { syncUserFromStorage } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "demohr@talentlens.ai",
      password: "DemoHR123?",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSceneIndex((current) => (current + 1) % scenes.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentPhrase = typedPhrases[phraseIndex];
    let delay = isDeleting ? 48 : 92;
    if (!isDeleting && typedText === currentPhrase) delay = 1500;
    if (isDeleting && typedText === "") delay = 280;

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (typedText === currentPhrase) {
          setIsDeleting(true);
          return;
        }
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
        return;
      }

      if (typedText === "") {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % typedPhrases.length);
        return;
      }

      setTypedText(currentPhrase.slice(0, typedText.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, phraseIndex, typedText]);

  const activeScene = scenes[sceneIndex];

  const openPanel = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPanelOpen(true);
  };

  const redirectToDashboard = (role: string) => {
    if (role === "job_seeker") {
      router.replace("/seeker/dashboard");
      return;
    }

    if (role === "system_controller") {
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/dashboard");
  };

  const onLoginSubmit = async (values: LoginValues) => {
    try {
      const result = await login({ ...values, role: "recruiter" }).unwrap();
      window.localStorage.setItem("talentlens_access_token", result.accessToken);
      window.localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      window.localStorage.setItem("talentlens_user", JSON.stringify(result.user));
      syncUserFromStorage();
      toast.success("Welcome back.");

      redirectToDashboard(result.user.role);
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    try {
      const result = await registerUser({ ...values, role: "recruiter" }).unwrap();
      window.localStorage.setItem("talentlens_access_token", result.accessToken);
      window.localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      window.localStorage.setItem("talentlens_user", JSON.stringify(result.user));
      syncUserFromStorage();
      toast.success("Account created.");

      redirectToDashboard(result.user.role);
    } catch {
      toast.error("Registration failed. Try a different email.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_76%_18%,rgba(129,140,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_24%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1540px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[30px] bg-white/94 px-5 py-4 text-[#0F172A] shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo size="md" theme="light" showTagline />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#475569]">
                  TalentLens AI
                </p>
                <p className="mt-2 text-sm text-[#475569]">
                  Explainable hiring intelligence for modern HR teams.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-7 text-sm font-medium text-[#475569] lg:flex">
              <span>Screening</span>
              <span>Comparison</span>
              <span>Insights</span>
              <span>Recruiter Access</span>
            </div>

            <button
              type="button"
              onClick={() => openPanel(initialMode)}
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#4338CA,#2563EB,#14B8A6)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(67,56,202,0.24)] hover:opacity-95"
            >
              Join Platform
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        <section className="relative mt-5 flex-1 overflow-hidden rounded-[42px] border border-white/10 shadow-[0_40px_120px_rgba(2,6,23,0.34)]">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeScene.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1.09 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            >
              <Image
                src={activeScene.src}
                alt={activeScene.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(67,56,202,0.84)_0%,rgba(37,99,235,0.58)_26%,rgba(15,23,42,0.34)_52%,rgba(2,6,23,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(165,180,252,0.22),transparent_22%),radial-gradient(circle_at_74%_26%,rgba(45,212,191,0.12),transparent_20%),radial-gradient(circle_at_24%_84%,rgba(191,219,254,0.1),transparent_20%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)_20%,rgba(2,6,23,0.22)_58%,rgba(2,6,23,0.68)_100%)]" />
          <div className="absolute inset-0 backdrop-blur-[1.5px]" />

          <div className="relative z-10 flex min-h-[calc(100vh-10rem)] flex-col justify-between px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <div className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
              <div className="flex flex-col justify-center">
                <div className="auth-fade-up flex items-center gap-5">
                  <div className="drop-shadow-[0_18px_38px_rgba(2,6,23,0.42)]">
                    <Logo size="lg" theme="dark" showTagline />
                  </div>
                  <div className="max-w-[250px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/66">
                      TalentLens AI
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      International-grade hiring intelligence for modern recruiters and talent teams.
                    </p>
                  </div>
                </div>

                <div className="auth-fade-up auth-delay-1 mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/78 backdrop-blur-md">
                  <Sparkles className="h-4 w-4" strokeWidth={1.9} />
                  Global HR Intelligence Platform
                </div>

                <h1 className="auth-fade-up auth-delay-1 mt-7 max-w-[780px] text-[clamp(3.2rem,6.2vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                  Recruit with clarity.
                  <span className="block">Decide with confidence.</span>
                </h1>

                <div className="auth-fade-up auth-delay-2 mt-7 flex flex-wrap items-center gap-3 text-[15px] sm:text-[18px]">
                  <span className="text-white/70">Welcome to</span>
                  <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-md">
                    {typedText}
                    <span className="auth-type-caret ml-0.5 align-middle text-white">|</span>
                  </span>
                </div>

                <p className="auth-fade-up auth-delay-3 mt-7 max-w-[720px] text-[17px] leading-8 text-white/82 sm:text-[19px]">
                  TalentLens brings screening, explainable AI reasoning, candidate comparison,
                  and recruiter-ready reporting into one disciplined workspace built for serious
                  hiring teams.
                </p>

                <div className="auth-fade-up auth-delay-3 mt-8 max-w-[640px] rounded-[26px] border border-white/12 bg-white/8 px-5 py-4 backdrop-blur-md">
                  <p className="text-sm leading-7 text-white/74">
                    Continue through
                    <span className="mx-1.5 font-semibold text-white">Join Platform</span>
                    in the upper-right corner to open sign in or create recruiter access without
                    interrupting the welcome flow.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-5 lg:items-end">
                <div className="flex items-center gap-3 self-end">
                  <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-white/72 backdrop-blur-md">
                    {String(sceneIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSceneIndex((current) => (current - 1 + scenes.length) % scenes.length)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/18"
                    aria-label="Show previous hero scene"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSceneIndex((current) => (current + 1) % scenes.length)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/18"
                    aria-label="Show next hero scene"
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="w-full max-w-[500px] rounded-[34px] border border-white/14 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] p-6 shadow-[0_34px_90px_rgba(2,6,23,0.24)] backdrop-blur-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/66">
                    Current Focus
                  </p>
                  <h2 className="mt-4 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-tight text-white">
                    {activeScene.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/72">{activeScene.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeScene.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-white/78"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid w-full max-w-[500px] gap-3">
                  {scenes.map((scene, index) => (
                    <button
                      key={scene.nav}
                      type="button"
                      onClick={() => setSceneIndex(index)}
                      className={
                        "flex items-center gap-4 rounded-[26px] border px-4 py-4 text-left backdrop-blur-md transition " +
                        (sceneIndex === index
                          ? "border-white/26 bg-white/16 shadow-[0_18px_50px_rgba(2,6,23,0.2)]"
                          : "border-white/8 bg-white/8 hover:bg-white/12")
                      }
                    >
                      <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-[18px]">
                        <Image
                          src={scene.src}
                          alt={scene.alt}
                          fill
                          sizes="96px"
                          className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(2,6,23,0.4))]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold tracking-[0.24em] text-white/58">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="truncate text-sm font-semibold text-white">{scene.nav}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/66">{scene.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
              <div className="rounded-[32px] bg-[linear-gradient(135deg,rgba(67,56,202,0.86),rgba(37,99,235,0.72),rgba(20,184,166,0.64))] p-6 shadow-[0_26px_80px_rgba(37,99,235,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/74">
                  Why HR Teams Stay
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  From first screening to final justification, TalentLens keeps the whole hiring
                  story visible.
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/84">
                  That is what makes the platform feel credible, international, and ready for
                  real recruiting work instead of just another login screen.
                </p>
              </div>

              {insights.slice(0, 2).map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-[30px] border border-white/12 bg-white/10 p-6 backdrop-blur-md"
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.9} />
                  <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/74">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {panelOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close authentication panel"
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-30 bg-[#020617]/52 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              className="fixed right-4 top-1/2 z-40 flex w-[min(92vw,470px)] -translate-y-1/2 flex-col overflow-hidden rounded-[34px] border border-white/60 bg-white/95 text-[#0F172A] shadow-[0_34px_120px_rgba(15,23,42,0.36)] backdrop-blur-2xl max-h-[90vh]"
              initial={{ opacity: 0, x: 56, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 56, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 25, mass: 0.95 }}
            >
              <div className="bg-[linear-gradient(135deg,#EEF2FF,#F8FAFC)] px-6 py-6 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6366F1]">
                      Join Platform
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-[#0F172A]">
                      {mode === "login" ? "Enter your recruiter workspace" : "Create recruiter access"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D9E1F0] bg-white text-[#475569] hover:border-[#C7D2FE] hover:text-[#0F172A]"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 rounded-full bg-white p-1 shadow-[0_14px_30px_rgba(99,102,241,0.08)]">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={
                      "rounded-full px-4 py-2.5 text-sm font-semibold " +
                      (mode === "login"
                        ? "bg-[linear-gradient(135deg,#4338CA,#2563EB)] text-white"
                        : "text-[#64748B]")
                    }
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={
                      "rounded-full px-4 py-2.5 text-sm font-semibold " +
                      (mode === "register"
                        ? "bg-[linear-gradient(135deg,#4338CA,#2563EB)] text-white"
                        : "text-[#64748B]")
                    }
                  >
                    Create account
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
                {mode === "login" ? (
                  <div>
                    <div className="rounded-[28px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#FFFFFF,#F8FAFC)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6366F1]">
                        Demo Access
                      </p>
                      <div className="mt-4 rounded-[20px] border border-white bg-white px-4 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
                        <p className="text-sm font-semibold text-[#111827]">sarah@talentlens.ai</p>
                        <p className="mt-1 text-xs leading-6 text-[#64748B]">
                          Password: TalentLens2024!
                        </p>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#475569]">
                        The seeded recruiter is ready, and registered recruiter accounts can sign
                        in here as well.
                      </p>
                    </div>

                    <form className="mt-6 space-y-5" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                      <Field label="Email" error={loginForm.formState.errors.email?.message}>
                        <input
                          {...loginForm.register("email")}
                          autoComplete="email"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="you@company.com"
                        />
                      </Field>
                      <Field label="Password" error={loginForm.formState.errors.password?.message}>
                        <input
                          {...loginForm.register("password")}
                          type="password"
                          autoComplete="current-password"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="Enter your password"
                        />
                      </Field>
                      <button
                        type="submit"
                        disabled={!loginForm.formState.isValid || isLoginLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#4338CA,#2563EB,#14B8A6)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(79,70,229,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoginLoading ? "Signing in..." : "Open dashboard"}
                        {!isLoginLoading ? <ArrowRight className="h-4 w-4" strokeWidth={2} /> : null}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4338CA] hover:text-[#312E81]"
                    >
                      Need a recruiter account? Create one here.
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="rounded-[28px] border border-[#D9E1F0] bg-[linear-gradient(135deg,#FFFFFF,#EEF2FF)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4338CA] shadow-[0_12px_24px_rgba(99,102,241,0.16)]">
                          <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            Two or more recruiters can join this platform
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[#475569]">
                            Register each recruiter with a different email address, then they can
                            sign in separately from the same access panel.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form
                      className="mt-6 space-y-5"
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    >
                      <Field label="Full name" error={registerForm.formState.errors.name?.message}>
                        <input
                          {...registerForm.register("name")}
                          autoComplete="name"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="Recruiter name"
                        />
                      </Field>
                      <Field
                        label="Organization"
                        error={registerForm.formState.errors.organization?.message}
                      >
                        <input
                          {...registerForm.register("organization")}
                          autoComplete="organization"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="Company or hiring team"
                        />
                      </Field>
                      <Field
                        label="Email"
                        error={registerForm.formState.errors.email?.message}
                        hint="Use a different email for every recruiter account."
                      >
                        <input
                          {...registerForm.register("email")}
                          autoComplete="email"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="you@company.com"
                        />
                      </Field>
                      <Field
                        label="Location"
                        error={registerForm.formState.errors.location?.message}
                      >
                        <select
                          {...registerForm.register("location")}
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                        >
                          <option value="">Select your district</option>
                          {rwandaDistricts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field
                        label="Password"
                        error={registerForm.formState.errors.password?.message}
                        hint="Use at least 8 characters."
                      >
                        <input
                          {...registerForm.register("password")}
                          type="password"
                          autoComplete="new-password"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="Create a password"
                        />
                      </Field>
                      <Field
                        label="Confirm Password"
                        error={registerForm.formState.errors.confirmPassword?.message}
                      >
                        <input
                          {...registerForm.register("confirmPassword")}
                          type="password"
                          autoComplete="new-password"
                          className="w-full rounded-[18px] border border-[#D9E1F0] bg-white px-4 py-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-[#E0E7FF]"
                          placeholder="Confirm your password"
                        />
                      </Field>
                      <label className="flex items-start gap-3">
                        <input
                          {...registerForm.register("agreeToTerms")}
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-[#D9E1F0] text-[#4338CA] outline-none transition focus:ring-4 focus:ring-[#E0E7FF]"
                        />
                        <span className="text-sm text-[#475569]">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="font-semibold text-[#4338CA] hover:text-[#312E81]"
                          >
                            Terms & Conditions
                          </a>
                        </span>
                      </label>
                      {registerForm.formState.errors.agreeToTerms && (
                        <p className="text-sm text-[#DC2626]">
                          {registerForm.formState.errors.agreeToTerms.message}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={!registerForm.formState.isValid || isRegisterLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#4338CA,#2563EB,#14B8A6)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(79,70,229,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRegisterLoading ? "Creating account..." : "Create recruiter account"}
                        {!isRegisterLoading ? <ArrowRight className="h-4 w-4" strokeWidth={2} /> : null}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4338CA] hover:text-[#312E81]"
                    >
                      Already have access? Sign in here.
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#111827]">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-6 text-[#64748B]">{hint}</span> : null}
      {error ? <span className="mt-2 block text-sm text-[#DC2626]">{error}</span> : null}
    </label>
  );
}
