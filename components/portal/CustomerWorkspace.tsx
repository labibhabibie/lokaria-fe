"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Gift,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";
import { SmartLink } from "@/components/ui/SmartLink";
import { useAuth } from "@/components/auth/AuthProvider";
import { categories, routes, rupiah } from "@/content/site";
import { customerBookings } from "@/mock/portal";
import { createClient } from "@/lib/supabase/client";
import {
  EmptyState,
  Panel,
  StatusBadge,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "./Primitives";
import {
  useCustomerBookings,
  useMarketplaceVenues,
  useUnavailableSlots,
  type MarketplaceVenue,
} from "./customer/useMarketplace";

type ListedVenue = MarketplaceVenue;

const fallbackVenues: ListedVenue[] = categories.flatMap((category) =>
  category.detail.venues.map((venue) => ({
    ...venue,
    id: "",
    category: category.title,
    categorySlug: category.slug,
    courts: [{ id: "", name: "Lapangan utama", price: venue.price }],
  })),
);

const slots = [
  "08:00",
  "09:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "19:00",
  "20:00",
];

const BOOKING_DRAFT_KEY = "lokaria.booking.draft.v1";
const BOOKING_PAYMENT_KEY = "lokaria.booking.payment.v1";

function localIsoDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type BookingDraft = {
  venueId: string;
  venueSlug: string;
  venueName: string;
  courtId: string;
  courtName: string;
  date: string;
  slots: string[];
  unitPrice: number;
};

type BookingPayment = {
  bookingId: string;
  paymentId: string;
  bookingCode: string;
  venueName: string;
  courtName: string;
  date: string;
  slots: string[];
  method: string;
  total: number;
  demo?: boolean;
};

function VenueCard({ venue }: { venue: ListedVenue }) {
  return (
    <article className="group overflow-hidden border border-line bg-white">
      <SmartLink
        href={routes.venue(venue.slug)}
        className="relative block aspect-[16/10] overflow-hidden bg-stone"
      >
        <Image
          src={venue.image.src}
          alt={venue.image.alt}
          fill
          sizes="(max-width: 640px) 88vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-extrabold tracking-label uppercase">
          {venue.category}
        </span>
      </SmartLink>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-extrabold uppercase">{venue.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-[#11111180]">
              <MapPin size={12} /> {venue.city}
            </p>
          </div>
          {venue.live && <StatusBadge>{venue.live}</StatusBadge>}
        </div>
        <p className="mt-4 text-[11px] leading-[1.6] text-[#11111180]">
          {venue.description}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <p>
            <strong className="text-[14px]">{rupiah(venue.price)}</strong>
            <span className="block text-[9px] text-[#11111173]">per sesi</span>
          </p>
          <SmartLink href={`/booking?venue=${venue.slug}`} className={secondaryButton}>
            Pesan <ChevronRight size={14} />
          </SmartLink>
        </div>
      </div>
    </article>
  );
}

function Explore() {
  const { venues } = useMarketplaceVenues();
  const featured = venues[0] ?? fallbackVenues[0];
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-[1.3fr_.7fr] overflow-hidden bg-olive text-white tablet:grid-cols-1">
        <div className="p-[clamp(24px,5vw,54px)]">
          <p className="text-[10px] font-extrabold tracking-eyebrow text-beige uppercase">
            Temukan sesi berikutnya
          </p>
          <h2 className="mt-4 max-w-[650px] text-[clamp(30px,5vw,58px)] leading-[.96] font-extrabold uppercase">
            Bermain, berlatih, atau berkarya hari ini.
          </h2>
          <div className="mt-8 grid grid-cols-[1fr_1fr_auto] gap-2 mobile:grid-cols-1">
            <label className="relative">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-olive"
              />
              <span className="sr-only">Cari venue</span>
              <input
                className={`${fieldClass} pl-10 text-ink`}
                placeholder="Aktivitas atau venue"
              />
            </label>
            <select aria-label="Kota" className={`${fieldClass} text-ink`}>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
              <option>Yogyakarta</option>
            </select>
            <SmartLink
              href="/venues"
              className={`${primaryButton} border-beige bg-beige text-ink hover:bg-beige-hover`}
            >
              Jelajahi
            </SmartLink>
          </div>
        </div>
        <div className="relative min-h-[280px] tablet:min-h-[230px]">
          <Image
            src={featured.image.src}
            alt="Lapangan padel"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-extrabold tracking-label text-olive uppercase">
              Jelajahi berdasarkan aktivitas
            </p>
            <h2 className="mt-1 text-[20px] font-extrabold uppercase">
              Apa yang sedang kamu cari?
            </h2>
          </div>
          <SmartLink href="/venues" className="text-[10px] font-extrabold text-olive uppercase">
            Lihat semua
          </SmartLink>
        </div>
        <div className="no-scrollbar grid grid-cols-6 gap-2 overflow-x-auto pb-2 tablet:grid-cols-none tablet:auto-cols-[160px] tablet:grid-flow-col">
          {categories.map((category) => (
            <SmartLink
              key={category.slug}
              href={`/venues?category=${category.slug}`}
              className="min-h-[126px] border border-line bg-white p-4 text-ink no-underline hover:border-olive"
            >
              <span className="text-[9px] text-[#11111173]">{category.code}</span>
              <h3 className="mt-8 text-[12px] font-extrabold uppercase">
                {category.title}
              </h3>
              <p className="mt-2 text-[9px] text-olive">Mulai {rupiah(category.price)}</p>
            </SmartLink>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-[1fr_310px] gap-6 tablet:grid-cols-1">
        <section>
          <h2 className="mb-4 text-[20px] font-extrabold uppercase">Populer di dekatmu</h2>
          <div className="grid grid-cols-2 gap-3 mobile:no-scrollbar mobile:-mx-[18px] mobile:flex mobile:snap-x mobile:overflow-x-auto mobile:px-[18px]">
            {venues.slice(0, 4).map((venue) => (
              <div key={venue.slug} className="mobile:w-[84vw] mobile:shrink-0">
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        </section>
        <Panel title="Pemesanan mendatang" eyebrow="Besok">
          <div className="p-5">
            <StatusBadge>Terkonfirmasi</StatusBadge>
            <h3 className="mt-5 text-[18px] font-extrabold uppercase">PIK Padel Club</h3>
            <p className="mt-2 text-[11px] text-[#11111180]">Lapangan 02</p>
            <div className="mt-5 space-y-3 border-y border-line py-4 text-[11px]">
              <p className="flex items-center gap-2"><CalendarDays size={15} />28 Sep 2026</p>
              <p className="flex items-center gap-2"><Clock3 size={15} />19:00 - 20:00</p>
            </div>
            <SmartLink href="/bookings" className={`${secondaryButton} mt-5 w-full`}>
              Lihat pesanan
            </SmartLink>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function VenueList() {
  const { venues, loading } = useMarketplaceVenues();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Semua kota");
  const filtered = useMemo(
    () =>
      venues.filter(
        (venue) =>
          (city === "Semua kota" || venue.city === city) &&
          `${venue.name} ${venue.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [city, query, venues],
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(220px,1fr)_220px] gap-2 mobile:grid-cols-1">
        <label className="relative">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#11111173]"
          />
          <span className="sr-only">Cari venue</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`${fieldClass} pl-10`}
            placeholder="Cari venue atau aktivitas"
          />
        </label>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className={fieldClass}
          aria-label="Saring kota"
        >
          <option>Semua kota</option>
          {[...new Set(venues.map((venue) => venue.city))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <p className="text-[11px] text-[#11111173]">{loading ? "Memuat venue mitra..." : `${filtered.length} venue ditemukan`}</p>
      {filtered.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filtered.map((venue) => <VenueCard key={venue.slug} venue={venue} />)}
        </div>
      ) : (
        <Panel>
          <EmptyState
            icon={Search}
            title="Venue tidak ditemukan"
            text="Coba kota atau kata pencarian lainnya."
          />
        </Panel>
      )}
    </div>
  );
}

function VenueDetail({ path }: { path: string }) {
  const { venues } = useMarketplaceVenues();
  const venue = venues.find((item) => item.slug === path.split("/").pop()) ?? venues[0] ?? fallbackVenues[0];
  const category = categories.find((item) => item.slug === venue.categorySlug) ?? categories[0];

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-[1.1fr_.9fr] border border-line bg-white tablet:grid-cols-1">
        <div className="relative min-h-[430px] tablet:min-h-[280px]">
          <Image
            src={venue.image.src}
            alt={venue.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
        <div className="p-[clamp(24px,4vw,44px)]">
          <StatusBadge>{venue.live ?? "Tersedia"}</StatusBadge>
          <p className="mt-6 text-[10px] font-extrabold text-olive uppercase">{venue.category}</p>
          <h2 className="mt-2 text-[clamp(27px,4vw,44px)] leading-none font-extrabold uppercase">
            {venue.name}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-[#11111180]">
            <MapPin size={14} /> {venue.city}
          </p>
          <p className="mt-6 text-[13px] leading-[1.7] text-[#11111180]">
            {category.detail.lead}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {category.detail.highlights.slice(0, 4).map((item) => (
              <span key={item} className="flex items-center gap-2 bg-ivory p-3 text-[10px] font-bold">
                <Check size={13} /> {item}
              </span>
            ))}
          </div>
          <p className="mt-7 text-[10px] text-[#11111173]">Mulai dari</p>
          <p className="mt-1 text-[23px] font-extrabold">{rupiah(venue.price)}</p>
          <SmartLink
            href={`/booking?venue=${venue.slug}`}
            className={`${primaryButton} mt-5 w-full`}
          >
            Pilih jadwal
          </SmartLink>
        </div>
      </section>
      <Panel title="Ruang tersedia" eyebrow="Pratinjau langsung">
        <div className="grid grid-cols-3 gap-3 p-5 tablet:grid-cols-1">
          {venue.courts.map((court) => (
            <article key={court.id || court.name} className="border border-line p-4">
              <h3 className="text-[13px] font-extrabold uppercase">{court.name}</h3>
              <p className="mt-2 text-[10px] text-[#11111173]">Mulai {rupiah(court.price)} per sesi</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Booking() {
  const router = useRouter();
  const { venues } = useMarketplaceVenues();
  const [venueSlug, setVenueSlug] = useState(fallbackVenues[0].slug);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState(localIsoDate());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const current = venues.find((item) => item.slug === venueSlug) ?? venues[0] ?? fallbackVenues[0];
  const currentCourt = current.courts.find((court) => court.id === courtId) ?? current.courts[0];
  const unavailableSlots = useUnavailableSlots(currentCourt?.id ?? "", date);
  const total = (currentCourt?.price ?? current.price) * selectedSlots.length;

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("venue");
    if (requested && venues.some((venue) => venue.slug === requested)) {
      queueMicrotask(() => setVenueSlug(requested));
    } else if (!venues.some((venue) => venue.slug === venueSlug) && venues[0]) {
      queueMicrotask(() => setVenueSlug(venues[0].slug));
    }
  }, [venueSlug, venues]);

  useEffect(() => {
    if (currentCourt?.id && currentCourt.id !== courtId) queueMicrotask(() => setCourtId(currentCourt.id));
  }, [courtId, currentCourt?.id]);

  useEffect(() => {
    queueMicrotask(() => setSelectedSlots((selected) => selected.filter((slot) => !unavailableSlots.includes(slot))));
  }, [unavailableSlots]);

  const toggleSlot = (slot: string) => {
    setSelectedSlots((selected) =>
      selected.includes(slot)
        ? selected.filter((item) => item !== slot)
        : [...selected, slot].sort(
            (left, right) => slots.indexOf(left) - slots.indexOf(right),
          ),
    );
  };

  const continueToCheckout = () => {
    if (!selectedSlots.length) return;
    const draft: BookingDraft = {
      venueId: current.id,
      venueSlug,
      venueName: current.name,
      courtId: currentCourt?.id ?? "",
      courtName: currentCourt?.name ?? "Lapangan utama",
      date,
      slots: selectedSlots,
      unitPrice: currentCourt?.price ?? current.price,
    };
    window.sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5 tablet:grid-cols-1">
      <Panel title="Pilih sesimu" eyebrow="Langkah 1 dari 2">
        <div className="space-y-7 p-5">
          <label className="block text-[10px] font-extrabold tracking-label uppercase">
            Venue
            <select
              value={venueSlug}
              onChange={(event) => {
                setVenueSlug(event.target.value);
                setCourtId("");
                setSelectedSlots([]);
              }}
              className={`${fieldClass} mt-2 normal-case`}
            >
              {venues.map((venue) => (
                <option key={venue.slug} value={venue.slug}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[10px] font-extrabold tracking-label uppercase">
            Lapangan
            <select
              value={currentCourt?.id ?? ""}
              onChange={(event) => {
                setCourtId(event.target.value);
                setSelectedSlots([]);
              }}
              className={`${fieldClass} mt-2 normal-case`}
            >
              {current.courts.map((court) => <option key={court.id || court.name} value={court.id}>{court.name} - {rupiah(court.price)}</option>)}
            </select>
          </label>
          <label className="block text-[10px] font-extrabold tracking-label uppercase">
            Tanggal
            <input
              type="date"
              min={localIsoDate()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={`${fieldClass} mt-2 normal-case`}
            />
          </label>
          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-label uppercase">
              Waktu tersedia
            </p>
            <div className="grid grid-cols-4 gap-2 mobile:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  disabled={unavailableSlots.includes(slot)}
                  onClick={() => toggleSlot(slot)}
                  aria-pressed={selectedSlots.includes(slot)}
                  className={`min-h-12 cursor-pointer rounded-field border text-[11px] font-bold disabled:cursor-not-allowed disabled:bg-stone disabled:text-[#11111142] ${
                    selectedSlots.includes(slot)
                      ? "border-olive bg-olive text-white"
                      : "border-line bg-white hover:border-olive"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-[#11111173]">
              Pilih satu atau beberapa waktu yang tersedia. Jadwal berwarna abu-abu tidak dapat dipilih.
            </p>
          </div>
        </div>
      </Panel>
      <Panel title="Ringkasan pemesanan" eyebrow="Pilihanmu">
        <div className="p-5">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={current.image.src}
              alt={current.image.alt}
              fill
              sizes="340px"
              className="object-cover"
            />
          </div>
          <h3 className="mt-5 text-[17px] font-extrabold uppercase">{current.name}</h3>
          <p className="mt-1 text-[11px] text-[#11111173]">{currentCourt?.name ?? "Lapangan utama"} - {current.city}</p>
          <div className="mt-5 space-y-3 border-y border-line py-4 text-[11px]">
            <p className="flex justify-between gap-4"><span>Tanggal</span><strong>{date}</strong></p>
            <div className="flex items-start justify-between gap-4">
              <span>Waktu</span>
              <strong className="text-right">
                {selectedSlots.length ? selectedSlots.join(", ") : "Belum ada jadwal dipilih"}
              </strong>
            </div>
            <p className="flex justify-between gap-4">
              <span>Sesi</span><strong>{selectedSlots.length} x 60 menit</strong>
            </p>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-[11px]">Total</span>
            <strong className="text-[22px]">{rupiah(total)}</strong>
          </div>
          <button
            type="button"
            disabled={!selectedSlots.length}
            onClick={continueToCheckout}
            className={`${primaryButton} mt-6 w-full`}
          >
            Lanjut meninjau pesanan
          </button>
        </div>
      </Panel>
    </div>
  );
}

function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const fallback = fallbackVenues[0];
  const [draft, setDraft] = useState<BookingDraft>({
    venueId: fallback.id,
    venueSlug: fallback.slug,
    venueName: fallback.name,
    courtId: fallback.courts[0].id,
    courtName: fallback.courts[0].name,
    date: localIsoDate(),
    slots: [],
    unitPrice: fallback.price,
  });
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("DOKU Virtual Account");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(BOOKING_DRAFT_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as BookingDraft;
      if (Array.isArray(parsed.slots) && parsed.slots.length) {
        queueMicrotask(() => setDraft(parsed));
      }
    } catch {
      window.sessionStorage.removeItem(BOOKING_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (user?.name) queueMicrotask(() => setName(user.name));
  }, [user?.name]);

  const subtotal = draft.unitPrice * draft.slots.length;
  const total = subtotal + 5000;

  const createBooking = async () => {
    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Nama lengkap dan nomor telepon wajib diisi.");
      return;
    }
    if (!draft.slots.length) {
      setErrorMessage("Pilih jadwal terlebih dahulu.");
      return;
    }
    setProcessing(true);
    setErrorMessage("");
    const supabase = createClient();
    const { data: authData } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (!supabase || !authData.user) {
      const payment: BookingPayment = {
        bookingId: `DEMO-${Date.now()}`,
        paymentId: `PAY-${Date.now()}`,
        bookingCode: `LKR-DEMO-${String(Date.now()).slice(-6)}`,
        venueName: draft.venueName,
        courtName: draft.courtName,
        date: draft.date,
        slots: draft.slots,
        method,
        total,
        demo: true,
      };
      window.sessionStorage.setItem(BOOKING_PAYMENT_KEY, JSON.stringify(payment));
      router.push("/payment");
      return;
    }
    if (!draft.venueId || !draft.courtId) {
      setErrorMessage("Data venue belum siap. Kembali ke pemilihan jadwal dan coba lagi.");
      setProcessing(false);
      return;
    }
    const bookingSlots = draft.slots.map((start) => ({
      court_id: draft.courtId,
      date: draft.date,
      start_time: start,
      end_time: `${String((Number(start.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`,
    }));
    const { data, error } = await supabase.rpc("create_marketplace_booking", {
      p_venue_id: draft.venueId,
      p_customer_name: name.trim(),
      p_customer_phone: phone.trim(),
      p_payment_method: method,
      p_slots: bookingSlots,
    });
    const created = Array.isArray(data) ? data[0] : data;
    if (error || !created) {
      setErrorMessage(error?.message ?? "Pesanan gagal dibuat. Silakan coba lagi.");
      setProcessing(false);
      return;
    }
    const payment: BookingPayment = {
      bookingId: String(created.booking_id),
      paymentId: String(created.payment_id),
      bookingCode: String(created.booking_code),
      venueName: draft.venueName,
      courtName: draft.courtName,
      date: draft.date,
      slots: draft.slots,
      method,
      total: Number(created.total),
    };
    window.sessionStorage.setItem(BOOKING_PAYMENT_KEY, JSON.stringify(payment));
    router.push("/payment");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5 tablet:grid-cols-1">
      <div className="space-y-5">
        <Panel title="Detail kontak" eyebrow="Pemilik pesanan">
          <div className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1">
            <label className="text-[10px] font-extrabold tracking-label uppercase">
              Nama lengkap
              <input value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-2 normal-case`} />
            </label>
            <label className="text-[10px] font-extrabold tracking-label uppercase">
              Nomor telepon
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className={`${fieldClass} mt-2 normal-case`} placeholder="+62 812 3456 7890" />
            </label>
          </div>
        </Panel>
        <Panel title="Metode pembayaran" eyebrow="Pembayaran aman">
          <div className="grid grid-cols-3 gap-2 p-5 mobile:grid-cols-1">
            {["DOKU Virtual Account", "QRIS", "Kartu Kredit / Debit"].map(
              (option) => (
                <label
                  key={option}
                  className="flex min-h-20 cursor-pointer items-center gap-3 border border-line p-3 has-checked:border-olive has-checked:bg-[#535b400a]"
                >
                  <input type="radio" name="payment" value={option} checked={method === option} onChange={() => setMethod(option)} />
                  <span className="text-[11px] font-bold">{option}</span>
                </label>
              ),
            )}
          </div>
        </Panel>
      </div>
      <Panel title="Ringkasan pesanan" eyebrow="1 item">
        <div className="p-5">
          <h3 className="text-[15px] font-extrabold uppercase">{draft.venueName}</h3>
          <p className="mt-2 text-[11px] leading-6 text-[#11111173]">
            {draft.courtName}<br />{draft.date}<br />{draft.slots.join(", ") || "Belum ada jadwal"}
          </p>
          <div className="mt-5 space-y-3 border-y border-line py-4 text-[11px]">
            <p className="flex justify-between">
              <span>{draft.slots.length} sesi</span><span>{rupiah(subtotal)}</span>
            </p>
            <p className="flex justify-between"><span>Biaya layanan</span><span>Rp 5.000</span></p>
          </div>
          <p className="mt-5 flex items-end justify-between">
            <span className="text-[11px]">Total</span>
            <strong className="text-[23px]">{rupiah(total)}</strong>
          </p>
          {errorMessage && <p className="mt-4 text-[10px] font-bold text-[#8d332e]">{errorMessage}</p>}
          <button type="button" disabled={processing} onClick={createBooking} className={`${primaryButton} mt-6 w-full`}>
            <ShieldCheck size={16} /> {processing ? "Membuat pesanan..." : "Bayar dengan aman"}
          </button>
          <p className="mt-3 text-center text-[9px] text-[#11111173]">
            Hanya demo. Tidak ada pembayaran yang diproses.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function Payment() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [payment, setPayment] = useState<BookingPayment | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(BOOKING_PAYMENT_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as BookingPayment;
      queueMicrotask(() => setPayment(parsed));
    } catch {
      window.sessionStorage.removeItem(BOOKING_PAYMENT_KEY);
    }
  }, []);

  const confirmPayment = async () => {
    if (!payment) {
      setErrorMessage("Data pembayaran tidak ditemukan. Buat pesanan baru terlebih dahulu.");
      return;
    }
    setProcessing(true);
    if (payment.demo) {
      router.push("/booking/success");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setErrorMessage("Supabase belum terhubung.");
      setProcessing(false);
      return;
    }
    const { error } = await supabase.rpc("confirm_demo_payment", { p_booking_id: payment.bookingId });
    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
      return;
    }
    router.push("/booking/success");
  };

  return (
    <div className="mx-auto max-w-[720px]">
      <Panel title="Selesaikan pembayaran" eyebrow="DOKU Virtual Account">
        <div className="p-[clamp(22px,5vw,48px)] text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#535b4012] text-olive">
            <CreditCard size={24} />
          </span>
          <p className="mt-6 text-[11px] text-[#11111173]">Total pembayaran</p>
          <p className="mt-2 text-[34px] font-extrabold">{rupiah(payment?.total ?? 0)}</p>
          <div className="mx-auto mt-7 max-w-[420px] border border-line bg-ivory p-5 text-left">
            <p className="text-[9px] font-extrabold tracking-label uppercase">{payment?.method ?? "Metode pembayaran"}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <strong className="text-[20px] mobile:text-[16px]">8808 0812 3456 7890</strong>
              <button type="button" onClick={() => setCopied(true)} className={secondaryButton}>
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          </div>
          {errorMessage && <p className="mt-5 text-[10px] font-bold text-[#8d332e]">{errorMessage}</p>}
          <button type="button" disabled={processing || !payment} onClick={confirmPayment} className={`${primaryButton} mt-8 w-full max-w-[420px]`}>
            {processing ? "Memperbarui pembayaran..." : "Saya sudah menyelesaikan pembayaran"}
          </button>
          <p className="mt-4 text-[10px] text-[#11111173]">Status pembayaran hanya simulasi.</p>
        </div>
      </Panel>
    </div>
  );
}

function Success() {
  const [payment, setPayment] = useState<BookingPayment | null>(null);
  useEffect(() => {
    const stored = window.sessionStorage.getItem(BOOKING_PAYMENT_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as BookingPayment;
      queueMicrotask(() => setPayment(parsed));
    } catch {
      window.sessionStorage.removeItem(BOOKING_PAYMENT_KEY);
    }
  }, []);
  return (
    <div className="mx-auto max-w-[760px]">
      <Panel>
        <div className="p-[clamp(26px,7vw,70px)] text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#2d8b4e16] text-[#266d3e]">
            <Check size={30} />
          </span>
          <p className="mt-6 text-[10px] font-extrabold tracking-label text-olive uppercase">
            Pemesanan terkonfirmasi
          </p>
          <h2 className="mt-3 text-[clamp(28px,5vw,48px)] leading-none font-extrabold uppercase">
            Sampai bertemu di lapangan.
          </h2>
          <div className="mx-auto mt-8 grid max-w-[520px] grid-cols-[160px_1fr] border border-line text-left mobile:grid-cols-1">
            <div className="grid aspect-square place-items-center bg-ink p-5 text-center text-white">
              <div><Ticket size={36} className="mx-auto" /><p className="mt-3 text-[10px]">PRATINJAU QR</p></div>
            </div>
            <div className="p-5">
              <p className="text-[9px] text-[#11111173] uppercase">Kode pemesanan</p>
              <p className="mt-1 text-[20px] font-extrabold">{payment?.bookingCode ?? "LOKARIA"}</p>
              <p className="mt-5 text-[12px] font-bold">{payment?.venueName ?? "Venue LOKARIA"}</p>
              <p className="mt-1 text-[11px] leading-5 text-[#11111173]">
                {payment?.courtName ?? "Lapangan"}<br />{payment?.date ?? "-"}, {payment?.slots.join(", ") ?? "-"}
              </p>
            </div>
          </div>
          <SmartLink href="/bookings" className={`${primaryButton} mt-8`}>
            Pesanan saya
          </SmartLink>
        </div>
      </Panel>
    </div>
  );
}

function Bookings() {
  const [filter, setFilter] = useState("Semua");
  const { user } = useAuth();
  const { bookings, loading } = useCustomerBookings();
  const isDemo = user?.email.endsWith("@lokaria.test");
  const source = bookings.length || !isDemo ? bookings : customerBookings.map((booking) => ({ ...booking, paymentStatus: booking.status === "Terkonfirmasi" ? "Lunas" : "Menunggu" }));
  const shown = source.filter(
    (booking) => filter === "Semua" || booking.status === filter,
  );
  return (
    <div className="space-y-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {["Semua", "Terkonfirmasi", "Selesai", "Dibatalkan"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-[10px] font-extrabold uppercase ${
              filter === item ? "border-olive bg-olive text-white" : "border-line bg-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {loading && <p className="text-[11px] text-[#11111173]">Memuat riwayat pembelian...</p>}
      {shown.map((booking) => (
        <article
          key={booking.id}
          className="grid grid-cols-[1fr_auto] items-center gap-5 border border-line bg-white p-5 mobile:grid-cols-1"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge>{booking.status}</StatusBadge>
              <span className="text-[9px] font-bold text-olive">Pembayaran: {booking.paymentStatus}</span>
              <span className="text-[9px] font-bold text-[#11111173]">{booking.id}</span>
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold uppercase">{booking.venue}</h2>
            <p className="mt-2 text-[11px] text-[#11111173]">
              {booking.space} - {booking.date}, {booking.time}
            </p>
          </div>
          <div className="text-right mobile:text-left">
            <p className="text-[16px] font-extrabold">{rupiah(booking.total)}</p>
            <button type="button" className={`${secondaryButton} mt-3`}>Lihat detail</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Profile() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="grid grid-cols-[250px_minmax(0,1fr)] gap-5 tablet:grid-cols-1">
      <Panel>
        <div className="p-6 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-olive text-[20px] font-extrabold text-white">CD</span>
          <h2 className="mt-4 text-[17px] font-extrabold uppercase">Pelanggan Demo</h2>
          <p className="mt-1 text-[11px] text-[#11111173]">Pelanggan sejak Januari 2026</p>
        </div>
      </Panel>
      <Panel title="Informasi pribadi" eyebrow="Akun">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
          className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1"
        >
          {["Nama lengkap", "Email", "Telepon", "Kota asal"].map((label, index) => (
            <label key={label} className="text-[10px] font-extrabold tracking-label uppercase">
              {label}
              <input
                className={`${fieldClass} mt-2 normal-case`}
                defaultValue={[
                  "Pelanggan Demo",
                  "customer@lokaria.test",
                  "+62 812 3456 7890",
                  "Jakarta",
                ][index]}
              />
            </label>
          ))}
          <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line pt-5 mobile:col-span-1">
            <p className="text-[11px] font-bold text-[#266d3e]">{saved ? "Profil disimpan secara lokal." : ""}</p>
            <button type="submit" className={primaryButton}>Simpan perubahan</button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

function Rewards() {
  const rewards = [
    ["Voucher Rp 25.000", "500 poin"],
    ["Sewa raket gratis", "750 poin"],
    ["Voucher Rp 50.000", "1.000 poin"],
  ];
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 bg-loyalty text-white mobile:grid-cols-1">
        <div className="p-[clamp(24px,5vw,52px)]">
          <p className="text-[10px] font-extrabold text-beige uppercase">Saldo tersedia</p>
          <p className="mt-4 text-[clamp(42px,7vw,76px)] leading-none font-extrabold">1,250</p>
          <p className="mt-2 text-[12px] text-[#ffffff9c]">Poin Lokaria</p>
        </div>
        <div className="grid place-items-center border-l border-[#ffffff1f] p-8 text-center mobile:border-t mobile:border-l-0">
          <div><Award size={44} className="mx-auto text-beige" /><p className="mt-4 text-[18px] font-extrabold uppercase">Anggota Perak</p></div>
        </div>
      </section>
      <Panel title="Hadiah tersedia" eyebrow="Tukarkan poin">
        <div className="grid grid-cols-3 gap-3 p-5 tablet:grid-cols-1">
          {rewards.map(([name, points]) => (
            <article key={name} className="border border-line p-5">
              <Gift size={20} className="text-olive" />
              <h3 className="mt-5 text-[14px] font-extrabold uppercase">{name}</h3>
              <p className="mt-2 text-[11px] text-[#11111173]">{points}</p>
              <button type="button" className={`${secondaryButton} mt-5 w-full`}>Tukarkan</button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Membership() {
  const tiers = [
    { name: "Dasar", price: "Gratis", style: "bg-white text-ink" },
    { name: "Plus", price: "Rp 49.000 / bln", style: "bg-[#e8d8c8] text-ink" },
    { name: "Elite", price: "Rp 129.000 / bln", style: "bg-olive text-white" },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 tablet:grid-cols-1">
      {tiers.map((tier, index) => (
        <article key={tier.name} className={`border border-line p-6 ${tier.style}`}>
          <Sparkles size={22} />
          <p className="mt-8 text-[10px] font-extrabold uppercase">Tingkat {index + 1}</p>
          <h2 className="mt-2 text-[28px] font-extrabold uppercase">{tier.name}</h2>
          <p className="mt-3 text-[14px] font-bold">{tier.price}</p>
          <div className="mt-7 space-y-3 border-y border-current/20 py-5">
            {["Diskon pemesanan", "Poin anggota", "Bantuan prioritas"].map((perk) => (
              <p key={perk} className="flex items-center gap-2 text-[11px]"><Check size={14} />{perk}</p>
            ))}
          </div>
          <button
            type="button"
            className="mt-6 min-h-11 w-full cursor-pointer rounded-field border border-current px-4 text-[10px] font-extrabold uppercase"
          >
            {index === 0 ? "Paket saat ini" : "Pilih paket"}
          </button>
        </article>
      ))}
    </div>
  );
}

export function CustomerWorkspace({ path }: { path: string }) {
  if (path === "/explore") return <Explore />;
  if (path === "/venues") return <VenueList />;
  if (path.startsWith("/venues/")) return <VenueDetail path={path} />;
  if (path === "/booking") return <Booking />;
  if (path === "/checkout") return <Checkout />;
  if (path === "/payment") return <Payment />;
  if (path === "/booking/success") return <Success />;
  if (path === "/bookings") return <Bookings />;
  if (path === "/profile") return <Profile />;
  if (path === "/rewards") return <Rewards />;
  if (path === "/membership") return <Membership />;
  return (
    <Panel>
      <EmptyState
        icon={UserRound}
        title="Halaman tidak tersedia"
        text="Layar pelanggan ini belum tersedia."
      />
    </Panel>
  );
}
