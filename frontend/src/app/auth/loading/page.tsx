'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'

export default function LoadingScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('talentlens_user')
      const legacyRole = localStorage.getItem('imboni_role')
      let role: string | null = legacyRole

      if (storedUser) {
        try {
          role = JSON.parse(storedUser)?.role ?? legacyRole
        } catch {
          role = legacyRole
        }
      }
      
      if (role === 'recruiter') {
        router.push('/dashboard')
      } else if (role === 'job_seeker') {
        router.push('/seeker/dashboard')
      } else if (role === 'system_controller') {
        router.push('/admin/dashboard')
      } else {
        router.push('/auth')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <style>{`
        body {
          background: #0B1220;
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .loading-screen {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0B1220;
          gap: 32px;
        }

        .loading-icon {
          width: 80px;
          height: 80px;
          background: rgba(99, 102, 241, 0.7);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          animation: pulseScale 3s infinite ease-in-out;
        }

        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 0 0 12px rgba(99, 102, 241, 0);
          }
        }

        .eye-icon {
          width: 40px;
          height: 40px;
          animation: eyeBlink 3s infinite;
        }

        @keyframes eyeBlink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }

        .loading-text {
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          text-align: center;
        }

        .loading-underline {
          width: 0;
          height: 2px;
          background: #10B981;
          border-radius: 1px;
          margin-top: 12px;
          animation: expandWidth 1.5s ease forwards;
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 120px;
          }
        }
      `}</style>

      <div className="loading-screen">
        <div className="loading-icon">
          <Eye className="eye-icon" size={40} />
        </div>

        <div>
          <div className="loading-text">Preparing Your Workspace</div>
          <div className="loading-underline" />
        </div>
      </div>
    </>
  )
}
