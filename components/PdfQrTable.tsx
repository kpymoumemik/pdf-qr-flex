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
          <div key={row.id} className="grid gap-4 rounded-md border border-white/10 bg-white/8 p-3 shadow-lg shadow-slate-950/20 sm:p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-md bg-white text-slate-950 sm:size-20">
                <span className="text-2xl sm:text-3xl">▦</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-sky-300">PDF</span>
                  <h3 className="line-clamp-2 text-base font-semibold text-white sm:truncate sm:text-lg">{row.title}</h3>
                </div>
                <p className="mt-1 break-all text-sm text-sky-300">{url}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Создан: {formatDateTime(row.created_at)} · Сканирований: {row.total_scans || 0}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap lg:justify-end">
              <div className="col-span-2 sm:col-span-1">
                <StatusBadge status={row.status} expiresAt={row.expires_at} />
              </div>
              <DownloadQrButton url={url} title={row.title} color={row.qr_color} background={row.qr_background} size={row.qr_size} frameStyle={row.frame_style} patternStyle={row.pattern_style} />
              <CopyButton value={url} label="Ссылка" />
              <Link href={`/dashboard/${row.id}`} className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-100 hover:bg-white/12">
                Детали
              </Link>
              <QrActionsMenu qrCodeId={row.id} status={row.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
