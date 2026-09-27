import { USER_ROLES, type UserRole } from "./types";

export type PortalPageDefinition = {
  path: string;
  title: string;
  navLabel: string;
  description: string;
  roles: readonly UserRole[];
};

const CUSTOMER = [USER_ROLES.CUSTOMER] as const;
const PARTNER = [USER_ROLES.PARTNER_OWNER, USER_ROLES.PARTNER_STAFF] as const;
const ADMIN = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN] as const;

export const CUSTOMER_PAGES: readonly PortalPageDefinition[] = [
  { path: "/explore", title: "Explore", navLabel: "Explore", description: "Customer home for discovering categories and venues.", roles: CUSTOMER },
  { path: "/venues", title: "Venues", navLabel: "Venues", description: "Search and filter the local venue catalogue.", roles: CUSTOMER },
  { path: "/booking", title: "Booking", navLabel: "Booking", description: "Select a venue, date, and available mock time slot.", roles: CUSTOMER },
  { path: "/checkout", title: "Checkout", navLabel: "Checkout", description: "Review attendee, payment, promo, and booking totals.", roles: CUSTOMER },
  { path: "/payment", title: "Payment", navLabel: "Payment", description: "Preview the payment handoff without processing a transaction.", roles: CUSTOMER },
  { path: "/booking/success", title: "Booking Success", navLabel: "Confirmation", description: "Preview booking confirmation and local QR state.", roles: CUSTOMER },
  { path: "/bookings", title: "My Bookings", navLabel: "My Bookings", description: "Browse upcoming and previous mock bookings.", roles: CUSTOMER },
  { path: "/profile", title: "Profile", navLabel: "Profile", description: "Local customer profile and logout access.", roles: CUSTOMER },
  { path: "/rewards", title: "Rewards", navLabel: "Rewards", description: "Review points, tier progress, and mock reward redemption.", roles: CUSTOMER },
  { path: "/membership", title: "Membership", navLabel: "Membership", description: "Compare local membership tiers and benefits.", roles: CUSTOMER },
];

export const PARTNER_PAGES: readonly PortalPageDefinition[] = [
  { path: "/partner", title: "Partner Dashboard", navLabel: "Dashboard", description: "Local partner workspace overview.", roles: PARTNER },
  { path: "/partner/bookings", title: "Bookings", navLabel: "Bookings", description: "Filter and monitor venue bookings.", roles: PARTNER },
  { path: "/partner/calendar", title: "Calendar", navLabel: "Calendar", description: "Review weekly court occupancy and blocked time.", roles: PARTNER },
  { path: "/partner/venues", title: "Venues", navLabel: "Venues", description: "Manage local venue listings and verification states.", roles: PARTNER },
  { path: "/partner/courts", title: "Courts & Spaces", navLabel: "Courts", description: "Review bookable spaces, prices, and operating status.", roles: PARTNER },
  { path: "/partner/pricing", title: "Pricing", navLabel: "Pricing", description: "Manage weekly time-based pricing rules.", roles: PARTNER },
  { path: "/partner/staff", title: "Staff", navLabel: "Staff", description: "Review team roles, shifts, and account status.", roles: PARTNER },
  { path: "/partner/inventory", title: "Inventory", navLabel: "Inventory", description: "Monitor product stock, minimum levels, and movements.", roles: PARTNER },
  { path: "/partner/inventory/stock-in", title: "Stock In", navLabel: "Stock In", description: "Record a local incoming inventory movement.", roles: PARTNER },
  { path: "/partner/inventory/stock-out", title: "Stock Out", navLabel: "Stock Out", description: "Record a local outgoing inventory movement.", roles: PARTNER },
  { path: "/partner/inventory/stock-opname", title: "Stock Opname", navLabel: "Stock Opname", description: "Preview a physical stock reconciliation form.", roles: PARTNER },
  { path: "/partner/pos", title: "Point of Sale", navLabel: "POS", description: "Build a local cart and preview front desk checkout.", roles: PARTNER },
  { path: "/partner/finance", title: "Finance", navLabel: "Finance", description: "Review revenue, payouts, and transaction activity.", roles: PARTNER },
  { path: "/partner/expenses", title: "Expenses", navLabel: "Expenses", description: "Review local operating expense records.", roles: PARTNER },
];

