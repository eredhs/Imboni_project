"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useLoginMutation, useRegisterMutation } from "@/store/api/auth-api";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  organization: z.string().min(2, "Enter your organization."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type AuthMode = "login" | "register";
type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function JobSeekerAuthShell({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { syncUserFromStorage } = useAuth();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const redirectToDashboard = (role: string) => {
    if (role === "system_controller") {
      router.replace("/admin/dashboard");
      return;
    }

    if (role === "recruiter") {
      router.replace("/dashboard");
      return;
    }

    router.replace("/seeker/dashboard");
  };

  const onLoginSubmit = async (values: LoginValues) => {
    try {
      const result = await login({ ...values, role: "job_seeker" }).unwrap();
      window.localStorage.setItem("talentlens_access_token", result.accessToken);
      window.localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      window.localStorage.setItem("talentlens_user", JSON.stringify(result.user));
      syncUserFromStorage();
      toast.success("Welcome! Redirecting to your dashboard.");

      redirectToDashboard(result.user.role);
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    try {
      const result = await registerUser({ ...values, role: "job_seeker" }).unwrap();
      window.localStorage.setItem("talentlens_access_token", result.accessToken);
      window.localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      window.localStorage.setItem("talentlens_user", JSON.stringify(result.user));
      syncUserFromStorage();
      toast.success("Account created! Redirecting to your dashboard.");

      redirectToDashboard(result.user.role);
    } catch {
      toast.error("Registration failed. Try a different email.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo size="md" theme="light" showTagline />

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B7280]">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#10B981] font-semibold hover:underline text-sm"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-[#6B7280]">
            {mode === "login"
              ? "Sign in to explore your next opportunity"
              : "Start your career journey with AI-powered opportunities"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register("email")}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                    className="w-full px-4 py-3 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full mt-6 px-4 py-3 bg-[#10B981] text-white font-semibold rounded-lg hover:bg-[#059669] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoginLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  {...registerForm.register("name")}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  placeholder="Your company or current employer"
                  {...registerForm.register("organization")}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
                {registerForm.formState.errors.organization && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.organization.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...registerForm.register("email")}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                    className="w-full px-4 py-3 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full mt-6 px-4 py-3 bg-[#10B981] text-white font-semibold rounded-lg hover:bg-[#059669] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isRegisterLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Social Login (placeholder) */}
          <button className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-[#111827] font-medium hover:bg-[#F9FAFB] transition-colors">
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#6B7280]">
          By signing {mode === "login" ? "in" : "up"}, you agree to our{" "}
          <Link href="#" className="text-[#10B981] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#10B981] hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
