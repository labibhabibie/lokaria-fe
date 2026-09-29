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
  { path: "/explore", title: "Jelajahi", navLabel: "Jelajahi", description: "Temukan kategori dan venue yang sesuai untuk aktivitasmu.", roles: CUSTOMER },
  { path: "/venues", title: "Venue", navLabel: "Venue", description: "Cari dan saring katalog venue yang tersedia.", roles: CUSTOMER },
  { path: "/booking", title: "Pemesanan", navLabel: "Pesan", description: "Pilih venue, tanggal, dan satu atau beberapa jadwal yang tersedia.", roles: CUSTOMER },
  { path: "/checkout", title: "Tinjau Pesanan", navLabel: "Tinjau Pesanan", description: "Periksa data pemesan, pembayaran, promo, dan total pesanan.", roles: CUSTOMER },
  { path: "/payment", title: "Pembayaran", navLabel: "Pembayaran", description: "Pratinjau proses pembayaran tanpa memproses transaksi sungguhan.", roles: CUSTOMER },
  { path: "/booking/success", title: "Pemesanan Berhasil", navLabel: "Konfirmasi", description: "Lihat konfirmasi pemesanan dan QR lokal.", roles: CUSTOMER },
  { path: "/bookings", title: "Pesanan Saya", navLabel: "Pesanan Saya", description: "Lihat pesanan mendatang dan riwayat pesanan demo.", roles: CUSTOMER },
  { path: "/profile", title: "Profil", navLabel: "Profil", description: "Kelola profil pelanggan dan akses keluar akun.", roles: CUSTOMER },
  { path: "/rewards", title: "Poin", navLabel: "Poin", description: "Lihat poin, perkembangan tingkat, dan simulasi penukaran hadiah.", roles: CUSTOMER },
  { path: "/membership", title: "Keanggotaan", navLabel: "Keanggotaan", description: "Bandingkan tingkat keanggotaan dan manfaatnya.", roles: CUSTOMER },
];

export const PARTNER_PAGES: readonly PortalPageDefinition[] = [
  { path: "/partner", title: "Dasbor Mitra", navLabel: "Dasbor", description: "Ringkasan ruang kerja mitra.", roles: PARTNER },
  { path: "/partner/bookings", title: "Pemesanan", navLabel: "Pemesanan", description: "Saring dan pantau pemesanan venue.", roles: PARTNER },
  { path: "/partner/calendar", title: "Kalender", navLabel: "Kalender", description: "Lihat keterisian lapangan dan waktu yang diblokir.", roles: PARTNER },
  { path: "/partner/venues", title: "Venue", navLabel: "Venue", description: "Tambah, edit, dan kelola daftar venue beserta status verifikasinya.", roles: PARTNER },
  { path: "/partner/courts", title: "Lapangan & Harga", navLabel: "Lapangan", description: "Kelola lapangan, harga dasar, serta aturan harga hari kerja, akhir pekan, dan khusus.", roles: PARTNER },
  { path: "/partner/staff", title: "Staf", navLabel: "Staf", description: "Tambah, edit, dan kelola peran, sif, serta status akun staf.", roles: PARTNER },
  { path: "/partner/inventory", title: "Inventaris", navLabel: "Inventaris", description: "Kelola produk, harga jual, stok, dan batas minimum inventaris.", roles: PARTNER },
  { path: "/partner/inventory/stock-in", title: "Stok Masuk", navLabel: "Stok Masuk", description: "Catat pergerakan inventaris yang masuk.", roles: PARTNER },
  { path: "/partner/inventory/stock-out", title: "Stok Keluar", navLabel: "Stok Keluar", description: "Catat pergerakan inventaris yang keluar.", roles: PARTNER },
  { path: "/partner/inventory/stock-opname", title: "Stok Opname", navLabel: "Stok Opname", description: "Pratinjau formulir rekonsiliasi stok fisik.", roles: PARTNER },
  { path: "/partner/pos", title: "Kasir", navLabel: "Kasir", description: "Kelola keranjang, pembayaran, dan riwayat transaksi meja layanan.", roles: PARTNER },
  { path: "/partner/finance", title: "Keuangan", navLabel: "Keuangan", description: "Kelola buku besar dan ekspor laporan keuangan berdasarkan periode.", roles: PARTNER },
  { path: "/partner/expenses", title: "Pengeluaran", navLabel: "Pengeluaran", description: "Tambah, edit, dan kelola catatan pengeluaran operasional.", roles: PARTNER },
];

export const ADMIN_PAGES: readonly PortalPageDefinition[] = [
  { path: "/admin", title: "Dasbor Admin", navLabel: "Dasbor", description: "Ringkasan administrasi platform.", roles: ADMIN },
  { path: "/admin/customers", title: "Pelanggan", navLabel: "Pelanggan", description: "Cari akun pelanggan dan aktivitasnya.", roles: ADMIN },
  { path: "/admin/partners", title: "Mitra", navLabel: "Mitra", description: "Tinjau akses mitra dan status verifikasinya.", roles: ADMIN },
  { path: "/admin/venues", title: "Venue", navLabel: "Venue", description: "Moderasi daftar venue di seluruh platform.", roles: ADMIN },
  { path: "/admin/bookings", title: "Pemesanan", navLabel: "Pemesanan", description: "Pantau data pemesanan demo dari semua mitra.", roles: ADMIN },
  { path: "/admin/payments", title: "Pembayaran", navLabel: "Pembayaran", description: "Tinjau penyedia pembayaran dan status rekonsiliasi.", roles: ADMIN },
  { path: "/admin/refunds", title: "Pengembalian Dana", navLabel: "Pengembalian Dana", description: "Tinjau permintaan dan status penyelesaian pengembalian dana.", roles: ADMIN },
  { path: "/admin/promotions", title: "Promosi", navLabel: "Promosi", description: "Kelola kode kampanye, periode, dan penggunaannya.", roles: ADMIN },
  { path: "/admin/reports", title: "Laporan", navLabel: "Laporan", description: "Pantau nilai pemesanan, pendapatan, dan komposisi kategori.", roles: ADMIN },
  { path: "/admin/settings", title: "Pengaturan", navLabel: "Pengaturan", description: "Atur nilai bawaan dan identitas platform.", roles: ADMIN },
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
      title: "Detail Venue",
      navLabel: "Detail Venue",
      description: "Lihat informasi venue, fasilitas, ruang, dan harga awal.",
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
    "/partner/pos",
    "/partner/bookings",
    "/partner/finance",
    "/partner/staff",
  ],
  PARTNER_STAFF: [
    "/partner",
    "/partner/pos",
    "/partner/bookings",
    "/partner/calendar",
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
  if (role === USER_ROLES.CUSTOMER) return "Pelanggan";
  if (role === USER_ROLES.PARTNER_OWNER) return "Pemilik Mitra";
  if (role === USER_ROLES.PARTNER_STAFF) return "Staf Mitra";
  if (role === USER_ROLES.ADMIN) return "Admin";
  return "Admin Utama";
}
