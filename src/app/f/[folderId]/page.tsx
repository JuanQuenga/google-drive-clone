import { withAuth } from "@workos-inc/authkit-nextjs";
import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { redirect } from "next/navigation";

export default async function FolderPage(props: {
  params: Promise<{ folderId: string }>;
}) {
  const { user } = await withAuth({ ensureSignedIn: true });
  if (!user) return redirect("/");

  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) return redirect("/");

  const folder = await QUERIES.getFolderById(parsedFolderId);
  if (!folder) return redirect("/");
  if (folder.ownerId !== user.id) return redirect("/");

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      userInfo={{
        firstName: user.firstName ?? "My Drive",
      }}
      currentFolderId={parsedFolderId}
    />
  );
}
