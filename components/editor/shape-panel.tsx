"use client";

import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CanvasNodeShape } from "@/types/canvas";

interface ShapeConfig {
  shape: CanvasNodeShape;
  icon: LucideIcon;
  label: string;
  width: number;
  height: number;
}

const SHAPE_CONFIGS: ShapeConfig[] = [
  { shape: "rectangle", icon: RectangleHorizontal, label: "Rectangle", width: 160, height: 80 },
  { shape: "diamond", icon: Diamond, label: "Diamond", width: 120, height: 120 },
  { shape: "circle", icon: Circle, label: "Circle", width: 100, height: 100 },
  { shape: "pill", icon: Pill, label: "Pill", width: 160, height: 70 },
  { shape: "cylinder", icon: Cylinder, label: "Cylinder", width: 100, height: 120 },
  { shape: "hexagon", icon: Hexagon, label: "Hexagon", width: 120, height: 104 },
];

export interface ShapeDragPayload {
  shape: CanvasNodeShape;
  width: number;
  height: number;
}

export const SHAPE_DRAG_TYPE = "application/ghost-shape";

export function ShapePanel() {
  const handleDragStart = (
    e: React.DragEvent,
    shape: CanvasNodeShape,
    width: number,
    height: number
  ) => {
    const payload: ShapeDragPayload = { shape, width, height };
    e.dataTransfer.setData(SHAPE_DRAG_TYPE, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 shadow-lg">
      {SHAPE_CONFIGS.map(({ shape, icon: Icon, label, width, height }) => (
        <button
          key={shape}
          draggable
          onDragStart={(e) => handleDragStart(e, shape, width, height)}
          title={label}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] active:cursor-grabbing"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
