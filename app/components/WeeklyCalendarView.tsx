"use client";

const DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];

interface WeeklyCalendarViewProps {
  weekOffset: number; // 0=今週, 1=来週, -1=先週
}

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  // days[0] = 時間セクターの直後 = 画面上の「2列目」= 今日（weekOffset=0）
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + weekOffset * 7 + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

const HOURS = Array.from({ length: 24 }, (_, i) => i + 1); // 1〜24

export default function WeeklyCalendarView({ weekOffset }: WeeklyCalendarViewProps) {
  const today = new Date();
  const days = getWeekDays(weekOffset);

  return (
    <div className="flex flex-col h-full">
      {/* 曜日ヘッダー */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
        {/* 時間列ヘッダー（空白） */}
        <div className="w-12 flex-shrink-0" />

        {/* 各曜日 */}
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isSun = day.getDay() === 0;
          const isSat = day.getDay() === 6;
          let color = "#3C3C43";
          if (isSun) color = "#FF3B30";
          if (isSat) color = "#007AFF";

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center py-2 gap-1"
              style={{ borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
            >
              <span className="text-[10px] font-semibold" style={{ color: "#8E8E93" }}>
                {DOW_JA[day.getDay()]}
              </span>
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full"
                style={{ background: isToday ? "var(--ios-blue)" : "transparent" }}
              >
                <span
                  className="text-[14px] font-semibold leading-none"
                  style={{ color: isToday ? "#fff" : color }}
                >
                  {day.getDate()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 時間グリッド */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {HOURS.map((hour) => (
          <div key={hour} className="flex" style={{ minHeight: 52 }}>
            {/* 時間ラベル */}
            <div
              className="w-12 flex-shrink-0 flex items-start justify-end pr-2 pt-0.5"
              style={{ borderRight: "1px solid rgba(0,0,0,0.08)" }}
            >
              <span className="text-[10px]" style={{ color: "#8E8E93", lineHeight: 1 }}>
                {hour}:00
              </span>
            </div>

            {/* 各曜日セル */}
            {days.map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
