import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { HomeHero } from "./components/home-hero";
import { CTASection } from "./components/cta-section";

export default async function HomePage() {
  const { user } = await withAuth();

  // Redirect authenticated users to their drive
  if (user) {
    redirect("/f/1");
  }

  return (
    <main className="w-full">
      <HomeHero isAuthenticated={false} />
    </main>
  );
}
