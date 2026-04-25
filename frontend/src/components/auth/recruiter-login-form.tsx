import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/store/api/auth-api";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

export default function RecruiterLoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { syncUserFromStorage } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "hrdemo@gmail.com",
    password: "Demohr123?",
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
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: "recruiter",
      }).unwrap();

      window.localStorage.setItem("talentlens_access_token", result.accessToken);
      window.localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      window.localStorage.setItem("talentlens_user", JSON.stringify(result.user));
      syncUserFromStorage();

      toast.success("Welcome back!");
      router.replace("/dashboard");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMsg);
      toast.error(errorMsg);
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
            placeholder="you@company.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
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
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 font-medium text-white hover:from-purple-700 hover:to-purple-800 disabled:from-slate-700 disabled:to-slate-700"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-xs text-slate-500">
        Demo: <strong>hrdemo@gmail.com</strong> / <strong>Demohr123?</strong>
      </p>
    </form>
  );
}
