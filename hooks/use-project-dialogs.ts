"use client";

import { createContext, useContext, useState } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  owned: boolean;
}

export const MOCK_MY_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", owned: true },
  { id: "2", name: "Auth Service", slug: "auth-service", owned: true },
];

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "3", name: "Shared Dashboard", slug: "shared-dashboard", owned: false },
];

export type DialogType = "create" | "rename" | "delete" | null;

interface ProjectDialogsContextValue {
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
}

export const ProjectDialogsContext =
  createContext<ProjectDialogsContextValue | null>(null);

export function useEditorDialogs(): ProjectDialogsContextValue {
  const ctx = useContext(ProjectDialogsContext);
  if (!ctx) throw new Error("useEditorDialogs must be used inside EditorShell");
  return ctx;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface UseProjectDialogsReturn {
  dialog: DialogType;
  selectedProject: Project | null;
  name: string;
  slug: string;
  isLoading: boolean;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;
  setName: (name: string) => void;
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setNameState] = useState("");
  const isLoading = false;

  const slug = toSlug(name);

  function openCreate() {
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

  return {
    dialog,
    selectedProject,
    name,
    slug,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    setName: setNameState,
  };
}
