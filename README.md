# JUST ORDERED
**Buy everything. Spend nothing.**

Responsive local-first web/PWA prototype for the Just Ordered virtual shopping simulator.

## Stack
Next.js + React + TypeScript. State persistence is abstracted behind `StateRepository`; this prototype uses browser localStorage. The public cross-device version should move state, trusted time, and checkout to a transactional backend such as Supabase/Postgres.

## Implemented
- Responsive desktop/mobile premium-commerce shell
- Three-step first-run onboarding with explicit virtual-shopping disclosure
- Ledger-first starting balance of ৳1,000
- Calendar-day +৳1,000 income with missed-day accumulation
- Automatic daily-income/welcome-back presentation; no claim button
- 42 fictional products across Food, Electronics, Gaming, Fashion, Home, Vehicles and Luxury
- Search, categories and "I can afford this" filtering
- Product affordability shortfall and daily-deposit estimate
- Persistent wishlist and cart
- Virtual checkout to `My Place`
- PURCHASE ledger entry and persistent orders
- Timestamp-derived order progression that survives browser restarts
- Active / Delivered / All order filtering and tracking timeline
- Receive Package interaction and reveal experience
- Idempotent collection insertion; consumables never become collection items
- Collection statistics and Wallet statistics/history
- Debug-only simulated time controls and reset flow
- PWA manifest, icon and service-worker offline-shell foundation
- Accessibility labels, non-color status text, responsive touch targets and empty states
- Vitest coverage for delivery progression, idempotent receive and consumable exclusion

## Run
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.

## Test / build
```bash
npm test
npm run build
```
This execution sandbox has Node/npm but cannot currently reach the npm registry, so dependencies cannot be installed here and those commands have not been claimed as passing.

## Economy
`src/core/config.ts` owns `startingBalance` and `dailyIncome`. Money uses integer taka. Balance is derived from signed ledger transactions. Daily income compares calendar-date keys, not elapsed 24-hour timers.

## Delivery
`src/domain/delivery.ts` derives order state from `orderedAt` and `expectedDeliveryAt`; the browser does not need to remain open. `receiveOrder` owns collectible-vs-consumable rules and prevents a received order from adding its collection items twice.

## PWA
`public/manifest.webmanifest`, `public/icon.svg`, and `public/sw.js` provide the install/offline-shell foundation. Production deployment should generate platform-specific raster icons and use a versioned caching strategy rather than treating the current service worker as the final offline architecture.

## Debug controls
In non-production builds, Profile shows controls to advance simulated time by six hours or one day, add ৳1,000, and reset simulation data. These controls are omitted when `NODE_ENV=production`.

## Production migration
Before a public cross-device launch, replace browser-local persistence with authenticated backend persistence. Checkout must become a server/database transaction with an idempotency key, server-authoritative time, ledger/order/cart atomicity, and row-level authorization. The current localStorage implementation is for prototype validation, not anti-tamper security.

## Next milestone
Run the repository in a network-enabled Node environment, fix any compiler/browser issues discovered by the first real build, deploy a preview URL, test installation on Android/iOS/desktop, then split the large page into feature components/stores before adding accounts/Supabase.
