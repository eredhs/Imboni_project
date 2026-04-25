const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

export const authAPI = {
  async login(email: string, password: string, role: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  async register(name: string, email: string, password: string, role: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return response.json()
  },

  async verifyAdminKey(secretKey: string) {
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'IMBONI-SYSTEM-2024'
    return { valid: secretKey === adminSecret }
  },

  logout() {
    localStorage.removeItem("talentlens_access_token")
    localStorage.removeItem("talentlens_refresh_token")
    localStorage.removeItem("talentlens_user")
  },
}
