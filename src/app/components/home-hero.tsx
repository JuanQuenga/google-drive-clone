import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SimplexBackground } from "./simplex-background";
import { SignInButton } from "./sign-in-button";

interface HeroProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function HomeHero({ isAuthenticated, userName }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {!isAuthenticated && <SimplexBackground />}
      {/* Overlay for unauthenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-5 bg-black/30"></div>
      )}

      {/* Decorative background elements */}
      {isAuthenticated && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/5 absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl"></div>
          <div className="bg-accent/5 absolute right-10 bottom-20 h-72 w-72 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="bg-card/50 border-border/50 rounded-xl border p-8 shadow-lg backdrop-blur-md sm:p-12">
          {isAuthenticated ? (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                  Welcome back, {userName}!
                </h1>
                <p className="text-foreground/70 mx-auto max-w-2xl text-lg sm:text-xl">
                  Your personal cloud storage is ready. Access, organize, and
                  share your files securely.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="cursor-pointer">
                  <NextLink href="/f/1">Go to Drive</NextLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <NextLink href="/account">View Account</NextLink>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                  Your Files, Your Way
                </h1>
                <p className="text-foreground/70 mx-auto max-w-2xl text-lg sm:text-xl">
                  A modern, personal cloud storage solution built with Next.js.
                  Organize your files securely in the cloud.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <SignInButton />
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
