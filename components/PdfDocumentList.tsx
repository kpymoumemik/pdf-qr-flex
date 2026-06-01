import { FileText, RefreshCw, Trash2 } from "lucide-react";
import { deletePdfDocument, replacePdfDocument } from "@/lib/actions";
import type { PdfDocument } from "@/lib/types";

export function PdfDocumentList({ qrCodeId, documents }: { qrCodeId: string; documents: PdfDocument[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Закрепленный PDF-файл</h2>
      <div className="mt-4 grid gap-3">
        {documents.map((document) => (
          <div key={document.id} className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_auto] md:items-center">
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
              <form action={replacePdfDocument} className="flex items-center gap-2">
                <input type="hidden" name="qr_code_id" value={qrCodeId} />
                <input type="hidden" name="document_id" value={document.id} />
                <input name="replacement" type="file" accept="application/pdf,.pdf" className="w-48 text-sm" />
                <button title="Заменить PDF" className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 hover:border-sky-400 hover:text-sky-700">
                  <RefreshCw size={16} />
                </button>
              </form>
              <form action={deletePdfDocument}>
                <input type="hidden" name="qr_code_id" value={qrCodeId} />
                <input type="hidden" name="document_id" value={document.id} />
                <button title="Удалить PDF" className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 hover:border-red-300 hover:text-red-700">
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
