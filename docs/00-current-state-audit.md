# LOKARIA Current State Audit

Date: 2026-09-27  
Repository: `labibhabibie/lokaria-fe`  
Audited commit: `26851351d7941422501e38d335614d13e44664fd` (`init design`)

## 1. Executive Summary

LOKARIA is currently a polished, responsive marketing frontend and product concept prototype. It is not yet a transactional venue-booking or venue-management platform.

The working implementation consists of:

- A public landing page with category, city, rewards, membership, event, partner, and support sections.
- Six statically generated category pages populated from local mock data.
- Client-side category, city, and date selection that redirects to a booking placeholder.
- Branded placeholder pages for booking, authentication, partner, dashboard, event, support, account, and policy routes.
- A newsletter Server Action that validates an email address but does not store or send it.

There is no database, ORM, persistence model, migration, authentication system, authorization layer, API, booking engine, payment integration, webhook handler, QR system, inventory system, financial ledger, or automated test suite.

The frontend source is healthy: ESLint passes, and a production build completes with Node.js 22 and Next.js Webpack. The machine's default Node.js 18 runtime is incompatible with Next.js 16, and the repository does not currently pin a supported Node version.

## 2. Technology Stack

| Concern | Current technology | Status and notes |
|---|---|---|
| Frontend framework | Next.js 16.3.6 App Router, React 19.2.8 | Implemented |
| Backend framework | None | One Next.js Server Action exists for newsletter validation only |
| Programming language | TypeScript/TSX, CSS | TypeScript strict mode is enabled |
| Database | None | No database dependency, connection, schema, or environment configuration |
| ORM/query layer | None | No Prisma, Drizzle, Sequelize, TypeORM, or equivalent |
| Authentication | None | `/auth` is a placeholder page |
| API architecture | None | No Route Handlers, REST API, GraphQL API, or RPC layer |
| CSS/UI | Tailwind CSS 4, custom global design tokens and utilities | Implemented; no third-party component framework |
| Package manager | npm | `package-lock.json` is committed |
| Build system | Next.js build; Turbopack default, Webpack supported | Verified with `next build --webpack` on Node 22 |
| Linting | ESLint 9 with Next.js Core Web Vitals and TypeScript presets | Passing |
| Testing | None | No test runner, test files, or test script |
| Deployment | No deployment config committed | The provided production URL is hosted on Vercel, but project/CI settings are external to this repository |
| Runtime pinning | None | No `.nvmrc`, `.node-version`, or `package.json#engines`; default Node 18 fails Next.js 16 requirements |

## 3. Architecture and Project Structure

### 3.1 Runtime Architecture

The application is a single Next.js project. It is content-driven and mostly statically rendered.

```text
content/site.ts
  -> Server Components and Client Components
  -> static homepage and category pages

HeroSearch client state
  -> /booking?category=&city=&when=
  -> Coming Soon placeholder

Newsletter form
  -> Next.js Server Action
  -> regex validation
  -> success response without persistence
```

No backend application, worker, queue, cron process, database, or external service adapter exists.

### 3.2 Directory Map

| Path | Responsibility |
|---|---|
| `app/` | Next.js App Router pages, root layout, global CSS, and newsletter Server Action |
| `app/[...path]/` | Statically generated catch-all placeholder routes |
| `app/categories/[slug]/` | Six statically generated category pages |
| `app/actions/` | Newsletter Server Action; validation only |
| `components/sections/` | Landing-page and placeholder sections |
| `components/category/` | Venue grid and rules tabs for category pages |
| `components/ui/` | Reusable presentation components |
| `content/` | Central static copy, links, prices, venues, categories, cities, events, and membership mock data |
| `lib/` | A single CSS-class composition helper |
| `public/` | Default starter SVG assets and favicon |
| `docs/` | Project documentation, beginning with this audit |

### 3.3 Missing Structural Layers

The repository has no backend directories, controllers, persistence models, repositories, domain services, API route handlers, middleware, migrations, seeders, jobs, queues, test directories, or deployment workflows.

### 3.4 Existing Routes

