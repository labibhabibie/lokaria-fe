"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { MOCK_AUTH_ENABLED } from "@/lib/auth/mock-auth-service";
import { getHomeRoute, roleLabel } from "@/lib/auth/routes";
import type { LoginCredentials } from "@/lib/auth/types";
import { DEVELOPMENT_ACCOUNTS, type DevelopmentAccount } from "@/mock/users";
import { useAuth } from "./AuthProvider";

type Mode = "signin" | "signup";
type FieldErrors = { name?: string; email?: string; password?: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode: Mode, name: string, credentials: LoginCredentials) {
  const errors: FieldErrors = {};
  if (mode === "signup" && !name.trim()) errors.name = "Name is required.";
  if (!credentials.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL.test(credentials.email.trim())) errors.email = "Enter a valid email address.";
  if (!credentials.password) errors.password = "Password is required.";
  else if (mode === "signup" && credentials.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }
  return errors;
}

export function LoginPage() {
  const router = useRouter();
  const {
    login,
    loginWithGoogle,
    signUp,
    status,
    supabaseEnabled,
    user,
  } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");

  useEffect(() => {
    if (status === "authenticated" && user) router.replace(getHomeRoute(user.role));
  }, [router, status, user]);

  const resetMessage = () => {
    setErrors({});
    setMessage("");
  };

  const attemptLogin = async (credentials: LoginCredentials) => {
    const nextErrors = validate("signin", "", credentials);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    const result = await login(credentials);
    setLoading(false);
    if (!result.ok) {
      setMessageTone("error");
      setMessage(result.message);
      return;
    }
    router.replace(getHomeRoute(result.user.role));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = { email, password };
    const nextErrors = validate(mode, name, credentials);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    if (mode === "signin") {
      await attemptLogin(credentials);
      return;
    }
    setLoading(true);
    const result = await signUp({ name, ...credentials });
    setLoading(false);
    setMessageTone(result.ok ? "success" : "error");
    setMessage(result.message ?? "Account created.");
    if (result.ok && !result.requiresConfirmation) router.replace("/explore");
  };

  const googleLogin = async () => {
    setLoading(true);
    setMessage("");
    const result = await loginWithGoogle();
    if (!result.ok) {
      setLoading(false);
      setMessageTone("error");
      setMessage(result.message);
    }
  };

  const quickLogin = async (account: DevelopmentAccount) => {
    setMode("signin");
    setEmail(account.user.email);
    setPassword(account.password);
    await attemptLogin({ email: account.user.email, password: account.password });
  };

  return (
    <main className="grid min-h-screen grid-cols-[minmax(320px,.82fr)_minmax(520px,1.18fr)] bg-ivory text-ink tablet:grid-cols-1">
      <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-olive p-[max(4vw,48px)] text-white tablet:min-h-[330px] tablet:p-10 mobile:min-h-[280px] mobile:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[.08em] bottom-[-.16em] -z-10 text-[clamp(150px,22vw,360px)] leading-none font-extrabold text-[#f5f2ec0a]"
        >
          L
        </div>
        <SmartLink href="/" className="text-[28px] font-extrabold text-white no-underline">
          LOKAR<span className="text-beige">IA</span>
        </SmartLink>
        <div className="mt-auto max-w-[540px] tablet:mt-16 mobile:mt-12">
          <p className="mb-5 text-[11px] font-extrabold tracking-eyebrow text-beige uppercase">
            One account, every session
          </p>
          <h1 className="font-serif text-[clamp(44px,6vw,84px)] leading-[.92] font-medium italic">
            Your place is waiting.
          </h1>
          <p className="mt-7 max-w-[460px] text-[14px] leading-[1.7] text-[#ffffffbf]">
            Sign in to book spaces, manage venues, or operate the platform from one responsive workspace.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-[clamp(28px,7vw,110px)] py-16 tablet:min-h-0 mobile:px-[18px] mobile:py-12">
        <div className="w-full max-w-[560px]">
          <div className="mb-8 grid grid-cols-2 border-b border-line" role="tablist">
            {(["signin", "signup"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                onClick={() => {
                  setMode(item);
                  resetMessage();
                }}
                className={`min-h-12 cursor-pointer border-b-2 text-[11px] font-extrabold tracking-label uppercase ${
                  mode === item
                    ? "border-olive text-olive"
                    : "border-transparent text-[#11111173]"
                }`}
              >
                {item === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <p className="mb-3 text-[10px] font-extrabold tracking-eyebrow text-olive uppercase">
            {mode === "signin" ? "Welcome back" : "Join Lokaria"}
          </p>
          <h2 className="text-[clamp(32px,4vw,50px)] leading-none font-extrabold uppercase">
            {mode === "signin" ? "Sign in to Lokaria" : "Create your account"}
          </h2>

          <button
            type="button"
            onClick={googleLogin}
            disabled={loading || !supabaseEnabled}
            className="mt-7 flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-field border border-line bg-white px-4 text-[11px] font-extrabold uppercase hover:border-olive disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="grid size-6 place-items-center rounded-full border border-line text-[12px]">G</span>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[9px] font-bold text-[#11111166] uppercase">
            <span className="h-px flex-1 bg-line" /> or use email <span className="h-px flex-1 bg-line" />
          </div>

          <form noValidate onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-2 block text-[10px] font-extrabold uppercase">Full name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-13 w-full rounded-field border border-line bg-white px-4 text-[14px] outline-none focus:border-olive"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-2 text-[11px] text-[#a13b35]">{errors.name}</p>}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-[10px] font-extrabold uppercase">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-13 w-full rounded-field border border-line bg-white px-4 text-[14px] outline-none focus:border-olive"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-[11px] text-[#a13b35]">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-[10px] font-extrabold uppercase">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-13 w-full rounded-field border border-line bg-white px-4 pr-13 text-[14px] outline-none focus:border-olive"
                  placeholder={mode === "signup" ? "At least 8 characters" : "Enter password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 cursor-pointer place-items-center text-olive"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-[11px] text-[#a13b35]">{errors.password}</p>}
            </div>

            <p
              aria-live="polite"
              className={`min-h-5 text-[12px] font-semibold ${
                messageTone === "success" ? "text-[#266d3e]" : "text-[#a13b35]"
              }`}
            >
              {message}
            </p>
            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {!supabaseEnabled && (
            <p className="mt-5 border border-[#d9770640] bg-[#d9770610] p-3 text-[11px] leading-5 text-[#8c560d]">
              Supabase is not configured yet. Fill <code>.env.local</code> to enable sign-up and Google login.
            </p>
          )}

          {MOCK_AUTH_ENABLED && mode === "signin" && (
            <section className="mt-8 border-t border-line pt-6">
              <p className="mb-3 text-[10px] font-extrabold uppercase">Development accounts</p>
              <div className="grid grid-cols-3 gap-2 mobile:grid-cols-1">
                {DEVELOPMENT_ACCOUNTS.map((account) => (
                  <button
                    key={account.user.id}
                    type="button"
                    onClick={() => quickLogin(account)}
                    disabled={loading}
                    className="cursor-pointer rounded-field border border-line bg-white p-3 text-left hover:border-olive"
                  >
                    <span className="block text-[10px] font-extrabold uppercase">{account.label}</span>
                    <span className="mt-2 block text-[9px] text-[#11111173]">{account.user.email}</span>
                    <span className="mt-2 block text-[9px] font-bold text-olive uppercase">
                      {roleLabel(account.user.role)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
