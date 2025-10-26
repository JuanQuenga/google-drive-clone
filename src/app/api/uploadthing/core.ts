import { withAuth } from "@workos-inc/authkit-nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    blob: {
      maxFileSize: "1GB",
      maxFileCount: 999,
    },
  })
    .input(
      z.object({
        folderId: z.number(),
      }),
    )
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { user } = await withAuth();

      // If you throw, the user will not be able to upload
      if (!user?.id)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      const folder = await QUERIES.getFolderById(input.folderId);

      if (!folder)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Folder not found");
      if (folder.ownerId !== user.id)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, folderId: folder.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({
        file: {
          name: file.name,
          size: file.size,
          url: file.ufsUrl,
          parent: metadata.folderId,
          fileKey: file.key,
          ownerId: metadata.userId,
        },
        userId: parseInt(metadata.userId),
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
