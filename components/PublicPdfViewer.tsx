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

export function PublicPdfViewer({
  token,
  documents,
}: {
  token: string;
  documents: PublicPdfDocument[];
}) {
  const firstDocument = documents[0];

  if (!firstDocument) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
        PDF-файл не найден.
      </div>
    );
  }

  const openUrl = `/api/pdf/${token}/documents/${firstDocument.id}`;
  const downloadUrl = `/api/pdf/${token}/documents/${firstDocument.id}?download=1`;

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-md bg-sky-100 text-sky-700">
            <FileText size={22} />
          </span>
          <div>
            <p className="font-semibold text-slate-950">{firstDocument.file_name}</p>
            <p className="text-sm text-slate-500">{formatFileSize(firstDocument.file_size)}</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <a href={openUrl} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 font-semibold text-slate-900 hover:border-slate-400">
            <ExternalLink size={18} />
            Открыть PDF
          </a>
          <a href={downloadUrl} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-4 font-semibold text-white hover:bg-sky-600">
            <Download size={18} />
            Скачать PDF
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <iframe title={firstDocument.file_name} src={openUrl} className="h-[72vh] min-h-[520px] w-full" />
      </div>
    </div>
  );
}
