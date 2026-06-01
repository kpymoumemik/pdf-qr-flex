"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Неверная почта или пароль.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Почта
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-500"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Пароль
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-500"
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="h-11 rounded-md bg-sky-500 font-semibold text-white hover:bg-sky-600 disabled:opacity-60">
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
