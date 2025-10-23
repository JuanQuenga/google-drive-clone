import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const { user } = await withAuth();
  if (!user) return redirect("/login");

  const rootFolder = await QUERIES.getRootFolderForUser(user.id);
  if (!rootFolder)
    return (
      <form
        action={async () => {
          "use server";
          const { user } = await withAuth();
          if (!user) return redirect("/login");

          await MUTATIONS.onboardUser(user.id);
        }}
      >
        <button type="submit">Enable Cloud Drive</button>
      </form>
    );

  return redirect(`/f/${rootFolder.id}`);
}
