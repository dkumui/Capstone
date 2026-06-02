create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.product_type as enum ('batik_cap');
create type public.cap_type as enum ('cap_1_warna', 'cap_2_warna');
create type public.stock_status as enum ('ready', 'limited', 'sold_out', 'check_stock');
create type public.product_source as enum ('seed', 'manual', 'cashier_api');
create type public.chat_session_status as enum ('open', 'pending', 'closed');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  alt_business_name text,
  description text,
  address text not null,
  whatsapp_number text,
  contact_phone text,
  operation_hours text,
  google_maps_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique,
  name text not null,
  product_type public.product_type not null default 'batik_cap',
  cap_type public.cap_type not null,
  color_variant text not null,
  size_length_cm integer not null,
  size_width_cm integer not null,
  size_note text,
  price integer not null check (price >= 0),
  stock_qty integer check (stock_qty >= 0),
  stock_status public.stock_status not null default 'check_stock',
  image_url text,
  description text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  source public.product_source not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_cap_type on public.products(cap_type);
create index if not exists idx_products_color_variant on public.products(color_variant);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_token text,
  customer_name text,
  customer_whatsapp text,
  status public.chat_session_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('user', 'assistant', 'admin')),
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);

create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  product_code text not null,
  previous_qty integer,
  new_qty integer,
  previous_stock_status public.stock_status,
  new_stock_status public.stock_status,
  source text not null default 'manual',
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_transactions_product_code on public.inventory_transactions(product_code);

create table if not exists public.inventory_sync_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null,
  message text,
  payload jsonb,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_knowledge_base (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.compute_product_stock_status(p_stock_qty integer)
returns public.stock_status
language sql
immutable
as $$
  select case
    when p_stock_qty is null then 'check_stock'::public.stock_status
    when p_stock_qty = 0 then 'sold_out'::public.stock_status
    when p_stock_qty between 1 and 5 then 'limited'::public.stock_status
    else 'ready'::public.stock_status
  end;
$$;

create or replace function public.sync_product_stock_status()
returns trigger
language plpgsql
as $$
begin
  new.stock_status := public.compute_product_stock_status(new.stock_qty);
  return new;
end;
$$;

create or replace function public.log_inventory_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.stock_qty is distinct from old.stock_qty then
    insert into public.inventory_transactions (
      product_id,
      product_code,
      previous_qty,
      new_qty,
      previous_stock_status,
      new_stock_status,
      source,
      note,
      changed_by
    ) values (
      new.id,
      new.product_code,
      old.stock_qty,
      new.stock_qty,
      old.stock_status,
      new.stock_status,
      'manual',
      'Stock updated from admin dashboard',
      auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_company_settings_updated_at on public.company_settings;
create trigger trg_company_settings_updated_at
before update on public.company_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_sync_stock_status on public.products;
create trigger trg_products_sync_stock_status
before insert or update of stock_qty on public.products
for each row execute function public.sync_product_stock_status();

drop trigger if exists trg_products_inventory_transaction on public.products;
create trigger trg_products_inventory_transaction
after update of stock_qty on public.products
for each row execute function public.log_inventory_transaction();

drop trigger if exists trg_inventory_transactions_updated_at on public.inventory_transactions;
create trigger trg_inventory_transactions_updated_at
before update on public.inventory_transactions
for each row execute function public.set_updated_at();

drop trigger if exists trg_product_images_updated_at on public.product_images;
create trigger trg_product_images_updated_at
before update on public.product_images
for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_sessions_updated_at on public.chat_sessions;
create trigger trg_chat_sessions_updated_at
before update on public.chat_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_messages_updated_at on public.chat_messages;
create trigger trg_chat_messages_updated_at
before update on public.chat_messages
for each row execute function public.set_updated_at();

drop trigger if exists trg_inventory_sync_logs_updated_at on public.inventory_sync_logs;
create trigger trg_inventory_sync_logs_updated_at
before update on public.inventory_sync_logs
for each row execute function public.set_updated_at();

drop trigger if exists trg_faq_knowledge_base_updated_at on public.faq_knowledge_base;
create trigger trg_faq_knowledge_base_updated_at
before update on public.faq_knowledge_base
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.company_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.services enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.inventory_sync_logs enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.faq_knowledge_base enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles admin full" on public.profiles;
create policy "profiles admin full"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "company settings public read" on public.company_settings;
create policy "company settings public read"
on public.company_settings
for select
using (true);

drop policy if exists "company settings admin manage" on public.company_settings;
create policy "company settings admin manage"
on public.company_settings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products public read active" on public.products;
create policy "products public read active"
on public.products
for select
using (is_active = true);

drop policy if exists "products admin manage" on public.products;
create policy "products admin manage"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "product images public read active products" on public.product_images;
create policy "product images public read active products"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id and p.is_active = true
  )
);

drop policy if exists "product images admin manage" on public.product_images;
create policy "product images admin manage"
on public.product_images
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "services public read active" on public.services;
create policy "services public read active"
on public.services
for select
using (is_active = true);

drop policy if exists "services admin manage" on public.services;
create policy "services admin manage"
on public.services
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "faq public read active" on public.faq_knowledge_base;
create policy "faq public read active"
on public.faq_knowledge_base
for select
using (is_active = true);

drop policy if exists "faq admin manage" on public.faq_knowledge_base;
create policy "faq admin manage"
on public.faq_knowledge_base
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "chat sessions public insert" on public.chat_sessions;
create policy "chat sessions public insert"
on public.chat_sessions
for insert
with check (true);

drop policy if exists "chat sessions admin manage" on public.chat_sessions;
create policy "chat sessions admin manage"
on public.chat_sessions
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "chat messages public insert" on public.chat_messages;
create policy "chat messages public insert"
on public.chat_messages
for insert
with check (
  exists (
    select 1 from public.chat_sessions cs where cs.id = session_id
  )
);

drop policy if exists "chat messages admin manage" on public.chat_messages;
create policy "chat messages admin manage"
on public.chat_messages
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "inventory logs admin manage" on public.inventory_sync_logs;
create policy "inventory logs admin manage"
on public.inventory_sync_logs
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "inventory transactions admin manage" on public.inventory_transactions;
create policy "inventory transactions admin manage"
on public.inventory_transactions
for all
using (public.is_admin())
with check (public.is_admin());
