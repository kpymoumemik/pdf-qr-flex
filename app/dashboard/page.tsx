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
      <Header />
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Мои QR-коды</h1>
            <p className="mt-1 text-slate-600">Здесь отображаются QR-коды, созданные в этом аккаунте.</p>
          </div>
          <Link href="/dashboard/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-500 px-4 font-semibold text-white hover:bg-sky-600">
            <Plus size={18} />
            Создать QR-код
          </Link>
        </div>

        <div className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <label className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-slate-500">
            <Search size={18} />
            <input placeholder="Поиск..." className="w-full bg-transparent outline-none" />
          </label>
        </div>

        {rows.length ? (
          <PdfQrTable rows={rows} />
        ) : (
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Пока нет QR-кодов</h2>
            <p className="mt-2 text-slate-600">Перейдите в раздел создания и загрузите первый PDF-файл.</p>
            <Link href="/dashboard/new" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600">
              Создать QR-код
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
