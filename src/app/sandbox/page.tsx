import { db } from "~/server/db";
import { mockFolders } from "~/lib/mock-data";
import { folders_table, files_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function SandboxPage() {
  const { user } = await withAuth();
  if (!user) throw new Error("User not found");

  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.id));

  console.log("folders:", folders);

  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";
          const { user } = await withAuth();
          if (!user) throw new Error("User not found");

          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              parent: null,
              ownerId: user.id,
            })
            .$returningId();

          await db.insert(folders_table).values(
            mockFolders.map((folder) => ({
              name: folder.name,
              parent: rootFolder[0]!.id,
              createdAt: new Date(),
              ownerId: user.id,
            })),
          );
        }}
      >
        <button type="submit">Seed</button>
      </form>
      <form
        action={async () => {
          "use server";
          const { user } = await withAuth();
          if (!user) throw new Error("User not found");

          await db.delete(files_table).where(eq(files_table.ownerId, user.id));
          await db
            .delete(folders_table)
            .where(eq(folders_table.ownerId, user.id));
        }}
      >
        <button type="submit">Empty Tables</button>
      </form>
    </div>
  );
}