| Route | Access | Rendering | Current behavior |
|---|---|---|---|
| `/` | Public | Static | Marketing landing page |
| `/categories/football` | Public | SSG | Mock category and venue data |
| `/categories/padel` | Public | SSG | Mock category and venue data |
| `/categories/tennis` | Public | SSG | Mock category and venue data |
| `/categories/badminton` | Public | SSG | Mock category and venue data |
| `/categories/music-studio` | Public | SSG | Mock category and venue data |
| `/categories/fishing` | Public | SSG | Mock category and venue data |
| `/booking` | Public | SSG placeholder | Coming Soon |
| `/auth` | Public | SSG placeholder | Coming Soon |
| `/faq` | Public | SSG placeholder | Coming Soon |
| `/partner` | Public | SSG placeholder | Coming Soon |
| `/partner/dashboard` | Public | SSG placeholder | Coming Soon; not authenticated |
| `/partner/pricing` | Public | SSG placeholder | Coming Soon |
| `/events` | Public | SSG placeholder | Coming Soon |
| `/events/[known-slug]` | Public | SSG placeholder | Coming Soon |
| `/help` | Public | SSG placeholder | Coming Soon |
| `/contact` | Public | SSG placeholder | Coming Soon |
| `/bookings` | Public | SSG placeholder | Coming Soon; not authenticated |
| `/privacy` | Public | SSG placeholder | Coming Soon |
| `/terms` | Public | SSG placeholder | Coming Soon |
| Any unlisted path | Public | N/A | Correctly returns 404 |

There are no authenticated, customer-only, partner-only, or admin-only routes because authentication and authorization do not exist.

## 4. Feature Matrix

Status definitions used in this audit: `IMPLEMENTED`, `PARTIAL`, `UI ONLY`, `MOCK`, `PLACEHOLDER`, `MISSING`, `BROKEN`, and `UNKNOWN`.

| Feature | Status | Evidence and notes |
|---|---|---|
| Authentication | PLACEHOLDER | `/auth` exists only as a Coming Soon page |
| User | MISSING | No user entity, persistence, profile, session, or API |
| Customer | MISSING | No customer model, dashboard, account, or business logic |
| Partner | PLACEHOLDER | Marketing content and public placeholder routes only |
| Admin | MISSING | No route, UI, role, API, or authorization logic |
| Venue | MOCK | Venue cards are hardcoded in `content/site.ts` |
| Sport/category | MOCK | Six local category objects; no persistent category management |
| Court/space | MISSING | No separately modeled bookable space or court entity |
| Location | MOCK | Four hardcoded city options; no geolocation, coordinates, or distance calculation |
| Search | UI ONLY | Selectors generate booking query parameters; no search results or backend query |
| Schedule | MISSING | No operating hours, special schedules, blocks, or maintenance schedules |
| Availability | MOCK | Labels such as `8 slots today` are static strings |
| Booking | PLACEHOLDER | `/booking` is Coming Soon; no booking form, state, or persistence |
| Payment | MISSING | Marketing copy mentions payment methods, but no implementation exists |
| DOKU | MISSING | No package, client, signature verification, callback, or webhook |
| Receipt | MISSING | No receipt generation, record, or page |
| QR | MISSING | Mentioned only in marketing copy |
| Check-in | MISSING | No QR validation or check-in workflow |
| Inventory | MISSING | No products, movements, stock balances, or audit history |
| POS | MISSING | No sales, cart, checkout, or payment workflow |
| Stock opname | MISSING | No physical count or adjustment workflow |
| Finance | MISSING | No ledger, revenue, expenses, commission, refund, or payout records |
| Promotion | MISSING | No promotion or promo-code rules |
| Review | MISSING | No review data, form, moderation, or aggregation |
| Rewards | UI ONLY | Static loyalty card and marketing copy; no points ledger |
| Membership | UI ONLY | Static Starter, Pro, and Elite cards; no purchase or entitlement logic |
| Notification | MISSING | No email, push, WhatsApp, inbox, template, or delivery service |
| Events | MOCK | Static event list; event routes are placeholders |
| Newsletter | PLACEHOLDER | Email syntax is validated, but no address is stored or sent |
| Support/contact | MOCK | Static email, placeholder phone number, and placeholder WhatsApp link |
| Responsive navigation | IMPLEMENTED | Desktop/mobile navigation and menu interactions exist |
| Category UI | IMPLEMENTED | Category pages, venue filters, and rules tabs render correctly using mock data |
| Local runtime setup | BROKEN | Default Node 18 cannot run Next.js 16; Node 22 works, but is not pinned in the repository |

## 5. Database Matrix

No schema, migrations, seeders, database configuration, or persistence dependency was found. The TypeScript `Category`, `Venue`, `City`, `Tier`, and `EventItem` types describe display data only and are not database models.

