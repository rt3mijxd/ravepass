-- RavePass — схема БД (Supabase / Postgres)
-- Запусти этот SQL один раз в Supabase: Dashboard → SQL Editor → New query → Run.

-- Отзывы пользователей (форма обратной связи)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  message text not null,
  missing_artist text
);

-- Подписки на уведомления об артистах (для Фазы 2)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  artist_slug text not null,
  artist_name text,
  confirmed boolean not null default false,
  confirm_token uuid not null default gen_random_uuid(),
  unique (email, artist_slug)
);

-- RLS: включаем, но НЕ создаём публичных политик.
-- Запись идёт только с сервера через service_role (он обходит RLS),
-- поэтому из браузера к этим таблицам доступа нет — данные защищены.
alter table feedback enable row level security;
alter table subscriptions enable row level security;
