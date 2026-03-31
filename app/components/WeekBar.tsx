"use client";

import { useRef, useEffect } from "react";

interface WeekBarProps {
  baseDate: Date;        // center month (for context)
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function generateDays(center: Date, span = 30): Date[] {
  const days: Date[] = [];
  for (let i = -span; i <= span; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function WeekBar({ baseDate, selectedDate, onSelectDate }: WeekBarProps) {
  const today = new Date();
  const days = generateDays(today, 30);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected date into center on mount / when selectedDate changes
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = selectedRef.current;
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [selectedDate]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 overflow-x-auto scrollbar-hide px-3 py-2"
    >
      {days.map((day, i) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, today);
        const isSun = day.getDay() === 0;
        const isSat = day.getDay() === 6;

        let textColor = "#1C1C1E";
        if (isSun) textColor = "#FF3B30";
        if (isSat) textColor = "#007AFF";

        return (
          <button
            key={i}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelectDate(day)}
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl ios-press flex-shrink-0"
            style={{
              width: 44,
              height: 60,
              background: isSelected ? "var(--ios-blue)" : "transparent",
            }}
          >
            {/* Day of week */}
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "#8E8E93" }}
            >
              {DOW_JA[day.getDay()]}
            </span>

            {/* Date number */}
            <span
              className="text-[17px] font-semibold leading-none"
              style={{ color: isSelected ? "#FFFFFF" : textColor }}
            >
              {day.getDate()}
            </span>

            {/* Today dot */}
            {isToday && !isSelected && (
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--ios-blue)" }}
              />
            )}
            {!isToday && <span className="w-1 h-1" />}
          </button>
        );
      })}
    </div>
  );
}
