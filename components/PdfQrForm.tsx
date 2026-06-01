"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileText, KeyRound, Palette, QrCode } from "lucide-react";
import { createPdfQrCodeRecord, deletePdfQrCodeById, type ActionState } from "@/lib/actions";
import { EXPIRATION_OPTIONS, MAX_PDF_SIZE_BYTES, PDF_BUCKET } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PdfUpload } from "@/components/PdfUpload";

const initialState: ActionState = { ok: false, message: "" };

const frameStyles = ["Без рамки", "Классика", "Сканируй", "Тонкая", "Контраст"];
const patternStyles = ["Квадрат", "Скругленный", "Точки", "Ромб", "Плитка"];

export function PdfQrForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [state, setState] = useState<ActionState>(initialState);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState(initialState);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("documents");
    formData.set("title", String(formData.get("qr_title") || ""));
    formData.set("password", String(formData.get("qr_access_code") || ""));
    formData.delete("qr_title");
    formData.delete("qr_access_code");

    try {
      if (!(file instanceof File) || file.size === 0) {
        throw new Error("Выберите PDF-файл.");
      }

      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        throw new Error("Можно загружать только PDF-файлы.");
      }

      if (file.size > MAX_PDF_SIZE_BYTES) {
        throw new Error("Размер PDF-файла не должен превышать 25 MB.");
      }

      formData.delete("documents");
      formData.set("file_name", file.name);

      const result = await createPdfQrCodeRecord(initialState, formData);
      if (!result.ok) {
        throw new Error(result.message);
      }

      const qrCode = result.data as { id: string; user_id: string };
      const safeName = file.name.replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/-+/g, "-") || "document.pdf";
      const filePath = `${qrCode.user_id}/${qrCode.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage.from(PDF_BUCKET).upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

      if (uploadError) {
        await deletePdfQrCodeById(qrCode.id);
        throw new Error(uploadError.message);
      }

      const { error: documentError } = await supabase.from("documents").insert({
        qr_code_id: qrCode.id,
        file_name: safeName,
        file_path: filePath,
        file_type: "application/pdf",
        file_size: file.size,
        sort_order: 0,
      });

      if (documentError) {
        await supabase.storage.from(PDF_BUCKET).remove([filePath]);
        await deletePdfQrCodeById(qrCode.id);
        throw new Error(documentError.message);
      }

      router.push(`/dashboard/${qrCode.id}`);
      router.refresh();
    } catch (error) {
      setState({ ok: false, message: error instanceof Error ? error.message : "Не удалось создать QR-код." });
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" className="grid gap-5">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0">
        <input type="text" name="email" autoComplete="username" tabIndex={-1} />
        <input type="password" name="browser_saved_password" autoComplete="current-password" tabIndex={-1} />
      </div>

      <FormSection
        icon={<FileText size={24} />}
        title="PDF-файл *"
        subtitle="Загрузите PDF-файл, который будет открываться по QR-коду."
        open
      >
        <PdfUpload />
      </FormSection>

      <FormSection
        icon={<QrCode size={24} />}
        title="Название QR-кода"
        subtitle="Необязательно. Если оставить пустым, используем имя PDF-файла."
      >
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Имя
          <input
            name="qr_title"
            type="text"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            placeholder="Например, мой QR-код"
            className="h-12 rounded-md border border-slate-300 bg-white px-4 outline-none focus:border-sky-500"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
          Описание
          <textarea
            name="description"
            rows={4}
            maxLength={4000}
            placeholder="Например, описание PDF-файла"
            className="rounded-md border border-slate-300 bg-white p-4 outline-none focus:border-sky-500"
          />
        </label>
      </FormSection>

      <FormSection icon={<KeyRound size={24} />} title="Пароль" subtitle="Необязательно. Можно закрыть публичную страницу паролем.">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Пароль для доступа к PDF
          <input
            name="qr_access_code"
            type="password"
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            placeholder="Оставьте пустым, если пароль не нужен"
            className="h-12 rounded-md border border-slate-300 bg-white px-4 outline-none focus:border-sky-500"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
          Срок действия ссылки
          <select name="expires_in_days" defaultValue="never" className="h-12 rounded-md border border-slate-300 bg-white px-4 outline-none focus:border-sky-500">
            {EXPIRATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </FormSection>

      <FormSection icon={<Palette size={24} />} title="Оформите QR-код" subtitle="Выберите простой внешний вид QR-кода.">
        <div className="grid gap-6">
          <OptionStrip label="Рамка" name="frame_style" options={frameStyles} />
          <OptionStrip label="Узор QR-кода" name="pattern_style" options={patternStyles} />
          <div className="grid gap-4 rounded-md bg-slate-50 p-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Цвет узора
              <input name="qr_color" type="color" defaultValue="#000000" className="h-12 w-full rounded-md border border-slate-300 bg-white p-1" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Цвет фона
              <input name="qr_background" type="color" defaultValue="#ffffff" className="h-12 w-full rounded-md border border-slate-300 bg-white p-1" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Размер PNG
              <input name="qr_size" type="number" min={192} max={1024} step={64} defaultValue={512} className="h-12 rounded-md border border-slate-300 bg-white px-4" />
            </label>
          </div>
        </div>
      </FormSection>

      {state.message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.message}</p> : null}
      <div className="flex justify-end">
        <button disabled={pending} className="h-11 rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600 disabled:opacity-60">
          {pending ? "Создаем QR..." : "Создать QR-код"}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  icon,
  title,
  subtitle,
  children,
  open = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-600">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-semibold text-slate-950">{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{subtitle}</span>
        </span>
        <ChevronDown size={22} className="text-slate-900" />
      </summary>
      <div className="mt-5 border-t border-slate-200 pt-5">{children}</div>
    </details>
  );
}

function OptionStrip({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-slate-700">{label}</legend>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {options.map((option, index) => (
          <label key={option} className="group block shrink-0">
            <input className="peer sr-only" type="radio" name={name} value={option} defaultChecked={index === 0} />
            <span className="grid size-20 place-items-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm peer-checked:border-sky-500 peer-checked:ring-2 peer-checked:ring-sky-500/20">
              <span className="grid size-12 place-items-center rounded border-2 border-slate-900">
                {index === 0 ? "-" : "QR"}
              </span>
            </span>
            <span className="mt-1 block w-20 truncate text-center text-xs text-slate-500">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
