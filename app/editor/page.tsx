import { EditorShell } from "@/components/editor/editor-shell";

export default function EditorPage() {
  return (
    <EditorShell>
      <div className="flex h-full items-center justify-center">
        <span className="text-copy-muted">Ghost AI</span>
      </div>
    </EditorShell>
  );
}
