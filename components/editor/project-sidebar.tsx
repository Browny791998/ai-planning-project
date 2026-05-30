"use client";

import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_MY_PROJECTS,
  MOCK_SHARED_PROJECTS,
  useEditorDialogs,
  type Project,
} from "@/hooks/use-project-dialogs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProjectItem({ project }: { project: Project }) {
  const { openRename, openDelete } = useEditorDialogs();

  return (
    <li className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-elevated">
      <span className="flex-1 truncate text-sm text-copy-primary">
        {project.name}
      </span>
      {project.owned && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Rename"
            onClick={() => openRename(project)}
          >
            <Pencil className="h-3.5 w-3.5 text-copy-secondary" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete"
            onClick={() => openDelete(project)}
          >
            <Trash2 className="h-3.5 w-3.5 text-error" />
          </Button>
        </div>
      )}
    </li>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { openCreate } = useEditorDialogs();

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-72 flex-col bg-surface border-r border-surface-border transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-medium text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-copy-secondary" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="mt-2 overflow-y-auto">
            {MOCK_MY_PROJECTS.length === 0 ? (
              <div className="flex h-full items-center justify-center py-8">
                <p className="text-sm text-copy-muted">No projects yet.</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {MOCK_MY_PROJECTS.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-2 overflow-y-auto">
            {MOCK_SHARED_PROJECTS.length === 0 ? (
              <div className="flex h-full items-center justify-center py-8">
                <p className="text-sm text-copy-muted">No shared projects yet.</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {MOCK_SHARED_PROJECTS.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full gap-2" onClick={openCreate}>
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
