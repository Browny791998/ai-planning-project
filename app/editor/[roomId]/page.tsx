import { redirect } from "next/navigation";
import { getCurrentIdentity, getProjectWithAccess } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomId } = await params;

  const identity = await getCurrentIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getProjectWithAccess(roomId, identity);
  if (!project) {
    return <AccessDenied />;
  }

  const { myProjects, sharedProjects } = await getProjectsForUser();
  const isOwner = project.ownerId === identity.userId;

  return (
    <WorkspaceShell
      projectId={project.id}
      projectName={project.name}
      isOwner={isOwner}
      myProjects={myProjects}
      sharedProjects={sharedProjects}
    />
  );
}
