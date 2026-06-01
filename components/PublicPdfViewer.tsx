import { Download, ExternalLink, FileText } from "lucide-react";

export type SignedDocument = {
  id: string;
  file_name: string;
  file_size: number | null;
  signed_url: string;
};

export function PublicPdfViewer({ documents }: { documents: SignedDocument[] }) {
  return (
    <div className="grid gap-3">
      {documents.map((document) => (
        <div key={document.id} className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-sky-100 text-sky-700">
              <FileText size={20} />
            </span>
            <div>
              <p className="font-semibold text-slate-950">{document.file_name}</p>
              <p className="text-sm text-slate-500">{document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : "PDF"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={document.signed_url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold hover:border-slate-400">
              <ExternalLink size={16} />
              Открыть PDF
            </a>
            <a href={document.signed_url} download className="inline-flex h-10 items-center gap-2 rounded-md bg-sky-500 px-3 text-sm font-semibold text-white hover:bg-sky-600">
              <Download size={16} />
              Скачать PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
