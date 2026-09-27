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
const IMG_PADEL = "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_TENNIS = "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_INDOOR = "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200";
// TODO: replace with Lokaria photo
const IMG_ARENA = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200";

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
  tagline: "Find your place. Book your time.",
  meta: {
    title: "Lokaria | Book Sports Venues & Creative Spaces",
    description:
      "Book football, futsal, padel, tennis and badminton courts, music studios and fishing ponds near you. Live availability, instant confirmation, secure payment.",
  },
};

export const nav = {
  links: [
    { label: "Explore", href: "/#categories" },
    { label: "For Venues", href: "/#for-venues" },
    { label: "Rewards", href: "/#rewards" },
    { label: "Membership", href: "/#membership" },
    { label: "FAQ", href: routes.faq },
  ] satisfies LinkItem[],
  signIn: { label: "Sign in", href: routes.auth },
  cta: { label: "Book a Space", href: routes.booking },
  floatingCta: { label: "Book", href: routes.booking },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export type CategoryAccent = "football" | "padel" | "tennis" | "badminton" | "music" | "fishing";

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
    label: "House rules",
    items: ["Arrive 10 minutes before your slot.", "Show your booking QR at the front desk.", "Follow each venue's own safety guidelines."],
  },
  {
    label: "Cancellation",
    items: ["Free cancellation up to 24 hours before.", "Credits are refunded to your Lokaria wallet.", "Elite members reschedule free up to 6 hours before."],
  },
  { label: "What to bring", items: bring },
];

