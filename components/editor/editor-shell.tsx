"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogs } from "./project-dialogs";
import { ProjectDialogsContext, type Project } from "@/hooks/use-project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";

interface EditorShellProps {
  children: React.ReactNode;
  myProjects: Project[];
  sharedProjects: Project[];
}

export function EditorShell({ children, myProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: actions.openCreate,
        openRename: actions.openRename,
        openDelete: actions.openDelete,
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
          myProjects={myProjects}
          sharedProjects={sharedProjects}
        />
        <ProjectDialogs
          dialog={actions.dialog}
          selectedProject={actions.selectedProject}
          name={actions.name}
          roomId={actions.roomId}
          isLoading={actions.isLoading}
          onClose={actions.close}
          onNameChange={actions.setName}
          onConfirmCreate={actions.confirmCreate}
          onConfirmRename={actions.confirmRename}
          onConfirmDelete={actions.confirmDelete}
        />
        <main className="h-full pt-12">{children}</main>
      </div>
    </ProjectDialogsContext.Provider>
  );
}
