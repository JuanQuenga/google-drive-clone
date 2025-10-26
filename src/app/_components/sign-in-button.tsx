"use client";

/**
 * Example of a client component using the useAuth hook to get the current user session.
 */

import { Button } from "~/app/_components/ui/button";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { handleSignOutAction } from "../actions/signOut";
import { redirect, usePathname } from "next/navigation";

export function SignInButton({ large }: { large?: boolean }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <Button disabled size={large ? "lg" : "default"}>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <form action={handleSignOutAction}>
        <Button type="submit" size={large ? "lg" : "default"}>
          Sign Out
        </Button>
      </form>
    );
  }

  return (
    <Button asChild size={large ? "lg" : "default"}>
      <a href="/login">Sign In {large && "with AuthKit"}</a>
    </Button>
  );
}
