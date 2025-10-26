import { Suspense } from "react";
import { ShadersBackground } from "~/app/_components/shaders-background";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<></>}>
          <ShadersBackground />
        </Suspense>
        <div className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-card/50 border-border/50 rounded-xl border p-8 shadow-lg backdrop-blur-md sm:p-12">
            <div className="space-y-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
