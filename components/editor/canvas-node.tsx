"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeRenderer({ data, selected }: NodeProps<CanvasNode>) {
  const textColor =
    NODE_COLORS.find((c) => c.fill === data.color)?.text ?? "#EDEDED";

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div
        style={{ backgroundColor: data.color, color: textColor }}
        className={cn(
          "flex min-h-[48px] min-w-[80px] items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium",
          selected
            ? "border-[var(--accent-primary)]"
            : "border-[var(--border-default)]"
        )}
      >
        {data.label || " "}
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
