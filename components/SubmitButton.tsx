"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="h-11 rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600 disabled:opacity-60">
      {pending ? "Сохранение..." : children}
    </button>
  );
}
