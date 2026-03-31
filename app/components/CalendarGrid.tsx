"use client";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DOW_HEADERS = ["日", "月", "火", "水", "木", "金", "土"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function buildRows(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

const EVENT_DATES: Record<string, string[]> = {
  "2026-3-5":  ["#007AFF"],
  "2026-3-10": ["#34C759", "#FF9500"],
  "2026-3-15": ["#FF3B30"],
  "2026-3-20": ["#007AFF", "#34C759"],
  "2026-3-25": ["#FF9500"],
  "2026-3-31": ["#007AFF"],
};

export default function CalendarGrid({ year, month, selectedDate, onSelectDate }: CalendarGridProps) {
  const today = new Date();
  const rows = buildRows(year, month);

  return (
    <div className="flex flex-col h-full px-2">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 flex-shrink-0 pb-1">
        {DOW_HEADERS.map((d, i) => (
          <div key={d} className="flex justify-center py-1">
            <span
              className="text-[12px] font-semibold"
              style={{ color: i === 0 ? "#FF3B30" : i === 6 ? "#007AFF" : "#8E8E93" }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar rows — each row fills equal vertical space */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 flex-1 min-h-0">
          {row.map((date, ci) => {
            if (!date) return <div key={`empty-${ri}-${ci}`} />;

            const isSelected = isSameDay(date, selectedDate);
            const isToday    = isSameDay(date, today);
            const isSun = date.getDay() === 0;
            const isSat = date.getDay() === 6;
            const isOtherMonth = date.getMonth() !== month;

            const key  = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const dots = EVENT_DATES[key] ?? [];

            let numColor = "#1C1C1E";
            if (isOtherMonth) numColor = "#C7C7CC";
            else if (isSun)   numColor = "#FF3B30";
            else if (isSat)   numColor = "#007AFF";

            return (
              <button
                key={key}
                onClick={() => onSelectDate(date)}
                className="flex flex-col items-center justify-center gap-0.5 ios-press"
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    background: isSelected
                      ? "var(--ios-blue)"
                      : isToday
                      ? "rgba(0,122,255,0.12)"
                      : "transparent",
                  }}
                >
                  <span
                    className="text-[15px] leading-none"
                    style={{
                      fontWeight: isToday || isSelected ? 700 : 400,
                      color: isSelected ? "#FFFFFF" : isToday ? "var(--ios-blue)" : numColor,
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Event dots */}
                <div className="flex gap-0.5 h-1.5 items-center">
                  {dots.slice(0, 3).map((color, di) => (
                    <span
                      key={di}
                      className="w-1 h-1 rounded-full"
                      style={{ background: isSelected ? "rgba(255,255,255,0.7)" : color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
