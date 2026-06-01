import Link from "next/link";
import { QrCode } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-500 text-white">
            <QrCode size={22} />
          </span>
          PDF QR
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Мои QR-коды
          </Link>
          <Link href="/login" className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
}
