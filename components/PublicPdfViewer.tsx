import { Download, ExternalLink, FileText } from "lucide-react";

export type PublicPdfDocument = {
  id: string;
  file_name: string;
  file_size: number | null;
};

function formatFileSize(size: number | null) {
  if (!size) return "PDF";
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function PublicPdfViewer({ token, documents }: { token: string; documents: PublicPdfDocument[] }) {
  const firstDocument = documents[0];

  if (!firstDocument) {
    return (
      <div className="rounded-md border border-white/10 bg-white/8 p-5 text-slate-300 shadow-lg shadow-slate-950/20">
        PDF-файл не найден.
      </div>
    );
  }

  const openUrl = `/api/pdf/${token}/documents/${firstDocument.id}`;
  const downloadUrl = `/api/pdf/${token}/documents/${firstDocument.id}?download=1`;

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-md border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-sky-400/10 text-sky-300">
            <FileText size={22} />
          </span>
          <div className="min-w-0">
            <p className="break-words font-semibold text-white">{firstDocument.file_name}</p>
            <p className="text-sm text-slate-400">{formatFileSize(firstDocument.file_size)}</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <a href={openUrl} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-4 font-semibold text-slate-100 hover:bg-white/12">
            <ExternalLink size={18} />
            Открыть PDF
          </a>
          <a href={downloadUrl} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 font-semibold text-white hover:bg-sky-400">
            <Download size={18} />
            Скачать PDF
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10 bg-white shadow-lg shadow-slate-950/20">
        <iframe title={firstDocument.file_name} src={openUrl} className="h-[68vh] min-h-[420px] w-full sm:h-[72vh] sm:min-h-[520px]" />
      </div>
    </div>
  );
}
