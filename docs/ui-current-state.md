# LOKARIA UI Current State Audit

Date: 2026-09-27  
Audited commit: `26851351d7941422501e38d335614d13e44664fd` (`init design`)  
Scope: Existing frontend UI only. No feature, UI, or database implementation is included in this audit.

## Audit Summary

LOKARIA already has a coherent, responsive marketing website and a useful marketing-oriented design system. The strongest existing surfaces are the homepage, public category pages, navigation, content cards, and responsive section layouts.

The application UI required for a real booking platform has not been built. Customer booking and account routes are branded placeholders; partner operations are placeholders or missing; all admin UI is missing. Venue, city, availability, rewards, membership, and event data displayed by the existing UI is static mock content from `content/site.ts`.

The conclusions below are based on repository source inspection, route/build inspection, and the previously verified production build. An interactive browser was unavailable in this audit session, so visual QA across actual desktop/mobile viewports remains a separate verification task.

## 1. Frontend Foundation

### Framework and Rendering

| Area | Existing implementation |
|---|---|
| Framework | Next.js 16.3.6 App Router and React 19.2.8 |
| Language | TypeScript/TSX with strict TypeScript configuration |
| Rendering | Static homepage plus SSG category and placeholder routes |
| Client state | Local React state; no global store or server data cache |
| Styling | Tailwind CSS 4 plus custom theme tokens and utilities in `app/globals.css` |
| Fonts | Manrope for sans/display and Lora for serif accents through `next/font/google` |
| Images | Next.js `Image`; four remote Unsplash placeholders reused throughout the site |
| Icons | Text/Unicode symbols; no dedicated icon system or icon dependency |
| Forms | Hero search controls and one newsletter form |

### Routing and Layouts

| Route/layout | Existing file | Current UI |
|---|---|---|
| Root layout | `app/layout.tsx` | Global fonts, navigation, page content, and footer |
| Home | `app/page.tsx` | Complete marketing composition |
| Category detail | `app/categories/[slug]/page.tsx` | Six SSG category pages using mock data |
| Placeholder routes | `app/[...path]/page.tsx` | Shared Coming Soon screen for known unfinished routes |
| Unknown routes | Next.js not-found behavior | Returns 404 |

There are no nested customer, partner, or admin layouts. There is no dashboard shell, authenticated navigation, sidebar, breadcrumbs, account menu, or role-aware UI.

### Page Composition

The homepage currently contains:

1. Hero carousel, primary CTAs, and search controls.
2. Category discovery cards.
3. Brand manifesto.
4. Customer and partner marketing feature sections.
5. Rewards presentation.
6. City discovery cards.
7. Membership tiers.
8. Events list.
9. Final CTA.
10. How-it-works and support content.
11. Global footer and newsletter form.

## 2. Feature Matrix

Status values: `IMPLEMENTED`, `PARTIAL`, `UI ONLY`, `MOCK`, `PLACEHOLDER`, `MISSING`, and `BROKEN`.

### Customer UI

