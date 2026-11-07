import { HelpCircle } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { WorkspaceSection } from "../workspace/WorkspaceChrome";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function HostDetailsHelp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative -top-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&>svg]:block",
            className,
          )}
          aria-label={typeof children === "string" ? children : undefined}
        >
          <HelpCircle size={13} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[260px] text-left leading-relaxed">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export function HostDetailsSection({
  icon,
  title,
  hint,
  children,
  className,
  action,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <WorkspaceSection
      title={title}
      icon={icon}
      className={className}
      accessory={<>
        {hint && <HostDetailsHelp>{hint}</HostDetailsHelp>}
        {action && <div className="ml-auto flex items-center">{action}</div>}
      </>}
    >
      {children}
    </WorkspaceSection>
  );
}

export function HostDetailsSettingRow({
  label,
  hint,
  children,
  className,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Fixed height so switch / select / input rows stay aligned.
        "flex h-12 items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/40 px-3",
        className,
      )}
    >
      <div className="flex min-h-5 min-w-0 items-center gap-1.5">
        <span className="truncate text-sm font-medium leading-5 text-foreground">{label}</span>
        {hint && <HostDetailsHelp>{hint}</HostDetailsHelp>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
