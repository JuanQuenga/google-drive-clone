import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "../../DriveContents";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));

    if (folder.length === 0) {
      throw new Error("Folder not found");
    }

    parents.push(folder[0]);
    currentId = folder[0]?.parent ?? null;
  }
  return parents;
}

export default async function FolderPage(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const foldersPromise = db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));

  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