// TODO: replace placeholder highlights, venues and rules with real partner data
export const categories: Category[] = [
  {
    slug: "football",
    index: "01",
    code: "FB",
    title: "Football & Futsal",
    description: "Indoor futsal courts and outdoor mini soccer pitches",
    price: 150000,
    unit: "/ pitch / hr",
    accent: "football",
    image: { src: IMG_TENNIS, alt: "Floodlit outdoor pitch" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Indoor futsal courts and outdoor mini soccer pitches, bookable by the hour with instant confirmation.",
      highlights: ["Vinyl & synthetic turf", "Night lighting", "Changing rooms", "Ball & bib rental"],
      venues: [
        { slug: "arena-kemang", name: "Arena Kemang", city: "Jakarta", tag: "Indoor", description: "Two FIFA-size futsal courts with stands.", price: 180000, image: { src: IMG_ARENA, alt: "Indoor futsal court" }, live: "3 slots today" },
        { slug: "gbk-mini-soccer", name: "Senayan Mini Soccer", city: "Jakarta", tag: "Outdoor", description: "Seven-a-side synthetic pitch under lights.", price: 350000, image: { src: IMG_TENNIS, alt: "Outdoor mini soccer pitch" } },
        { slug: "dago-futsal", name: "Dago Futsal Center", city: "Bandung", tag: "Indoor", description: "Three courts, cafe and parking on site.", price: 150000, image: { src: IMG_INDOOR, alt: "Futsal court" }, live: "5 slots today" },
        { slug: "pakuwon-soccer", name: "Pakuwon Soccer Park", city: "Surabaya", tag: "Outdoor", description: "Mini soccer with shaded seating for fans.", price: 300000, image: { src: IMG_TENNIS, alt: "Mini soccer pitch" } },
      ],
      rules: defaultRules(["Futsal or turf shoes", "Shin guards", "Water bottle"]),
    },
  },
  {
    slug: "padel",
    index: "02",
    code: "PD",
    title: "Padel",
    description: "Panoramic glass courts, indoor and outdoor",
    price: 250000,
    unit: "/ court / hr",
    accent: "padel",
    image: { src: IMG_PADEL, alt: "Padel court" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Panoramic glass courts, indoor and outdoor, for doubles games any time of day.",
      highlights: ["Panoramic glass walls", "Pro-grade artificial turf", "Indoor & outdoor courts", "Racket & ball rental"],
      venues: [
        { slug: "padel-pik", name: "PIK Padel Club", city: "Jakarta", tag: "Panoramic", description: "Four panoramic courts by the waterfront.", price: 300000, image: { src: IMG_PADEL, alt: "Panoramic padel court" }, live: "2 slots today" },
        { slug: "padel-senopati", name: "Senopati Padel House", city: "Jakarta", tag: "Indoor", description: "Climate-controlled courts in the city centre.", price: 350000, image: { src: IMG_INDOOR, alt: "Indoor padel court" } },
        { slug: "padel-bandung", name: "Lembang Padel Garden", city: "Bandung", tag: "Outdoor", description: "Cool mountain air and three outdoor courts.", price: 250000, image: { src: IMG_PADEL, alt: "Outdoor padel court" }, live: "4 slots today" },
      ],
      rules: defaultRules(["Padel racket (or rent on site)", "Non-marking court shoes", "Water bottle"]),
    },
  },
  {
    slug: "tennis",
    index: "03",
    code: "TN",
    title: "Tennis",
    description: "Hard and clay courts with night lighting",
    price: 150000,
    unit: "/ court / hr",
    accent: "tennis",
    image: { src: IMG_TENNIS, alt: "Tennis court" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Hard and clay courts with night lighting, from casual rallies to competitive sets.",
      highlights: ["Hard & clay surfaces", "Night lighting", "Ball machine rental", "Coaches on request"],
      venues: [
        { slug: "tennis-senayan", name: "Senayan Tennis Courts", city: "Jakarta", tag: "Hard", description: "Tournament-standard hard courts.", price: 200000, image: { src: IMG_TENNIS, alt: "Hard tennis court" }, live: "6 slots today" },
        { slug: "tennis-bandung", name: "Setiabudi Clay Club", city: "Bandung", tag: "Clay", description: "Red clay courts with a clubhouse.", price: 150000, image: { src: IMG_TENNIS, alt: "Clay tennis court" } },
        { slug: "tennis-yogya", name: "Kaliurang Tennis Park", city: "Yogyakarta", tag: "Hard", description: "Quiet courts with night lighting.", price: 150000, image: { src: IMG_ARENA, alt: "Tennis court at night" } },
      ],
      rules: defaultRules(["Tennis racket", "Tennis shoes", "Towel"]),
    },
  },
  {
    slug: "badminton",
    index: "04",
    code: "BD",
    title: "Badminton",
    description: "Wooden and vinyl courts with tournament-standard nets",
    price: 60000,
    unit: "/ court / hr",
    accent: "badminton",
    image: { src: IMG_ARENA, alt: "Badminton hall" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Wooden and vinyl courts with tournament-standard nets and bright, even lighting.",
      highlights: ["Wooden & vinyl floors", "Tournament-standard nets", "Anti-glare lighting", "Shuttlecock sales"],
      venues: [
        { slug: "gor-cempaka", name: "GOR Cempaka", city: "Jakarta", tag: "Wooden", description: "Eight wooden courts under one roof.", price: 80000, image: { src: IMG_ARENA, alt: "Wooden badminton court" }, live: "8 slots today" },
        { slug: "gor-pajajaran", name: "GOR Pajajaran", city: "Bandung", tag: "Vinyl", description: "Vinyl courts used by local clubs.", price: 60000, image: { src: IMG_INDOOR, alt: "Vinyl badminton court" } },
        { slug: "gor-kertajaya", name: "Kertajaya Sports Hall", city: "Surabaya", tag: "Wooden", description: "Six courts with spectator seating.", price: 70000, image: { src: IMG_ARENA, alt: "Badminton hall" }, live: "2 slots today" },
      ],
      rules: defaultRules(["Badminton racket", "Non-marking shoes", "Shuttlecocks"]),
    },
  },
  {
    slug: "music-studio",
    index: "05",
    code: "MS",
    title: "Music Studio",
    description: "Rehearsal and recording rooms with full backline",
    price: 80000,
    unit: "/ room / hr",
    accent: "music",
    image: { src: IMG_INDOOR, alt: "Music studio" }, // TODO: replace with Lokaria photo
    span: 7,
    detail: {
      lead: "Rehearsal and recording rooms with full backline, soundproofed and ready when you are.",
      highlights: ["Full backline", "Soundproofed rooms", "Recording add-on", "Late-night slots"],
      venues: [
        { slug: "studio-blok-m", name: "Blok M Sound Room", city: "Jakarta", tag: "Rehearsal", description: "Three rooms with drums, amps and PA.", price: 100000, image: { src: IMG_INDOOR, alt: "Rehearsal room" }, live: "Open now" },
        { slug: "studio-braga", name: "Braga Studio", city: "Bandung", tag: "Recording", description: "Tracking room with an engineer on call.", price: 150000, image: { src: IMG_INDOOR, alt: "Recording studio" } },
        { slug: "studio-prawirotaman", name: "Prawirotaman Jam Space", city: "Yogyakarta", tag: "Rehearsal", description: "Cosy rooms for bands and solo practice.", price: 80000, image: { src: IMG_ARENA, alt: "Jam space" }, live: "Open now" },
      ],
      rules: defaultRules(["Your own instrument (optional)", "Cables & picks", "Earplugs"]),
    },
  },
  {
    slug: "fishing",
    index: "06",
    code: "FP",
    title: "Fishing Pond",
    description: "Stocked ponds with shaded gazebos and gear rental",
    price: 40000,
    unit: "/ person / session",
    accent: "fishing",
    image: { src: IMG_ARENA, alt: "Fishing pond" }, // TODO: replace with Lokaria photo
    span: 5,
    detail: {
      lead: "Stocked ponds with shaded gazebos and gear rental, for a slow morning or a family day out.",
      highlights: ["Stocked daily", "Shaded gazebos", "Rod & bait rental", "Family friendly"],
      venues: [
        { slug: "pond-sidoarjo", name: "Telaga Sidoarjo", city: "Surabaya", tag: "Stocked", description: "Large pond with twenty gazebos.", price: 50000, image: { src: IMG_ARENA, alt: "Fishing pond with gazebos" }, live: "Open now" },
        { slug: "pond-sleman", name: "Kolam Sleman", city: "Yogyakarta", tag: "Family", description: "Shallow ponds and a small cafe.", price: 40000, image: { src: IMG_INDOOR, alt: "Family fishing pond" } },
        { slug: "pond-bekasi", name: "Pemancingan Bekasi", city: "Jakarta", tag: "Stocked", description: "Night sessions every weekend.", price: 60000, image: { src: IMG_ARENA, alt: "Fishing pond" } },
      ],
      rules: defaultRules(["Hat & sunscreen", "Cooler box for your catch", "Your own rod (optional)"]),
    },
  },
];

