import type { ReactNode } from 'react'

export const metadata = {
  title: 'IMBONI - Intelligent Recruitment',
  description: 'See what others miss. Intelligent hiring platform powered by AI.',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
