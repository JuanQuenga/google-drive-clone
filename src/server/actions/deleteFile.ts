"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { db } from "../db";
import { files_table } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

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
