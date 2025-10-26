"use client";

import { ChevronRight } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignInButton } from "~/app/_components/sign-in-button";
import { UploadButton } from "~/app/_components/uploadthing";
import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { createFolder } from "~/server/actions";
import NewFolderButton from "~/app/_components/new-folder-button";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  userInfo: { firstName: string };
  currentFolderId: number;
}) {
  const { folders, files, parents, userInfo } = props;
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/f/1" className="mr-2 text-gray-300 hover:text-white">
              {userInfo.firstName ?? "My Drive"}
            </Link>
            {parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <UploadButton
            endpoint="imageUploader"
            input={{ folderId: props.currentFolderId }}
            onClientUploadComplete={() => {
              navigate.refresh();
            }}
          />
          <NewFolderButton currentFolderId={props.currentFolderId} />

          <SignInButton />
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <ul>
            {folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
