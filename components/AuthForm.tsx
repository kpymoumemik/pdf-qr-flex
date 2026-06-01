"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white shadow-sm" : "text-slate-600"}`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white shadow-sm" : "text-slate-600"}`}
        >
          Регистрация
        </button>
      </div>
      <form action={onSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <input required name="email" type="email" className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-500" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Пароль
          <input required name="password" type="password" minLength={6} className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-500" />
        </label>
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="h-11 rounded-md bg-sky-500 font-semibold text-white hover:bg-sky-600 disabled:opacity-60">
          {loading ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}
