// All site copy, prices, lists, links and images live here.
// Numbers, prices, venue counts and contact details are placeholders — edit freely.

/** Heading with an italic serif accent word: `before *accent* after`. */
export type Accented = { before?: string; accent?: string; after?: string };
export type LinkItem = { label: string; href: string };
export type Img = { src: string; alt: string };

/** "Rp 150.000" — Indonesian dot thousands separator. */
export function rupiah(amount: number) {
  return "Rp " + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// TODO: replace with Lokaria photo
const IMG_PADEL =
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_TENNIS =
  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_INDOOR =
  "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_ARENA =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200";

export const routes = {
  booking: "/booking",
  auth: "/login",
  register: "/login",
  faq: "/faq",
  partner: "/partner",
  events: "/events",
  help: "/help",
  whatsapp: "https://wa.me/6281200000000",
  category: (slug: string) => `/categories/${slug}`,
  venue: (slug: string) => `/venues/${slug}`,
  bookCategory: (slug: string) => `/booking?category=${slug}`,
  bookCity: (slug: string) => `/booking?city=${slug}`,
  event: (slug: string) => `/events/${slug}`,
};

export const brand = {
  name: "Lokaria",
  wordmark: "LOKARIA",
  tagline: "Temukan tempatmu. Pesan waktumu.",
  meta: {
    title: "Lokaria | Pesan Venue Olahraga & Ruang Kreatif",
    description:
      "Pesan lapangan sepak bola, futsal, padel, tenis, bulu tangkis, studio musik, dan kolam pancing di dekatmu. Ketersediaan langsung, konfirmasi instan, dan pembayaran aman.",
  },
};

export const nav = {
  links: [
    { label: "Jelajahi", href: "/#categories" },
    { label: "Untuk Venue", href: "/#for-venues" },
    { label: "Poin", href: "/#rewards" },
    { label: "Keanggotaan", href: "/#membership" },
    { label: "Tanya Jawab", href: routes.faq },
  ] satisfies LinkItem[],
  signIn: { label: "Masuk", href: routes.auth },
  cta: { label: "Pesan Tempat", href: routes.booking },
  floatingCta: { label: "Pesan", href: routes.booking },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export type CategoryAccent =
  | "football"
  | "padel"
  | "tennis"
  | "badminton"
  | "music"
  | "fishing";

export type Venue = {
  slug: string;
  name: string;
  city: string;
  tag: string;
  description: string;
  price: number;
  image: Img;
  live?: string;
};

export type Category = {
  slug: string;
  index: string;
  code: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  accent: CategoryAccent;
  image: Img;
  /** Grid column span on desktop (12-col grid). */
  span: 5 | 7;
  detail: {
    lead: string;
    highlights: string[];
    venues: Venue[];
    rules: { label: string; items: string[] }[];
  };
};

const defaultRules = (bring: string[]) => [
  {
    label: "Peraturan venue",
    items: [
      "Datang 10 menit sebelum jadwal dimulai.",
      "Tunjukkan QR pemesanan di meja layanan.",
      "Patuhi panduan keselamatan yang berlaku di setiap venue.",
    ],
  },
  {
    label: "Pembatalan",
    items: [
      "Pembatalan gratis hingga 24 jam sebelumnya.",
      "Kredit dikembalikan ke dompet Lokaria.",
      "Anggota Elite dapat menjadwalkan ulang gratis hingga 6 jam sebelumnya.",
    ],
  },
  { label: "Yang perlu dibawa", items: bring },
];

// TODO: replace placeholder highlights, venues and rules with real partner data
export const categories: Category[] = [
  {
    slug: "football",
    index: "01",
    code: "FB",
    title: "Sepak Bola & Futsal",
    description: "Lapangan futsal dalam ruangan dan mini soccer luar ruangan",
    price: 150000,
    unit: "/ lapangan / jam",
    accent: "football",
    image: { src: IMG_TENNIS, alt: "Lapangan luar ruangan dengan lampu sorot" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Lapangan futsal dalam ruangan dan mini soccer luar ruangan yang dapat dipesan per jam dengan konfirmasi instan.",
      highlights: [
        "Vinil & rumput sintetis",
        "Penerangan malam",
        "Ruang ganti",
        "Sewa bola & rompi",
      ],
      venues: [
        {
          slug: "arena-kemang",
          name: "Arena Kemang",
          city: "Jakarta",
          tag: "Dalam Ruangan",
          description:
            "Dua lapangan futsal berukuran standar FIFA dengan tribun.",
          price: 180000,
          image: { src: IMG_ARENA, alt: "Lapangan futsal dalam ruangan" },
          live: "3 jadwal hari ini",
        },
        {
          slug: "gbk-mini-soccer",
          name: "Senayan Mini Soccer",
          city: "Jakarta",
          tag: "Luar Ruangan",
          description:
            "Lapangan sintetis untuk tujuh pemain dengan lampu sorot.",
          price: 350000,
          image: { src: IMG_TENNIS, alt: "Lapangan mini soccer luar ruangan" },
        },
        {
          slug: "dago-futsal",
          name: "Dago Futsal Center",
          city: "Bandung",
          tag: "Dalam Ruangan",
          description: "Tiga lapangan, kafe, dan area parkir di lokasi.",
          price: 150000,
          image: { src: IMG_INDOOR, alt: "Lapangan futsal" },
          live: "5 jadwal hari ini",
        },
        {
          slug: "pakuwon-soccer",
          name: "Pakuwon Soccer Park",
          city: "Surabaya",
          tag: "Luar Ruangan",
          description:
            "Mini soccer dengan tempat duduk beratap untuk penonton.",
          price: 300000,
          image: { src: IMG_TENNIS, alt: "Lapangan mini soccer" },
        },
      ],
      rules: defaultRules([
        "Sepatu futsal atau sepatu rumput sintetis",
        "Pelindung tulang kering",
        "Botol minum",
      ]),
    },
  },
  {
    slug: "padel",
    index: "02",
    code: "PD",
    title: "Padel",
    description: "Lapangan kaca panoramik dalam dan luar ruangan",
    price: 250000,
    unit: "/ lapangan / jam",
    accent: "padel",
    image: { src: IMG_PADEL, alt: "Lapangan padel" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Lapangan kaca panoramik dalam dan luar ruangan untuk permainan ganda kapan saja.",
      highlights: [
        "Dinding kaca panoramik",
        "Rumput sintetis kelas profesional",
        "Lapangan dalam & luar ruangan",
        "Sewa raket & bola",
      ],
      venues: [
        {
          slug: "padel-pik",
          name: "PIK Padel Club",
          city: "Jakarta",
          tag: "Panoramik",
          description: "Empat lapangan panoramik di tepi perairan.",
          price: 300000,
          image: { src: IMG_PADEL, alt: "Lapangan padel panoramik" },
          live: "2 jadwal hari ini",
        },
        {
          slug: "padel-senopati",
          name: "Senopati Padel House",
          city: "Jakarta",
          tag: "Dalam Ruangan",
          description: "Lapangan berpengatur suhu di pusat kota.",
          price: 350000,
          image: { src: IMG_INDOOR, alt: "Lapangan padel dalam ruangan" },
        },
        {
          slug: "padel-bandung",
          name: "Lembang Padel Garden",
          city: "Bandung",
          tag: "Luar Ruangan",
          description:
            "Udara pegunungan yang sejuk dan tiga lapangan luar ruangan.",
          price: 250000,
          image: { src: IMG_PADEL, alt: "Lapangan padel luar ruangan" },
          live: "4 jadwal hari ini",
        },
      ],
      rules: defaultRules([
        "Raket padel (atau sewa di lokasi)",
        "Sepatu lapangan tanpa bekas",
        "Botol minum",
      ]),
    },
  },
  {
    slug: "tennis",
    index: "03",
    code: "TN",
    title: "Tenis",
    description: "Lapangan keras dan tanah liat dengan penerangan malam",
    price: 150000,
    unit: "/ lapangan / jam",
    accent: "tennis",
    image: { src: IMG_TENNIS, alt: "Lapangan tenis" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Lapangan keras dan tanah liat dengan penerangan malam, untuk latihan santai hingga pertandingan kompetitif.",
      highlights: [
        "Permukaan keras & tanah liat",
        "Penerangan malam",
        "Sewa mesin bola",
        "Pelatih sesuai permintaan",
      ],
      venues: [
        {
          slug: "tennis-senayan",
          name: "Senayan Tennis Courts",
          city: "Jakarta",
          tag: "Keras",
          description: "Lapangan keras berstandar turnamen.",
          price: 200000,
          image: { src: IMG_TENNIS, alt: "Lapangan tenis keras" },
          live: "6 jadwal hari ini",
        },
        {
          slug: "tennis-bandung",
          name: "Setiabudi Clay Club",
          city: "Bandung",
          tag: "Tanah Liat",
          description: "Lapangan tanah liat merah dengan rumah klub.",
          price: 150000,
          image: { src: IMG_TENNIS, alt: "Lapangan tenis tanah liat" },
        },
        {
          slug: "tennis-yogya",
          name: "Kaliurang Tennis Park",
          city: "Yogyakarta",
          tag: "Keras",
          description: "Lapangan yang tenang dengan penerangan malam.",
          price: 150000,
          image: { src: IMG_ARENA, alt: "Lapangan tenis pada malam hari" },
        },
      ],
      rules: defaultRules(["Raket tenis", "Sepatu tenis", "Handuk"]),
    },
  },
  {
    slug: "badminton",
    index: "04",
    code: "BD",
    title: "Bulu Tangkis",
    description: "Lapangan kayu dan vinil dengan net berstandar turnamen",
    price: 60000,
    unit: "/ lapangan / jam",
    accent: "badminton",
    image: { src: IMG_ARENA, alt: "Gedung bulu tangkis" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Lapangan kayu dan vinil dengan net berstandar turnamen serta pencahayaan terang dan merata.",
      highlights: [
        "Lantai kayu & vinil",
        "Net berstandar turnamen",
        "Pencahayaan anti-silau",
        "Penjualan kok",
      ],
      venues: [
        {
          slug: "gor-cempaka",
          name: "GOR Cempaka",
          city: "Jakarta",
          tag: "Kayu",
          description: "Delapan lapangan kayu dalam satu gedung.",
          price: 80000,
          image: { src: IMG_ARENA, alt: "Lapangan bulu tangkis kayu" },
          live: "8 jadwal hari ini",
        },
        {
          slug: "gor-pajajaran",
          name: "GOR Pajajaran",
          city: "Bandung",
          tag: "Vinil",
          description: "Lapangan vinil yang digunakan klub lokal.",
          price: 60000,
          image: { src: IMG_INDOOR, alt: "Lapangan bulu tangkis vinil" },
        },
        {
          slug: "gor-kertajaya",
          name: "Kertajaya Sports Hall",
          city: "Surabaya",
          tag: "Kayu",
          description: "Enam lapangan dengan tempat duduk penonton.",
          price: 70000,
          image: { src: IMG_ARENA, alt: "Gedung bulu tangkis" },
          live: "2 jadwal hari ini",
        },
      ],
      rules: defaultRules(["Raket bulu tangkis", "Sepatu tanpa bekas", "Kok"]),
    },
  },
  {
    slug: "music-studio",
    index: "05",
    code: "MS",
    title: "Studio Musik",
    description: "Ruang latihan dan rekaman dengan peralatan lengkap",
    price: 80000,
    unit: "/ ruang / jam",
    accent: "music",
    image: { src: IMG_INDOOR, alt: "Studio musik" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Ruang latihan dan rekaman dengan peralatan lengkap, kedap suara, dan siap digunakan kapan saja.",
      highlights: [
        "Peralatan lengkap",
        "Ruang kedap suara",
        "Tambahan layanan rekaman",
        "Jadwal larut malam",
      ],
      venues: [
        {
          slug: "studio-blok-m",
          name: "Blok M Sound Room",
          city: "Jakarta",
          tag: "Latihan",
          description: "Tiga ruang dengan drum, amplifier, dan sistem PA.",
          price: 100000,
          image: { src: IMG_INDOOR, alt: "Ruang latihan musik" },
          live: "Buka sekarang",
        },
        {
          slug: "studio-braga",
          name: "Braga Studio",
          city: "Bandung",
          tag: "Rekaman",
          description: "Ruang perekaman dengan teknisi yang siap dipanggil.",
          price: 150000,
          image: { src: IMG_INDOOR, alt: "Studio rekaman" },
        },
        {
          slug: "studio-prawirotaman",
          name: "Prawirotaman Jam Space",
          city: "Yogyakarta",
          tag: "Latihan",
          description: "Ruang nyaman untuk latihan band dan solo.",
          price: 80000,
          image: { src: IMG_ARENA, alt: "Ruang latihan musik" },
          live: "Buka sekarang",
        },
      ],
      rules: defaultRules([
        "Instrumen pribadi (opsional)",
        "Kabel & plektrum",
        "Pelindung telinga",
      ]),
    },
  },
  {
    slug: "fishing",
    index: "06",
    code: "FP",
    title: "Kolam Pancing",
    description: "Kolam berisi ikan dengan gazebo teduh dan penyewaan alat",
    price: 40000,
    unit: "/ orang / sesi",
    accent: "fishing",
    image: { src: IMG_ARENA, alt: "Kolam pancing" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Kolam berisi ikan dengan gazebo teduh dan penyewaan alat, cocok untuk pagi santai atau rekreasi keluarga.",
      highlights: [
        "Ikan ditambahkan setiap hari",
        "Gazebo teduh",
        "Sewa joran & umpan",
        "Ramah keluarga",
      ],
      venues: [
        {
          slug: "pond-sidoarjo",
          name: "Telaga Sidoarjo",
          city: "Surabaya",
          tag: "Berisi Ikan",
          description: "Kolam besar dengan dua puluh gazebo.",
          price: 50000,
          image: { src: IMG_ARENA, alt: "Kolam pancing dengan gazebo" },
          live: "Buka sekarang",
        },
        {
          slug: "pond-sleman",
          name: "Kolam Sleman",
          city: "Yogyakarta",
          tag: "Keluarga",
          description: "Kolam dangkal dan sebuah kafe kecil.",
          price: 40000,
          image: { src: IMG_INDOOR, alt: "Kolam pancing keluarga" },
        },
        {
          slug: "pond-bekasi",
          name: "Pemancingan Bekasi",
          city: "Jakarta",
          tag: "Berisi Ikan",
          description: "Sesi malam setiap akhir pekan.",
          price: 60000,
          image: { src: IMG_ARENA, alt: "Kolam pancing" },
        },
      ],
      rules: defaultRules([
        "Topi & tabir surya",
        "Kotak pendingin untuk hasil tangkapan",
        "Joran pribadi (opsional)",
      ]),
    },
  },
];

export const categoryLabel = (c: Category) =>
  `Mulai ${rupiah(c.price)} ${c.unit}`;

// ─── Cities ──────────────────────────────────────────────────────────────────

export type City = {
  slug: string;
  label: string;
  meta: string;
  title: string;
  subtitle: string;
  image: Img;
};

export const cities: City[] = [
  {
    slug: "jakarta",
    label: "Kota 01",
    meta: "120+ Venue",
    title: "Jakarta",
    subtitle: "Sepak Bola, Padel, Tenis, Studio Musik",
    image: { src: IMG_PADEL, alt: "Venue di Jakarta" },
  }, // TODO: replace with Lokaria photo
  {
    slug: "bandung",
    label: "Kota 02",
    meta: "80+ Venue",
    title: "Bandung",
    subtitle: "Futsal, Bulu Tangkis, Studio Musik",
    image: { src: IMG_TENNIS, alt: "Venue di Bandung" },
  }, // TODO: replace with Lokaria photo
  {
    slug: "surabaya",
    label: "Kota 03",
    meta: "60+ Venue",
    title: "Surabaya",
    subtitle: "Sepak Bola, Bulu Tangkis, Kolam Pancing",
    image: { src: IMG_INDOOR, alt: "Venue di Surabaya" },
  }, // TODO: replace with Lokaria photo
  {
    slug: "yogyakarta",
    label: "Kota 04",
    meta: "40+ Venue",
    title: "Yogyakarta",
    subtitle: "Futsal, Studio Musik, Kolam Pancing",
    image: { src: IMG_ARENA, alt: "Venue di Yogyakarta" },
  }, // TODO: replace with Lokaria photo
];

// ─── Homepage sections ───────────────────────────────────────────────────────

export const hero = {
  eyebrow: "Satu Aplikasi. Semua Tempat Bermain.",
  heading: {
    before: "Temukan",
    accent: "TEMPATMU",
    after: "untuk bermain",
  } satisfies Accented,
  sub: "Pesan lapangan sepak bola, olahraga raket, studio musik, dan kolam pancing di seluruh Indonesia. Cek ketersediaan langsung, pilih jadwal, lalu bayar dalam hitungan detik.",
  primary: { label: "Pesan Sekarang", href: routes.booking },
  secondary: { label: "Jelajahi Kategori", href: "/#categories" },
  slides: [
    {
      label: "Sepak Bola & Futsal",
      image: { src: IMG_TENNIS, alt: "Lapangan sepak bola dengan lampu sorot" },
    }, // TODO: replace with Lokaria photo
    {
      label: "Olahraga Raket",
      image: { src: IMG_PADEL, alt: "Lapangan padel" },
    }, // TODO: replace with Lokaria photo
    { label: "Studio Musik", image: { src: IMG_INDOOR, alt: "Studio musik" } }, // TODO: replace with Lokaria photo
    { label: "Kolam Pancing", image: { src: IMG_ARENA, alt: "Kolam pancing" } }, // TODO: replace with Lokaria photo
  ],
  search: {
    what: { label: "Aktivitas", placeholder: "Pilih kategori" },
    where: { label: "Lokasi", placeholder: "Pilih kota" },
    when: { label: "Waktu", placeholder: "Tanggal & waktu" },
    button: "Cari",
  },
  scrollHint: "Gulir untuk menjelajahi",
};

export const categoriesSection = {
  id: "categories",
  eyebrow: "Enam Pilihan Aktivitas",
  heading: { before: "Jelajahi", accent: "KATEGORI" } satisfies Accented,
  sub: "Dari sepak bola akhir pekan hingga sesi musik larut malam, setiap tempat telah diverifikasi, dapat dipesan per jam, dan dikonfirmasi secara instan.",
  detailsLabel: "Lihat detail",
  bookLabel: "Pesan sekarang",
  comingSoon: {
    label: "Segera hadir",
    items: [
      "Bola Basket",
      "Sepak Bola Mini",
      "Studio Foto",
      "Ruang Rapat",
      "Kolam Renang",
    ],
  },
};

export const manifesto = {
  eyebrow: "Manifesto",
  statement: {
    before:
      "Kami membangun Lokaria karena mencari tempat bermain seharusnya semudah memutuskan untuk bermain.",
    accent: "Satu aplikasi, semua tempat,",
    after: "tanpa lagi menelepon, mengirim pesan, atau menunggu balasan.",
  } satisfies Accented,
  meta: ["Indonesia", "6 Kategori Saat Diluncurkan", "Berdiri 2026"],
};

export type Feature = {
  id?: string;
  dark?: boolean;
  reverse?: boolean;
  image: Img;
  imageLabel?: string;
  stat?: { value: string; label: string };
  eyebrow: string;
  heading: Accented;
  body: string;
  chips?: string[];
  list?: string[];
  cta: LinkItem;
};

export const features: Feature[] = [
  {
    image: { src: IMG_INDOOR, alt: "Pemain di lapangan dalam ruangan" }, // TODO: replace with Lokaria photo
    imageLabel: "Ketersediaan Langsung",
    eyebrow: "Untuk Pemain",
    heading: { before: "Pesan dalam", accent: "60 DETIK" },
    body: "Lihat setiap jadwal kosong secara langsung, bandingkan venue berdasarkan harga, jarak, dan penilaian, lalu amankan pesanan dengan konfirmasi instan. Bagi tagihan bersama teman dan dapatkan pengingat sebelum bermain.",
    chips: [
      "Kalender Jadwal Langsung",
      "Konfirmasi Instan",
      "Bagi Pembayaran",
      "QRIS & Dompet Digital",
    ],
    cta: { label: "Mulai Memesan", href: routes.booking },
  },
  {
    id: "for-venues",
    dark: true,
    reverse: true,
    image: { src: IMG_ARENA, alt: "Venue pada malam hari" }, // TODO: replace with Lokaria photo
    stat: { value: "24/7", label: "Pesanan masuk bahkan saat Anda tidur" },
    eyebrow: "Untuk Pemilik Venue",
    heading: { before: "Tumbuh bersama", accent: "MITRA LOKARIA" },
    body: "Ubah jam kosong menjadi pendapatan. Kelola jadwal, harga, staf, dan pencairan dana dari satu dasbor, serta jangkau pemain yang mencari tempat di dekat mereka.",
    list: [
      "Pengelola Jadwal Pintar",
      "Harga Dinamis",
      "Pencairan Dana Otomatis",
      "Laporan Penjualan",
    ],
    cta: { label: "Daftarkan Venue", href: routes.partner },
  },
];

export const rewards = {
  id: "rewards",
  eyebrow: "Poin Lokaria",
  heading: {
    before: "Dapatkan poin dari",
    accent: "SETIAP PESANAN",
  } satisfies Accented,
  body: "Setiap pemesanan di kategori apa pun menghasilkan Poin Lokaria. Tukarkan dengan jam gratis, voucher mitra, dan peningkatan keanggotaan.",
  stats: [
    { value: "1 Poin", label: "per Rp 10.000 transaksi" },
    {
      value: "Lintas Kategori",
      label: "kumpulkan di lapangan, tukarkan di studio",
    },
  ],
  card: {
    label: "Kartu Lokaria",
    tier: "Tingkat Emas",
    balanceLabel: "Saldo Saat Ini",
    balance: "2,450",
    unit: "Poin Lokaria",
    voucherLabel: "Voucher Tersedia",
    voucher: `Potongan ${rupiah(50000)} untuk pesanan berikutnya`,
    note: "Masuk atau buat akun untuk mengaktifkan kartu poin Anda.",
  },
};

export const citiesSection = {
  eyebrow: "Lokasi Bermain",
  heading: { before: "Jelajahi", accent: "KOTA" } satisfies Accented,
  sub: "Temukan venue terverifikasi di berbagai kota di Indonesia, dengan mitra baru yang bergabung setiap bulan.",
  note: "Ketuk untuk melihat venue di dekatmu.",
};

export type Tier = {
  tone: "silver" | "gold" | "black";
  index: string;
  name: string;
  note: string;
  price: number;
  period: string;
  credits: string;
  features: string[];
  popular?: string;
};

/** 1 Credit = Rp 10.000, usable at any partner venue. */
export const membership = {
  id: "membership",
  eyebrow: "Lokaria Plus",
  heading: { before: "Tingkat", accent: "KEANGGOTAAN" } satisfies Accented,
  sub: "Lebih sering bermain, lebih hemat membayar. Dapatkan kredit pemesanan, diskon anggota, dan akses lebih awal ke jam sibuk di setiap venue mitra.",
  cta: { label: "Pilih Tingkat →", href: routes.register },
  tiers: [
    {
      tone: "silver",
      index: "Tingkat 01",
      name: "Pemula",
      note: "Untuk pemain santai di akhir pekan",
      price: 250000,
      period: "/ 30 hari",
      credits: "+25 kredit",
      features: [
        "Termasuk 25 kredit, dapat digunakan di semua kategori",
        "Diskon anggota hingga 5%",
        "Pesan hingga 3 hari sebelumnya",
        "Berlaku 30 hari per siklus",
      ],
    },
    {
      tone: "gold",
      index: "Tingkat 02",
      name: "Pro",
      popular: "Paling Populer",
      note: "Untuk pemain rutin dan grup musik",
      price: 500000,
      period: "/ 30 hari",
      credits: "+55 kredit",
      features: [
        "Termasuk 55 kredit (bonus 10%)",
        "Diskon anggota hingga 10%",
        "Pesan hingga 7 hari sebelumnya",
        "2x Poin Lokaria di setiap pemesanan",
      ],
    },
    {
      tone: "black",
      index: "Tingkat 03",
      name: "Elite",
      note: "Untuk tim, klub, dan pengguna aktif",
      price: 1000000,
      period: "/ 30 hari",
      credits: "+115 kredit",
      features: [
        "Termasuk 115 kredit (bonus 15%)",
        "Diskon anggota hingga 15%",
        "Pesan hingga 14 hari sebelumnya",
        "Jadwal ulang gratis hingga 6 jam sebelumnya",
      ],
    },
  ] satisfies Tier[],
};

export type EventItem = {
  slug: string;
  day: string;
  month: string;
  tag: string;
  title: string;
  description: string;
};

export const events = {
  eyebrow: "Kalender Komunitas",
  heading: { before: "Acara", accent: "MENDATANG" } satisfies Accented,
  link: { label: "Lihat Semua Acara", href: routes.events },
  items: [
    {
      slug: "lokaria-futsal-league-season-1",
      day: "18",
      month: "Okt",
      tag: "Futsal",
      title: "Liga Futsal Lokaria, Musim 1",
      description:
        "Liga 16 tim yang digelar di berbagai venue mitra di Jakarta.",
    },
    {
      slug: "weekend-padel-americano",
      day: "25",
      month: "Okt",
      tag: "Padel",
      title: "Padel Americano Akhir Pekan",
      description:
        "Turnamen sosial untuk berbagai tingkat kemampuan, terbuka bagi semua pemain.",
    },
    {
      slug: "open-jam-night",
      day: "08",
      month: "Nov",
      tag: "Musik",
      title: "Malam Jam Terbuka",
      description: "Bawa instrumenmu dan berbagi panggung di studio mitra.",
    },
    {
      slug: "lokaria-fishing-cup",
      day: "15",
      month: "Nov",
      tag: "Memancing",
      title: "Piala Memancing Lokaria",
      description:
        "Tangkapan terbesar menjadi pemenang. Ramah keluarga dan tersedia penyewaan alat.",
    },
  ] satisfies EventItem[],
};

export const finalCta = {
  image: { src: IMG_TENNIS, alt: "" }, // TODO: replace with Lokaria photo
  eyebrow: "Siap Bermain?",
  heading: {
    before: "Amankan",
    accent: "TEMPATMU",
    after: "hari ini",
  } satisfies Accented,
  body: "Jadwal baru tersedia setiap hari. Temukan pilihanmu dan pesan dalam waktu kurang dari satu menit.",
  primary: { label: "Pesan Sekarang", href: routes.booking },
  secondary: { label: "Buat Akun", href: routes.register },
};

export const howItWorks = {
  eyebrow: "Cara Kerjanya",
  heading: {
    before: "Tiga langkah untuk",
    accent: "MULAI BERMAIN.",
  } satisfies Accented,
  aside: brand.tagline,
  image: { src: IMG_INDOOR, alt: "" }, // TODO: replace with Lokaria photo
  statusPill: "Ketersediaan langsung · 24/7",
  steps: [
    {
      index: "01",
      title: "Cari",
      body: "Pilih kategori, kota, dan waktu untuk melihat semua jadwal yang tersedia.",
    },
    {
      index: "02",
      title: "Pesan & Bayar",
      body: "Konfirmasi secara instan dengan QRIS, dompet digital, transfer bank, atau kredit.",
    },
    {
      index: "03",
      title: "Datang & Bermain",
      body: "Tunjukkan QR pemesanan di venue dan nikmati sesimu.",
    },
  ],
  support: {
    label: "Lokaria · Bantuan",
    title: "Butuh bantuan?",
    email: process.env.NEXT_PUBLIC_EMAIL_CONTACT
      ? process.env.NEXT_PUBLIC_EMAIL_CONTACT
      : "info@lokaria.labib.click",
    copyLabel: "Salin",
    copiedLabel: "Tersalin",
    rows: [
      { label: "WhatsApp", value: "+62 812 0000 0000" },
      {
        label: "Jam layanan",
        value: "Setiap hari, pukul 07.00 sampai 23.00 WIB",
      },
    ],
    primary: { label: "Hubungi Kami ↗", href: routes.whatsapp },
    secondary: { label: "Kunjungi Pusat Bantuan", href: routes.help },
  },
};

export const footer = {
  wordmark: "LOKARIA",
  newsletter: {
    label: "Tetap terhubung",
    placeholder: "Email Anda",
    button: "Daftar",
    success: "Anda sudah terdaftar.",
  },
  columns: [
    {
      heading: "Olahraga",
      links: [
        { label: "Sepak Bola & Futsal", href: routes.category("football") },
        { label: "Padel", href: routes.category("padel") },
        { label: "Tenis", href: routes.category("tennis") },
        { label: "Bulu Tangkis", href: routes.category("badminton") },
      ],
    },
    {
      heading: "Berkreasi & Bersantai",
      links: [
        { label: "Studio Musik", href: routes.category("music-studio") },
        { label: "Kolam Pancing", href: routes.category("fishing") },
        { label: "Segera Hadir", href: "/#categories" },
      ],
    },
    {
      heading: "Mitra",
      links: [
        { label: "Daftarkan Venue", href: routes.partner },
        { label: "Dasbor Mitra", href: "/partner/dashboard" },
        { label: "Kelola Lapangan", href: "/partner/courts" },
      ],
    },
    {
      heading: "Bantuan",
      links: [
        { label: "Tanya Jawab", href: routes.faq },
        { label: "Hubungi Kami", href: "/contact" },
        { label: "Pusat Bantuan", href: routes.help },
      ],
    },
    {
      heading: "Akun",
      links: [
        { label: "Masuk", href: routes.auth },
        { label: "Lokaria Plus", href: "/#membership" },
        { label: "Poin", href: "/#rewards" },
        { label: "Pesanan Saya", href: "/bookings" },
      ],
    },
    {
      heading: "Terhubung",
      // TODO: add real social profile URLs
      links: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "YouTube", href: "#" },
      ],
    },
  ] satisfies { heading: string; links: LinkItem[] }[],
  bottom: {
    left: "Lokaria. Temukan tempatmu.",
    middle: "Indonesia / © 2026 Lokaria",
    links: [
      { label: "Privasi", href: "/privacy" },
      { label: "Ketentuan", href: "/terms" },
    ],
  },
};

