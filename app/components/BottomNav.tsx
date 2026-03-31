"use client";

import { CalendarDays, CheckSquare, Settings } from "lucide-react";

type Tab = "calendar" | "tasks" | "settings";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }> }[] = [
  { id: "calendar", label: "カレンダー", Icon: CalendarDays },
  { id: "tasks",    label: "タスク",     Icon: CheckSquare },
  { id: "settings", label: "設定",       Icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
      style={{ background: "rgba(249,249,249,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      {/* top hairline separator */}
      <div className="h-px bg-black/10 w-full" />

      <div className="flex items-center justify-around px-2 pt-2 pb-safe"
           style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}>
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-0.5 px-5 py-1 ios-press"
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.2 : 1.6}
                color={active ? "var(--ios-blue)" : "#8E8E93"}
              />
              <span
                className="text-[10px] font-medium tracking-tight"
                style={{ color: active ? "var(--ios-blue)" : "#8E8E93" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
