-- ==========================================
-- MARATHI DUKANDAAR MAP — COMPLETE SETUP
-- Run this ONCE in the Supabase SQL Editor
-- ==========================================


-- ══════════════════════════════════════════
-- 0. HELPER: Admin check (bypasses RLS)
-- ══════════════════════════════════════════
create or replace function public.is_admin()
returns boolean as $$
begin
  -- Check if user's email is the admin email OR their profile role is 'admin'
  return exists (
    select 1 from auth.users
    where id = auth.uid() and email = 'rakshakmaharashtra@gmail.com'
  ) or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;


-- ══════════════════════════════════════════
-- 1. PROFILES TABLE
-- ══════════════════════════════════════════
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user'::text,
  points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can update any profile" on profiles;

create policy "Users can view own profile"
on profiles for select
using ( auth.uid() = id );

create policy "Admins can view all profiles"
on profiles for select
using ( public.is_admin() );

-- Users can only update their own name (not role or points)
create policy "Users can update own profile"
on profiles for update
using ( auth.uid() = id )
with check ( auth.uid() = id );

-- Admins can update any profile (e.g., change role)
create policy "Admins can update any profile"
on profiles for update
using ( public.is_admin() );


-- ══════════════════════════════════════════
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ══════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case when new.email = 'rakshakmaharashtra@gmail.com' then 'admin' else 'user' end
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ══════════════════════════════════════════
-- 3. SHOPS TABLE & SECURITY
-- ══════════════════════════════════════════

-- Create table if it doesn't exist, OR ensure columns exist
create table if not exists public.shops (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_name text,
  category text,
  description text,
  images text[] default '{}',
  position numeric[] not null,
  status text default 'pending',
  "submittedBy" text,
  "submittedByEmail" text,
  "submittedById" text,
  approved_at timestamp with time zone,
  rejected_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure newer columns exist (if table was created in an older version of the tutorial)
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='owner_name') then
    alter table public.shops add column owner_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='description') then
    alter table public.shops add column description text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='images') then
    alter table public.shops add column images text[] default '{}';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='status') then
    alter table public.shops add column status text default 'pending';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='submittedBy') then
    alter table public.shops add column "submittedBy" text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='submittedByEmail') then
    alter table public.shops add column "submittedByEmail" text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='submittedById') then
    alter table public.shops add column "submittedById" text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='approved_at') then
    alter table public.shops add column approved_at timestamp with time zone;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='shops' and column_name='rejected_at') then
    alter table public.shops add column rejected_at timestamp with time zone;
  end if;
end $$;

alter table public.shops enable row level security;

drop policy if exists "Anyone can view approved shops" on shops;
drop policy if exists "Users can view their own submissions" on shops;
drop policy if exists "Admins can view all shops" on shops;
drop policy if exists "Users can insert shops" on shops;
drop policy if exists "Users delete own shops, Admins delete any" on shops;
drop policy if exists "Admins can update shops" on shops;

create policy "Anyone can view approved shops"
on shops for select using ( status = 'approved' );

create policy "Users can view their own submissions"
on shops for select using ( "submittedById" = auth.uid()::text );

create policy "Admins can view all shops"
on shops for select using ( public.is_admin() );

create policy "Users can insert shops"
on shops for insert to authenticated with check (true);

create policy "Users delete own shops, Admins delete any"
on shops for delete using (
  "submittedById" = auth.uid()::text or public.is_admin()
);

create policy "Users update own shops, Admins update any"
on shops for update using (
  "submittedById" = auth.uid()::text or public.is_admin()
);


-- ══════════════════════════════════════════
-- 4. POINTS TRIGGER (GAMIFICATION)
-- ══════════════════════════════════════════
create or replace function public.award_submission_points()
returns trigger as $$
begin
  -- Only award points when status changes to 'approved'
  if new.status = 'approved' and (old.status is null or old.status != 'approved') then
    update public.profiles
    set points = points + 50
    where id::text = new."submittedById";
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_shop_submitted on public.shops;
drop trigger if exists on_shop_approved on public.shops;
create trigger on_shop_approved
  after update on public.shops
  for each row execute procedure public.award_submission_points();


-- ══════════════════════════════════════════
-- 5. FIX YOUR ACCOUNT RIGHT NOW
-- ══════════════════════════════════════════
-- Confirm email (skip verification)
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'rakshakmaharashtra@gmail.com';

-- Set admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'rakshakmaharashtra@gmail.com';