| Feature | Status | Existing Files | Notes |
|---|---|---|---|
| Home | IMPLEMENTED | `app/page.tsx`, `components/sections/*` | Full responsive marketing homepage |
| Global navigation | IMPLEMENTED | `app/layout.tsx`, `components/ui/NavBar.tsx` | Desktop nav, mobile overlay menu, floating mobile booking CTA |
| Explore categories | MOCK | `components/sections/Categories.tsx`, `components/ui/SportWorldCard.tsx`, `content/site.ts` | Six working links backed by static categories |
| Explore cities | MOCK | `components/sections/Cities.tsx`, `components/ui/DestinationCard.tsx`, `content/site.ts` | Four hardcoded cities linking to booking placeholder |
| Category detail | MOCK | `app/categories/[slug]/page.tsx` | Complete presentation using hardcoded category and venue content |
| Venue listing | MOCK | `components/category/VenueGrid.tsx`, `components/ui/SportCard.tsx` | Client city filtering over local arrays; static prices and availability labels |
| Search | UI ONLY | `components/sections/HeroSearch.tsx` | Category/city/date selectors only build `/booking` query parameters |
| Location detection | MISSING | None | No GPS, permission, coordinate, distance, or nearby UI |
| Search results | MISSING | None | No result page, sorting, pagination, map, or query state |
| Venue detail | MISSING | None | Venue cards exist, but no dedicated venue or space detail route |
| Space/court selection | MISSING | None | No separately represented bookable space UI |
| Schedule/calendar | MISSING | None | No operating-hours or slot calendar UI |
| Availability | MOCK | `content/site.ts`, `components/ui/SportCard.tsx` | Labels such as `8 slots today` are display strings |
| Booking | PLACEHOLDER | `app/[...path]/page.tsx`, `components/sections/ComingSoon.tsx` | `/booking` renders Coming Soon |
| Checkout | MISSING | None | No summary, attendee, promo, price, terms, or submit UI |
| Payment | MISSING | None | Payment methods appear only in marketing copy |
| Confirmation | MISSING | None | No booking success, status, receipt, or QR screen |
| My Bookings | PLACEHOLDER | `app/[...path]/page.tsx` | `/bookings` renders Coming Soon |
| Booking detail/history | MISSING | None | No upcoming, completed, cancelled, or refund views |
| Login | PLACEHOLDER | `app/[...path]/page.tsx` | `/auth` renders Coming Soon |
| Registration | PLACEHOLDER | `content/site.ts`, `app/[...path]/page.tsx` | `/auth?tab=register` does not produce a registration UI |
| Profile | MISSING | None | No account settings or personal data UI |
| Rewards | UI ONLY | `components/sections/Rewards.tsx`, `components/ui/LoyaltyCard.tsx` | Static balance, tier, and voucher presentation |
| Membership | UI ONLY | `components/sections/Membership.tsx`, `components/ui/TierCard.tsx` | Static tier comparison; CTA leads to auth placeholder |
| Reviews/ratings | MISSING | None | No rating display, review form, or moderation state |
| Promotions | MISSING | None | No promo discovery or redemption UI |
| Events | PARTIAL | `components/sections/Events.tsx`, `components/ui/EventRow.tsx` | Homepage event list exists; event pages are placeholders |
| FAQ/help/contact | PLACEHOLDER | `app/[...path]/page.tsx` | Branded Coming Soon pages |
| Newsletter | PLACEHOLDER | `components/ui/NewsletterField.tsx`, `app/actions/newsletter.ts` | Real form interaction, but success is shown without persistence |

### Partner UI

| Feature | Status | Existing Files | Notes |
|---|---|---|---|
| Partner marketing | IMPLEMENTED | `components/sections/FeatureSplit.tsx`, `content/site.ts` | Public value proposition and CTA only |
| Partner onboarding | PLACEHOLDER | `app/[...path]/page.tsx` | `/partner` renders Coming Soon |
| Dashboard | PLACEHOLDER | `app/[...path]/page.tsx` | `/partner/dashboard` is public Coming Soon page |
| Venue management | MISSING | None | No list, editor, media, amenities, or verification UI |
| Court/space management | MISSING | None | No bookable-space CRUD UI |
| Schedule | MISSING | None | No operating hours, exceptions, blocks, or maintenance UI |
| Pricing | PLACEHOLDER | `app/[...path]/page.tsx` | `/partner/pricing` is informational placeholder, not pricing management |
| Booking management | MISSING | None | No inbox, calendar, status, cancellation, or detail UI |
| Customer check-in | MISSING | None | No QR scanner, token entry, or check-in state |
| Staff management | MISSING | None | No invitation, roles, or permission UI |
| Product management | MISSING | None | No product/category UI |
| Inventory | MISSING | None | No stock list, movement, or adjustment UI |
| POS | MISSING | None | No sale/cart/register UI |
| Stock opname | MISSING | None | No count, variance, reason, or approval UI |
| Expenses | MISSING | None | No expense entry or review UI |
| Finance/reports | MISSING | None | No revenue, expense, commission, payout, or export UI |
| Payouts | MISSING | None | No balance, payout status, or bank-account UI |

