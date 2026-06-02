"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileText, FileUp, X } from "lucide-react";

export function PdfUpload({ name = "documents" }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function syncSelectedFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    setFileName(file?.name || "");
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    syncSelectedFile(event.currentTarget);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || !inputRef.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    syncSelectedFile(inputRef.current);
  }

  function clearFile() {
    if (inputRef.current) inputRef.current.value = "";
    setFileName("");
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-md border px-4 py-8 text-center transition ${
        isDragging ? "border-sky-400 bg-sky-400/10" : "border-sky-400/30 bg-sky-400/5 hover:border-sky-400 hover:bg-sky-400/10"
      }`}
    >
      <input ref={inputRef} name={name} type="file" accept="application/pdf,.pdf" required onChange={onChange} className="sr-only" />

      {fileName ? (
        <div className="grid justify-items-center gap-3">
          <span className="flex size-20 items-center justify-center rounded-md bg-white text-sky-500 shadow-sm">
            <FileText size={34} />
          </span>
          <div>
            <p className="font-semibold text-white">{fileName}</p>
            <p className="mt-1 text-sm text-slate-400">Файл выбран. Можно создать QR-код.</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              clearFile();
            }}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-100 hover:border-red-400/40 hover:text-red-200"
          >
            <X size={16} />
            Удалить
          </button>
        </div>
      ) : (
        <div className="grid justify-items-center gap-3">
          <span className="flex size-20 items-center justify-center rounded-md bg-white text-sky-500 shadow-sm">
            <FileUp size={34} />
          </span>
          <div>
            <p className="font-semibold text-white">Загрузите PDF-файл</p>
            <p className="mt-1 text-sm text-slate-400">Перетащите файл сюда или нажмите кнопку ниже</p>
          </div>
          <span className="inline-flex h-10 items-center justify-center rounded-md bg-sky-500 px-4 text-sm font-semibold text-white">
            Выбрать PDF
          </span>
          <p className="text-xs text-slate-500">Один файл PDF, до 25 MB</p>
        </div>
      )}
    </div>
  );
}
