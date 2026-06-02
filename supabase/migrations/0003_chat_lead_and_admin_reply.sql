alter table public.chat_sessions
add column if not exists product_code text,
add column if not exists product_name text,
add column if not exists product_color text,
add column if not exists last_message_at timestamptz not null default now();

create index if not exists idx_chat_sessions_status
on public.chat_sessions(status);

create index if not exists idx_chat_sessions_last_message_at
on public.chat_sessions(last_message_at desc);

create index if not exists idx_chat_sessions_customer_whatsapp
on public.chat_sessions(customer_whatsapp);

create index if not exists idx_chat_sessions_product_code
on public.chat_sessions(product_code);