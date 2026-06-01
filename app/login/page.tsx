import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mx-auto mb-8 max-w-md text-center">
          <h1 className="text-3xl font-semibold text-slate-950">Личный кабинет</h1>
          <p className="mt-2 text-slate-600">Войдите, чтобы создавать QR-коды и менять закрепленные PDF-файлы.</p>
        </div>
        <AuthForm />
      </section>
    </main>
  );
}
