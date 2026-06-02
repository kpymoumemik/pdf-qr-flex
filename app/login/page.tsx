import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mx-auto mb-8 max-w-md text-center">
          <h1 className="text-3xl font-semibold text-white">Вход в кабинет</h1>
          <p className="mt-2 text-slate-400">Введите почту и пароль, чтобы создавать QR-коды и видеть свои PDF QR.</p>
        </div>
        <AuthForm />
      </section>
    </main>
  );
}
