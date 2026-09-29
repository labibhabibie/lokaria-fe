import { cx } from "@/lib/cx";

type Props = {
  label: string;
  tier: string;
  balanceLabel?: string;
  balance: string;
  unit: string;
  voucherLabel?: string;
  voucher?: string;
  note?: string;
  tilt?: boolean;
  className?: string;
};

const caption = "text-[11.5px] tracking-[.16em] text-[#ffffff8c] uppercase";

export function LoyaltyCard({ label, tier, balanceLabel = "Saldo Saat Ini", balance, unit, voucherLabel = "Voucher Tersedia", voucher, note, tilt = true, className }: Props) {
  return (
    <div
      className={cx(
        "relative flex min-h-[510px] flex-col rounded-card border border-[#ffffff1f] bg-[linear-gradient(150deg,#20231c,#111111_72%)] p-[34px] font-sans text-white shadow-float",
        tilt && "rotate-2",
        className,
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[22px] border border-[#c6ae9433]" />
      <div className="flex items-center justify-between text-[12px] tracking-[.16em] uppercase">
        <span>{label}</span>
        <small className="text-[11px] text-beige">{tier}</small>
      </div>
      <div className="mt-auto mb-[34px] flex flex-col">
        <span className={caption}>{balanceLabel}</span>
        <b className="my-2 font-serif text-[92px] leading-[.9] font-medium tracking-[-.05em] mobile:text-[72px]">{balance}</b>
        <small className={caption}>{unit}</small>
      </div>
      {voucher && (
        <div className="flex items-end justify-between gap-3 border-y border-[#ffffff2e] py-5">
          <span className="text-[12px] text-[#ffffff9e]">{voucherLabel}</span>
          <b className="text-right text-[12px] tracking-label text-beige uppercase">{voucher}</b>
        </div>
      )}
      {note && <p className="mt-[22px] max-w-[310px] text-[12.5px] leading-[1.7] text-[#ffffff85]">{note}</p>}
    </div>
  );
}
