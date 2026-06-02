import Link from "next/link";
import { ArrowRight, Download, FileUp, LockKeyhole, QrCode, RefreshCw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const features = [
  { title: "Загрузите PDF", text: "При создании нужен только один PDF-файл.", icon: FileUp },
  { title: "Получите QR-код", text: "QR ведет на постоянную публичную страницу PDF.", icon: QrCode },
  { title: "Заменяйте PDF", text: "Файл можно заменить, QR-код останется тем же.", icon: RefreshCw },
  { title: "Скачайте PNG", text: "Готовый QR можно скачать и использовать где угодно.", icon: Download },
  { title: "Закрытое хранение", text: "PDF хранится в private bucket и открывается через сайт.", icon: LockKeyhole },
  { title: "Только PDF QR", text: "Без Wi-Fi, vCard, соцсетей и других типов QR.", icon: ShieldCheck },
];

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authenticated = Boolean(user);

  return (
    <main>
      <Header authenticated={authenticated} />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
            <span className="size-2 rounded-full bg-sky-500" />
            Генератор PDF QR
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-zinc-950 md:text-7xl">
            PDF в QR-код за пару кликов
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Загрузите PDF-файл, получите QR-код и делитесь им где угодно. Файл можно заменить позже, а ссылка внутри QR останется прежней.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={authenticated ? "/dashboard/new" : "/login"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-5 font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Создать QR-код
              <ArrowRight size={18} />
            </Link>
            {!authenticated ? (
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 font-semibold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Войти
              </Link>
            ) : null}
          </div>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            <Metric value="1 PDF" label="для создания" />
            <Metric value="PNG" label="скачивание QR" />
            <Metric value="Private" label="хранение файла" />
          </div>
        </div>

        <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-lg shadow-zinc-200/70">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-950">Готовый QR</p>
                <p className="mt-1 text-xs text-zinc-500">Пример публичной страницы PDF</p>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Активно</span>
            </div>
            <div className="grid aspect-square place-items-center rounded-md bg-white p-8 shadow-inner">
              <QrMock />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-3 rounded-md border border-zinc-200 bg-white p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-600">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-zinc-950">{feature.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-zinc-500">{feature.text}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-lg font-semibold text-zinc-950">{value}</div>
      <div className="mt-1 text-sm text-zinc-500">{label}</div>
    </div>
  );
}

function QrMock() {
  const cells = [
    1, 1, 1, 0, 1, 0, 0, 1, 1, 1,
    1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
    1, 1, 1, 1, 0, 1, 0, 1, 1, 0,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1,
    1, 0, 0, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 1, 0, 0, 1, 0, 1, 1, 1,
    1, 0, 1, 1, 0, 0, 1, 0, 0, 1,
    1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
    0, 1, 1, 1, 0, 1, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 0, 1, 1, 1, 1,
  ];

  return (
    <div className="grid w-full max-w-[250px] grid-cols-10 gap-1">
      {cells.map((cell, index) => (
        <span key={index} className={`aspect-square rounded-[3px] ${cell ? "bg-zinc-950" : "bg-transparent"}`} />
      ))}
    </div>
  );
}
