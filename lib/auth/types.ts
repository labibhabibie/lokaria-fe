export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  PARTNER_OWNER: "PARTNER_OWNER",
  PARTNER_STAFF: "PARTNER_STAFF",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  avatarUrl?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = LoginCredentials & {
  name: string;
};

export type ProfileUpdate = {
  name: string;
  photo?: File | null;
};

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

export type SignUpResult = ActionResult & {
  requiresConfirmation?: boolean;
};

export type AuthResult =
  | { ok: true; user: CurrentUser }
  | {
      ok: false;
      code:
        | "AUTH_DISABLED"
        | "AUTH_ERROR"
        | "INVALID_CREDENTIALS"
        | "STORAGE_UNAVAILABLE"
        | "VALIDATION_ERROR";
      message: string;
    };

export type SessionStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface AuthService {
  restore(): Promise<CurrentUser | null>;
  signIn(credentials: LoginCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
}
