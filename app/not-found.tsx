import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[72vh] items-center bg-ivory px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="mb-5 text-[12px] font-extrabold uppercase tracking-button text-olive">
          Kesalahan 404
        </p>
        <h1 className="font-serif text-[clamp(2.6rem,8vw,5.5rem)] font-medium leading-[0.95] text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-[15px] leading-7 text-ink/65 sm:text-base">
          Alamat yang kamu buka mungkin sudah berubah atau tidak tersedia. Kembali ke beranda untuk
          menemukan venue dan aktivitas pilihanmu.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#f5f2ec38] bg-olive px-5 text-[12px] font-extrabold uppercase tracking-button text-white shadow-button transition-[translate,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-brown hover:shadow-button-hover"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/#categories"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-ink/20 px-5 text-[12px] font-extrabold uppercase tracking-button text-ink transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-beige"
          >
            Jelajahi Kategori
          </Link>
        </div>
      </div>
    </main>
  );
}
