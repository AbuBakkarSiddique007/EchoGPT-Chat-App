"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ConversationMenu({
  title,
  onRename,
  onRequestDelete,
}: {
  title: string;
  onRename: () => void;
  onRequestDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`Actions for ${title}`}
            className="focus-ring flex size-6 items-center justify-center rounded text-fg-dim transition-colors hover:bg-brand/10 hover:text-fg data-[popup-open]:bg-brand/15 data-[popup-open]:text-fg"
          />
        }
      >
        <MoreHorizontal className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom" className="w-36">
        <DropdownMenuItem
          onClick={onRename}
          className="focus-ring cursor-pointer text-[13px] text-fg-2 hover:bg-brand/10 hover:text-fg"
        >
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onRequestDelete}
          className="focus-ring cursor-pointer text-[13px] text-destructive hover:bg-destructive/10"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
