-- Migration: Initial schema for MyJobTrack
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: job_applications
create table if not exists public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_name text not null,
  position text not null,
  applied_date date not null default current_date,
  status text not null default 'applied' check (status in (
    'applied', 'screening', 'interview', 'offer', 'accepted', 'rejected'
  )),
  source text, -- LinkedIn, JobStreet, Referral, dll
  location text, -- Kota Malang, Kabupaten Malang, Remote, dll
  job_url text,
  salary_range text,
  recruiter_name text,
  recruiter_contact text,
  notes text,
  follow_up_date date,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast user-scoped queries
create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_job_applications_status on public.job_applications(status);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.job_applications
  for each row
  execute function public.handle_updated_at();

-- RLS: Enable Row Level Security
alter table public.job_applications enable row level security;

-- Policy: Users can only see their own data
create policy "Users can view own applications"
  on public.job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.job_applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.job_applications for delete
  using (auth.uid() = user_id);