export const categoryLabel = (c: Category) => `From ${rupiah(c.price)} ${c.unit}`;

// ─── Cities ──────────────────────────────────────────────────────────────────

export type City = { slug: string; label: string; meta: string; title: string; subtitle: string; image: Img };

export const cities: City[] = [
  { slug: "jakarta", label: "City 01", meta: "120+ Venues", title: "Jakarta", subtitle: "Football, Padel, Tennis, Music Studios", image: { src: IMG_PADEL, alt: "Jakarta venue" } }, // TODO: replace with Lokaria photo
  { slug: "bandung", label: "City 02", meta: "80+ Venues", title: "Bandung", subtitle: "Futsal, Badminton, Music Studios", image: { src: IMG_TENNIS, alt: "Bandung venue" } }, // TODO: replace with Lokaria photo
  { slug: "surabaya", label: "City 03", meta: "60+ Venues", title: "Surabaya", subtitle: "Football, Badminton, Fishing Ponds", image: { src: IMG_INDOOR, alt: "Surabaya venue" } }, // TODO: replace with Lokaria photo
  { slug: "yogyakarta", label: "City 04", meta: "40+ Venues", title: "Yogyakarta", subtitle: "Futsal, Music Studios, Fishing Ponds", image: { src: IMG_ARENA, alt: "Yogyakarta venue" } }, // TODO: replace with Lokaria photo
];

