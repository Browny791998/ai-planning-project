"use client";

import { useState } from "react";
import { BrainCircuit, Sparkles } from "lucide-react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogs } from "./project-dialogs";
import { ShareDialog } from "./share-dialog";
import { CanvasWrapper } from "./canvas-wrapper";
import { ProjectDialogsContext } from "@/hooks/use-project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectData } from "@/lib/projects";

interface WorkspaceShellProps {
  projectId: string;
  projectName: string;
  isOwner: boolean;
  myProjects: ProjectData[];
  sharedProjects: ProjectData[];
}

export function WorkspaceShell({
  projectId,
  projectName,
  isOwner,
  myProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const actions = useProjectActions(projectId);

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: actions.openCreate,
        openRename: actions.openRename,
        openDelete: actions.openDelete,
      }}
    >
      <div className="flex h-screen flex-col overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          projectName={projectName}
          projectSubtitle="Workspace"
          isAiSidebarOpen={isAiOpen}
          onAiToggle={() => setIsAiOpen((prev) => !prev)}
          onShare={() => setIsShareOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden pt-12">
          <ProjectSidebar
            variant="docked"
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            myProjects={myProjects}
            sharedProjects={sharedProjects}
            activeProjectId={projectId}
          />

          {/* Canvas area */}
          <main className="relative flex flex-1 overflow-hidden bg-base">
            <CanvasWrapper roomId={projectId} />
          </main>

          {/* AI sidebar */}
          {isAiOpen && (
            <aside className="flex w-80 flex-shrink-0 flex-col border-l border-surface-border bg-surface">
              <div className="flex items-start justify-between border-b border-surface-border px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-semibold text-copy-primary">
                    AI Copilot
                  </h3>
                  <p className="text-xs text-copy-muted">Placeholder panel</p>
                </div>
                <Sparkles className="h-4 w-4 text-brand mt-0.5" />
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex gap-3 rounded-2xl border border-surface-border bg-elevated p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-accent-dim">
                    <BrainCircuit className="h-4 w-4 text-brand" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-copy-primary">
                      Chat surface pending
                    </p>
                    <p className="text-xs leading-relaxed text-copy-secondary">
                      The toggle is wired. Messaging and generation are
                      intentionally out of scope here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-surface-border p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-copy-muted">
                  Future Hooks
                </p>
                <p className="text-xs leading-relaxed text-copy-secondary">
                  Prompt composer, run status, and architecture guidance will
                  attach to this sidebar.
                </p>
              </div>
            </aside>
          )}
        </div>

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

        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          projectId={projectId}
          isOwner={isOwner}
        />
      </div>
    </ProjectDialogsContext.Provider>
  );
}
