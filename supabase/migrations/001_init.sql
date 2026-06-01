create extension if not exists pgcrypto;

create table if not exists public.pdf_qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text unique not null,
  title text not null,
  description text,
  expires_at timestamptz,
  password_hash text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  qr_color text not null default '#000000',
  qr_background text not null default '#ffffff',
  qr_size int not null default 512,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid not null references public.pdf_qr_codes(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text not null default 'application/pdf',
  file_size bigint,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid not null references public.pdf_qr_codes(id) on delete cascade,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists pdf_qr_codes_user_id_idx on public.pdf_qr_codes(user_id);
create index if not exists pdf_qr_codes_token_idx on public.pdf_qr_codes(token);
create index if not exists documents_qr_code_id_idx on public.documents(qr_code_id);
create index if not exists access_logs_qr_code_id_created_at_idx on public.access_logs(qr_code_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pdf_qr_codes_updated_at on public.pdf_qr_codes;
create trigger set_pdf_qr_codes_updated_at
before update on public.pdf_qr_codes
for each row execute function public.set_updated_at();

alter table public.pdf_qr_codes enable row level security;
alter table public.documents enable row level security;
alter table public.access_logs enable row level security;

drop policy if exists "Users manage own qr codes" on public.pdf_qr_codes;
create policy "Users manage own qr codes"
on public.pdf_qr_codes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage documents for own qr codes" on public.documents;
create policy "Users manage documents for own qr codes"
on public.documents
for all
to authenticated
using (
  exists (
    select 1 from public.pdf_qr_codes
    where pdf_qr_codes.id = documents.qr_code_id
      and pdf_qr_codes.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.pdf_qr_codes
    where pdf_qr_codes.id = documents.qr_code_id
      and pdf_qr_codes.user_id = auth.uid()
  )
);

drop policy if exists "Users read logs for own qr codes" on public.access_logs;
create policy "Users read logs for own qr codes"
on public.access_logs
for select
to authenticated
using (
  exists (
    select 1 from public.pdf_qr_codes
    where pdf_qr_codes.id = access_logs.qr_code_id
      and pdf_qr_codes.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('pdf-documents', 'pdf-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Users can read own pdf objects" on storage.objects;
create policy "Users can read own pdf objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'pdf-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can upload own pdf objects" on storage.objects;
create policy "Users can upload own pdf objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'pdf-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own pdf objects" on storage.objects;
create policy "Users can update own pdf objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pdf-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'pdf-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own pdf objects" on storage.objects;
create policy "Users can delete own pdf objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pdf-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
