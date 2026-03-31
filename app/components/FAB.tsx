"use client";

import { Plus } from "lucide-react";

interface FABProps {
  onClick?: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="absolute z-40 flex items-center justify-center"
      style={{
        bottom: 80,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: "var(--ios-blue)",
        boxShadow: "0 4px 16px rgba(0,122,255,0.45), 0 1px 4px rgba(0,0,0,0.15)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,122,255,0.35)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,122,255,0.45), 0 1px 4px rgba(0,0,0,0.15)";
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <Plus size={28} strokeWidth={2.5} color="#FFFFFF" />
    </button>
  );
}
