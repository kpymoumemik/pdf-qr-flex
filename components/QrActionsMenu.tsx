"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, PauseCircle, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { deletePdfQrCode, setPdfQrCodeStatus } from "@/lib/actions";

function MenuSubmitButton({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Выполняется..." : children}
    </button>
  );
}

export function QrActionsMenu({ qrCodeId, status }: { qrCodeId: string; status: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDisabled = status === "disabled";

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        title="Действия"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md bg-sky-500 text-white hover:bg-sky-600"
      >
        <MoreHorizontal size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white py-2 shadow-lg">
          <Link
            href={`/dashboard/${qrCodeId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <Pencil size={16} />
            Детали QR-кода
          </Link>

          <form action={setPdfQrCodeStatus}>
            <input type="hidden" name="qr_code_id" value={qrCodeId} />
            <input type="hidden" name="status" value={isDisabled ? "active" : "disabled"} />
            <input type="hidden" name="redirect_to" value={pathname} />
            <MenuSubmitButton className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70">
              {isDisabled ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
              {isDisabled ? "Включить QR" : "Отключить QR"}
            </MenuSubmitButton>
          </form>

          <div className="my-2 border-t border-slate-100" />

          <form action={deletePdfQrCode}>
            <input type="hidden" name="qr_code_id" value={qrCodeId} />
            <MenuSubmitButton className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-wait disabled:opacity-70">
              <Trash2 size={16} />
              Удалить QR-код
            </MenuSubmitButton>
          </form>
        </div>
      ) : null}
    </div>
  );
}
