import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "./sign-in-button";

export function CTASection() {
  return (
    <section className="from-primary/10 via-background to-primary/5 border-border border-t bg-gradient-to-r px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-card border-border space-y-8 rounded-xl border p-8 text-center shadow-lg sm:p-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="text-foreground/70 text-lg">
              Sign in now and start organizing your files in the cloud. It's
              free and only takes seconds.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="cursor-pointer">
              <SignInButton />
            </Button>
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
      </div>
    </section>
  );
}
