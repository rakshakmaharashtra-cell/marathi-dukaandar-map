-- ==========================================
-- MARATHI DUKANDAAR MAP — NEW FEATURES SETUP
-- Run this ONCE in the Supabase SQL Editor
-- ==========================================

-- 1. ADD NEW COLUMNS TO SHOPS TABLE
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='phone') then
    alter table public.shops add column phone text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='opening_hours') then
    alter table public.shops add column opening_hours text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='verified_by_users') then
    alter table public.shops add column verified_by_users text[] default '{}';
  end if;
end $$;

-- 2. CREATE REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references public.shops(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(shop_id, user_id) -- One review per user per shop
);

alter table public.reviews enable row level security;

-- Policies for reviews:
drop policy if exists "Anyone can read reviews" on public.reviews;
drop policy if exists "Users can create reviews" on public.reviews;

create policy "Anyone can read reviews"
on public.reviews for select
using (true);

create policy "Users can create reviews"
on public.reviews for insert
with check ( auth.uid() = user_id );

-- 3. SETUP STORAGE FOR SHOP IMAGES
insert into storage.buckets (id, name, public) 
values ('shop-images', 'shop-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view images" on storage.objects;
drop policy if exists "Authenticated users can upload images" on storage.objects;

create policy "Anyone can view images"
on storage.objects for select
using ( bucket_id = 'shop-images' );

create policy "Authenticated users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'shop-images' and auth.role() = 'authenticated'
);

-- 4. UPDATE SCORE INCREMENT RPC FOR NEW ACTIONS
-- Points guide: Adding Shop=50, Review=10, Verifying Shop=5
create or replace function public.increment_points(user_id uuid, amount integer)
returns void as $$
begin
  update public.profiles
  set points = points + amount
  where id = user_id;
end;
$$ language plpgsql security definer;
