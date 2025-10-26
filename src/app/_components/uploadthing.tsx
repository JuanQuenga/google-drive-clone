"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";
import { cn } from "~/lib/utils";

const BaseUploadButton = generateUploadButton<OurFileRouter>();

export const UploadButton = (
  props: React.ComponentProps<typeof BaseUploadButton>,
) => {
  return (
    <BaseUploadButton
      {...props}
      className={cn(
        // Button styling to match shadcn
        "ut-button:inline-flex ut-button:items-center ut-button:justify-center ut-button:gap-2",
        "ut-button:whitespace-nowrap ut-button:rounded-md ut-button:text-sm ut-button:font-medium",
        "ut-button:transition-all ut-button:shrink-0",
        "ut-button:h-9 ut-button:px-4 ut-button:py-2",
        // Colors
        "ut-button:bg-primary ut-button:text-primary-foreground",
        "ut-button:hover:bg-primary/90",
        // Focus states
        "ut-button:outline-none ut-button:focus-visible:border-ring",
        "ut-button:focus-visible:ring-ring/50 ut-button:focus-visible:ring-[3px]",
        // Disabled state
        "ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50",
        // Hide allowed content text
        "ut-allowed-content:hidden",
        props.className,
      )}
    />
  );
};

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