// ─── Homepage sections ───────────────────────────────────────────────────────

export const hero = {
  eyebrow: "One App. Every Place to Play.",
  heading: { before: "Find your", accent: "PLACE", after: "to play" } satisfies Accented,
  sub: "Book football pitches, courts, music studios and fishing ponds across Indonesia. Check live availability, pick your slot and pay in seconds.",
  primary: { label: "Book Now", href: routes.booking },
  secondary: { label: "Explore Categories", href: "/#categories" },
  slides: [
    { label: "Football & Futsal", image: { src: IMG_TENNIS, alt: "Football pitch under lights" } }, // TODO: replace with Lokaria photo
    { label: "Racket Sports", image: { src: IMG_PADEL, alt: "Padel court" } }, // TODO: replace with Lokaria photo
    { label: "Music Studios", image: { src: IMG_INDOOR, alt: "Music studio" } }, // TODO: replace with Lokaria photo
    { label: "Fishing Ponds", image: { src: IMG_ARENA, alt: "Fishing pond" } }, // TODO: replace with Lokaria photo
  ],
  search: {
    what: { label: "What", placeholder: "Choose category" },
    where: { label: "Where", placeholder: "Choose city" },
    when: { label: "When", placeholder: "Date & time" },
    button: "Search",
  },
  scrollHint: "Scroll to discover",
};

export const categoriesSection = {
  id: "categories",
  eyebrow: "Six Ways to Play",
  heading: { before: "Explore by", accent: "CATEGORY" } satisfies Accented,
  sub: "From weekend football to late-night jam sessions, every space is verified, bookable by the hour and confirmed instantly.",
  detailsLabel: "View details",
  bookLabel: "Book now",
  comingSoon: { label: "Coming soon", items: ["Basketball", "Mini Soccer", "Photo Studio", "Meeting Room", "Swimming Pool"] },
};

export const manifesto = {
  eyebrow: "Manifesto",
  statement: {
    before: "We built Lokaria because finding a place to play should be as easy as deciding to play.",
    accent: "One app, every space,",
    after: "no more calls, chats or waiting for a reply.",
  } satisfies Accented,
  meta: ["Indonesia", "6 Categories at Launch", "Est. 2026"],
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
    image: { src: IMG_INDOOR, alt: "Players on an indoor court" }, // TODO: replace with Lokaria photo
    imageLabel: "Live Availability",
    eyebrow: "For Players",
    heading: { before: "Book in", accent: "60 SECONDS" },
    body: "See every open slot live, compare venues by price, distance and rating, and lock in your booking with instant confirmation. Split the bill with friends and get a reminder before you play.",
    chips: ["Live Slot Calendar", "Instant Confirmation", "Split Payment", "QRIS & E-Wallet"],
    cta: { label: "Start Booking", href: routes.booking },
  },
  {
    id: "for-venues",
    dark: true,
    reverse: true,
    image: { src: IMG_ARENA, alt: "Venue at night" }, // TODO: replace with Lokaria photo
    stat: { value: "24/7", label: "Bookings come in while you sleep" },
    eyebrow: "For Venue Owners",
    heading: { before: "Grow with", accent: "LOKARIA PARTNER" },
    body: "Turn empty hours into revenue. Manage schedules, pricing, staff and payouts from one dashboard, and reach players searching for a place near you.",
    list: ["Smart Schedule Manager", "Dynamic Pricing", "Automatic Payouts", "Sales Reports"],
    cta: { label: "List Your Venue", href: routes.partner },
  },
];

