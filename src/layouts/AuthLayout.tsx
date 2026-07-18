import { Pill } from "lucide-react";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <aside className="hidden w-[40%] flex-col justify-between bg-blue-50 p-14 lg:flex">
          <div>
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg">
              <Pill size={42} />
            </div>

            <h1 className="text-4xl font-bold text-blue-700">
              Zásoby produktov
            </h1>
            <p className="mt-4 text-xl text-blue-700">TCM Stock Management</p>

            <p className="mt-10 max-w-sm text-xl leading-relaxed text-slate-700">
              Spravujte svoje zásoby produktov TČM jednoducho a efektívne.
            </p>
          </div>

          <div className="rounded-3xl bg-white/40 p-8 text-center text-blue-300">
            <Pill className="mx-auto" size={150} strokeWidth={1.2} />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
