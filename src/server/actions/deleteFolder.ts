"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "../db";
import { files_table, folders_table } from "../db/schema";
import { inArray, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { QUERIES } from "../db/queries";

const utApi = new UTApi();

export async function deleteFolder(folderId: number) {
  // Check if the user is logged in
  const { user } = await withAuth();
  if (!user) return { error: "Unauthorized" };

  // Check if the folder exists and if the user is the owner
  const folder = await QUERIES.getFolderById(folderId);
  if (!folder) return { error: "Folder not found" };
  if (folder.ownerId !== user.id) return { error: "Unauthorized" };

  // Get all folders that will need to be deleted
  async function getAllDescendants(parentFolderId: number) {
    const childFolders = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, parentFolderId));

    const allDescendants = [...childFolders];
    for (const child of childFolders) {
      const descendants = await getAllDescendants(child.id);
      allDescendants.push(...descendants);
    }
    return allDescendants;
  }
  const foldersToDelete = await getAllDescendants(folderId);

  // Get all files that will need to be deleted
  const folderIds = [folder.id, ...foldersToDelete.map((f) => f.id)];
  const filesToDelete = await db
    .select()
    .from(files_table)
    .where(inArray(files_table.parent, folderIds));

  // Delete from UploadThing
  if (filesToDelete.length > 0) {
    const fileKeys = filesToDelete.map((fileToDelete) => fileToDelete.fileKey);
    try {
      await utApi.deleteFiles(fileKeys);
    } catch (error) {
      return {
        error: "Failed to delete files from UploadThing",
      };
    }
  }

  // Delete files from the database
  if (filesToDelete.length > 0) {
    const fileIds = filesToDelete.map((f) => f.id);
    await db.delete(files_table).where(inArray(files_table.id, fileIds));
  }
  // Delete folders from the database
  await db.delete(folders_table).where(inArray(folders_table.id, folderIds));

  // Forces NextJS to re-render the page without the need for client-side code
  const cookieStore = await cookies();
  cookieStore.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
