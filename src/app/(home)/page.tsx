import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { SignInButton } from "../components/sign-in-button";
import { Button } from "~/app/components/ui/button";

export default async function HomePage() {
  const { user } = await withAuth();

  // Redirect authenticated users to their drive
  if (user) redirect("/drive");

  return (
    <>
      <div className="space-y-4 text-center">
        <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Personal Drive
        </h1>
        <p className="text-foreground/70 mx-auto max-w-2xl text-lg sm:text-xl">
          My personal drive for storing files.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <SignInButton large />
        <Button asChild size="lg" variant="outline" className="cursor-pointer">
          <a
            href="https://github.com/juanquenga/google-drive-clone"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </Button>
      </div>
    </>
  );
}
