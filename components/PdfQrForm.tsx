"use client";

import { useActionState } from "react";
import { ChevronDown, FileText, KeyRound, Palette, QrCode } from "lucide-react";
import { createPdfQrCode, type ActionState } from "@/lib/actions";
import { EXPIRATION_OPTIONS } from "@/lib/constants";
import { PdfUpload } from "@/components/PdfUpload";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: ActionState = { ok: false, message: "" };

const frameStyles = ["Без рамки", "Классика", "Сканируй", "Тонкая", "Контраст"];
const patternStyles = ["Квадрат", "Скругленный", "Точки", "Ромб", "Плитка"];

export function PdfQrForm() {
  const [state, action] = useActionState(createPdfQrCode, initialState);

  return (
    <form action={action} className="grid gap-5">
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
            name="title"
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
            name="password"
            type="password"
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
        <SubmitButton>Создать QR-код</SubmitButton>
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
