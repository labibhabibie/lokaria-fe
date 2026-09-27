# LOKARIA Frontend

Responsive customer, partner, and admin interfaces for the LOKARIA venue-booking platform.

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project for real authentication and profile persistence

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/login`.

Without Supabase credentials, the development-only demo accounts remain available:

| Role | Email | Password |
|---|---|---|
| Customer | `customer@lokaria.test` | `Customer123!` |
| Partner owner | `mitra@lokaria.test` | `Mitra123!` |
| Super admin | `admin@lokaria.test` | `Admin123!` |

## Supabase Environment

Get the project URL and publishable key from **Supabase Dashboard > Connect**, then fill:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_MOCK_AUTH=true
```

For production, set `NEXT_PUBLIC_SITE_URL=https://lokaria.labib.click` and normally set
`NEXT_PUBLIC_ENABLE_MOCK_AUTH=false`.

Never put the Supabase service-role key in a `NEXT_PUBLIC_*` variable or browser code.

## Database Setup

Run [the profile and avatar migration](supabase/migrations/20260927000000_profiles_and_avatars.sql)
through the Supabase SQL Editor, or use the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration creates:

- `public.profiles` linked to `auth.users`
- A new-user trigger with `CUSTOMER` as the secure default role
- Row Level Security so users can read and edit only their own profile
- A public `avatars` bucket with a 2 MB image limit
- Storage policies that restrict uploads to each user's own folder

Partner and admin roles must be assigned by a trusted administrator or SQL Editor. Client
sign-up never accepts a privileged role.

## Google Sign-In

1. Create a Web OAuth client in Google Auth Platform.
2. In Google, add the Supabase callback shown in **Supabase > Authentication > Providers > Google**. It normally looks like `https://PROJECT_REF.supabase.co/auth/v1/callback`.
3. Add the Google Client ID and Client Secret to the Google provider in Supabase.
4. In **Supabase > Authentication > URL Configuration**, add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
   - `https://lokaria.labib.click/auth/callback`
5. Restart the Next.js development server after editing `.env.local`.

The app uses the PKCE callback at `app/auth/callback/route.ts` and cookie refresh through
the Next.js 16 `proxy.ts` convention.

## Verification

```bash
npm run lint
npm run build -- --webpack
```

All booking, payment, POS, inventory, and reporting records are still UI mock data. Supabase
currently persists authentication and user profile data only.
