
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-provider";

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={toggleSidebar}
        {...props}
      >
        {children || <Menu className="h-5 w-5" />}
      </Button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";
