// Auth context for persistent user state
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "recruiter" | "job_seeker" | "system_controller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  location?: string;
  companyName?: string;
  profession?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (
    data: Partial<User> & { password: string; confirmPassword: string }
  ) => Promise<boolean>;
  logout: () => void;
  syncUserFromStorage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organization?: string;
  };
  accessToken: string;
  refreshToken: string;
};

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const API_BASE_URL = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

function hydrateUser(user: AuthResponse["user"]): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    location: (user as any).location,
    companyName: user.role === "recruiter" ? user.organization : undefined,
    profession: user.role === "job_seeker" ? user.organization : undefined,
  };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message) ||
      (data &&
        typeof data === "object" &&
        "error" in data &&
        typeof data.error === "string" &&
        data.error) ||
      "Request failed";

    throw new Error(message);
  }

  return data as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("talentlens_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user from localStorage:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const syncUserFromStorage = () => {
    const storedUser = localStorage.getItem("talentlens_user");
    if (!storedUser) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Failed to sync user from localStorage:", error);
      setUser(null);
    }
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });
      const result = await parseApiResponse<AuthResponse>(response);

      if (result.user.role !== role) {
        throw new Error(
          role === "system_controller"
            ? "Unauthorized System Controller credentials"
            : `This account is registered as ${result.user.role.replaceAll("_", " ")}.`
        );
      }

      const userData = hydrateUser(result.user);
      setUser(userData);
      localStorage.setItem("talentlens_user", JSON.stringify(userData));
      localStorage.setItem("talentlens_access_token", result.accessToken);
      localStorage.setItem("talentlens_refresh_token", result.refreshToken);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    data: Partial<User> & { password: string; confirmPassword: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!data.email || !data.name || !data.password) {
        throw new Error("Missing required fields");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const role = data.role || "job_seeker";
      const organization =
        role === "recruiter"
          ? data.companyName?.trim()
          : data.profession?.trim() || "Individual";

      if (!organization) {
        throw new Error(
          role === "recruiter" ? "Company name is required" : "Professional title is required"
        );
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          organization,
          role,
        }),
      });
      const result = await parseApiResponse<AuthResponse>(response);

      const newUser: User = {
        ...hydrateUser(result.user),
        ...(role === "recruiter" && { companyName: data.companyName }),
        ...(role === "job_seeker" && {
          profession: data.profession,
          location: data.location,
        }),
      };

      setUser(newUser);
      localStorage.setItem("talentlens_user", JSON.stringify(newUser));
      localStorage.setItem("talentlens_access_token", result.accessToken);
      localStorage.setItem("talentlens_refresh_token", result.refreshToken);

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("talentlens_user");
    localStorage.removeItem("talentlens_access_token");
    localStorage.removeItem("talentlens_refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, syncUserFromStorage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
