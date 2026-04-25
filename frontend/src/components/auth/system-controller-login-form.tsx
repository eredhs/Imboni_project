'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Fingerprint, Check, Key } from "lucide-react";

type Step = 1 | 2 | 3;

export default function SystemControllerLoginForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    secretKey: "",
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

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (currentStep === 1) {
        const response = await fetch("/api/auth/admin/verify-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secretKey: formData.secretKey }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.valid) {
          setError("Unauthorized System Controller credentials");
          setIsSubmitting(false);
          return;
        }

        // Step 1 complete, move to Step 2
        setCompletedSteps([...completedSteps, 1]);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Validate email format
        if (!formData.email.includes("@")) {
          setError("Please enter a valid email address");
          setIsSubmitting(false);
          return;
        }
        // Step 2 complete, move to Step 3
        setCompletedSteps([...completedSteps, 2]);
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Final step: authenticate user
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: "system_controller",
          }),
        });

        if (!response.ok) {
          setError(
            "Unauthorized System Controller credentials. This access attempt has been logged."
          );
          setIsSubmitting(false);
          return;
        }

        const data = await response.json();
        localStorage.setItem("talentlens_access_token", data.accessToken);
        localStorage.setItem("talentlens_refresh_token", data.refreshToken || "");
        localStorage.setItem("talentlens_user", JSON.stringify(data.user));
        localStorage.setItem("imboni_role", "system_controller");

        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-system-controller-form">
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-system-controller-form {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0B1220 0%, #0F1825 100%);
          padding: 60px 20px 80px;
          animation: fadeUp 0.6s ease;
        }

        .admin-card {
          background: rgba(19, 28, 46, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 48px;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .admin-icon {
          width: 64px;
          height: 64px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366F1;
          margin: 0 auto 28px;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .admin-title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 8px;
          animation: fadeUp 0.6s ease 0.15s both;
        }

        .admin-subtitle {
          font-size: 13px;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.5;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 36px;
          animation: fadeUp 0.6s ease 0.25s both;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 14px;
        }

        .step-circle.active {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        .step-circle.completed {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .step-line {
          width: 16px;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          margin: 0 4px;
        }

        .step-line.active {
          background: #6366f1;
        }

        .step-label {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          text-align: center;
          font-weight: 600;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .step-label.active {
          color: #6366f1;
        }

        .input-wrapper {
          margin-bottom: 20px;
          animation: fadeUp 0.6s ease 0.3s both;
        }

        .input-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          width: 16px;
          height: 16px;
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 14px 16px 14px 44px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: all 0.2s ease;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .input-field:focus {
          outline: none;
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
          background: rgba(255, 255, 255, 0.06);
        }

        .input-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s ease;
          width: 16px;
          height: 16px;
        }

        .input-toggle:hover {
          color: #fff;
        }

        .btn-primary {
          width: 100%;
          background: #fff;
          color: #0b1220;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-top: 24px;
          animation: fadeUp 0.6s ease 0.35s both;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255, 255, 255, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #ef4444;
          margin-bottom: 24px;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          animation: fadeUp 0.3s ease;
        }

        .footer-text {
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 28px;
          animation: fadeUp 0.6s ease 0.4s both;
          line-height: 1.6;
        }
      `}</style>

      <div className="admin-card">
        <div className="admin-icon">
          <Fingerprint size={32} />
        </div>
        <h2 className="admin-title">System Controller Login</h2>
        <p className="admin-subtitle">
          Multi-layer cryptographic verification required for root access.
        </p>

        <div className="step-indicator">
          <div className="step-item">
            <div
              className={`step-circle ${completedSteps.includes(1) ? "completed" : currentStep >= 1 ? "active" : ""}`}
            >
              {completedSteps.includes(1) ? <Check size={20} /> : "1"}
            </div>
            <div className={`step-label ${completedSteps.includes(1) ? "active" : ""}`}>
              SECRET KEY
            </div>
          </div>
          <div className={`step-line ${completedSteps.includes(1) ? "active" : ""}`} />
          <div className="step-item">
            <div
              className={`step-circle ${completedSteps.includes(2) ? "completed" : currentStep >= 2 ? "active" : ""}`}
            >
              {completedSteps.includes(2) ? <Check size={20} /> : "2"}
            </div>
            <div className={`step-label ${completedSteps.includes(2) ? "active" : ""}`}>
              EMAIL
            </div>
          </div>
          <div className={`step-line ${completedSteps.includes(2) ? "active" : ""}`} />
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 3 ? "active" : ""}`}>3</div>
            <div className={`step-label ${currentStep >= 3 ? "active" : ""}`}>
              PASSWORD
            </div>
          </div>
        </div>

        <form onSubmit={handleStepSubmit}>
          {error && (
            <div className="error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {currentStep === 1 && (
            <div className="input-wrapper">
              <label className="input-label">Boot Secret Key</label>
              <div className="input-group">
                <Key className="input-icon" />
                <input
                  type="password"
                  name="secretKey"
                  className="input-field"
                  placeholder="••••••••••••••••"
                  value={formData.secretKey}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="input-wrapper">
              <label className="input-label">Administrator Email</label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="admin@imboni.io"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="input-wrapper">
              <label className="input-label">Secure Password</label>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input-field"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <div
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {currentStep === 1 && "Verifying..."}
                {currentStep === 2 && "Verifying Email..."}
                {currentStep === 3 && "Authenticating..."}
              </>
            ) : (
              <>
                {currentStep === 1 && "Continue to Next Phase"}
                {currentStep === 2 && "Proceed to Authentication"}
                {currentStep === 3 && "Grant Access"}
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="footer-text">
          Only Authorized System Controllers Can Proceed
          <br />
          All Activity Is Encrypted and Logged in Real-Time
        </div>
      </div>
    </div>
  );
}
