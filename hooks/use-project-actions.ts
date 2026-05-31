"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DialogType, Project } from "@/hooks/use-project-dialogs";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}

export interface UseProjectActionsReturn {
  dialog: DialogType;
  selectedProject: Project | null;
  name: string;
  roomId: string;
  isLoading: boolean;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;
  setName: (name: string) => void;
  confirmCreate: () => Promise<void>;
  confirmRename: () => Promise<void>;
  confirmDelete: () => Promise<void>;
}

export function useProjectActions(activeProjectId?: string): UseProjectActionsReturn {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setNameState] = useState("");
  const [suffix, setSuffix] = useState(() => shortId());
  const [isLoading, setIsLoading] = useState(false);

  const slug = toSlug(name);
  const roomId = slug ? `${slug}-${suffix}` : "";

  function openCreate() {
    setSuffix(shortId());
    setNameState("");
    setSelectedProject(null);
    setDialog("create");
  }

  function openRename(project: Project) {
    setNameState(project.name);
    setSelectedProject(project);
    setDialog("rename");
  }

  function openDelete(project: Project) {
    setSelectedProject(project);
    setDialog("delete");
  }

  function close() {
    setDialog(null);
    setSelectedProject(null);
    setNameState("");
  }

  async function confirmCreate() {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const { project } = await res.json();
      close();
      router.push(`/editor/${project.id}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmRename() {
    if (!name.trim() || !selectedProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      close();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (!selectedProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      close();
      if (activeProjectId === selectedProject.id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    dialog,
    selectedProject,
    name,
    roomId,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName: setNameState,
    confirmCreate,
    confirmRename,
    confirmDelete,
  };
}
