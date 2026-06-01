import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { DownloadQrButton } from "@/components/DownloadQrButton";
import { QrActionsMenu } from "@/components/QrActionsMenu";
import { StatusBadge } from "@/components/StatusBadge";
import type { PdfQrWithDocuments } from "@/lib/types";
import { formatDateTime, publicPdfUrl } from "@/lib/utils";

export function PdfQrTable({ rows }: { rows: PdfQrWithDocuments[] }) {
  return (
    <div className="grid gap-3">
      {rows.map((row) => {
        const url = publicPdfUrl(row.token);
        return (
          <div key={row.id} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid size-20 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-900">
                <span className="text-3xl">▦</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-red-500">PDF</span>
                  <h3 className="truncate text-lg font-semibold text-slate-950">{row.title}</h3>
                </div>
                <p className="mt-1 break-all text-sm text-sky-700">{url}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Создан: {formatDateTime(row.created_at)} · Сканирований: {row.total_scans || 0}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <StatusBadge status={row.status} expiresAt={row.expires_at} />
              <DownloadQrButton url={url} title={row.title} color={row.qr_color} background={row.qr_background} size={row.qr_size} />
              <CopyButton value={url} label="Ссылка" />
              <Link href={`/dashboard/${row.id}`} className="inline-flex h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold hover:border-slate-400">
                Детали
              </Link>
              <QrActionsMenu qrCodeId={row.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
