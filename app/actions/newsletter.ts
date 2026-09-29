"use server";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter sign-up. Validates only — nothing is stored or sent yet. */
export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL.test(email)) return { status: "error", message: "Masukkan alamat email yang valid.", email };
  // TODO: connect email provider (e.g. Resend, Mailchimp) here
  return { status: "success" };
}
