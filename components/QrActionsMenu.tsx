"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deletePdfQrCode } from "@/lib/actions";

export function QrActionsMenu({ qrCodeId }: { qrCodeId: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <form action={deletePdfQrCode}>
            <input type="hidden" name="qr_code_id" value={qrCodeId} />
            <button
              type="submit"
              onClick={() => {
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Удалить QR-код
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
