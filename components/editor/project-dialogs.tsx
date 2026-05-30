"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DialogType, Project } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  dialog: DialogType;
  selectedProject: Project | null;
  name: string;
  slug: string;
  isLoading: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
}

export function ProjectDialogs({
  dialog,
  selectedProject,
  name,
  slug,
  isLoading,
  onClose,
  onNameChange,
}: ProjectDialogsProps) {
  return (
    <>
      {/* Create Project */}
      <Dialog open={dialog === "create"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Give your architecture workspace a name.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-name" className="text-sm font-medium text-copy-primary">
                Name
              </label>
              <Input
                id="create-name"
                autoFocus
                placeholder="My project"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-copy-muted">Slug</span>
              <span className="font-mono text-xs text-copy-faint">
                {slug || "my-project"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button disabled={!name.trim() || isLoading} onClick={onClose}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project */}
      <Dialog open={dialog === "rename"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Renaming{" "}
              <span className="font-medium text-copy-secondary">
                {selectedProject?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rename-name" className="text-sm font-medium text-copy-primary">
              New name
            </label>
            <Input
              id="rename-name"
              autoFocus
              placeholder="New name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim() && !isLoading) {
                  onClose();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button disabled={!name.trim() || isLoading} onClick={onClose}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project */}
      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-copy-secondary">
                {selectedProject?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLoading} onClick={onClose}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
