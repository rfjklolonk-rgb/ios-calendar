"use client";

import { CalendarRange, LayoutGrid, Calendar } from "lucide-react";

interface ViewToggleButtonProps {
  mode: "monthly" | "weekly" | "daily";
  onClick: () => void;
}

export default function ViewToggleButton({ mode, onClick }: ViewToggleButtonProps) {
  const Icon = mode === "monthly" ? CalendarRange
             : mode === "weekly"  ? LayoutGrid
             : Calendar; // daily → 月間に戻る

  return (
    <button
      onClick={onClick}
      className="absolute z-40 flex items-center justify-center"
      style={{
        bottom: 80,
        left: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: "#FFFFFF",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)";
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <Icon size={26} strokeWidth={1.8} color="var(--ios-blue)" />
    </button>
  );
}
