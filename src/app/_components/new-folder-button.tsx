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
import { createFolder } from "~/server/actions";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function NewFolderButton({
  currentFolderId,
}: {
  currentFolderId: number;
}) {
  const [state, action, pending] = useActionState(createFolder, {
    success: false,
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
            <Button>New Folder</Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Create a new folder</TooltipContent>
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

            <input
              type="hidden"
              name="parentId"
              value={currentFolderId}
              required
            />
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
      </Tooltip>
    </Dialog>
  );
}
