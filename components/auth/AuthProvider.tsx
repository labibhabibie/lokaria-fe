"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthChangeEvent,
  Session,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import {
  authService,
  MOCK_AUTH_ENABLED,
  persistMockUser,
} from "@/lib/auth/mock-auth-service";
import { USER_ROLES, type UserRole } from "@/lib/auth/types";
import type {
  ActionResult,
  AuthResult,
  CurrentUser,
  LoginCredentials,
  ProfileUpdate,
  SignUpCredentials,
  SignUpResult,
} from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthStatus = "loading" | "anonymous" | "authenticated";

type AuthContextValue = {
  user: CurrentUser | null;
  status: AuthStatus;
  supabaseEnabled: boolean;
  login(credentials: LoginCredentials): Promise<AuthResult>;
  signUp(credentials: SignUpCredentials): Promise<SignUpResult>;
  loginWithGoogle(): Promise<ActionResult>;
  updateProfile(input: ProfileUpdate): Promise<ActionResult>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const roles = new Set<string>(Object.values(USER_ROLES));

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "LK";
}

async function mapSupabaseUser(user: User): Promise<CurrentUser> {
  const supabase = createClient();
  const { data: profile } = supabase
    ? await supabase
        .from("profiles")
        .select("name, avatar_url, role")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  const metadata = user.user_metadata ?? {};
  const name =
    profile?.name ||
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0] ||
    "Lokaria User";
  const role = roles.has(profile?.role)
    ? (profile.role as UserRole)
    : USER_ROLES.CUSTOMER;

  return {
    id: user.id,
    name,
    email: user.email ?? "",
    role,
    avatar: initials(name),
    avatarUrl: profile?.avatar_url || metadata.avatar_url || metadata.picture,
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const initialize = async () => {
      const restoredMock = await authService.restore();
      if (!active) return;
      if (restoredMock) {
        setUser(restoredMock);
        setStatus("authenticated");
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setStatus("anonymous");
        return;
      }

      const { data }: UserResponse = await supabase.auth.getUser();
      if (!active) return;
      const mapped = data.user ? await mapSupabaseUser(data.user) : null;
      if (!active) return;
      setUser(mapped);
      setStatus(mapped ? "authenticated" : "anonymous");

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          window.setTimeout(async () => {
            if (!active) return;
            const nextUser = session?.user
              ? await mapSupabaseUser(session.user)
              : null;
            if (!active) return;
            setUser(nextUser);
            setStatus(nextUser ? "authenticated" : "anonymous");
          }, 0);
        },
      );
      unsubscribe = () => listener.subscription.unsubscribe();
    };

    void initialize();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      supabaseEnabled: isSupabaseConfigured,
      async login(credentials) {
        const isDemo = credentials.email.trim().toLowerCase().endsWith("@lokaria.test");
        if (!isSupabaseConfigured || (MOCK_AUTH_ENABLED && isDemo)) {
          const result = await authService.signIn(credentials);
          if (result.ok) {
            setUser(result.user);
            setStatus("authenticated");
          }
          return result;
        }

        const supabase = createClient();
        if (!supabase) {
          return { ok: false, code: "AUTH_DISABLED", message: "Supabase is not configured." };
        }
        await authService.signOut();
        const { data, error } = await supabase.auth.signInWithPassword(credentials);
        if (error || !data.user) {
          return {
            ok: false,
            code: "INVALID_CREDENTIALS",
            message: error?.message ?? "Unable to sign in.",
          };
        }
        const mapped = await mapSupabaseUser(data.user);
        setUser(mapped);
        setStatus("authenticated");
        return { ok: true, user: mapped };
      },
      async signUp(credentials) {
        const supabase = createClient();
        if (!supabase) {
          return {
            ok: false,
            message: "Fill the Supabase URL and publishable key in .env.local first.",
          };
        }
        await authService.signOut();
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: { full_name: credentials.name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/explore`,
          },
        });
        if (error) return { ok: false, message: error.message };
        const requiresConfirmation = !data.session;
        return {
          ok: true,
          requiresConfirmation,
          message: requiresConfirmation
            ? "Check your email to confirm the account."
            : "Account created successfully.",
        };
      },
      async loginWithGoogle() {
        const supabase = createClient();
        if (!supabase) {
          return {
            ok: false,
            message: "Fill the Supabase env values before using Google sign-in.",
          };
        }
        await authService.signOut();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${siteUrl}/auth/callback?next=/explore` },
        });
        return error ? { ok: false, message: error.message } : { ok: true };
      },
      async updateProfile(input) {
        const name = input.name.trim();
        if (!user || !name) return { ok: false, message: "Name is required." };
        if (input.photo && input.photo.size > 2 * 1024 * 1024) {
          return { ok: false, message: "Profile photo must be smaller than 2 MB." };
        }

        const supabase = createClient();
        if (!supabase || user.id.startsWith("dev-")) {
          const avatarUrl = input.photo ? await fileToDataUrl(input.photo) : user.avatarUrl;
          const updated = { ...user, name, avatar: initials(name), avatarUrl };
          if (!persistMockUser(updated)) {
            return { ok: false, message: "Browser session storage is unavailable." };
          }
          setUser(updated);
          return { ok: true, message: "Profile updated in this browser session." };
        }

        let avatarUrl = user.avatarUrl;
        if (input.photo) {
          const extension = input.photo.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${user.id}/avatar-${Date.now()}.${extension}`;
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, input.photo, { upsert: true });
          if (uploadError) return { ok: false, message: uploadError.message };
          avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ name, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
          .eq("id", user.id);
        if (error) return { ok: false, message: error.message };
        await supabase.auth.updateUser({ data: { full_name: name, avatar_url: avatarUrl } });
        setUser({ ...user, name, avatar: initials(name), avatarUrl });
        return { ok: true, message: "Profile updated." };
      },
      async logout() {
        const supabase = createClient();
        if (supabase && user && !user.id.startsWith("dev-")) {
          await supabase.auth.signOut();
        }
        await authService.signOut();
        setUser(null);
        setStatus("anonymous");
      },
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
