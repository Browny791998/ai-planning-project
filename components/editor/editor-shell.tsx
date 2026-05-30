"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogs } from "./project-dialogs";
import {
  useProjectDialogs,
  ProjectDialogsContext,
} from "@/hooks/use-project-dialogs";

interface EditorShellProps {
  children: React.ReactNode;
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: dialogs.openCreate,
        openRename: dialogs.openRename,
        openDelete: dialogs.openDelete,
      }}
    >
      <div className="h-screen overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <ProjectDialogs
          dialog={dialogs.dialog}
          selectedProject={dialogs.selectedProject}
          name={dialogs.name}
          slug={dialogs.slug}
          isLoading={dialogs.isLoading}
          onClose={dialogs.close}
          onNameChange={dialogs.setName}
        />
        <main className="h-full pt-12">{children}</main>
      </div>
    </ProjectDialogsContext.Provider>
  );
}
