import Link from "next/link";
import { LogOut, Plus, QrCode, Rows3 } from "lucide-react";
import { signOut } from "@/lib/actions";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-zinc-950">
          <span className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white shadow-sm">
            <QrCode size={22} />
          </span>
          <span className="text-base tracking-tight">PDF QR</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {authenticated ? (
            <>
              <Link
                href="/dashboard/new"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
              >
                <Plus size={16} />
                Создать QR
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Rows3 size={16} />
                Мои QR
              </Link>
              <form action={signOut}>
                <button className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                  <LogOut size={16} />
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
