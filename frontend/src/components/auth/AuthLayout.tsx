'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import ImboniLogo from './ImboniLogo'
import { Shield } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  showNavbar?: boolean
}

export default function AuthLayout({ children, showNavbar = true }: AuthLayoutProps) {
  const router = useRouter()

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          background: #0B1220;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .auth-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: rgba(11, 18, 32, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 1000;
        }

        .auth-navbar-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }

        .auth-navbar-back {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .auth-navbar-back:hover {
          color: #ffffff;
        }

        .auth-navbar-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .auth-navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: flex-end;
        }

        .auth-navbar-shield {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10B981;
        }

        .auth-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: auto;
          background: rgba(11, 18, 32, 0.7);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }

        .auth-footer-right {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .auth-footer-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
        }

        .auth-content {
          min-height: 100vh;
          padding-top: 64px;
          padding-bottom: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .auth-navbar {
            padding: 0 20px;
            height: 56px;
          }

          .auth-navbar-left {
            gap: 16px;
          }

          .auth-footer {
            padding: 12px 20px;
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .auth-footer-right {
            width: 100%;
            justify-content: center;
            gap: 12px;
          }

          .auth-footer-divider {
            display: none;
          }

          .auth-content {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>

      {showNavbar && (
        <nav className="auth-navbar">
          <div className="auth-navbar-left">
            <button
              className="auth-navbar-back"
              onClick={() => router.back()}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ← Back
            </button>
          </div>

          <div className="auth-navbar-center">
            <ImboniLogo size="md" showTagline={false} />
          </div>

          <div className="auth-navbar-right">
            <div className="auth-navbar-shield">
              <Shield size={20} strokeWidth={2} />
            </div>
          </div>
        </nav>
      )}

      <div className="auth-content">{children}</div>

      <footer className="auth-footer">
        <div>© 2026 IMBONI INTELLIGENCE</div>
        <div className="auth-footer-right">
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
            Privacy Protocol
          </a>
          <div className="auth-footer-divider" />
          <div>System Status: Optimal</div>
        </div>
      </footer>
    </>
  )
}
