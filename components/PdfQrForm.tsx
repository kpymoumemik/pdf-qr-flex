"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileText, KeyRound, Palette, QrCode } from "lucide-react";
import { createPdfQrCodeRecord, deletePdfQrCodeById, type ActionState } from "@/lib/actions";
import { EXPIRATION_OPTIONS, MAX_PDF_SIZE_BYTES, PDF_BUCKET } from "@/lib/constants";
import { FRAME_STYLES, PATTERN_STYLES, generateStyledQrSvgDataUrl } from "@/lib/qr-style";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PdfUpload } from "@/components/PdfUpload";

const initialState: ActionState = { ok: false, message: "" };
const frameStyles = [...FRAME_STYLES];
const patternStyles = [...PATTERN_STYLES];
const fieldClass = "h-12 rounded-md border border-white/10 bg-slate-950/55 px-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400";

export function PdfQrForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [state, setState] = useState<ActionState>(initialState);
  const [pending, setPending] = useState(false);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBackground, setQrBackground] = useState("#ffffff");
  const [qrSize, setQrSize] = useState("512");
  const [frameStyle, setFrameStyle] = useState<string>(frameStyles[0]);
  const [patternStyle, setPatternStyle] = useState<string>(patternStyles[0]);

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
      if (!(file instanceof File) || file.size === 0) throw new Error("Выберите PDF-файл.");
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) throw new Error("Можно загружать только PDF-файлы.");
      if (file.size > MAX_PDF_SIZE_BYTES) throw new Error("Размер PDF-файла не должен превышать 25 MB.");

      formData.delete("documents");
      formData.set("file_name", file.name);

      const result = await createPdfQrCodeRecord(initialState, formData);
      if (!result.ok) throw new Error(result.message);

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

      <FormSection icon={<FileText size={24} />} title="PDF-файл *" subtitle="Загрузите PDF-файл, который будет открываться по QR-коду." open>
        <PdfUpload />
      </FormSection>

      <FormSection icon={<QrCode size={24} />} title="Название QR-кода" subtitle="Необязательно. Если оставить пустым, используем имя PDF-файла.">
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Имя
          <input name="qr_title" type="text" autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-form-type="other" placeholder="Например, мой QR-код" className={fieldClass} />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium text-slate-300">
          Описание
          <textarea name="description" rows={4} maxLength={4000} placeholder="Например, описание PDF-файла" className="rounded-md border border-white/10 bg-slate-950/55 p-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400" />
        </label>
      </FormSection>

      <FormSection icon={<KeyRound size={24} />} title="Пароль" subtitle="Необязательно. Можно закрыть публичную страницу паролем.">
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Пароль для доступа к PDF
          <input name="qr_access_code" type="password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-form-type="other" placeholder="Оставьте пустым, если пароль не нужен" className={fieldClass} />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium text-slate-300">
          Срок действия ссылки
          <select name="expires_in_days" defaultValue="never" className={fieldClass}>
            {EXPIRATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </FormSection>

      <FormSection icon={<Palette size={24} />} title="Оформите QR-код" subtitle="Выберите внешний вид QR-кода.">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="grid gap-6">
            <OptionStrip label="Рамка" name="frame_style" options={frameStyles} value={frameStyle} onChange={setFrameStyle} />
            <OptionStrip label="Узор QR-кода" name="pattern_style" options={patternStyles} value={patternStyle} onChange={setPatternStyle} />
            <div className="grid gap-4 rounded-md border border-white/10 bg-slate-950/35 p-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Цвет узора
                <input name="qr_color" type="color" value={qrColor} onChange={(event) => setQrColor(event.target.value)} className="h-12 w-full rounded-md border border-white/10 bg-slate-950/55 p-1" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Цвет фона
                <input name="qr_background" type="color" value={qrBackground} onChange={(event) => setQrBackground(event.target.value)} className="h-12 w-full rounded-md border border-white/10 bg-slate-950/55 p-1" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Размер PNG
                <input name="qr_size" type="number" min={192} max={1024} step={64} value={qrSize} onChange={(event) => setQrSize(event.target.value)} className={fieldClass} />
              </label>
            </div>
          </div>
          <QrLivePreview color={qrColor} background={qrBackground} sizeValue={qrSize} frameStyle={frameStyle} patternStyle={patternStyle} />
        </div>
      </FormSection>

      {state.message ? <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-400/20">{state.message}</p> : null}
      <div className="flex justify-end">
        <button disabled={pending} className="h-11 w-full rounded-md bg-sky-500 px-5 font-semibold text-white shadow-lg shadow-sky-950/30 hover:bg-sky-400 disabled:opacity-60 sm:w-auto">
          {pending ? "Создаем QR..." : "Создать QR-код"}
        </button>
      </div>
    </form>
  );
}

function QrLivePreview({ color, background, sizeValue, frameStyle, patternStyle }: { color: string; background: string; sizeValue: string; frameStyle: string; patternStyle: string }) {
  const previewSize = Math.min(1024, Math.max(192, Number(sizeValue) || 512));
  const dataUrl = useMemo(() => generateStyledQrSvgDataUrl("https://pdf-qr-flex.vercel.app/pdf/preview", { color, background, size: previewSize, frameStyle, patternStyle }), [background, color, frameStyle, patternStyle, previewSize]);

  return (
    <aside className="rounded-md border border-white/10 bg-slate-950/45 p-3 shadow-lg shadow-slate-950/25 sm:p-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-white">Предпросмотр QR</p>
        <p className="mt-1 text-xs text-slate-400">Белая подложка сохраняет читаемость QR.</p>
      </div>
      <div className="mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-md border border-slate-200 bg-white p-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Предпросмотр QR-кода" className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm text-slate-500">Готовим QR...</span>
        )}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-400">
        <div className="grid grid-cols-2 gap-2">
          <span className="rounded bg-white/8 px-2 py-1">Узор {color}</span>
          <span className="rounded bg-white/8 px-2 py-1">Фон {background}</span>
        </div>
        <span className="rounded bg-white/8 px-2 py-1">Рамка: {frameStyle}</span>
        <span className="rounded bg-white/8 px-2 py-1">Узор QR: {patternStyle}</span>
      </div>
    </aside>
  );
}

function FormSection({ icon, title, subtitle, children, open = false }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="rounded-md border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20 sm:p-5">
      <summary className="flex cursor-pointer list-none items-center gap-3 sm:gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-sky-400/10 text-sky-300 sm:size-14">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold text-white sm:text-xl">{title}</span>
          <span className="mt-1 block text-sm text-slate-400">{subtitle}</span>
        </span>
        <ChevronDown size={22} className="text-slate-200" />
      </summary>
      <div className="mt-5 border-t border-white/10 pt-5">{children}</div>
    </details>
  );
}

function OptionStrip({ label, name, options, value, onChange }: { label: string; name: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-slate-300">{label}</legend>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {options.map((option, index) => (
          <label key={option} className="group block shrink-0">
            <input className="peer sr-only" type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
            <span className="grid size-18 place-items-center rounded-md border border-white/10 bg-slate-950/45 text-xs font-semibold text-slate-200 shadow-sm peer-checked:border-sky-400 peer-checked:ring-2 peer-checked:ring-sky-400/20 sm:size-20">
              <span className="grid size-11 place-items-center rounded border-2 border-slate-200 sm:size-12">
                {index === 0 ? "-" : "QR"}
              </span>
            </span>
            <span className="mt-1 block w-18 truncate text-center text-xs text-slate-400 sm:w-20">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
