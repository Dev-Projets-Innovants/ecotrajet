
import React from "react";
import { cn } from "@/lib/utils";

const Timeline = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("relative space-y-4 ml-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TimelineItem = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("relative pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TimelineConnector = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("absolute h-full w-0.5 bg-border left-0 top-6 ml-2.5", className)}
      {...props}
    />
  );
};

const TimelineHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TimelineIcon = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-eco-light-green text-eco-green",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const TimelineTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn("font-medium leading-none", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const TimelineBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("ml-7", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineBody,
};
