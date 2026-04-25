'use client'

interface ImboniLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  inline?: boolean
}

export default function ImboniLogo({
  size = 'md',
  showTagline = true,
  inline = false,
}: ImboniLogoProps) {
  const sizes = {
    sm: { fontSize: 18, oSize: 16, gap: 1, dotSize: 3, scanHeight: 0.5, borderSize: 1 },
    md: { fontSize: 22, oSize: 20, gap: 2, dotSize: 4, scanHeight: 1, borderSize: 1.5 },
    lg: { fontSize: 72, oSize: 64, gap: 6, dotSize: 12, scanHeight: 2, borderSize: 3 },
  }

  const s = sizes[size]

  return (
    <div
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: inline ? 'row' : 'column',
        alignItems: 'center',
        gap: inline ? 2 : s.gap,
      }}
    >
      <style>{`
        .imboni-wordmark {
          display: flex;
          align-items: center;
          gap: ${s.gap}px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: ${size === 'lg' ? '6px' : '2px'};
          font-size: ${s.fontSize}px;
          line-height: 1;
        }

        .logo-o-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${s.oSize}px;
          height: ${s.oSize}px;
          flex-shrink: 0;
          margin: 0 ${s.gap}px;
        }

        .o-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: ${s.borderSize}px solid #ffffff;
          border-radius: 50%;
          border-right-color: transparent;
          transform: rotate(-20deg);
          transition: all 0.3s ease;
        }

        .imboni-wordmark:hover .o-ring {
          border-color: #10B981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }

        .o-dot {
          position: absolute;
          width: ${s.dotSize}px;
          height: ${s.dotSize}px;
          background: #10B981;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }

        .imboni-wordmark:hover .o-dot {
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        }

        .o-scan {
          position: absolute;
          width: 120%;
          height: ${s.scanHeight}px;
          background: #10B981;
          top: 50%;
          left: -10%;
          opacity: 0.5;
          transform: translateY(-50%);
          animation: scanPulse 2s infinite;
        }

        @keyframes scanPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .imboni-tagline {
          font-family: 'Inter', sans-serif;
          font-size: ${size === 'lg' ? '14px' : '10px'};
          letter-spacing: ${size === 'lg' ? '4px' : '2px'};
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
          text-align: center;
          margin-top: ${size === 'lg' ? '12px' : '4px'};
        }
      `}</style>

      <div className="imboni-wordmark">
        <span>IMB</span>
        <div className="logo-o-container">
          <div className="o-ring" />
          <div className="o-dot" />
          <div className="o-scan" />
        </div>
        <span>NI</span>
      </div>

      {showTagline && !inline && <div className="imboni-tagline">SEE BEYOND</div>}
    </div>
  )
}
