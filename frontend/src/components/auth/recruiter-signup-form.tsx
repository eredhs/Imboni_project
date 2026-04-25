import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RecruiterSignupForm() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      const success = await signup({
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: "recruiter",
      });

      if (success) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
          Your Name
        </label>
        <div className="relative mt-2">
          <User className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean-Paul Mugabo"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Company Name
        </label>
        <div className="relative mt-2">
          <Building2 className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company Ltd"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            required
          />
        </div>
      </div>

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
            placeholder="you@company.rw"
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

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Confirm Password
        </label>
        <div className="relative mt-2">
          <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 font-medium text-white hover:from-purple-700 hover:to-purple-800 disabled:from-slate-700 disabled:to-slate-700"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
