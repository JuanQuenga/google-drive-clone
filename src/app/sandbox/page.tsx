import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { files_table, folders_table } from "~/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";

          await db.insert(folders_table).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: index !== 0 ? 1 : null,
              createdAt: new Date(),
              ownerId: "root",
            })),
          );
          await db.insert(files_table).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              size: 5000,
              url: file.url,
              parent: (index % 3) + 1,
              createdAt: new Date(),
              ownerId: "root",
            })),
          );
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
