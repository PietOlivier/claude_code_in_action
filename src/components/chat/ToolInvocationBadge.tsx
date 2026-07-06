"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function basename(path?: string): string | undefined {
  if (!path) return undefined;
  const parts = path.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : undefined;
}

export function getToolLabel(toolName: string, args: any): string {
  const file = basename(args?.path as string | undefined);

  if (toolName === "str_replace_editor") {
    switch (args?.command) {
      case "create":
        return file ? `Creating ${file}` : "Creating file";
      case "str_replace":
      case "insert":
        return file ? `Editing ${file}` : "Editing file";
      case "view":
        return file ? `Viewing ${file}` : "Viewing file";
      case "undo_edit":
        return file ? `Undoing changes to ${file}` : "Undoing changes";
      default:
        return file ? `Editing ${file}` : "Editing file";
    }
  }

  if (toolName === "file_manager") {
    switch (args?.command) {
      case "rename": {
        const newFile = basename(args?.new_path as string | undefined);
        if (file && newFile) return `Renaming ${file} to ${newFile}`;
        if (file) return `Renaming ${file}`;
        return "Renaming file";
      }
      case "delete":
        return file ? `Deleting ${file}` : "Deleting file";
      default:
        return file ? `Updating ${file}` : "Updating file";
    }
  }

  return file ? `Running ${toolName} on ${file}` : `Running ${toolName}`;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const label = getToolLabel(toolInvocation.toolName, toolInvocation.args);
  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {toolInvocation.state === "result" && toolInvocation.result ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