export const rewards = {
  id: "rewards",
  eyebrow: "Lokaria Rewards",
  heading: { before: "Earn points on", accent: "EVERY BOOKING" } satisfies Accented,
  body: "Every booking in any category earns Lokaria Points. Redeem them for free hours, partner vouchers and membership upgrades.",
  stats: [
    { value: "1 Point", label: "per Rp 10.000 spent" },
    { value: "Cross-Category", label: "earn on the court, redeem at the studio" },
  ],
  card: {
    label: "Lokaria Pass",
    tier: "Gold Tier",
    balanceLabel: "Current Balance",
    balance: "2,450",
    unit: "Lokaria Points",
    voucherLabel: "Available Voucher",
    voucher: `${rupiah(50000)} off next booking`,
    note: "Sign in or create an account to activate your rewards pass.",
  },
};

export const citiesSection = {
  eyebrow: "Where We Play",
  heading: { before: "Explore by", accent: "CITY" } satisfies Accented,
  sub: "Discover verified venues in cities across Indonesia, with new partners joining every month.",
  note: "Tap to see venues near you.",
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
  heading: { before: "Membership", accent: "TIERS" } satisfies Accented,
  sub: "Play more, pay less. Get booking credits, member discounts and early access to peak hours at every partner venue.",
  cta: { label: "Join Tier →", href: routes.register },
  tiers: [
    {
      tone: "silver",
      index: "Tier 01",
      name: "Starter",
      note: "For casual weekend players",
      price: 250000,
      period: "/ 30 days",
      credits: "+25 credits",
      features: ["25 credits included, usable in any category", "Up to 5% member discount", "Book up to 3 days ahead", "30-day validity per cycle"],
    },
    {
      tone: "gold",
      index: "Tier 02",
      name: "Pro",
      popular: "Most Popular",
      note: "For regular players and bands",
      price: 500000,
      period: "/ 30 days",
      credits: "+55 credits",
      features: ["55 credits included (10% bonus)", "Up to 10% member discount", "Book up to 7 days ahead", "2x Lokaria Points on every booking"],
    },
    {
      tone: "black",
      index: "Tier 03",
      name: "Elite",
      note: "For teams, clubs and power users",
      price: 1000000,
      period: "/ 30 days",
      credits: "+115 credits",
      features: ["115 credits included (15% bonus)", "Up to 15% member discount", "Book up to 14 days ahead", "Free rescheduling up to 6 hours before"],
    },
  ] satisfies Tier[],
};

export type EventItem = { slug: string; day: string; month: string; tag: string; title: string; description: string };

export const events = {
  eyebrow: "Community Calendar",
  heading: { before: "Upcoming", accent: "EVENTS" } satisfies Accented,
  link: { label: "View All Events", href: routes.events },
  items: [
    { slug: "lokaria-futsal-league-season-1", day: "18", month: "Oct", tag: "Futsal", title: "Lokaria Futsal League, Season 1", description: "A 16-team league played across partner venues in Jakarta." },
    { slug: "weekend-padel-americano", day: "25", month: "Oct", tag: "Padel", title: "Weekend Padel Americano", description: "Mixed-level social tournament, every player welcome." },
    { slug: "open-jam-night", day: "08", month: "Nov", tag: "Music", title: "Open Jam Night", description: "Bring your instrument and share the stage at a partner studio." },
    { slug: "lokaria-fishing-cup", day: "15", month: "Nov", tag: "Fishing", title: "Lokaria Fishing Cup", description: "Biggest catch wins. Family friendly, gear rental available." },
  ] satisfies EventItem[],
};

export const finalCta = {
  image: { src: IMG_TENNIS, alt: "" }, // TODO: replace with Lokaria photo
  eyebrow: "Ready to Play?",
  heading: { before: "Claim your", accent: "SPOT", after: "today" } satisfies Accented,
  body: "New slots open every day. Find yours and book in under a minute.",
  primary: { label: "Book Now", href: routes.booking },
  secondary: { label: "Create Account", href: routes.register },
};

