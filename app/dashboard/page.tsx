import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { PdfQrTable } from "@/components/PdfQrTable";
import { getPdfQrCodesForCurrentUser } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await getPdfQrCodesForCurrentUser();

  return (
    <main>
      <Header authenticated />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Мои QR-коды</h1>
            <p className="mt-1 text-slate-400">Здесь отображаются QR-коды, созданные в этом аккаунте.</p>
          </div>
          <Link href="/dashboard/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-500 px-4 font-semibold text-white shadow-lg shadow-sky-950/30 hover:bg-sky-400">
            <Plus size={18} />
            Создать QR-код
          </Link>
        </div>

        <div className="mb-6 rounded-md border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20">
          <label className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-slate-950/40 px-4 text-slate-400">
            <Search size={18} />
            <input placeholder="Поиск..." className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500" />
          </label>
        </div>

        {rows.length ? (
          <PdfQrTable rows={rows} />
        ) : (
          <div className="rounded-md border border-white/10 bg-white/8 p-8 text-center shadow-lg shadow-slate-950/20">
            <h2 className="text-xl font-semibold text-white">Пока нет QR-кодов</h2>
            <p className="mt-2 text-slate-400">Перейдите в раздел создания и загрузите первый PDF-файл.</p>
            <Link href="/dashboard/new" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-400">
              Создать QR-код
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
