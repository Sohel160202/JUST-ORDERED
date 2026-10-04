# Supabase backend plan

The frontend currently runs local-first. This migration is the production backend boundary for accounts and authoritative economy.

## Server-authoritative rules
- Auth user creation creates exactly one INITIAL_BALANCE of ৳5,000.
- Daily income uses Postgres current_date and grants ৳5,000 per missed calendar day.
- Wallet balance is derived from immutable ledger rows.
- Checkout prices come from the products table, not browser values.
- Checkout locks the user's cart/order path inside a database function and checks balance before purchase.
- Each order has a UUID idempotency key so double-click/retry returns the same order.
- RECEIVE only succeeds after expected_delivery_at and collectible order items are inserted idempotently.
- RLS isolates every user's profile/cart/wishlist/orders/collection.
- Direct client writes to wallet/order/collection tables are revoked.

## Required environment variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

Never put a service-role key in browser code.

## Migration
Apply `supabase/migrations/001_just_ordered_v2.sql`, then seed the products table from `src/data/catalog.ts`.

## Frontend migration sequence
1. Add Supabase Auth provider.
2. On login call `credit_daily_income()`.
3. Replace BrowserStateRepository with SupabaseStateRepository.
4. Sync wishlist/cart through their own tables.
5. Call `place_virtual_order()` instead of calculating/deducting in the browser.
6. Call `receive_virtual_order()` for delivered packages.
7. Keep BrowserStateRepository as guest/offline mode only.
