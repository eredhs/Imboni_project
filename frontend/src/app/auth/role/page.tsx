'use client'

import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import ImboniLogo from '@/components/auth/ImboniLogo'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Users, UserSearch, Lock, Zap, Shield } from 'lucide-react'

export default function RoleSelectionScreen() {
  const router = useRouter()

  return (
    <AuthLayout showNavbar={true}>
      <style>{`
        .role-screen {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
          padding: 40px 20px;
        }

        .role-chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .role-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-align: center;
          max-width: 600px;
        }

        .role-title-o {
          display: inline-block;
          position: relative;
          margin: 0 4px;
          width: 1em;
          height: 1em;
          vertical-align: middle;
        }

        .role-subtitle {
          font-size: 16px;
          color: #94a3b8;
          text-align: center;
          max-width: 540px;
        }

        .role-cards-container {
          background: #131C2E;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 40px 32px;
          max-width: 1000px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .role-card {
          background: #1A2540;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .role-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .role-card.restricted {
          background: #0F1825;
          border-color: rgba(239, 68, 68, 0.12);
        }

        .role-card.restricted:hover {
          border-color: rgba(239, 68, 68, 0.25);
        }

        .role-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A2540;
          color: #94a3b8;
        }

        .role-card.restricted .role-icon {
          background: rgba(239, 68, 68, 0.1);
          color: rgba(239, 68, 68, 0.6);
        }

        .role-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }

        .role-card.restricted .role-card-title {
          color: rgba(255, 255, 255, 0.75);
        }

        .role-card-subtitle {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.65;
          flex-grow: 1;
        }

        .role-card.restricted .role-card-subtitle {
          color: rgba(255, 255, 255, 0.5);
        }

        .role-badge {
          display: inline-block;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: #EF4444;
          font-weight: 600;
          width: fit-content;
          margin-bottom: 8px;
        }

        .role-card-cta {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          transition: color 0.2s ease;
          cursor: pointer;
          font-weight: 600;
        }

        .role-card:hover .role-card-cta {
          color: #ffffff;
        }

        .role-card.restricted:hover .role-card-cta {
          color: #EF4444;
        }

        .role-cards-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 24px;
        }

        .role-avatars {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #94a3b8;
        }

        .avatar-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .role-footer-links {
          display: flex;
          gap: 24px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .role-screen {
            gap: 32px;
            padding: 20px 16px;
          }

          .role-cards-container {
            grid-template-columns: 1fr;
            padding: 24px 16px;
          }

          .role-card {
            padding: 24px;
          }

          .role-cards-footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .role-footer-links {
            justify-content: center;
          }
        }
      `}</style>

      <ScreenTransition>
        <div className="role-screen">
          <div className="role-chip anim-fade-up anim-delay-1">
            <span>✦</span>
            <span>Platform Entry Gateway</span>
          </div>

          <h1 className="role-title anim-fade-up anim-delay-2">
            How do you want to use
            <br />
            IMB
            <ImboniLogo size="sm" showTagline={false} inline={true} />
            NI?
          </h1>

          <p className="role-subtitle anim-fade-up anim-delay-3">
            Select your identity to access tailored intelligent recruitment tools
            and system protocols.
          </p>

          <div className="role-cards-container anim-fade-up anim-delay-4">
            {/* Recruiter/HR Card */}
            <div
              className="role-card"
              onClick={() => router.push('/auth/recruiter')}
            >
              <div className="role-icon">
                <Users size={28} />
              </div>
              <h3 className="role-card-title">Recruiter / HR</h3>
              <p className="role-card-subtitle">
                Build high-performance teams with deep talent intelligence and
                automated verification protocols.
              </p>
              <div className="role-card-cta">Enter Dashboard →</div>
            </div>

            {/* Job Seeker Card */}
            <div
              className="role-card"
              onClick={() => router.push('/auth/candidate')}
            >
              <div className="role-icon">
                <UserSearch size={28} />
              </div>
              <h3 className="role-card-title">Job Seeker</h3>
              <p className="role-card-subtitle">
                Connect with premier companies through an AI-driven matching
                engine designed to showcase your true potential.
              </p>
              <div className="role-card-cta">Enter Dashboard →</div>
            </div>

            {/* System Controller Card */}
            <div
              className="role-card restricted"
              onClick={() => router.push('/auth/admin')}
            >
              <div className="role-badge">Encrypted Access</div>
              <div className="role-icon">
                <Lock size={28} />
              </div>
              <h3 className="role-card-title">System Controller</h3>
              <p className="role-card-subtitle">
                Authorized access for platform maintenance, security audit, and
                core infrastructure management.
              </p>
              <div className="role-card-cta">Verify Credentials →</div>
            </div>
          </div>

          <div className="role-cards-footer anim-fade-up anim-delay-5">
            <div className="role-avatars">
              <div className="avatar-circle" />
              <div className="avatar-circle" />
              <div className="avatar-circle" />
              <span>Join 2,400+ Verified Professionals</span>
            </div>
            <div className="role-footer-links">
              <span>⚡ AI Powered</span>
              <span>🛡 Secure Protocol</span>
            </div>
          </div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
