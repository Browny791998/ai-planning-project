"use client";

import { createContext, useContext } from "react";

export interface Project {
  id: string;
  name: string;
  owned: boolean;
}

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