// ─── Category detail + placeholder pages ─────────────────────────────────────

export const categoryDetail = {
  back: { label: "← Semua kategori", href: "/#categories" },
  bookLabel: (title: string) => `Pesan ${title}`,
  highlights: { eyebrow: "Keunggulan", heading: "Mengapa bermain di sini" },
  venues: {
    eyebrow: "Venue tersedia",
    heading: "Pilih venue",
    all: "Semua kota",
    details: "Detail →",
    book: "Pesan",
    unit: "/ jam",
  },
  cta: {
    eyebrow: "Siap bermain?",
    heading: "Pesan tempatmu",
    body: "Pemesanan cepat dan mudah dalam waktu kurang dari 60 detik.",
    secondary: { label: "Hubungi kami", href: "/contact" },
  },
};

export const comingSoon = {
  eyebrow: "Segera hadir",
  body: "Kami sedang menyiapkan halaman ini. Sementara itu, temukan tempat untuk bermain.",
  primary: { label: "Kembali ke beranda", href: "/" },
  secondary: { label: "Jelajahi kategori", href: "/#categories" },
  /** Every linked route that doesn't exist yet → page title. */
  pages: {
    booking: "Pemesanan",
    auth: "Masuk",
    faq: "Tanya Jawab",
    partner: "Mitra Lokaria",
    "partner/dashboard": "Dasbor Mitra",
    events: "Acara",
    help: "Pusat Bantuan",
    contact: "Hubungi Kami",
    bookings: "Pesanan Saya",
    privacy: "Privasi",
    terms: "Ketentuan",
    ...Object.fromEntries(
      events.items.map((e) => [`events/${e.slug}`, e.title]),
    ),
  } as Record<string, string>,
};
