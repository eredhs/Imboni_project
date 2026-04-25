'use client'

import { ReactNode } from 'react'

interface ScreenTransitionProps {
  children: ReactNode
  delay?: number
}

export default function ScreenTransition({ children, delay = 0 }: ScreenTransitionProps) {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scanPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(0);
          }
          50% {
            opacity: 0.8;
            transform: scaleX(1);
          }
        }

        @keyframes eyeBlink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }

        .screen-enter {
          animation: fadeUp 0.45s ease both;
          animation-delay: ${delay}ms;
        }

        .anim-fade-up {
          animation: fadeUp 0.6s ease both;
        }

        .anim-fade-in {
          animation: fadeIn 0.5s ease both;
        }

        .anim-delay-1 {
          animation-delay: 0.15s;
        }

        .anim-delay-2 {
          animation-delay: 0.3s;
        }

        .anim-delay-3 {
          animation-delay: 0.45s;
        }

        .anim-delay-4 {
          animation-delay: 0.6s;
        }

        .anim-delay-5 {
          animation-delay: 0.75s;
        }

        @media (max-width: 768px) {
          .anim-delay-1 {
            animation-delay: 0.1s;
          }
          .anim-delay-2 {
            animation-delay: 0.2s;
          }
          .anim-delay-3 {
            animation-delay: 0.3s;
          }
          .anim-delay-4 {
            animation-delay: 0.4s;
          }
          .anim-delay-5 {
            animation-delay: 0.5s;
          }
        }
      `}</style>
      <div className="screen-enter">{children}</div>
    </>
  )
}
