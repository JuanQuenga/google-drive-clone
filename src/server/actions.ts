"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { QUERIES } from "./db/queries";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  console.log("deleting file:", fileId);
  const { user } = await withAuth();
  if (!user) return { error: "Unauthorized" };

  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, user.id)));
  if (!file) return { error: "File not found" };

  const utapiResult = await utApi.deleteFiles([file.fileKey]);
  if (!utapiResult) return { error: "Failed to delete file" };

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));
  if (!dbDeleteResult) return { error: "Failed to delete file from database" };

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

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

export async function createFolder(parentId: number, formData: FormData) {
  const { user } = await withAuth();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("folderName") as string;
  if (!name) return { error: "Folder name is required" };

  const parentFolder = await QUERIES.getFolderById(parentId);
  if (!parentFolder) return { error: "Parent folder not found" };
  if (parentFolder.ownerId !== user.id) return { error: "Unauthorized" };

  const newFolderId = await db
    .insert(folders_table)
    .values({
      name,
      parent: parentId,
      ownerId: user.id,
    })
    .$returningId();

  const cookieStore = await cookies();
  cookieStore.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true, newFolderId: newFolderId[0]!.id };
}
