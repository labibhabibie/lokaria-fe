# LOKARIA Frontend

Responsive customer, partner, and admin interfaces for the LOKARIA venue-booking platform.

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project for authentication, marketplace, and operational data

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:9115/login`.

Without Supabase credentials, the development-only demo accounts remain available:

| Role          | Email                   | Password       |
| ------------- | ----------------------- | -------------- |
| Customer      | `customer@lokaria.test` | `Customer123!` |
| Partner owner | `mitra@lokaria.test`    | `Mitra123!`    |
| Super admin   | `admin@lokaria.test`    | `Admin123!`    |

## Supabase Environment

Get the project URL and publishable key from **Supabase Dashboard > Connect**, then fill:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:9115
NEXT_PUBLIC_ENABLE_MOCK_AUTH=true
```

For production, set `NEXT_PUBLIC_SITE_URL=https://lokaria.labib.click` and normally set
`NEXT_PUBLIC_ENABLE_MOCK_AUTH=false`.

Never put the Supabase service-role key in a `NEXT_PUBLIC_*` variable or browser code.

## Database Setup

Apply every migration in [`supabase/migrations`](supabase/migrations) with the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migrations create:

- `public.profiles` linked to `auth.users`
- A new-user trigger with `CUSTOMER` as the secure default role
- Partner, venue, court, pricing, staff, inventory, POS, and finance tables
- Customer bookings, multi-slot booking items, and payment state
- Atomic booking RPCs with active-slot double-booking protection
- Row Level Security for customer-owned and partner-owned records
- A public `avatars` bucket with a 2 MB image limit
- Storage policies that restrict uploads to each user's own folder

Partner and admin roles must be assigned by a trusted administrator or SQL Editor. Client
sign-up never accepts a privileged role.

## Google Sign-In

1. Create a Web OAuth client in Google Auth Platform.
2. In Google, add the Supabase callback shown in **Supabase > Authentication > Providers > Google**. For this project it is `https://blcdkeswamvzvuwgcncp.supabase.co/auth/v1/callback`.
3. Copy [`supabase/.env.example`](supabase/.env.example) to `supabase/.env.local`, fill the Google Client ID and Client Secret, then push the auth configuration:

```bash
set -a
source supabase/.env.local
set +a
supabase config push
```

4. In **Supabase > Authentication > URL Configuration**, add these redirect URLs:
   - `http://localhost:9115/auth/callback`
   - `http://127.0.0.1:9115/auth/callback`
   - `https://lokaria.labib.click/auth/callback`
5. Restart the Next.js development server after editing `.env.local`.

The app uses the PKCE callback at `app/auth/callback/route.ts` and cookie refresh through
the Next.js 16 `proxy.ts` convention.

## Verification

```bash
npm run lint
npm run build -- --webpack
```

Real Supabase users persist partner CRUD, inventory, POS, finance, customer bookings,
payment status, and purchase history. The `@lokaria.test` accounts intentionally keep using
local demo data so development previews remain available without creating cloud records.
