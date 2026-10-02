"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, LogOut, Pencil, X } from "lucide-react";
import { SmartLink } from "@/components/ui/SmartLink";
import { getProfileNavigation, roleLabel } from "@/lib/auth/routes";
import {
  fieldClass,
  primaryButton,
  secondaryButton,
} from "@/components/portal/Primitives";
import { useAuth } from "./AuthProvider";

function Avatar({
  name,
  initials,
  url,
  large = false,
}: {
  name: string;
  initials: string;
  url?: string;
  large?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label={`Foto profil ${name}`}
      style={url ? { backgroundImage: `url(${url})` } : undefined}
      className={`grid shrink-0 place-items-center rounded-full border bg-[#ffffff17] bg-cover bg-center font-extrabold ${
        large
          ? "size-24 border-line bg-stone text-[20px] text-ink"
          : "size-10 border-[#ffffff38] text-[11px] text-white"
      }`}
    >
      {!url && initials}
    </span>
  );
}

export function ProfileMenu() {
  const router = useRouter();
  const { logout, updateProfile, user } = useAuth();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  if (!user) return null;
  const navigation = getProfileNavigation(user.role);

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setMessage("");
    setPhoto(file);
    if (!file) {
      setPreview(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    const result = await updateProfile({ name, photo });
    setSaving(false);
    setMessage(result.message ?? "");
    if (result.ok) {
      setPhoto(null);
      setTimeout(() => setEditing(false), 450);
    }
  };

  const signOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-3 rounded-field p-1.5 text-left bg-beige/30 hover:bg-[#ffffff12] backdrop-blur-3xl  transition-all duration-300 hover:-translate-y-0.5 border border-[#ffffff94]/20 px-4 justify-center items-center rounded-full"
      >
        <div className="text-right mobile:hidden">
          <p className="text-[11px] font-bold text-white">{user.name}</p>
          <p className="mt-0.5 text-[8px] tracking-label text-white uppercase">
            {roleLabel(user.role)}
          </p>
        </div>
        <Avatar name={user.name} initials={user.avatar} url={user.avatarUrl} />
        <ChevronDown size={14} className="text-beige" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+10px)] right-0 z-50 w-[310px] border border-line bg-white p-2 text-ink shadow-panel mobile:fixed mobile:top-[68px] mobile:right-3 mobile:left-3 mobile:w-auto"
        >
          <div className="flex items-center gap-3 border-b border-line p-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-olive text-[11px] font-extrabold text-white">
              {user.avatar}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-extrabold">{user.name}</p>
              <p className="mt-1 truncate text-[9px] text-[#11111173]">
                {user.email}
              </p>
            </div>
          </div>
          <nav className="py-2">
            {navigation.map((item) => (
              <SmartLink
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className="block rounded-field px-3 py-2.5 text-[11px] font-bold text-ink no-underline hover:bg-ivory"
              >
                {item.navLabel}
              </SmartLink>
            ))}
          </nav>
          <div className="border-t border-line pt-2">
            <button
              type="button"
              onClick={() => {
                setName(user.name);
                setMessage("");
                setEditing(true);
                setOpen(false);
              }}
              className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-field px-3 text-[10px] font-extrabold uppercase hover:bg-ivory"
            >
              <Pencil size={14} /> Edit profil
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-field px-3 text-[10px] font-extrabold text-[#8d332e] uppercase hover:bg-[#a13b350a]"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#1111118c] p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="w-full max-w-[480px] border border-line bg-white p-6 text-ink shadow-float mobile:p-5"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-extrabold tracking-label text-olive uppercase">
                  Akun
                </p>
                <h2
                  id="edit-profile-title"
                  className="mt-1 text-[20px] font-extrabold uppercase"
                >
                  Edit profil
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                title="Tutup"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line"
              >
                <X size={17} />
              </button>
            </header>
            <div className="mt-7 flex items-center gap-5 mobile:items-start">
              <Avatar
                name={user.name}
                initials={user.avatar}
                url={preview ?? user.avatarUrl}
                large
              />
              <div>
                <label className={`${secondaryButton} relative cursor-pointer`}>
                  <Camera size={15} /> Ganti foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={choosePhoto}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-[9px] leading-4 text-[#11111173]">
                  JPG, PNG, atau WebP. Maksimal 2 MB.
                </p>
              </div>
            </div>
            <label className="mt-6 block text-[10px] font-extrabold uppercase">
              Nama tampilan
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={`${fieldClass} mt-2 normal-case`}
              />
            </label>
            <p
              className={`mt-4 min-h-5 text-[11px] font-bold ${message.toLowerCase().includes("diperbarui") ? "text-[#266d3e]" : "text-[#a13b35]"}`}
            >
              {message}
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={secondaryButton}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className={primaryButton}
              >
                {saving ? "Menyimpan..." : "Simpan profil"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
