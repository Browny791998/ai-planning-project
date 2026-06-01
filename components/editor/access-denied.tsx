import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-base">
      <Lock className="h-8 w-8 text-copy-muted" />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-copy-primary">Access Denied</h2>
        <p className="mt-1 text-sm text-copy-secondary">
          This project doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/editor">Back to Editor</Link>
      </Button>
    </div>
  );
}
