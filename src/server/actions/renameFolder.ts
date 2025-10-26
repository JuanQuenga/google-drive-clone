"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "../db";
import { folders_table } from "../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function renameFolder(
  _prevState: { error?: string; success?: boolean },
  formData: FormData,
) {
  const { user } = await withAuth();
  if (!user) return { error: "User not found" };

  const folderId = parseInt(formData.get("folderIdToRename") as string);
  if (!folderId) return { error: "Folder ID is required" };

  const newFolderName = formData.get("newFolderName") as string;
  if (!newFolderName) return { error: "New folder name is required" };

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.id, folderId));
  if (!folder) return { error: `Folder with ID '${folderId}' was not found` };
  if (folder.name === newFolderName) return { success: true };

  if (folder.ownerId !== user.id) return { error: "Unauthorized" };

  const [result] = await db
    .update(folders_table)
    .set({
      name: newFolderName,
    })
    .where(eq(folders_table.id, folderId));
  if (result.affectedRows === 0)
    return { error: "Failed to rename folder, no changes were made." };

  const cookieStore = await cookies();
  cookieStore.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
