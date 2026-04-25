'use client'

import Link from 'next/link'
import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'dark' | 'light'
  showTagline?: boolean
}

export default function Logo({
  size = 'md',
  theme = 'dark',
  showTagline = true
}: LogoProps) {

  const [isHovered, setIsHovered] = useState(false)

  const sizes = {
    sm: { text: 24, tagline: 12 },
    md: { text: 40, tagline: 14 },
    lg: { text: 64, tagline: 16 },
  }

  const s = sizes[size]

  return (
    <Link
      href="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        .imboni-logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: transform 0.3s ease;
        }

        .imboni-logo-container:hover {
          transform: scale(1.02);
        }

        .imboni-wordmark {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 5px;
          line-height: 1;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .hidden-o {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1em;
          height: 1em;
          flex-shrink: 0;
        }

        .hidden-o::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid #ffffff;
          border-radius: 50%;
          border-right-color: transparent;
          transform: rotate(-20deg);
          transition: border-color 0.3s ease;
        }

        .hidden-o::after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background: #10B981;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .imboni-logo-container:hover .hidden-o::after {
          width: 14px;
          height: 14px;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .scan {
          position: absolute;
          width: 120%;
          height: 2px;
          background: #10B981;
          top: 50%;
          left: -10%;
          opacity: 0.5;
          animation: scan 2s infinite;
        }

        @keyframes scan {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .imboni-tagline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          letter-spacing: 4px;
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .imboni-wordmark {
            letter-spacing: 3px;
          }
          .imboni-tagline {
            letter-spacing: 2px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="imboni-logo-container">
        {/* IMBONI Text with Custom O */}
        <div className="imboni-wordmark" style={{ fontSize: s.text }}>
          <span>IMB</span>
          <div className="hidden-o">
            <div className="scan"></div>
          </div>
          <span>NI</span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className="imboni-tagline">
            SEE BEYOND
          </div>
        )}
      </div>
    </Link>
  )
}
