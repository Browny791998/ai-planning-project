"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Copy, Check, X, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Collaborator {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
}

function CollaboratorAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  const initials =
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-elevated border border-surface-border flex items-center justify-center text-xs font-medium text-copy-secondary">
      {initials}
    </div>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const { user } = useUser();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCollaborators = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/collaborators`);
    if (res.ok) {
      const data = (await res.json()) as { collaborators: Collaborator[] };
      setCollaborators(data.collaborators);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      void fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  async function handleInvite() {
    const email = inviteEmail.trim();
    if (!email) return;
    setIsInviting(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Failed to invite collaborator");
      } else {
        setInviteEmail("");
        await fetchCollaborators();
      }
    } finally {
      setIsInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Failed to remove collaborator");
      } else {
        await fetchCollaborators();
      }
    } catch {
      setError("Failed to remove collaborator");
    } finally {
      setRemovingEmail(null);
    }
  }

  function handleCopyLink() {
    if (!navigator.clipboard) {
      setError("Clipboard not available");
      return;
    }
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
    }).catch(() => {
      setError("Failed to copy link");
    });
  }

  useEffect(() => {
    if (!copied) return;
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, [copied]);

  const ownerName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.primaryEmailAddress?.emailAddress ||
    "You";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface border-surface-border rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-copy-primary">
            <Users className="h-4 w-4 text-brand" />
            Share Project
          </DialogTitle>
          <DialogDescription className="text-copy-muted">
            {isOwner
              ? "Invite collaborators by email or copy the project link."
              : "View collaborators for this project."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* People with access */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-copy-muted">
              People with access
            </p>

            <div className="flex flex-col gap-0.5">
              {/* Owner row */}
              {user && (
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <CollaboratorAvatar
                    name={ownerName}
                    avatarUrl={user.imageUrl ?? null}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-copy-primary">
                      {ownerName}
                    </span>
                    {user.primaryEmailAddress?.emailAddress && (
                      <span className="truncate text-xs text-copy-muted">
                        {user.primaryEmailAddress.emailAddress}
                      </span>
                    )}
                  </div>
                  <span className="flex-shrink-0 rounded-lg bg-brand-dim px-2 py-0.5 text-xs font-medium text-brand">
                    Owner
                  </span>
                </div>
              )}

              {/* Collaborator rows */}
              {collaborators.map((collab) => {
                const name = collab.displayName ?? collab.email;
                return (
                  <div
                    key={collab.email}
                    className="flex items-center gap-3 rounded-xl px-2 py-2"
                  >
                    <CollaboratorAvatar
                      name={name}
                      avatarUrl={collab.avatarUrl}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      {collab.displayName ? (
                        <>
                          <span className="truncate text-sm font-medium text-copy-primary">
                            {collab.displayName}
                          </span>
                          <span className="truncate text-xs text-copy-muted">
                            {collab.email}
                          </span>
                        </>
                      ) : (
                        <span className="truncate text-sm text-copy-secondary">
                          {collab.email}
                        </span>
                      )}
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 text-copy-muted hover:bg-transparent hover:text-error"
                        disabled={removingEmail === collab.email}
                        onClick={() => void handleRemove(collab.email)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}

              {collaborators.length === 0 && (
                <p className="px-2 py-1 text-xs text-copy-muted">
                  No collaborators yet.
                </p>
              )}
            </div>
          </div>

          {/* Invite section — owner only */}
          {isOwner && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-copy-muted">
                Invite by email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleInvite();
                  }}
                  className="flex-1 bg-elevated border-surface-border text-copy-primary placeholder:text-copy-muted"
                />
                <Button
                  onClick={() => void handleInvite()}
                  disabled={isInviting || !inviteEmail.trim()}
                  size="sm"
                  className="gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite
                </Button>
              </div>
              {error && <p className="text-xs text-error">{error}</p>}
            </div>
          )}

          {/* Copy link */}
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="w-full gap-2 border-surface-border bg-elevated text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
