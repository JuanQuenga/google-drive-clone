"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { renameFolder } from "~/server/actions";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, FolderPen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function RenameFolderButton({
  folderId,
  folderName,
}: {
  folderId: number;
  folderName: string;
}) {
  const [state, action, pending] = useActionState(renameFolder, {
    success: false,
    error: undefined,
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <FolderPen />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Rename folder</TooltipContent>
        <DialogContent>
          <form action={action}>
            <DialogHeader>
              <DialogTitle>
                What would you like to rename the folder to?
              </DialogTitle>
            </DialogHeader>

            <input
              type="hidden"
              name="folderIdToRename"
              value={folderId}
              required
            />
            <Input
              type="text"
              placeholder="Enter folder name"
              name="newFolderName"
              defaultValue={folderName}
              className="mt-4"
              required
            />

            {state.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircleIcon />
                <AlertTitle>Unable to rename folder</AlertTitle>
                <AlertDescription>
                  <p>{state.error}</p>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={pending} type="submit">
                {pending ? "Working..." : "Rename Folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Tooltip>
    </Dialog>
  );
}
