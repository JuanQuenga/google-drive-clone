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
import { useState } from "react";

export default function NewFolderButton({
  currentFolderId,
}: {
  currentFolderId: number;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createFolder(currentFolderId, formData);
    if (result.success) {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              What would you like to name your new folder?
            </DialogTitle>
            <DialogDescription>
              This is the name that will be displayed in the file explorer.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="text"
            placeholder="Enter folder name"
            name="folderName"
            defaultValue="New Folder"
            className="my-4"
            required
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
