import { DEVELOPMENT_ACCOUNTS } from "../../mock/users";
import { USER_ROLES, type AuthResult, type AuthService, type CurrentUser, type LoginCredentials, type SessionStore } from "./types";

const SESSION_KEY = "lokaria.mock-auth.session.v1";
const VALID_ROLES = new Set<string>(Object.values(USER_ROLES));

export const MOCK_AUTH_ENABLED = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";

function cloneUser(user: CurrentUser): CurrentUser {
  return { ...user };
}

function readUser(value: string | null): CurrentUser | null {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as Partial<CurrentUser>;
    if (
      typeof candidate.id !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.email !== "string" ||
      typeof candidate.avatar !== "string" ||
      typeof candidate.role !== "string" ||
      !VALID_ROLES.has(candidate.role)
    ) {
      return null;
    }
    return candidate as CurrentUser;
  } catch {
    return null;
  }
}

export function authenticateMockUser(credentials: LoginCredentials): AuthResult {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email || !password) {
    return { ok: false, code: "VALIDATION_ERROR", message: "Email dan kata sandi wajib diisi." };
  }

  const account = DEVELOPMENT_ACCOUNTS.find((item) => item.user.email === email && item.password === password);
  if (!account) {
    return { ok: false, code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." };
  }

  return { ok: true, user: cloneUser(account.user) };
}

export function persistMockUser(user: CurrentUser) {
  const storage = browserStorage();
  if (!storage) return false;
  storage.setItem(SESSION_KEY, JSON.stringify(user));
  return true;
}

type ServiceOptions = {
  enabled?: boolean;
  getStorage?: () => SessionStore | null;
  delayMs?: number;
};

const browserStorage = () => (typeof window === "undefined" ? null : window.sessionStorage);

export function createMockAuthService({ enabled = MOCK_AUTH_ENABLED, getStorage = browserStorage, delayMs = 350 }: ServiceOptions = {}): AuthService {
  return {
    async restore() {
      if (!enabled) return null;
      return readUser(getStorage()?.getItem(SESSION_KEY) ?? null);
    },

    async signIn(credentials) {
      if (!enabled) {
        return {
          ok: false,
          code: "AUTH_DISABLED",
          message: "Login demo dinonaktifkan pada versi produksi.",
        };
      }

      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
      const result = authenticateMockUser(credentials);
      if (!result.ok) return result;

      const storage = getStorage();
      if (!storage) {
        return {
          ok: false,
          code: "STORAGE_UNAVAILABLE",
          message: "Penyimpanan sesi browser tidak tersedia.",
        };
      }

      storage.setItem(SESSION_KEY, JSON.stringify(result.user));
      return result;
    },

    async signOut() {
      getStorage()?.removeItem(SESSION_KEY);
    },
  };
}

export const authService = createMockAuthService();
