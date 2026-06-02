import Link from "next/link";
import { Header } from "@/components/Header";
import { PdfQrForm } from "@/components/PdfQrForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPdfQrPage() {
  await requireUser();

  return (
    <main>
      <Header authenticated />
      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm font-semibold text-sky-300 hover:text-sky-200">← Мои QR-коды</Link>
          <p className="mt-4 text-sm font-semibold text-sky-300">1. Загрузите PDF</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Создание QR-кода</h1>
          <p className="mt-1 text-slate-400">Обязателен только PDF-файл. Остальное можно оставить по умолчанию.</p>
        </div>
        <PdfQrForm />
      </section>
    </main>
  );
}