export const howItWorks = {
  eyebrow: "How It Works",
  heading: { before: "Three steps to", accent: "GAME ON." } satisfies Accented,
  aside: brand.tagline,
  image: { src: IMG_INDOOR, alt: "" }, // TODO: replace with Lokaria photo
  statusPill: "Live availability · 24/7",
  steps: [
    { index: "01", title: "Search", body: "Pick a category, city and time to see every available slot." },
    { index: "02", title: "Book & Pay", body: "Confirm instantly with QRIS, e-wallet, bank transfer or credits." },
    { index: "03", title: "Show Up & Play", body: "Show your booking QR at the venue and enjoy your session." },
  ],
  support: {
    label: "Lokaria · Support",
    title: "Need a hand?",
    email: "hello@lokaria.id",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    rows: [
      { label: "WhatsApp", value: "+62 812 0000 0000" },
      { label: "Hours", value: "Every day, 07.00 to 23.00 WIB" },
    ],
    primary: { label: "Chat with Us ↗", href: routes.whatsapp },
    secondary: { label: "Visit Help Center", href: routes.help },
  },
};

export const footer = {
  wordmark: "LOKARIA",
  newsletter: { label: "Stay in the game", placeholder: "Your email", button: "Join", success: "You're on the list." },
  columns: [
    {
      heading: "Play",
      links: [
        { label: "Football & Futsal", href: routes.category("football") },
        { label: "Padel", href: routes.category("padel") },
        { label: "Tennis", href: routes.category("tennis") },
        { label: "Badminton", href: routes.category("badminton") },
      ],
    },
    {
      heading: "Create & Relax",
      links: [
        { label: "Music Studios", href: routes.category("music-studio") },
        { label: "Fishing Ponds", href: routes.category("fishing") },
        { label: "Coming Soon", href: "/#categories" },
      ],
    },
    {
      heading: "Partners",
      links: [
        { label: "List Your Venue", href: routes.partner },
        { label: "Partner Dashboard", href: "/partner/dashboard" },
        { label: "Pricing for Venues", href: "/partner/pricing" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "FAQ", href: routes.faq },
        { label: "Contact Us", href: "/contact" },
        { label: "Help Center", href: routes.help },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "Sign in", href: routes.auth },
        { label: "Lokaria Plus", href: "/#membership" },
        { label: "Rewards", href: "/#rewards" },
        { label: "My Bookings", href: "/bookings" },
      ],
    },
    {
      heading: "Connect",
      // TODO: add real social profile URLs
      links: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "YouTube", href: "#" },
      ],
    },
  ] satisfies { heading: string; links: LinkItem[] }[],
  bottom: {
    left: "Lokaria. Find your place.",
    middle: "Indonesia / © 2026 Lokaria",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
};

// ─── Category detail + placeholder pages ─────────────────────────────────────

export const categoryDetail = {
  back: { label: "← All categories", href: "/#categories" },
  bookLabel: (title: string) => `Book ${title}`,
  highlights: { eyebrow: "Highlights", heading: "Why play here" },
  venues: { eyebrow: "Available venues", heading: "Choose your venue", all: "All cities", details: "Details →", book: "Book", unit: "/ hour" },
  cta: {
    eyebrow: "Ready to play?",
    heading: "Reserve your spot",
    body: "Fast, seamless booking in under 60 seconds.",
    secondary: { label: "Contact us", href: "/contact" },
  },
};

export const comingSoon = {
  eyebrow: "Coming soon",
  body: "We're building this page right now. In the meantime, find a place to play.",
  primary: { label: "Back home", href: "/" },
  secondary: { label: "Explore categories", href: "/#categories" },
  /** Every linked route that doesn't exist yet → page title. */
  pages: {
    booking: "Booking",
    auth: "Sign in",
    faq: "FAQ",
    partner: "Lokaria Partner",
    "partner/dashboard": "Partner Dashboard",
    "partner/pricing": "Pricing for Venues",
    events: "Events",
    help: "Help Center",
    contact: "Contact Us",
    bookings: "My Bookings",
    privacy: "Privacy",
    terms: "Terms",
    ...Object.fromEntries(events.items.map((e) => [`events/${e.slug}`, e.title])),
  } as Record<string, string>,
};