export const ADMIN_PAGES: readonly PortalPageDefinition[] = [
  { path: "/admin", title: "Admin Dashboard", navLabel: "Dashboard", description: "Local platform administration overview.", roles: ADMIN },
  { path: "/admin/customers", title: "Customers", navLabel: "Customers", description: "Search platform customer accounts and activity.", roles: ADMIN },
  { path: "/admin/partners", title: "Partners", navLabel: "Partners", description: "Review partner access and verification state.", roles: ADMIN },
  { path: "/admin/venues", title: "Venues", navLabel: "Venues", description: "Moderate venue listings across the platform.", roles: ADMIN },
  { path: "/admin/bookings", title: "Bookings", navLabel: "Bookings", description: "Monitor mock bookings across all partners.", roles: ADMIN },
  { path: "/admin/payments", title: "Payments", navLabel: "Payments", description: "Review local gateway and reconciliation states.", roles: ADMIN },
  { path: "/admin/refunds", title: "Refunds", navLabel: "Refunds", description: "Review refund requests and resolution states.", roles: ADMIN },
  { path: "/admin/promotions", title: "Promotions", navLabel: "Promotions", description: "Manage mock campaign codes, periods, and usage.", roles: ADMIN },
  { path: "/admin/reports", title: "Reports", navLabel: "Reports", description: "Track booking value, revenue, and category mix.", roles: ADMIN },
  { path: "/admin/settings", title: "Settings", navLabel: "Settings", description: "Configure local platform defaults and identity.", roles: ADMIN },
];

export const PORTAL_PAGES = [...CUSTOMER_PAGES, ...PARTNER_PAGES, ...ADMIN_PAGES] as const;
export const PROTECTED_STATIC_PATHS = PORTAL_PAGES.map((page) => page.path.slice(1));

function normalizePath(pathname: string) {
  const clean = pathname.split("?")[0].replace(/\/$/, "");
  return clean || "/";
}

export function resolveProtectedPage(pathname: string): PortalPageDefinition | null {
  const path = normalizePath(pathname);
  const exact = PORTAL_PAGES.find((page) => page.path === path);
  if (exact) return exact;
  if (/^\/venues\/[^/]+$/.test(path)) {
    return {
      path,
      title: "Venue Detail",
      navLabel: "Venue Detail",
      description: "Review venue information, amenities, spaces, and starting price.",
      roles: CUSTOMER,
    };
  }
  return null;
}

export function getHomeRoute(role: UserRole) {
  if (role === USER_ROLES.CUSTOMER) return "/explore";
  if (role === USER_ROLES.PARTNER_OWNER || role === USER_ROLES.PARTNER_STAFF) return "/partner";
  return "/admin";
}

export function getPortalNavigation(role: UserRole): readonly PortalPageDefinition[] {
  if (role === USER_ROLES.CUSTOMER) return CUSTOMER_PAGES;
  if (role === USER_ROLES.PARTNER_OWNER || role === USER_ROLES.PARTNER_STAFF) return PARTNER_PAGES;
  return ADMIN_PAGES;
}

const MOBILE_PATHS: Record<UserRole, readonly string[]> = {
  CUSTOMER: ["/explore", "/venues", "/booking", "/bookings"],
  PARTNER_OWNER: ["/partner", "/partner/bookings", "/partner/calendar", "/partner/pos"],
  PARTNER_STAFF: ["/partner", "/partner/bookings", "/partner/calendar", "/partner/pos"],
  ADMIN: ["/admin", "/admin/partners", "/admin/payments", "/admin/reports"],
  SUPER_ADMIN: ["/admin", "/admin/partners", "/admin/payments", "/admin/reports"],
};

const PROFILE_PATHS: Record<UserRole, readonly string[]> = {
  CUSTOMER: ["/explore", "/bookings", "/rewards", "/membership", "/profile"],
  PARTNER_OWNER: [
    "/partner",
    "/partner/bookings",
    "/partner/calendar",
    "/partner/finance",
    "/partner/staff",
  ],
  PARTNER_STAFF: [
    "/partner",
    "/partner/bookings",
    "/partner/calendar",
    "/partner/pos",
    "/partner/inventory",
  ],
  ADMIN: ["/admin", "/admin/partners", "/admin/payments", "/admin/refunds", "/admin/reports"],
  SUPER_ADMIN: [
    "/admin",
    "/admin/partners",
    "/admin/payments",
    "/admin/refunds",
    "/admin/reports",
  ],
};

function navigationForPaths(role: UserRole, paths: readonly string[]) {
  const pages = getPortalNavigation(role);
  return paths.flatMap((path) => {
    const page = pages.find((item) => item.path === path);
    return page ? [page] : [];
  });
}

export function getMobileNavigation(role: UserRole) {
  return navigationForPaths(role, MOBILE_PATHS[role]);
}

export function getProfileNavigation(role: UserRole) {
  return navigationForPaths(role, PROFILE_PATHS[role]);
}

export function isAuthPath(pathname: string) {
  const path = normalizePath(pathname);
  return path === "/login" || path === "/auth";
}

export function isPortalPath(pathname: string) {
  return resolveProtectedPage(pathname) !== null;
}

export function roleCanAccess(role: UserRole, allowedRoles: readonly UserRole[]) {
  return allowedRoles.includes(role);
}

export function roleLabel(role: UserRole) {
  if (role === USER_ROLES.CUSTOMER) return "Customer";
  if (role === USER_ROLES.PARTNER_OWNER) return "Partner Owner";
  if (role === USER_ROLES.PARTNER_STAFF) return "Partner Staff";
  if (role === USER_ROLES.ADMIN) return "Admin";
  return "Super Admin";
}
