"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "../db";
import { folders_table } from "../db/schema";
import { cookies } from "next/headers";
import { QUERIES } from "../db/queries";

export async function createFolder(
  _prevState: {
    error?: string;
    success?: boolean;
  },
  formData: FormData,
) {
  const { user } = await withAuth();
  if (!user) return { error: "User not found" };

  const parentId = parseInt(formData.get("parentId") as string);
  if (!parentId) return { error: "Parent folder ID is required" };

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
  if (!newFolderId) return { error: "Failed to create folder" };

  const cookieStore = await cookies();
  cookieStore.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
