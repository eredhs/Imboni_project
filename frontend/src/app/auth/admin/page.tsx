'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGateScreen() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth/admin/login')
  }, [])

  return null
}
