import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    const response = await fetch(`${apiUrl}/api/auth/admin/verify-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey }),
    })

    const data = await response.json()

    return NextResponse.json({
      valid: data.valid || response.ok,
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { valid: false, message: 'Verification failed' },
      { status: 400 }
    )
  }
}
