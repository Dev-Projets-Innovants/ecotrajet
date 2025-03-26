
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    const { state } = useSidebar();

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "flex h-14 items-center border-b px-4",
          state === "collapsed" && "justify-center px-2",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarHeader.displayName = "SidebarHeader";