| Entity | Exists | Complete | Notes |
|---|---:|---:|---|
| User | No | N/A | No identity record |
| Role | No | N/A | Required roles are not modeled |
| Permission | No | N/A | No RBAC model |
| Customer | No | N/A | No customer profile |
| Partner | No | N/A | Static marketing concept only |
| Partner staff | No | N/A | No staff membership or permissions |
| Venue | No | N/A | Mock display objects only |
| Venue image | No | N/A | Unsplash URLs are embedded in mock data |
| Sport/category | No | N/A | Mock display objects only |
| Court/space | No | N/A | No bookable resource model |
| Operating hours | No | N/A | Not modeled |
| Special schedule | No | N/A | Not modeled |
| Blocked schedule | No | N/A | Not modeled |
| Maintenance schedule | No | N/A | Not modeled |
| Pricing rule | No | N/A | Static display prices only |
| Booking | No | N/A | No persistence or state machine |
| Booking item | No | N/A | Not modeled |
| Booking status history | No | N/A | Not modeled |
| Slot hold | No | N/A | Not modeled |
| Payment | No | N/A | Not modeled |
| Payment transaction | No | N/A | Not modeled |
| Payment webhook | No | N/A | Not modeled |
| Receipt | No | N/A | Not modeled |
| QR token | No | N/A | Not modeled |
| Product/category | No | N/A | Not modeled |
| Stock movement | No | N/A | Not modeled |
| Stock opname/item | No | N/A | Not modeled |
| Sale/item | No | N/A | Not modeled |
| Expense | No | N/A | Not modeled |
| Financial transaction | No | N/A | Not modeled |
| Commission | No | N/A | Not modeled |
| Partner payout | No | N/A | Not modeled |
| Promotion/promo code | No | N/A | Not modeled |
| Review | No | N/A | Not modeled |
| Reward/point ledger | No | N/A | Static balance copy only |
| Membership/entitlement | No | N/A | Static tier copy only |
| Refund | No | N/A | Not modeled |
| Notification | No | N/A | Not modeled |
| Audit log | No | N/A | Not modeled |

## 6. API Matrix

### 6.1 Existing Server Interfaces

| Interface | Access | Validation | Persistence | Status |
|---|---|---|---|---|
| Newsletter `subscribe` Server Action | Public | Basic email regex and HTML email validation | None | PLACEHOLDER |

There are no API endpoints under `/api`, no Next.js Route Handlers, no middleware, and no authentication boundary.

### 6.2 Missing Critical APIs

| Domain | Required APIs |
|---|---|
| Authentication | Register, login, logout, session, password reset, email/phone verification |
| Customer | Profile, booking history, membership, points, notifications |
| Venue discovery | Search, filters, venue detail, spaces, media, ratings |
| Availability | Date/space availability, server-side price quote, hold creation and expiry |
| Booking | Create, retrieve, cancel, reschedule, status history |
| Payment | DOKU initiation, status, verified webhook, reconciliation, refund |
| QR/check-in | Secure token issuance, validation, check-in, duplicate prevention |
| Partner | Onboarding, verification, venue, spaces, pricing, schedules, bookings, staff |
| Inventory/POS | Product, sale, stock movement, stock opname, expense |
| Finance | Ledger, commission, payout, refund, partner reports |
| Admin | Users, partners, verification, bookings, payments, refunds, configuration, audit logs |
| Notification | Template, enqueue, delivery, retry, read status |

## 7. UI Matrix

| UI surface | Status | Notes |
|---|---|---|
| Landing page | IMPLEMENTED | Polished and responsive public marketing page |
| Search controls | UI ONLY | Category, city, and date selection; redirects to placeholder |
| Venue listing | MOCK | Venue cards inside category pages use hardcoded data |
| Venue detail | MISSING | No dedicated venue page or space selection |
| Category detail | IMPLEMENTED | Six static category pages using mock content |
| Booking UI | PLACEHOLDER | Coming Soon page only |
| Customer dashboard | MISSING | `/bookings` is a public placeholder, not a dashboard |
| Partner dashboard | PLACEHOLDER | Public Coming Soon page |
| Admin dashboard | MISSING | No route or component |
| Login/register | PLACEHOLDER | `/auth` is Coming Soon; query parameter is ignored |
| Rewards UI | UI ONLY | Static card with mock balance and voucher |
| Membership UI | UI ONLY | Static tier comparison cards |
| Event UI | PARTIAL | Homepage list exists; event pages are placeholders |
| Newsletter UI | PLACEHOLDER | Appears successful without storing the submission |
| FAQ/help/contact/policies | PLACEHOLDER | Branded Coming Soon pages |

## 8. Business Logic Audit

| Critical behavior | Present | Finding |
|---|---:|---|
| Real availability calculation | No | Availability is static copy |
| Booking persistence | No | No database or booking record |
| Double-booking protection | No | No transaction, lock, or unique constraint |
| Temporary slot hold | No | No hold state or expiry process |
| Payment state machine | No | No payment model or state |
| DOKU webhook handling | No | No endpoint, verification, idempotency, or log |
| Server-side price calculation | No | Prices are frontend display constants |
| Historical price snapshot | No | No booking persistence |
| Receipt generation | No | Not implemented |
| QR generation | No | Not implemented |
| QR validation | No | Not implemented |
| Check-in authorization | No | Not implemented |
| Inventory movement | No | Not implemented |
| Stock opname reconciliation | No | Not implemented |
| Financial ledger | No | Not implemented |
| Audit logging | No | Not implemented |