### Admin UI

| Feature | Status | Existing Files | Notes |
|---|---|---|---|
| Dashboard | MISSING | None | No admin route or shell |
| Customers | MISSING | None | No customer list/detail/actions |
| Partners | MISSING | None | No partner list, verification, or status UI |
| Venues | MISSING | None | No moderation or venue management UI |
| Bookings | MISSING | None | No monitoring or intervention UI |
| Payments | MISSING | None | No payment monitoring or reconciliation UI |
| Refunds | MISSING | None | No request, review, decision, or status UI |
| Promotions | MISSING | None | No campaign or promo-code UI |
| Reports | MISSING | None | No platform analytics or financial reporting UI |
| Categories | MISSING | None | No category management UI |
| Commission | MISSING | None | No commission-rule UI |
| Audit logs | MISSING | None | No event viewer or filtering UI |
| Settings | MISSING | None | No platform configuration UI |

## 3. CSS and Design System Audit

### Existing Tokens

`app/globals.css` defines a real Tailwind theme layer with:

- Brand colors: olive, brown, beige, ivory, ink, and supporting warm neutrals.
- Semantic accents for live status, membership tiers, and categories.
- Manrope and Lora font families wired to `next/font` variables.
- Seven responsive display-heading scales plus label and micro text.
- Tracking and display-weight tokens.
- Field, photo, listing, card, floor, and panel radii.
- Button, card, lift, panel, and floating shadows.
- Shared easing curves and live-status animation.
- Custom `tablet` and `mobile` variants at 1024px and 640px.
- Shared utilities for section padding, image treatment, overlays, hidden scrollbars, and reveal animation.

### Existing Component Primitives

| Component group | Files | Reuse status |
|---|---|---|
| Commands/links | `Button.tsx`, `IconButton.tsx`, `TextLink.tsx`, `SmartLink.tsx` | Reusable and variant-driven |
| Typography | `DisplayHeading.tsx`, `SectionHeading.tsx`, `Eyebrow.tsx` | Reusable marketing typography system |
| Labels/status | `Pill.tsx`, `Chip.tsx`, `FilterChip.tsx`, `StatusDot.tsx` | Reusable for current marketing/listing surfaces |
| Inputs | `FieldTrigger.tsx`, `NewsletterField.tsx` | Limited; no general input/select/form system |
| Navigation | `NavBar.tsx`, `HeroSwitcher.tsx` | Purpose-built and accessible at a basic level |
| Content cards | `SportWorldCard.tsx`, `SportCard.tsx`, `DestinationCard.tsx`, `LoyaltyCard.tsx`, `TierCard.tsx`, `EventRow.tsx` | Reusable within their current content types |
| Motion | `Reveal.tsx` | Reusable IntersectionObserver reveal with reduced-motion support |
| Category UI | `VenueGrid.tsx`, `RulesTabs.tsx` | Reusable within static category pages |

### Design System Status: PARTIAL

The project has a strong marketing design system foundation, but not yet a complete product/application design system.

Strengths:

- Consistent brand palette, font pairing, display hierarchy, radii, shadows, and motion.
- Reusable variant-driven primitives instead of fully duplicated markup.
- Central content source keeps marketing labels and links consistent.
- Responsive layout conventions are used throughout the existing sections.
- Components include useful ARIA attributes, semantic buttons/links, reduced-motion handling, and mobile menu focus behavior.

Gaps:

