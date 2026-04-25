'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Key, Mail, Lock, Eye, EyeOff, AlertCircle, Fingerprint, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function AdminAuthScreen() {
  const router = useRouter()
  const { syncUserFromStorage } = useAuth()
  const [step, setStep] = useState(1)
  const [secretKey, setSecretKey] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleVerifyKey = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/admin/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        setError('Unauthorized System Controller credentials')
        setLoading(false)
        return
      }

      setCompletedSteps([...completedSteps, 1])
      setStep(2)
      setError('')
      setLoading(false)
    } catch (err) {
      setError('Verification failed. Please try again.')
      setLoading(false)
    }
  }

  const handleContinueToPassword = () => {
    if (!email) {
      setError('Email is required')
      return
    }
    setCompletedSteps([...completedSteps, 2])
    setStep(3)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'system_controller' }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError('Unauthorized System Controller credentials. This access attempt has been logged.')
        setLoading(false)
        return
      }

      // Store tokens with correct keys for auth context
      localStorage.setItem('talentlens_user', JSON.stringify(data.user))
      localStorage.setItem('talentlens_access_token', data.accessToken)
      localStorage.setItem('talentlens_refresh_token', data.refreshToken || '')
      syncUserFromStorage()

      setTimeout(() => {
        router.replace('/admin/dashboard')
      }, 300)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#080D18', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0, zIndex: 999999 }}>
      {/* Red Banner */}
      <div style={{ width: '100%', height: '40px', background: 'rgba(239, 68, 68, 0.08)', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EF4444' }}>
        🔴 RESTRICTED ACCESS ZONE
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
        <div style={{ background: '#131C2E', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          {/* Icon */}
          <div style={{ width: '56px', height: '56px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', margin: '0 auto 20px' }}>
            <Fingerprint size={28} />
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', textAlign: 'center', margin: '0 0 4px 0' }}>System Controller Login</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: '0 0 24px 0', lineHeight: 1.4 }}>Multi-layer cryptographic verification required for root access.</p>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid ' + (step > 1 ? '#10B981' : step >= 1 ? '#6366F1' : 'rgba(255, 255, 255, 0.15)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step > 1 ? '#10B981' : step >= 1 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', background: step > 1 ? 'rgba(16, 185, 129, 0.1)' : step >= 1 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)', fontSize: '13px', fontWeight: 600 }}>
                {step > 1 ? <Check size={18} /> : '1'}
              </div>
              <div style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: step > 1 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>SECRET KEY</div>
            </div>

            <div style={{ width: '12px', height: '1px', background: step > 1 ? '#6366F1' : 'rgba(255, 255, 255, 0.1)', margin: '0 3px' }} />

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid ' + (step > 2 ? '#10B981' : step >= 2 ? '#6366F1' : 'rgba(255, 255, 255, 0.15)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step > 2 ? '#10B981' : step >= 2 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', background: step > 2 ? 'rgba(16, 185, 129, 0.1)' : step >= 2 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)', fontSize: '13px', fontWeight: 600 }}>
                {step > 2 ? <Check size={18} /> : '2'}
              </div>
              <div style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: step > 2 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>EMAIL</div>
            </div>

            <div style={{ width: '12px', height: '1px', background: step > 2 ? '#6366F1' : 'rgba(255, 255, 255, 0.1)', margin: '0 3px' }} />

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid ' + (step >= 3 ? '#6366F1' : 'rgba(255, 255, 255, 0.15)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= 3 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', background: step >= 3 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)', fontSize: '13px', fontWeight: 600 }}>3</div>
              <div style={{ fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: step >= 3 ? '#6366F1' : 'rgba(255, 255, 255, 0.35)', textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap' }}>PASSWORD</div>
            </div>
          </div>

          {/* Error Box */}
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#EF4444', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Secret Key */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Boot Secret Key</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyKey()}
                    autoFocus
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px 14px 12px 40px', color: '#fff', fontSize: '13px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', transition: 'all 0.2s ease', margin: 0, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button
                onClick={handleVerifyKey}
                disabled={loading || !secretKey.trim()}
                style={{ width: '100%', background: '#fff', color: '#0B1220', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading || !secretKey.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading || !secretKey.trim() ? 0.6 : 1, transition: 'all 0.3s ease' }}
              >
                {loading ? 'Verifying...' : 'Continue to Next Phase'}
                <span>→</span>
              </button>
            </>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Administrator Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    placeholder="admin@imboni.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleContinueToPassword()}
                    autoFocus
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px 14px 12px 40px', color: '#fff', fontSize: '13px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', transition: 'all 0.2s ease', margin: 0, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button
                onClick={handleContinueToPassword}
                disabled={loading}
                style={{ width: '100%', background: '#fff', color: '#0B1220', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.6 : 1, transition: 'all 0.3s ease' }}
              >
                Proceed to Authentication
                <span>→</span>
              </button>
            </>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Secure Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px 14px 12px 40px', color: '#fff', fontSize: '13px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', transition: 'all 0.2s ease', margin: 0, boxSizing: 'border-box', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: '#fff', color: '#0B1220', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.6 : 1, transition: 'all 0.3s ease' }}
              >
                {loading ? 'Authenticating...' : 'Grant Access'}
                <span>→</span>
              </button>
            </form>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.3)', marginTop: '20px', lineHeight: 1.5 }}>
            Only Authorized System Controllers Can Proceed
            <br />
            All Activity Is Encrypted and Logged in Real-Time
          </div>
        </div>

        {/* Bottom Info */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '24px' }}>
          Having trouble?{' '}
          <a href="mailto:security@imboni.io" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Contact Security Operations</a>
        </div>
      </div>
    </div>
  )
}