## 9. Security Findings

1. There is no authentication, session management, RBAC, or server-side authorization. All existing routes are public.
2. There are no sensitive business endpoints yet, but none of the controls required for booking, payments, partner operations, or administration exist.
3. No rate limiting, CSRF strategy, audit logging, abuse protection, or security headers configuration is present.
4. The newsletter action performs only basic email validation and has no rate limit, bot protection, persistence, or delivery integration.
5. There is no payment/webhook surface, so DOKU signature verification, replay prevention, and idempotency are absent.
6. There is no server-side availability or price validation. The current query parameters and static prices must never become trusted booking inputs.
7. Placeholder partner and customer routes are public. Future dashboards must be protected at the server boundary, not only hidden in the UI.
8. There is no file upload surface yet; upload validation and storage controls will be required for venue and product media.
9. No automated security tests or critical-flow regression tests exist.
10. Contact details, venue counts, prices, availability labels, social links, and images are explicitly placeholder content and must not be treated as production data.

## 10. Critical Gaps

1. Product requirements and the first production MVP boundary are not documented in sufficient detail.
2. The supported Node.js version is not pinned, causing an immediate local setup failure under Node 18.
3. No relational database, ORM, migration workflow, or persistence architecture exists.
4. No authentication, identity model, session strategy, or RBAC exists.
5. Venue, space, schedule, and pricing domain models are absent.
6. Availability, concurrency protection, slot holds, and booking state transitions are absent.
7. DOKU payment creation, verified webhook handling, idempotency, reconciliation, and refunds are absent.
8. QR issuance and authorized venue check-in are absent.
9. Partner operations, staff access, inventory, POS, expenses, payouts, and finance are absent.
10. Admin operations, audit logs, monitoring, notifications, testing, and operational documentation are absent.
11. Marketing claims currently describe functionality that is not implemented.
12. The README is still the generic create-next-app document and mentions Geist, while the app actually uses Manrope and Lora.

## 11. Recommended Implementation Order

No missing feature should be implemented until its foundational dependency is agreed and documented. Recommended order:

1. Discovery: define MVP actors, workflows, terminology, acceptance criteria, ownership, and compliance needs.
2. Architecture: select hosting, relational database, ORM, authentication/session approach, API conventions, observability, and supported Node version.
3. Documentation/runtime baseline: pin Node, replace the starter README, add environment documentation, and define testing conventions.
4. Database foundation: introduce migrations and the minimum identity/RBAC schema only.
5. Authentication and authorization: customer, partner owner/staff, admin, and super-admin server-side access controls.
6. Venue foundation: partner, venue, space, category, media, operating hours, exceptions, blocked periods, and pricing rules.
7. Location and search: coordinates, city taxonomy, distance calculation, filters, and venue detail APIs/UI.
8. Availability engine: server-side slot generation, schedule exceptions, pricing, and deterministic availability queries.
9. Booking engine: transaction-safe creation, uniqueness/concurrency protection, temporary holds, expiry, and status history.
10. DOKU payments: server-side amount validation, payment attempt records, signed/idempotent webhooks, reconciliation, receipts, cancellation, and refund states.
11. QR and check-in: secure opaque tokens, venue ownership validation, staff authorization, date/status checks, and duplicate prevention.
12. Partner management: venue operations, schedules, pricing, booking management, staff, reports, and payouts.
13. Inventory and POS: products, immutable stock movements, sales, returns, damage/loss, and stock opname adjustments.
14. Finance: append-only ledger, venue/product revenue, expenses, commission, refunds, and payout reconciliation.
15. Admin: verification, platform monitoring, commission, refund management, configuration, and audit logs.
16. Notifications: durable event-driven delivery with retries and delivery records.
17. Security and testing: concurrency, authorization, webhook replay, IDOR, price manipulation, QR abuse, inventory, and financial test coverage.
18. Production readiness: backups, migrations, monitoring, alerting, incident procedures, CI/CD, and deployment documentation.

## Audit Verification

- `npm run lint`: passed with no findings.
- `npm run build -- --webpack` with Node.js 22.14.0: passed.
- TypeScript validation: passed as part of the production build.
- Static generation: 26 pages generated successfully.
- Automated tests: not available; no test script or test files exist.
- Tracked source changes during audit: this documentation file only.
- Database changes: none.
