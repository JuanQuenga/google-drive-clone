import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const { user } = await withAuth();
  if (!user) return redirect("/login");

  const rootFolder = await QUERIES.getRootFolderForUser(user.id);
  if (!rootFolder) return redirect("/drive/create-root-folder");

  return redirect(`/f/${rootFolder.id}`);
}
