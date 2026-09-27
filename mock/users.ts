import { USER_ROLES, type CurrentUser } from "../lib/auth/types";

export type DevelopmentAccount = {
  label: string;
  password: string;
  user: CurrentUser;
};

/** Local UI-development identities. Never use these credentials for real authentication. */
export const DEVELOPMENT_ACCOUNTS: readonly DevelopmentAccount[] = [
  {
    label: "Customer",
    password: "Customer123!",
    user: {
      id: "dev-customer-001",
      name: "Customer Demo",
      email: "customer@lokaria.test",
      role: USER_ROLES.CUSTOMER,
      avatar: "CD",
    },
  },
  {
    label: "Mitra",
    password: "Mitra123!",
    user: {
      id: "dev-partner-001",
      name: "Mitra Lokaria",
      email: "mitra@lokaria.test",
      role: USER_ROLES.PARTNER_OWNER,
      avatar: "ML",
    },
  },
  {
    label: "Admin",
    password: "Admin123!",
    user: {
      id: "dev-admin-001",
      name: "Admin Lokaria",
      email: "admin@lokaria.test",
      role: USER_ROLES.SUPER_ADMIN,
      avatar: "AL",
    },
  },
];
