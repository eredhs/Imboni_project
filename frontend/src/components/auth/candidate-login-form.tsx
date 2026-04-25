import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function CandidateLoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const success = await login(
        formData.email,
        formData.password,
        "job_seeker"
      );
      if (success) {
        router.push("/seeker/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Email Address
        </label>
        <div className="relative mt-2">
          <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Password
        </label>
        <div className="relative mt-2">
          <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 font-medium text-white hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-700 disabled:to-slate-700"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-xs text-slate-500">
        Demo: <strong>demouser@imboni.io</strong> / <strong>DemoUser123?</strong>
      </p>
    </form>
  );
}
