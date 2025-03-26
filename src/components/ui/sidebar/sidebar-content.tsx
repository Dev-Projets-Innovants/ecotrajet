
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    const { state, open, openMobile, isMobile } = useSidebar();

    return (
      <aside
        ref={ref}
        data-state={state}
        data-mobile={isMobile || undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-[var(--sidebar-width)] flex-col border-r bg-white transition-all dark:bg-gray-900",
          isMobile && "shadow-lg",
          !isMobile && state === "collapsed" && "w-[var(--sidebar-width-icon)]",
          isMobile && !openMobile && "-translate-x-full",
          className
        )}
        {...props}
      />
    );
  }
);

Sidebar.displayName = "Sidebar";

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-1 flex-col overflow-hidden", className)}
        {...props}
      />
    );
  }
);

SidebarContent.displayName = "SidebarContent";
