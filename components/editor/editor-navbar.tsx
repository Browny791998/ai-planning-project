"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
  projectName?: string;
  projectSubtitle?: string;
  isAiSidebarOpen?: boolean;
  onAiToggle?: () => void;
  onShare?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggle,
  projectName,
  projectSubtitle,
  isAiSidebarOpen,
  onAiToggle,
  onShare,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center bg-surface border-b border-surface-border px-3 gap-3">
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 flex-shrink-0">
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 text-copy-secondary" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 text-copy-secondary" />
          )}
        </Button>
        {projectName && (
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-sm font-semibold text-copy-primary">{projectName}</span>
            {projectSubtitle && (
              <span className="text-xs text-copy-muted">{projectSubtitle}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="gap-1.5 h-8 px-3 text-copy-secondary hover:text-copy-primary"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </Button>
        )}
        {onAiToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAiToggle}
            className={`gap-1.5 h-8 px-3 transition-colors ${
              isAiSidebarOpen
                ? "bg-accent-dim text-brand hover:bg-accent-dim hover:text-brand"
                : "text-copy-secondary hover:text-copy-primary"
            }`}
            aria-pressed={isAiSidebarOpen}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">AI</span>
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
