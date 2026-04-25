'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import AuthLayout from '@/components/auth/AuthLayout'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react'

const rwandaDistricts = [
  "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare",
  "Rwamagana", "Nyaruguru", "Nyungwe", "Ruhango", "Huye", "Gisagara",
  "Nyamagabe", "Karongi", "Rutsiro", "Rubavu", "Nyabihu", "Gakenke",
  "Kigali City - Gasabo", "Kigali City - Kicukiro", "Kigali City - Nyarugenge"
]

export default function RecruiterAuthScreen() {
  const router = useRouter()
  const { syncUserFromStorage } = useAuth()
  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  // Signup state
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [location, setLocation] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  // Form state
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'recruiter' }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('talentlens_access_token', data.accessToken)
      localStorage.setItem('talentlens_refresh_token', data.refreshToken || '')
      localStorage.setItem('talentlens_user', JSON.stringify(data.user))
      syncUserFromStorage()

      setTimeout(() => {
        router.replace('/dashboard')
      }, 300)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms & Conditions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          organization,
          email: signupEmail,
          password: signupPassword,
          location,
          role: 'recruiter'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      localStorage.setItem('talentlens_access_token', data.accessToken)
      localStorage.setItem('talentlens_refresh_token', data.refreshToken || '')
      localStorage.setItem('talentlens_user', JSON.stringify(data.user))
      syncUserFromStorage()

      setTimeout(() => {
        router.replace('/dashboard')
      }, 300)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout showNavbar={true}>
      <style>{`
        .auth-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 1200px;
          gap: 60px;
          padding: 40px;
        }

        .auth-form-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 480px;
        }

        .auth-info-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 500px;
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 32px;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #1A2540;
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 32px;
          gap: 4px;
        }

        .auth-tab {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .auth-tab.active {
          background: #ffffff;
          color: #0B1220;
        }

        .auth-form-group {
          margin-bottom: 20px;
        }

        .auth-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .auth-input {
          width: 100%;
          background: #1A2540;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 14px 16px 14px 44px;
          color: #ffffff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          position: relative;
        }

        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .auth-input:focus {
          outline: none;
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .auth-input-wrapper {
          position: relative;
          margin-bottom: 20px;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .auth-input-action {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s ease;
        }

        .auth-input-action:hover {
          color: #ffffff;
        }

        .auth-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 12px;
        }

        .auth-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          cursor: pointer;
        }

        .auth-checkbox input {
          cursor: pointer;
          width: 16px;
          height: 16px;
        }

        .auth-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .auth-button {
          width: 100%;
          background: #ffffff;
          color: #0B1220;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          margin-bottom: 16px;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-security {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #EF4444;
          margin-bottom: 16px;
          text-align: center;
        }

        .auth-info-icon {
          width: 56px;
          height: 56px;
          background: #1A2540;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10B981;
          flex-shrink: 0;
        }

        .auth-info-title {
          font-size: 36px;
          font-weight: 800;
          line-height: 1.1;
          margin: 24px 0 16px 0;
        }

        .auth-info-description {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .auth-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 24px 0;
        }

        .auth-verification-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .auth-verification-icon {
          color: #94a3b8;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .auth-verification-heading {
          font-weight: 600;
          color: #ffffff;
        }

        .auth-verification-text {
          color: #94a3b8;
        }

        .auth-note-box {
          background: #1A2540;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          font-size: 12px;
        }

        .auth-note-icon {
          flex-shrink: 0;
          color: #94a3b8;
        }

        .auth-note-heading {
          font-weight: 600;
          color: #ffffff;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .auth-note-text {
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .auth-split {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 20px;
          }

          .auth-info-column {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .auth-split {
            padding: 16px;
          }

          .auth-form-column {
            max-width: 100%;
          }
        }
      `}</style>

      <ScreenTransition>
        <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '24px' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#94a3b8] transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Landing Page
          </Link>
        </div>
        <div className="auth-split">
          {/* LEFT: Form */}
          <div className="auth-form-column">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Access your dashboard to continue talent evaluation.
            </p>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="auth-input-wrapper">
                  <div className="auth-label">Work Email</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Password</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      className="auth-input-action"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="auth-row">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                    />
                    Remember Device
                  </label>
                  <a href="#" className="auth-link">
                    Recovery Key?
                  </a>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In to Platform →'}
                </button>

                <div className="auth-security">Secured by IMBONI Advanced Intelligence</div>
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                  ● ● ●
                </div>
              </form>
            )}

            {activeTab === 'signup' && (
              <form onSubmit={handleSignup}>
                <div className="auth-input-wrapper">
                  <div className="auth-label">Full Name</div>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ paddingLeft: '16px' }}
                  />
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Organization</div>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Company or hiring team"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    style={{ paddingLeft: '16px' }}
                  />
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Email Address</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="you@company.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Use a different email for every recruiter account
                  </div>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Location</div>
                  <select
                    className="auth-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{ paddingLeft: '16px' }}
                  >
                    <option value="">Select your district</option>
                    {rwandaDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Password</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <div
                      className="auth-input-action"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Use at least 8 characters
                  </div>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Confirm Password</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div
                      className="auth-input-action"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </div>
                  </div>
                </div>

                <label className="auth-checkbox" style={{ marginBottom: '24px', marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    I agree to the{' '}
                    <span style={{ color: '#10B981', fontWeight: 600 }}>
                      Terms & Conditions
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Recruiter Account →'}
                </button>

                <div className="auth-security">Secured by IMBONI Advanced Intelligence</div>
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                  ● ● ●
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="auth-info-column">
            <div className="auth-info-icon">
              <ShieldCheck size={32} />
            </div>

            <h2 className="auth-info-title">
              <span style={{ color: '#ffffff' }}>Company</span>
              <br />
              <span style={{ color: '#94a3b8' }}>Verification Required.</span>
            </h2>

            <p className="auth-info-description">
              IMBONI maintains the highest level of platform integrity. Our manual
              review process ensures a secure environment for top-tier talent.
            </p>

            <div className="auth-divider" />

            <div className="auth-verification-item">
              <div className="auth-verification-icon">○</div>
              <div>
                <div className="auth-verification-heading">Enterprise Review:</div>
                <div className="auth-verification-text">
                  All registered companies undergo a 12-point manual verification
                  check.
                </div>
              </div>
            </div>

            <div className="auth-verification-item">
              <div className="auth-verification-icon">○</div>
              <div>
                <div className="auth-verification-heading">Auto-Suspension:</div>
                <div className="auth-verification-text">
                  Unverified or suspicious accounts are automatically flagged and
                  removed within 24 hours.
                </div>
              </div>
            </div>

            <div className="auth-verification-item">
              <div className="auth-verification-icon">○</div>
              <div>
                <div className="auth-verification-heading">Deep Integrity:</div>
                <div className="auth-verification-text">
                  Platform integrity is enforced via AI-driven anomaly detection
                  in hiring patterns.
                </div>
              </div>
            </div>

            <div className="auth-note-box">
              <div className="auth-note-icon">ℹ</div>
              <div>
                <div className="auth-note-heading">NOTE TO RECRUITERS</div>
                <div className="auth-note-text">
                  Please ensure your business email matches your company domain.
                  Public providers (Gmail/Outlook) may require additional
                  documentation for approval.
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
