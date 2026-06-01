import Link from "next/link";
import { Header } from "@/components/Header";
import { PdfDocumentList } from "@/components/PdfDocumentList";
import { QrCodeCard } from "@/components/QrCodeCard";
import { StatusBadge } from "@/components/StatusBadge";
import { getPdfQrCodeById, setPdfQrCodeStatus } from "@/lib/actions";
import { formatDate, formatDateTime } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PdfQrDetailPage({ params }: Props) {
  const { id } = await params;
  const qrCode = await getPdfQrCodeById(id);
  const isDisabled = qrCode.status === "disabled";

  return (
    <main>
      <Header authenticated />
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-sky-700">
              ← Мои QR-коды
            </Link>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{qrCode.title}</h1>
            <p className="mt-1 text-slate-600">
              {qrCode.description || "PDF-файл закреплен за этим QR-кодом."}
            </p>
          </div>
          <form action={setPdfQrCodeStatus}>
            <input type="hidden" name="qr_code_id" value={qrCode.id} />
            <input type="hidden" name="status" value={isDisabled ? "active" : "disabled"} />
            <input type="hidden" name="redirect_to" value={`/dashboard/${qrCode.id}`} />
            <button className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-slate-400">
              {isDisabled ? "Включить QR-код" : "Отключить QR-код"}
            </button>
          </form>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <QrCodeCard
            token={qrCode.token}
            title={qrCode.title}
            color={qrCode.qr_color}
            background={qrCode.qr_background}
            size={qrCode.qr_size}
            frameStyle={qrCode.frame_style}
            patternStyle={qrCode.pattern_style}
          />

          <div className="grid gap-6">
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Информация</h2>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Статус</dt>
                  <dd className="mt-1">
                    <StatusBadge status={qrCode.status} expiresAt={qrCode.expires_at} />
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Срок действия</dt>
                  <dd className="mt-1 font-medium">{formatDate(qrCode.expires_at)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Сканирований</dt>
                  <dd className="mt-1 font-medium">{qrCode.total_scans || 0}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Последнее открытие</dt>
                  <dd className="mt-1 font-medium">{formatDateTime(qrCode.last_scan_at)}</dd>
                </div>
              </dl>
            </div>
            <PdfDocumentList qrCodeId={qrCode.id} documents={qrCode.documents || []} />
          </div>
        </div>
      </section>
    </main>
  );
}