- No dashboard/application-shell patterns, sidebar, top bar, breadcrumbs, page header, or dense data layout.
- No complete form system for labels, help text, validation, password, phone, currency, date, time slot, uploads, or controlled selects.
- No table, data grid, pagination, bulk actions, empty state, skeleton, toast, dialog, drawer, confirmation, or error-boundary components.
- No standardized loading, success, warning, destructive, or disabled state language.
- No icon library or documented iconography rules; several controls use Unicode symbols.
- Many spacing, colors, gradients, and text sizes remain one-off arbitrary values inside component class strings.
- No component documentation, Storybook, visual regression tests, or accessibility test suite.
- Focus-visible treatment and full keyboard behavior are not standardized across primitives.
- Design tokens are optimized for the marketing site, not operational partner/admin workflows.

## 4. Assets and Mock Data

### Assets

- Brand photography is not present in the repository.
- Four remote Unsplash images are reused for hero, categories, cities, venue cards, CTA, and how-it-works sections.
- `next.config.ts` allows only `images.unsplash.com` and marks those images as temporary.
- `public/` contains default create-next-app SVG files; no source reference to those files was found.
- The project has a favicon but no documented logo asset set, app icons, social preview image, or illustration library.
- The LOKARIA wordmark is rendered as text rather than an image asset.

### Mock Data

`content/site.ts` contains all current UI data, including:

- Six categories and eighteen sample venues.
- Four cities and venue-count marketing claims.
- Display prices and static availability labels.
- Membership prices, credits, and benefits.
- Reward balance and voucher copy.
- Four events.
- Contact details, WhatsApp number, and social links.

The file explicitly states that numbers, prices, venue counts, contact details, photos, highlights, venues, and rules are placeholders.

## 5. Forms and Interaction Audit

| Interaction | Status | Finding |
|---|---|---|
| Hero search | UI ONLY | Custom category/city dropdowns plus native `datetime-local`; not a semantic `<form>` |
| Search keyboard support | PARTIAL | Escape/outside-click supported; listbox arrow-key navigation and active-descendant behavior are absent |
| Newsletter | PLACEHOLDER | Semantic form and error announcement exist; backend does not persist submissions |
| Mobile menu | IMPLEMENTED | Body scroll lock, Escape close, close-button focus, ARIA dialog, and `inert` closed state |
| Hero carousel | IMPLEMENTED | Manual tabs and timed rotation; auto-rotation stops under reduced-motion preference |
| Venue city filters | MOCK | Client-side filtering of local arrays |
| Rules tabs | IMPLEMENTED | Basic tab semantics and local state |
| Copy email | IMPLEMENTED | Clipboard action and polite status announcement |
| Authentication forms | MISSING | No login, registration, recovery, or verification forms |
| Booking/checkout forms | MISSING | No slot, attendee, payment, promo, or confirmation forms |
| Partner/admin forms | MISSING | No operational forms |

## 6. Responsive Behavior Audit

The source includes deliberate responsive behavior:

- Custom max-width variants: tablet at 1024px and mobile at 640px.
- Section padding reduces from desktop to tablet to mobile.
- Desktop navigation becomes a full-screen mobile/tablet menu.
- A floating booking CTA appears on mobile.
- Category, city, membership, and venue grids become horizontal snap carousels on mobile.
- Multi-column feature and support layouts collapse to one column.
- Event rows and rules tabs adapt to narrower layouts.
- Major image sections use explicit minimum heights and responsive padding.
- Reduced-motion preferences disable smooth scrolling, reveal transitions, and hero auto-rotation behavior.

Source-level responsiveness is `IMPLEMENTED`, but actual visual overflow, text wrapping, touch targets, contrast, and browser-specific behavior still require screenshot-based QA at representative desktop, tablet, and mobile viewports.

## 7. Existing UI

1. Responsive public marketing homepage.
2. Global desktop/mobile navigation and footer.
3. Hero media carousel and search selectors.
4. Category, city, venue, membership, rewards, and event presentation.
5. Six category detail pages with city filtering and rules tabs.
6. Shared Coming Soon page for unfinished public routes.
7. Newsletter interaction, clipboard support, and scroll reveal motion.
8. Marketing-oriented design tokens and reusable UI primitives.

