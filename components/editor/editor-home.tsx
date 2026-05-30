"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorDialogs } from "@/hooks/use-project-dialogs";

export function EditorHome() {
  const { openCreate } = useEditorDialogs();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-base font-semibold text-copy-primary">
          Create a project or open an existing one
        </h2>
        <p className="mt-1.5 text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
      </div>
      <Button onClick={openCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
