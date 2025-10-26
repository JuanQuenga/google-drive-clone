"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createFolder, type CreateFolderState } from "~/server/actions";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function NewFolderButton({
  currentFolderId,
}: {
  currentFolderId: number;
}) {
  const [state, action, pending] = useActionState(createFolder, {
    success: false,
  } as CreateFolderState);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={action}>
          <DialogHeader>
            <DialogTitle>
              What would you like to name your new folder?
            </DialogTitle>
            <DialogDescription>
              This is the name that will be displayed in the file explorer.
            </DialogDescription>
          </DialogHeader>

          <input type="hidden" name="parentId" value={currentFolderId} />
          <Input
            type="text"
            placeholder="Enter folder name"
            name="folderName"
            defaultValue="New Folder"
            className="mt-4"
            required
          />

          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon />
              <AlertTitle>Unable to create folder</AlertTitle>
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
              {pending ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
