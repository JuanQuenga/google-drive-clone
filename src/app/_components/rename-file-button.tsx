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
import { renameFile } from "~/server/actions";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, FilePen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function RenameFileButton({
  fileId,
  fileName,
}: {
  fileId: number;
  fileName: string;
}) {
  const [state, action, pending] = useActionState(renameFile, {
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
              <FilePen />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Rename file</TooltipContent>
        <DialogContent>
          <form action={action}>
            <DialogHeader>
              <DialogTitle>
                What would you like to rename the folder to?
              </DialogTitle>
            </DialogHeader>

            <input
              type="hidden"
              name="fileIdToRename"
              value={fileId}
              required
            />
            <Input
              type="text"
              placeholder="Enter file name"
              name="newFileName"
              defaultValue={fileName}
              className="mt-4"
              required
            />

            {state.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircleIcon />
                <AlertTitle>Unable to rename file</AlertTitle>
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
                {pending ? "Working..." : "Rename File"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Tooltip>
    </Dialog>
  );
}
