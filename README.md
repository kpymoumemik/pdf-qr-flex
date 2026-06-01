# PDF QR

MVP веб-сервиса для создания динамических QR-кодов, к которым закреплен один PDF-файл.

Пользователь входит в кабинет, загружает PDF, получает QR-код на страницу `/pdf/[token]`, а позже может заменить PDF без изменения QR-кода.

## Стек

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth, PostgreSQL, private Storage
- `qrcode` для генерации QR в PNG
- Vercel для деплоя

## Установка

```bash
npm install
```

## Настройка Supabase

1. Создайте проект Supabase.
2. Выполните SQL из `supabase/migrations/001_init.sql`.
3. Проверьте, что bucket `pdf-documents` создан и остается private.
4. Включите Email/Password auth.

Миграция создает:

- `pdf_qr_codes`
- `documents`
- `access_logs`
- private bucket `pdf-documents`
- RLS-политики для пользовательских QR-кодов и PDF-файлов

Публичная страница `/pdf/[token]` не читает базу из браузера напрямую. Сервер проверяет статус, срок действия и пароль, пишет лог открытия и возвращает signed URL для PDF.

## Переменные окружения

Скопируйте `.env.example` в `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` используется только на сервере.

## Запуск

```bash
npm run dev
```

Откройте `http://localhost:3000`.

Основной сценарий:

1. Войти или зарегистрироваться.
2. Нажать `Создать QR-код`.
3. Загрузить один PDF-файл.
4. Скачать QR или скопировать ссылку.
5. Открыть публичную страницу по QR.
6. Открыть или скачать PDF.
7. При необходимости заменить PDF в деталях QR-кода.

## Важно

- Сервис поддерживает только PDF QR.
- Один QR-код связан с одним PDF-файлом.
- PDF хранится в private bucket.
- Доступ к PDF идет через signed URL.
- Пароль хранится как `password_hash`, не в открытом виде.
