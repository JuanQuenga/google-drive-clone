"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "../db";
import { files_table } from "../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function renameFile(
  _prevState: { error?: string; success?: boolean },
  formData: FormData,
) {
  const { user } = await withAuth();
  if (!user) return { error: "User not found" };

  const fileId = parseInt(formData.get("fileIdToRename") as string);
  if (!fileId) return { error: "File ID is required" };

  const newFileName = formData.get("newFileName") as string;
  if (!newFileName) return { error: "New file name is required" };

  const [file] = await db
    .select()
    .from(files_table)
    .where(eq(files_table.id, fileId));
  if (!file) return { error: `File with ID '${fileId}' was not found` };
  if (file.ownerId !== user.id) return { error: "Unauthorized" };
  if (file.name === newFileName) return { success: true };

  const [result] = await db
    .update(files_table)
    .set({
      name: newFileName,
    })
    .where(eq(files_table.id, fileId));
  if (result.affectedRows === 0)
    return { error: "Failed to rename file, no changes were made." };

  const cookieStore = await cookies();
  cookieStore.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
