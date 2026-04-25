'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Lock, CheckCircle2, Shield, Zap } from 'lucide-react'

export default function AdminVerifyScreen() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [biometricReady, setBiometricReady] = useState(false)
  const [encryptedTunnel, setEncryptedTunnel] = useState(false)

  useEffect(() => {
    // Simulate security check sequence
    const t1 = setTimeout(() => setBiometricReady(true), 800)
    const t2 = setTimeout(() => setEncryptedTunnel(true), 1400)
    const t3 = setTimeout(() => {
      setIsLoading(false)
      setProgress(100)
    }, 2000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, router])

  return (
    <AuthLayout showNavbar={true}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lockSpin { 0% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } 100% { transform: rotate(-5deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes progress { 0% { width: 0%; } 100% { width: var(--progress, 100%); } }

        .verify-screen { width: 100%; background: #080D18; position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; z-index: 1; }
        .verify-content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 20px 80px; animation: slideUp 0.6s ease; }
        .verify-card { text-align: center; max-width: 600px; width: 100%; }

        .verify-lock { width: 100px; height: 100px; background: rgba(99, 102, 241, 0.15); border: 2px solid rgba(99, 102, 241, 0.3); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: #6366F1; margin: 0 auto 32px; animation: slideUp 0.6s ease, lockSpin 2s ease-in-out infinite; animation-play-state: running; }

        .verify-protocol { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 24px; animation: slideUp 0.6s ease 0.1s both; }
        .verify-protocol span { display: flex; align-items: center; gap: 6px; }

        .verify-title { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 16px; animation: slideUp 0.6s ease 0.15s both; }
        .verify-subtitle { font-size: 16px; color: #94a3b8; margin-bottom: 40px; line-height: 1.6; animation: slideUp 0.6s ease 0.2s both; }

        .verify-statuses { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .status-item { display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; font-size: 13px; animation: slideUp 0.6s ease both; }
        .status-item.ready { border-color: rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.05); animation-delay: 0.25s; }
        .status-item.encrypted { border-color: rgba(99, 102, 241, 0.2); background: rgba(99, 102, 241, 0.05); animation-delay: 0.35s; }
        .status-item.disabled { opacity: 0.4; }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); animation: pulse 2s ease-in-out infinite; }
        .status-dot.active { background: #10B981; animation: pulse 1.5s ease-in-out infinite; }

        .status-text { color: #94a3b8; flex: 1; }
        .status-text.ready { color: #10B981; }
        .status-text.encrypted { color: #6366F1; }

        .verify-warning { color: rgba(255, 255, 255, 0.3); font-size: 11px; letter-spacing: 0.05em; line-height: 1.6; margin-bottom: 24px; text-transform: uppercase; }

        .progress-bar { width: 100%; height: 2px; background: rgba(255, 255, 255, 0.05); border-radius: 1px; overflow: hidden; margin-bottom: 16px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #6366F1, #10B981); width: 0%; transition: width 0.3s ease; }

        .verify-footer { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255, 255, 255, 0.2); animation: fadeIn 0.6s ease 0.5s both; }

        @media (max-width: 768px) {
          .verify-card { max-width: 100%; }
          .verify-lock { width: 80px; height: 80px; }
          .verify-title { font-size: 24px; }
          .verify-subtitle { font-size: 14px; }
        }
      `}</style>

      <ScreenTransition>
        <div className="verify-screen">
          <div className="verify-content">
            <div className="verify-card">
              <div className="verify-lock" style={{ animationPlayState: isLoading ? 'running' : 'paused' }}>
                <Lock size={48} />
              </div>

              <div className="verify-protocol">
                <span>⏱ INTERNAL SECURITY PROTOCOL</span>
              </div>

              <h2 className="verify-title">Restricted System Access</h2>
              <p className="verify-subtitle">All access is monitored and logged in the<br />IMBONI ledger.</p>

              <div className="verify-statuses">
                <div className={`status-item ${biometricReady ? 'ready' : 'disabled'}`}>
                  <div className={`status-dot ${biometricReady ? 'active' : ''}`} />
                  <span className="status-text">🔓 BIOMETRIC READY</span>
                </div>
                <div className={`status-item ${encryptedTunnel ? 'encrypted' : 'disabled'}`}>
                  <div className={`status-dot ${encryptedTunnel ? 'active' : ''}`} />
                  <span className="status-text">🔐 ENCRYPTED TUNNEL</span>
                </div>
              </div>

              <div className="verify-warning">
                Unauthorized access attempts are prohibited.<br />
                Your IP address and machine signature have been recorded.
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="verify-footer">
                {isLoading ? 'Initializing secure access...' : 'Access granted. Redirecting...'}
              </div>
            </div>
          </div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
