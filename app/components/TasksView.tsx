"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  done: boolean;
  time?: string;
  color: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "デザインレビュー", done: false, time: "10:00", color: "#007AFF" },
  { id: 2, title: "週次ミーティング",  done: false, time: "14:00", color: "#34C759" },
  { id: 3, title: "レポート提出",      done: true,  time: "17:00", color: "#FF9500" },
  { id: 4, title: "買い物リスト確認",  done: false, color: "#FF3B30" },
];

export default function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggle = (id: number) =>
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));

  const pending = tasks.filter(t => !t.done);
  const done    = tasks.filter(t => t.done);

  return (
    <div className="px-4 py-2 space-y-6">
      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#8E8E93" }}>
          未完了 {pending.length}件
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
          {pending.map((task, i) => (
            <div key={task.id}>
              <TaskRow task={task} onToggle={toggle} />
              {i < pending.length - 1 && (
                <div className="ml-14 h-px" style={{ background: "#E5E5EA" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#8E8E93" }}>
            完了 {done.length}件
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
            {done.map((task, i) => (
              <div key={task.id}>
                <TaskRow task={task} onToggle={toggle} />
                {i < done.length - 1 && (
                  <div className="ml-14 h-px" style={{ background: "#E5E5EA" }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <button
      className="flex items-center gap-3 w-full px-4 py-3.5 ios-press text-left"
      onClick={() => onToggle(task.id)}
    >
      {/* Color indicator + check */}
      <div className="relative flex-shrink-0">
        {task.done
          ? <CheckCircle2 size={24} style={{ color: task.color }} fill={task.color} strokeWidth={0} />
          : <Circle size={24} strokeWidth={2} style={{ color: task.color }} />
        }
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span
          className="text-[16px] leading-snug block truncate"
          style={{
            color: task.done ? "#8E8E93" : "#1C1C1E",
            textDecoration: task.done ? "line-through" : "none",
            fontWeight: 400,
          }}
        >
          {task.title}
        </span>
        {task.time && (
          <span className="text-[13px]" style={{ color: "#8E8E93" }}>
            {task.time}
          </span>
        )}
      </div>
    </button>
  );
}
