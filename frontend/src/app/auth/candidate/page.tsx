'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Heart } from 'lucide-react'

export default function CandidateTransitionScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/candidate/login')
    }, 3500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <AuthLayout showNavbar={true}>
      <style>{`
        .transition-screen {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        .transition-watermark {
          position: absolute;
          left: -50px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-size: 200px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.04);
          white-space: nowrap;
          letter-spacing: -0.02em;
          z-index: 0;
          pointer-events: none;
        }

        .transition-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          text-align: center;
        }

        .transition-line {
          font-size: 32px;
          font-weight: 400;
          color: #94a3b8;
          line-height: 1.4;
          min-height: 48px;
          transition: opacity 0.4s ease;
          max-width: 600px;
        }

        .transition-line.primary {
          color: #ffffff;
          font-weight: 700;
        }

        .transition-note {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 500px;
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.6;
        }

        .transition-note-icon {
          color: #10B981;
          flex-shrink: 0;
        }

        .transition-button {
          background: #ffffff;
          color: #0B1220;
          border: none;
          padding: 16px 40px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          margin-top: 24px;
        }

        .transition-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .transition-watermark {
            font-size: 120px;
          }

          .transition-line {
            font-size: 24px;
          }

          .transition-content {
            gap: 24px;
          }
        }
      `}</style>

      <ScreenTransition>
        <div className="transition-screen">
          <div className="transition-watermark">SEEKER</div>

          <div className="transition-content">
            <div
              className="transition-line anim-fade-up anim-delay-1"
              style={{
                color: '#94a3b8',
                animation: 'fadeUp 0.6s ease both',
                animationDelay: '0.15s',
              }}
            >
              You are looking for opportunity
            </div>

            <div
              className="transition-line primary anim-fade-up anim-delay-2"
              style={{
                color: '#ffffff',
                fontWeight: 700,
                animation: 'fadeUp 0.6s ease both',
                animationDelay: '0.3s',
              }}
            >
              We match you intelligently
            </div>

            <div
              className="transition-line anim-fade-up anim-delay-3"
              style={{
                color: '#94a3b8',
                animation: 'fadeUp 0.6s ease both',
                animationDelay: '0.45s',
              }}
            >
              Your profile speaks for itself
            </div>

            <div
              className="transition-note anim-fade-up anim-delay-4"
              style={{
                animation: 'fadeUp 0.6s ease both',
                animationDelay: '0.6s',
              }}
            >
              <div className="transition-note-icon">
                <Heart size={20} />
              </div>
              <div>
                Your skills and experience power an intelligent matching engine
                that surfaces you to the right employers.
              </div>
            </div>

            <button
              className="transition-button anim-fade-up anim-delay-5"
              onClick={() => router.push('/auth/candidate/login')}
              style={{
                animation: 'fadeUp 0.6s ease both',
                animationDelay: '0.75s',
              }}
            >
              Access Candidate Portal →
            </button>
          </div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
