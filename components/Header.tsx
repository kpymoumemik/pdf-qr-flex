import Link from "next/link";
import { Plus, QrCode } from "lucide-react";
import { signOut } from "@/lib/actions";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-500 text-white">
            <QrCode size={22} />
          </span>
          PDF QR
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {authenticated ? (
            <>
              <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Мои QR-коды
              </Link>
              <Link href="/dashboard/new" className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
                <Plus size={16} />
                Создать QR-код
              </Link>
              <form action={signOut}>
                <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
