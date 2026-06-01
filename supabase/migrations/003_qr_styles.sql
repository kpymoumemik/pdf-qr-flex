alter table public.pdf_qr_codes
add column if not exists frame_style text not null default 'Без рамки',
add column if not exists pattern_style text not null default 'Квадрат';
