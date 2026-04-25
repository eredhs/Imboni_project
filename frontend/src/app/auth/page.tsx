'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import ImboniLogo from '@/components/auth/ImboniLogo'
import ScreenTransition from '@/components/auth/ScreenTransition'
import { Users, UserSearch, Lock, Zap, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

        .role-back-link {
          width: 100%;
          max-width: 1200px;
          margin-bottom: 24px;
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
        }

        .role-title-o::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 3px;
          background: #10B981;
          border-radius: 2px;
        }

        .role-subtitle {
          font-size: 16px;
          color: #94a3b8;
          text-align: center;
          max-width: 500px;
        }

        .role-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        .role-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 24px;
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .role-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-4px);
        }
        
        @media (max-width: 1024px) {
          .role-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 640px) {
          .role-cards {
            grid-template-columns: 1fr;
          }
        }

        .role-card-icon {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #10B981;
        }

        .role-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .role-card-desc {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .role-card-button {
          width: 100%;
          padding: 12px 16px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .role-card-button:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .role-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <ScreenTransition>
        <div className="role-back-link">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#94a3b8] transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Landing Page
          </Link>
        </div>

        <div className="role-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="role-chip">
              <Zap size={14} />
              Platform Entry Gateway
            </div>
          </div>

          <h1 className="role-title">
            How do you want to use <span className="role-title-o">IMBONI</span>?
          </h1>

          <p className="role-subtitle">
            Select your identity to access tailored intelligent recruitment tools and system protocols.
          </p>

          <div className="role-cards">
            <div className="role-card" onClick={() => router.push('/auth/recruiter/login')}>
              <div className="role-card-icon">
                <Users size={28} />
              </div>
              <h3 className="role-card-title">Recruiter / HR</h3>
              <p className="role-card-desc">
                Build high-performance teams with deep talent intelligence and automated verification protocols.
              </p>
              <button className="role-card-button">
                ENTER DASHBOARD →
              </button>
            </div>

            <div className="role-card" onClick={() => router.push('/auth/candidate/login')}>
              <div className="role-card-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                <UserSearch size={28} />
              </div>
              <h3 className="role-card-title">Job Seeker</h3>
              <p className="role-card-desc">
                Connect with premier companies through an AI-driven matching engine designed to showcase your true potential.
              </p>
              <button className="role-card-button" style={{ background: '#22c55e' }}>
                ENTER DASHBOARD →
              </button>
            </div>

            <div className="role-card" onClick={() => router.push('/auth/admin/login')}>
              <div className="role-card-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                <Lock size={28} />
              </div>
              <h3 className="role-card-title">System Controller</h3>
              <p className="role-card-desc">
                Authorized access for platform maintenance, security audit, and core infrastructure management.
              </p>
              <button className="role-card-button" style={{ background: '#f97316' }}>
                VERIFY CREDENTIALS →
              </button>
            </div>
          </div>
        </div>
      </ScreenTransition>
    </AuthLayout>
  )
}
