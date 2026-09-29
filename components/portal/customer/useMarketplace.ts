"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, type Venue } from "@/content/site";
import { createClient } from "@/lib/supabase/client";

export type MarketplaceCourt = {
  id: string;
  name: string;
  price: number;
};

export type MarketplaceVenue = Venue & {
  id: string;
  category: string;
  categorySlug: string;
  courts: MarketplaceCourt[];
};

export type CustomerBooking = {
  id: string;
  venue: string;
  space: string;
  date: string;
  time: string;
  total: number;
  status: string;
  paymentStatus: string;
};

const fallbackVenues: MarketplaceVenue[] = categories.flatMap((category) =>
  category.detail.venues.map((venue) => ({
    ...venue,
    id: "",
    category: category.title,
    categorySlug: category.slug,
    courts: [{ id: "", name: "Lapangan utama", price: venue.price }],
  })),
);

function fallbackImage(category: string) {
  const normalized = category.toLowerCase();
  return categories.find((item) =>
    item.slug === normalized || item.title.toLowerCase().includes(normalized) || normalized.includes(item.title.toLowerCase()),
  )?.image ?? categories[0].image;
}

function priceForCourt(court: Record<string, unknown>) {
  const rules = Array.isArray(court.pricing_rules) ? court.pricing_rules as Array<{ price?: number | string }> : [];
  const prices = rules.map((rule) => Number(rule.price)).filter((price) => Number.isFinite(price) && price >= 0);
  return prices.length ? Math.min(...prices) : Number(court.base_price || 0);
}

export function useMarketplaceVenues() {
  const [venues, setVenues] = useState<MarketplaceVenue[]>(fallbackVenues);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("venues")
      .select("id,name,slug,category,city,description,image_url,courts(id,name,base_price,status,pricing_rules(price))")
      .eq("published", true)
      .eq("status", "Aktif")
      .order("created_at");
    if (error) {
      console.error("Gagal memuat katalog venue", error);
      setLoading(false);
      return;
    }
    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
      const image = fallbackImage(String(row.category));
      const courtRows = (Array.isArray(row.courts) ? row.courts : []) as Record<string, unknown>[];
      const courts = courtRows
        .filter((court) => court.status === "Aktif")
        .map((court) => ({ id: String(court.id), name: String(court.name), price: priceForCourt(court) }));
      const price = courts.length ? Math.min(...courts.map((court) => court.price)) : 0;
      return {
        id: String(row.id),
        slug: String(row.slug),
        name: String(row.name),
        city: String(row.city),
        tag: String(row.category),
        description: String(row.description || "Venue mitra LOKARIA."),
        price,
        image: { src: String(row.image_url || image.src), alt: `${row.name} di ${row.city}` },
        live: courts.length ? `${courts.length} lapangan tersedia` : undefined,
        category: String(row.category),
        categorySlug: String(row.category).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        courts,
      } satisfies MarketplaceVenue;
    }).filter((venue: MarketplaceVenue) => venue.courts.length > 0);
    setVenues(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  return { venues, loading, refresh: load };
}

export function useUnavailableSlots(courtId: string, date: string) {
  const [unavailable, setUnavailable] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const supabase = createClient();
      if (!supabase || !courtId || !date) {
        setUnavailable([]);
        return;
      }
      const { data, error } = await supabase.rpc("get_unavailable_slots", { p_court_id: courtId, p_slot_date: date });
      if (!active) return;
      if (error) {
        console.error("Gagal memuat ketersediaan", error);
        return;
      }
      setUnavailable((data ?? []).map((row: { start_time: string }) => row.start_time.slice(0, 5)));
    };
    void load();
    return () => { active = false; };
  }, [courtId, date]);
  return unavailable;
}

export function useCustomerBookings() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("bookings")
      .select("id,booking_code,total,status,venues(name),booking_slots(slot_date,start_time,end_time,courts(name)),payments(status)")
      .eq("customer_id", authData.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Gagal memuat riwayat pesanan", error);
      setLoading(false);
      return;
    }
    setBookings((data ?? []).map((row: Record<string, unknown>) => {
      const venueRelation = row.venues as { name?: string } | { name?: string }[] | null;
      const venue = Array.isArray(venueRelation) ? venueRelation[0] : venueRelation;
      const slots = (Array.isArray(row.booking_slots) ? row.booking_slots : []) as Array<{ slot_date?: string; start_time?: string; end_time?: string; courts?: { name?: string } | { name?: string }[] }>;
      const first = slots[0];
      const courtRelation = first?.courts;
      const court = Array.isArray(courtRelation) ? courtRelation[0] : courtRelation;
      const payments = (Array.isArray(row.payments) ? row.payments : []) as Array<{ status?: string }>;
      const times = slots.map((slot) => String(slot.start_time || "").slice(0, 5)).filter(Boolean);
      return {
        id: String(row.booking_code || row.id),
        venue: venue?.name || "Venue LOKARIA",
        space: court?.name || "Lapangan",
        date: first?.slot_date || "",
        time: times.join(", "),
        total: Number(row.total),
        status: row.status === "Dikonfirmasi" ? "Terkonfirmasi" : row.status === "Menunggu Pembayaran" ? "Menunggu" : String(row.status),
        paymentStatus: payments[0]?.status || "Menunggu",
      };
    }));
    setLoading(false);
  }, []);
  useEffect(() => { queueMicrotask(() => void load()); }, [load]);
  return useMemo(() => ({ bookings, loading, refresh: load }), [bookings, load, loading]);
}