## 8. Missing UI

1. Venue and space detail pages.
2. Real search-results and availability views.
3. Booking, checkout, payment, confirmation, receipt, and QR flows.
4. Customer account, profile, booking history, refunds, notifications, and reviews.
5. All operational partner UI beyond placeholder pages.
6. All admin UI.
7. Application-level form, table, feedback, loading, empty, error, and navigation patterns.

## 9. Incomplete UI

1. Explore and venue-listing screens are visually functional but backed entirely by mock data.
2. Search captures inputs but only redirects to a placeholder.
3. Rewards and membership are presentation-only.
4. Event rows exist, but event detail pages do not.
5. Newsletter reports success without storing or sending the address.
6. FAQ, help, contact, privacy, and terms are placeholders.
7. Accessibility has useful foundations but lacks full keyboard and automated accessibility verification.
8. Responsive behavior is encoded but has not been visually regression-tested in this audit.

## 10. Reusable Components

Preserve and extend these existing foundations where appropriate:

- `Button`, `IconButton`, `SmartLink`, and `TextLink` for actions and navigation.
- `DisplayHeading`, `SectionHeading`, and `Eyebrow` for public marketing hierarchy.
- `Pill`, `Chip`, `FilterChip`, and `StatusDot` for compact labels and states.
- `FieldTrigger` as a visual starting point for future select/combobox controls.
- `SportWorldCard`, `SportCard`, `DestinationCard`, `EventRow`, `LoyaltyCard`, and `TierCard` for their current presentation domains.
- `NavBar`, `Reveal`, `RulesTabs`, and `VenueGrid` for current public surfaces.

Dashboard work should add a separate operational component layer instead of forcing marketing-scale typography and card treatments into dense partner/admin screens.

## 11. Design System Status

Overall status: `PARTIAL`.

The visual identity is already clear enough to preserve: olive/ivory/beige brand colors, Manrope/Lora typography, editorial display headings, restrained borders, large photography, and soft motion. It should not be redesigned before core application flows are defined.

The next design-system work should focus on product UI foundations: compact typography, semantic status colors, forms, tables, navigation shells, dialogs, notifications, loading/empty/error states, accessible focus behavior, and documentation. These should reuse the existing palette and type families while adopting denser spacing appropriate for repeated operational work.

## 12. Recommended UI Implementation Order

UI should follow confirmed backend/domain contracts rather than inventing unsupported states.

1. Product-flow definitions and route map for customer, partner, and admin roles.
2. Application design-system primitives: form fields, validation, feedback, dialog/drawer, status, loading, empty, error, table, and pagination.
3. Authentication UI: login, registration, verification, recovery, and role-aware entry.
4. Customer discovery: search results, map/list filters, venue detail, space detail, and real availability calendar.
5. Customer booking: slot selection, quote, hold timer, checkout, DOKU handoff, processing, confirmation, receipt, QR, history, cancellation, and refund status.
6. Customer account: profile, notifications, rewards, membership, promotions, and reviews.
7. Partner shell: responsive sidebar/top bar, dashboard, venue/space setup, media, schedules, blocks, pricing, and staff.
8. Partner operations: booking calendar, booking detail, check-in, customer lookup, and payouts.
9. Partner commerce: products, POS, inventory movements, stock opname, expenses, and financial reports.
10. Admin shell and workflows: customers, partner verification, venues, bookings, payments, refunds, promotions, commission, reports, audit logs, and settings.
11. Accessibility, responsive, visual-regression, and end-to-end QA for each completed workflow.

## Verification and Change Scope

- No existing UI, route, component, CSS, asset, mock data, or database structure was modified.
- This audit adds documentation only.
- Existing lint and production build results remain passing under Node.js 22.
- Interactive browser screenshots were not available in this audit session; visual viewport QA remains outstanding.
