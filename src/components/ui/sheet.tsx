"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Slide-over panel built on Radix Dialog — gives every drawer (cart, menu, filters, search)
 * focus trapping, Escape-to-close, scroll locking and screen-reader labelling for free.
 */

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

const SIDE_CLASSES = {
  right: "inset-y-0 right-0 h-full w-full max-w-md animate-slide-in-right",
  left: "inset-y-0 left-0 h-full w-[85%] max-w-sm animate-slide-in-left",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl animate-slide-in-bottom",
  top: "inset-x-0 top-0 animate-slide-in-top",
} as const;

export function SheetContent({
  side = "right",
  title,
  description,
  hideHeader = false,
  className,
  children,
}: {
  side?: keyof typeof SIDE_CLASSES;
  title: string;
  description?: string;
  /** Keep the title for screen readers but render a custom header. */
  hideHeader?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 animate-fade-in bg-foreground/40" />
      <Dialog.Content
        className={cn("fixed z-50 flex flex-col bg-surface shadow-xl outline-none", SIDE_CLASSES[side], className)}
      >
        {hideHeader ? (
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
        ) : (
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
        )}
        <Dialog.Description className="sr-only">{description ?? title}</Dialog.Description>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
