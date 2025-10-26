import { FileIcon, Folder as FolderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import RenameFolderButton from "~/app/_components/rename-folder-button";
import { Button } from "~/app/_components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import type { files_table, folders_table } from "~/server/db/schema";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-gray-400">File</div>
        <div className="col-span-3 text-gray-400">{file.size}</div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="outline"
            onClick={() => deleteFile(file.id)}
            size="icon"
            aria-label="Delete file"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">Folder</div>
        <div className="col-span-3 text-gray-400">--</div>
        <div className="col-span-1 flex items-center gap-2 text-gray-400">
          <RenameFolderButton folderId={folder.id} folderName={folder.name} />
          <Button
            onClick={() => deleteFolder(folder.id)}
            variant="outline"
            size="icon"
            aria-label="Delete folder"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
