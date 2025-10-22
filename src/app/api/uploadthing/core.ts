import { withAuth, type UserInfo } from "@workos-inc/authkit-nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { MUTATIONS } from "~/server/db/queries";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { user } = await withAuth();

      // If you throw, th
      //\e user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user?.id) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
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
          parent: 1,
          createdAt: new Date(),
        },
        userId: parseInt(metadata.userId),
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
