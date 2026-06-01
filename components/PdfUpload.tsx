"use client";

import { FileUp } from "lucide-react";

export function PdfUpload({ name = "documents" }: { name?: string }) {
  return (
    <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-md border border-sky-200 bg-sky-50 px-4 py-8 text-center transition hover:border-sky-400 hover:bg-sky-100">
      <span className="mb-4 flex size-20 items-center justify-center rounded-md bg-white text-sky-500 shadow-sm">
        <FileUp size={34} />
      </span>
      <span className="font-semibold text-slate-950">Загрузите PDF-файл</span>
      <span className="mt-1 text-sm text-slate-500">Один файл PDF, до 25 MB</span>
      <input name={name} type="file" accept="application/pdf,.pdf" required className="sr-only" />
    </label>
  );
}
