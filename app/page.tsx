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
  { title: "Только PDF QR", text: "Без Wi-Fi, VCard, соцсетей и других типов QR.", icon: ShieldCheck },
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
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-8 px-4 py-7 sm:px-5 sm:py-10 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold text-slate-200 shadow-lg shadow-slate-950/20">
            <span className="size-2 rounded-full bg-sky-400" />
            Генератор PDF QR
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-7xl">
            PDF в QR-код за пару кликов
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            Загрузите PDF-файл, получите QR-код и делитесь им где угодно. Файл можно заменить позже, а ссылка внутри QR останется прежней.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={authenticated ? "/dashboard/new" : "/login"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-5 font-semibold text-white shadow-lg shadow-sky-950/40 transition hover:bg-sky-400"
            >
              Создать QR-код
              <ArrowRight size={18} />
            </Link>
            {!authenticated ? (
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/8 px-5 font-semibold text-slate-100 transition hover:bg-white/12"
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

        <div className="rounded-md border border-white/10 bg-white/8 p-3 shadow-2xl shadow-slate-950/40 sm:p-4">
          <div className="rounded-md border border-white/10 bg-slate-950/45 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Готовый QR</p>
                <p className="mt-1 text-xs text-slate-400">QR остается на светлой подложке для сканирования</p>
              </div>
              <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-300">Активно</span>
            </div>
            <div className="grid aspect-square place-items-center rounded-md bg-white p-5 shadow-inner shadow-slate-300/60 sm:p-8">
              <QrMock />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-3 rounded-md border border-white/10 bg-slate-950/35 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-400/10 text-sky-300">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{feature.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-400">{feature.text}</span>
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
    <div className="rounded-md border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
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
        <span key={index} className={`aspect-square rounded-[3px] ${cell ? "bg-slate-950" : "bg-transparent"}`} />
      ))}
    </div>
  );
}
