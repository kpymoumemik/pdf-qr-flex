import { FileText, RefreshCw, Trash2 } from "lucide-react";
import { deletePdfDocument, replacePdfDocument } from "@/lib/actions";
import type { PdfDocument } from "@/lib/types";

export function PdfDocumentList({ qrCodeId, documents }: { qrCodeId: string; documents: PdfDocument[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/8 p-5 shadow-lg shadow-slate-950/20">
      <h2 className="text-lg font-semibold text-white">Закрепленный PDF-файл</h2>
      <div className="mt-4 grid gap-3">
        {documents.map((document) => (
          <div key={document.id} className="grid gap-3 rounded-md border border-white/10 bg-slate-950/30 p-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-sky-400/10 text-sky-300">
                <FileText size={20} />
              </span>
              <div>
                <p className="font-semibold text-white">{document.file_name}</p>
                <p className="text-sm text-slate-400">{document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : "PDF"}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:flex sm:flex-wrap">
              <form action={replacePdfDocument} className="grid gap-2 sm:flex sm:items-center">
                <input type="hidden" name="qr_code_id" value={qrCodeId} />
                <input type="hidden" name="document_id" value={document.id} />
                <input name="replacement" type="file" accept="application/pdf,.pdf" className="w-full max-w-full text-sm text-slate-300 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-slate-100 sm:w-48" />
                <button title="Заменить PDF" className="inline-flex h-10 w-full items-center justify-center rounded-md border border-white/10 text-slate-100 hover:border-sky-400 hover:text-sky-300 sm:w-10">
                  <RefreshCw size={16} />
                </button>
              </form>
              <form action={deletePdfDocument}>
                <input type="hidden" name="qr_code_id" value={qrCodeId} />
                <input type="hidden" name="document_id" value={document.id} />
                <button title="Удалить PDF" className="inline-flex h-10 w-full items-center justify-center rounded-md border border-white/10 text-slate-100 hover:border-red-400 hover:text-red-300 sm:w-10">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
