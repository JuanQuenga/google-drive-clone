import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { ShadersBackground } from "../components/shaders-background";
import { Button } from "~/app/components/ui/button";

export default async function DrivePage() {
  const { user } = await withAuth();
  if (!user) return redirect("/login");

  const rootFolder = await QUERIES.getRootFolderForUser(user.id);
  if (!rootFolder)
    return (
      <main className="w-full">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
          <ShadersBackground />

          <div className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="bg-card/50 border-border/50 rounded-xl border p-8 shadow-lg backdrop-blur-md sm:p-12">
              <div className="space-y-8">
                <div className="space-y-4 text-center">
                  <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                    Welcome {user.firstName}!
                  </h1>
                  <p className="text-foreground/70 mx-auto max-w-2xl text-lg sm:text-xl">
                    Click the button below to set up your personal drive and
                    start storing files.
                  </p>
                </div>

                <form
                  action={async () => {
                    "use server";
                    const { user } = await withAuth();
                    if (!user) return redirect("/login");

                    const rootFolder = await MUTATIONS.onboardUser(user.id);
                    if (!rootFolder) return redirect("/login");
                    redirect(`/f/${rootFolder[0]!.id}`);
                  }}
                  className="flex justify-center"
                >
                  <Button type="submit" size="lg">
                    Enable Cloud Drive
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    );

  return redirect(`/f/${rootFolder.id}`);
}
