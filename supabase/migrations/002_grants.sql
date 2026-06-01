grant usage on schema public to anon, authenticated, service_role;

grant all privileges on table public.pdf_qr_codes to service_role;
grant all privileges on table public.documents to service_role;
grant all privileges on table public.access_logs to service_role;

grant select, insert, update, delete on table public.pdf_qr_codes to authenticated;
grant select, insert, update, delete on table public.documents to authenticated;
grant select on table public.access_logs to authenticated;

alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
