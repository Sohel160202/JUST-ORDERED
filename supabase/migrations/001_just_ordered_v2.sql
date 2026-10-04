-- JUST ORDERED V2 backend foundation
-- Designed for Supabase/Postgres. Run through Supabase migrations.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Shopper',
  last_income_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('Food','Electronics','Gaming','Fashion','Home','Vehicles','Luxury')),
  price bigint not null check (price >= 0),
  emoji text not null,
  collection_type text not null check (collection_type in ('collectible','consumable')),
  delivery_minutes integer not null check (delivery_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('INITIAL_BALANCE','DAILY_INCOME','PURCHASE','ACHIEVEMENT_REWARD','REFUND')),
  amount bigint not null,
  related_order_id uuid,
  description text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique(user_id,idempotency_key)
);
create index if not exists wallet_transactions_user_created_idx on public.wallet_transactions(user_id,created_at desc);

create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,product_id)
);

create table if not exists public.cart_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0 and quantity <= 99),
  updated_at timestamptz not null default now(),
  primary key(user_id,product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number text not null unique,
  total bigint not null check(total >= 0),
  status text not null default 'ORDER_PLACED' check (status in ('ORDER_PLACED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','RECEIVED')),
  location_name text not null default 'My Place',
  idempotency_key uuid not null,
  ordered_at timestamptz not null default now(),
  expected_delivery_at timestamptz not null,
  received_at timestamptz,
  unique(user_id,idempotency_key)
);
create index if not exists orders_user_created_idx on public.orders(user_id,ordered_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  name_snapshot text not null,
  price_snapshot bigint not null check(price_snapshot >= 0),
  quantity integer not null check(quantity > 0),
  emoji_snapshot text not null,
  collection_type_snapshot text not null check(collection_type_snapshot in ('collectible','consumable'))
);

alter table public.wallet_transactions
  drop constraint if exists wallet_transactions_related_order_id_fkey;
alter table public.wallet_transactions
  add constraint wallet_transactions_related_order_id_fkey foreign key (related_order_id) references public.orders(id) on delete set null;

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  product_id text not null references public.products(id),
  name_snapshot text not null,
  emoji_snapshot text not null,
  purchase_price bigint not null,
  acquired_at timestamptz not null default now(),
  unique(user_id,order_item_id)
);

create or replace function public.wallet_balance(p_user uuid)
returns bigint language sql stable security definer set search_path=public as $$
  select coalesce(sum(amount),0)::bigint from public.wallet_transactions where user_id=p_user;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,display_name,last_income_date)
    values(new.id,coalesce(new.raw_user_meta_data->>'display_name','Shopper'),current_date)
    on conflict(id) do nothing;
  insert into public.wallet_transactions(user_id,type,amount,description,idempotency_key)
    values(new.id,'INITIAL_BALANCE',5000,'Welcome balance','initial-balance')
    on conflict(user_id,idempotency_key) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.credit_daily_income()
returns table(days_credited integer,amount_credited bigint,new_balance bigint)
language plpgsql security definer set search_path=public as $$
declare
  uid uuid := auth.uid();
  last_day date;
  n integer;
  amount bigint;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  select last_income_date into last_day from profiles where id=uid for update;
  n := greatest(0,current_date-last_day);
  if n > 0 then
    amount := n::bigint * 5000;
    insert into wallet_transactions(user_id,type,amount,description,idempotency_key)
      values(uid,'DAILY_INCOME',amount,case when n=1 then 'Daily income' else n||' daily deposits' end,'daily-income-'||current_date::text)
      on conflict(user_id,idempotency_key) do nothing;
    update profiles set last_income_date=current_date,updated_at=now() where id=uid;
  else amount := 0; end if;
  return query select n,amount,public.wallet_balance(uid);
end; $$;

create or replace function public.place_virtual_order(p_idempotency_key uuid,p_location_name text default 'My Place')
returns uuid language plpgsql security definer set search_path=public as $$
declare
  uid uuid := auth.uid(); oid uuid; total_price bigint; max_minutes integer; existing uuid;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  select id into existing from orders where user_id=uid and idempotency_key=p_idempotency_key;
  if existing is not null then return existing; end if;

  select coalesce(sum(p.price*c.quantity),0)::bigint,coalesce(max(p.delivery_minutes),120)
    into total_price,max_minutes
    from cart_items c join products p on p.id=c.product_id
    where c.user_id=uid and p.is_active=true;

  if total_price <= 0 then raise exception 'Cart is empty'; end if;
  if public.wallet_balance(uid) < total_price then raise exception 'Insufficient virtual balance'; end if;

  insert into orders(user_id,order_number,total,status,location_name,idempotency_key,expected_delivery_at)
    values(uid,'JO-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),total_price,'ORDER_PLACED',coalesce(nullif(trim(p_location_name),''),'My Place'),p_idempotency_key,now()+make_interval(mins=>max_minutes))
    returning id into oid;

  insert into order_items(order_id,product_id,name_snapshot,price_snapshot,quantity,emoji_snapshot,collection_type_snapshot)
    select oid,p.id,p.name,p.price,c.quantity,p.emoji,p.collection_type from cart_items c join products p on p.id=c.product_id where c.user_id=uid;

  insert into wallet_transactions(user_id,type,amount,related_order_id,description,idempotency_key)
    values(uid,'PURCHASE',-total_price,oid,'Virtual order '||oid::text,'purchase-'||p_idempotency_key::text);

  delete from cart_items where user_id=uid;
  return oid;
end; $$;

create or replace function public.receive_virtual_order(p_order_id uuid)
returns integer language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); inserted_count integer;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  update orders set status='RECEIVED',received_at=now()
    where id=p_order_id and user_id=uid and expected_delivery_at<=now() and status<>'RECEIVED';
  insert into collection_items(user_id,order_item_id,product_id,name_snapshot,emoji_snapshot,purchase_price)
    select uid,oi.id,oi.product_id,oi.name_snapshot,oi.emoji_snapshot,oi.price_snapshot
    from order_items oi join orders o on o.id=oi.order_id
    where o.id=p_order_id and o.user_id=uid and o.status='RECEIVED' and oi.collection_type_snapshot='collectible'
    on conflict(user_id,order_item_id) do nothing;
  get diagnostics inserted_count = row_count;
  return inserted_count;
end; $$;

alter table public.profiles enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.collection_items enable row level security;
alter table public.products enable row level security;

create policy "products readable" on public.products for select using (is_active=true);
create policy "own profile read" on public.profiles for select using (auth.uid()=id);
create policy "own profile update" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy "own ledger read" on public.wallet_transactions for select using (auth.uid()=user_id);
create policy "own wishlist all" on public.wishlist_items for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own cart all" on public.cart_items for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own orders read" on public.orders for select using (auth.uid()=user_id);
create policy "own order items read" on public.order_items for select using (exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "own collection read" on public.collection_items for select using (auth.uid()=user_id);

revoke insert,update,delete on public.wallet_transactions from authenticated;
revoke insert,update,delete on public.orders from authenticated;
revoke insert,update,delete on public.order_items from authenticated;
revoke insert,update,delete on public.collection_items from authenticated;
grant execute on function public.credit_daily_income() to authenticated;
grant execute on function public.place_virtual_order(uuid,text) to authenticated;
grant execute on function public.receive_virtual_order(uuid) to authenticated;
