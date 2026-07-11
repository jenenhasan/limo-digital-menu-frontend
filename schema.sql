-- Run this ONCE in your shared Supabase project (SQL Editor -> New query).
-- Every client's menu is a single row in this table, keyed by slug.

create table if not exists menus (
  slug text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table menus enable row level security;

-- Public read: anyone visiting a client's site can load the menu.
create policy "Public can read menus"
  on menus for select
  using (true);

-- Public write: needed because the staff editor runs entirely in the
-- browser with no server of its own. The PIN in the UI stops casual
-- edits, but it is NOT real security -- anyone with the anon key could
-- write to any row. Acceptable for low-stakes content like a menu.
-- If a client needs real access control, add Supabase Auth and swap
-- these policies to check auth.uid() instead of allowing anon writes.
create policy "Public can upsert menus"
  on menus for insert
  with check (true);

create policy "Public can update menus"
  on menus for update
  using (true);
