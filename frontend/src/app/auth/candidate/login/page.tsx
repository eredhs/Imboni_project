'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import AuthLayout from '@/components/auth/AuthLayout'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Mail, Lock, Eye, EyeOff, Github, Linkedin, AlertCircle } from 'lucide-react'

export default function CandidateAuthScreen() {
  const router = useRouter()
  const { syncUserFromStorage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'job_seeker',
          organization: profession.trim() || 'Individual',
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
        router.replace('/seeker/dashboard')
      }, 300)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'job_seeker' }),
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
        router.replace('/seeker/dashboard')
      }, 300)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout showNavbar={true}>
      <style>{`
        .candidate-screen {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px 20px;
        }

        .candidate-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .candidate-card {
          background: #131C2E;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 40px;
          max-width: 480px;
          width: 100%;
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

        .auth-input-wrapper {
          margin-bottom: 20px;
          position: relative;
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
        }

        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .auth-input:focus {
          outline: none;
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
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

        .auth-warning {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .auth-warning-icon {
          color: #10B981;
          flex-shrink: 0;
          margin-top: 2px;
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

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .auth-social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .auth-social-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          padding: 14px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .auth-social-button:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.04);
        }

        .candidate-footer {
          font-size: 13px;
          color: #94a3b8;
          text-align: center;
          margin-top: 24px;
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
          display: flex;
          gap: 8px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .candidate-screen {
            padding: 20px 16px;
          }

          .candidate-card {
            padding: 24px;
          }

          .candidate-title {
            font-size: 24px;
          }
        }
      `}</style>

      <ScreenTransition>
        <div className="candidate-screen">
          <h1 className="candidate-title">Candidate Portal</h1>

          <div className="candidate-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
              </button>
              <button
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {activeTab === 'signup' && (
              <form onSubmit={handleSignup}>
                <div className="auth-input-wrapper">
                  <div className="auth-label">Full Name</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <span>👤</span>
                    </div>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Alexander Thorne"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Professional Title</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <span>💼</span>
                    </div>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Frontend Developer"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-wrapper">
                  <div className="auth-label">Secure Password</div>
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

                <div className="auth-warning">
                  <div className="auth-warning-icon">✦</div>
                  <div>
                    Your profile powers intelligent job matching. By continuing,
                    you agree to our data sovereignty protocols.
                  </div>
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="auth-divider">OR VERIFY WITH</div>

                <div className="auth-social-buttons">
                  <button type="button" className="auth-social-button">
                    <Github size={16} /> Github
                  </button>
                  <button type="button" className="auth-social-button">
                    <Linkedin size={16} /> LinkedIn
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="auth-input-wrapper">
                  <div className="auth-label">Email</div>
                  <div style={{ position: 'relative' }}>
                    <div className="auth-input-icon">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="your@email.com"
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

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
          </div>

          <div className="candidate-footer">Access support & guidance</div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
