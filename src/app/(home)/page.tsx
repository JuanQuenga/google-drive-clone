import { SignInButton } from "~/app/_components/sign-in-button";
import { Button } from "~/app/_components/ui/button";

export default async function HomePage() {
  return (
    <>
      <div className="space-y-4 text-center">
        <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Cloud Drive
        </h1>
        <p className="text-foreground/70 mx-auto max-w-2xl text-lg sm:text-xl">
          Your personal drive for storing files.
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
