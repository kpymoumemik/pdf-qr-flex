import Link from "next/link";
import { Download, FileUp, LockKeyhole, QrCode, RefreshCw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";

const features = [
  { title: "Загрузите PDF", text: "При создании нужен только один PDF-файл.", icon: FileUp },
  { title: "Получите QR-код", text: "QR ведет на постоянную публичную страницу PDF.", icon: QrCode },
  { title: "Заменяйте PDF", text: "Файл можно заменить, QR-код останется тем же.", icon: RefreshCw },
  { title: "Скачайте PNG", text: "Готовый QR можно скачать и использовать где угодно.", icon: Download },
  { title: "Закрытое хранение", text: "PDF хранится в private bucket и открывается по signed URL.", icon: LockKeyhole },
  { title: "Только PDF QR", text: "Без Wi-Fi, vCard, соцсетей и других типов QR.", icon: ShieldCheck },
];

export default function Home() {
  return (
    <main>
      <Header />
      <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Генератор PDF QR
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] text-slate-950 md:text-7xl">
            PDF QR
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Загрузите PDF-файл и получите динамический QR-код. Позже PDF можно заменить,
            а ссылка внутри QR останется прежней.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/new"
              className="inline-flex h-12 items-center justify-center rounded-md bg-sky-500 px-5 font-semibold text-white transition hover:bg-sky-600"
            >
              Создать QR-код
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Войти
            </Link>
          </div>
          <div className="mt-10 rounded-md border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
            Сервис делает только QR-коды для PDF-файлов. Другие типы QR-кодов в этом MVP не поддерживаются.
          </div>
        </div>

        <div className="grid gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-semibold text-slate-950">{feature.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">{feature.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
