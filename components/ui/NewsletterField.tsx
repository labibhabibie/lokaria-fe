"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/newsletter";
import { cx } from "@/lib/cx";

type Props = { label: string; placeholder: string; button: string; success: string; className?: string };

const initial: SubscribeState = { status: "idle" };

export function NewsletterField({ label, placeholder, button, success, className }: Props) {
  const [state, action, pending] = useActionState(subscribe, initial);
  const done = state.status === "success";
  return (
    <div className={cx("w-[360px] max-w-full font-sans text-white", className)}>
      <p className="mb-3 text-[12px] tracking-[.13em] uppercase">{label}</p>
      <form action={action} className="flex border-b border-[#ffffff80] py-2.5">
        <input
          key={state.status}
          defaultValue={done ? "" : state.email}
          type="email"
          name="email"
          required
          disabled={done}
          aria-label={placeholder}
          aria-invalid={state.status === "error"}
          placeholder={done ? success : placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-white outline-0 placeholder:text-[#ffffff8c]"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="cursor-pointer border-0 bg-transparent text-[12px] font-extrabold text-white uppercase disabled:cursor-default"
        >
          {button}
        </button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-[18px] text-[12px] text-beige">
        {state.status === "error" ? state.message : ""}
      </p>
    </div>
  );
}
