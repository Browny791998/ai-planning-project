"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggle }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center bg-surface border-b border-surface-border px-3">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5 text-copy-secondary" />
          ) : (
            <PanelLeftOpen className="h-5 w-5 text-copy-secondary" />
          )}
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center" />
    </header>
  );
}
