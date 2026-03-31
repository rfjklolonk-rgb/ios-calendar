"use client";

const DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];
const HOURS = Array.from({ length: 24 }, (_, i) => i + 1); // 1〜24

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

interface DailyCalendarViewProps {
  date: Date;
}

export default function DailyCalendarView({ date }: DailyCalendarViewProps) {
  const today = new Date();
  const isToday = isSameDay(date, today);
  const isSun = date.getDay() === 0;
  const isSat = date.getDay() === 6;

  let dayColor = "#3C3C43";
  if (isSun) dayColor = "#FF3B30";
  if (isSat) dayColor = "#007AFF";

  return (
    <div className="flex flex-col h-full">

      {/* ── ヘッダー: 曜日 + 日付 ── */}
      <div
        className="flex flex-shrink-0 border-b"
        style={{ borderColor: "rgba(0,0,0,0.1)" }}
      >
        {/* 時間列スペーサー */}
        <div className="w-12 flex-shrink-0" />

        {/* 選択日 */}
        <div className="flex-1 flex flex-col items-center py-2 gap-1">
          <span className="text-[10px] font-semibold" style={{ color: "#8E8E93" }}>
            {DOW_JA[date.getDay()]}
          </span>
          <div
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ background: isToday ? "var(--ios-blue)" : "transparent" }}
          >
            <span
              className="text-[14px] font-semibold leading-none"
              style={{ color: isToday ? "#fff" : dayColor }}
            >
              {date.getDate()}
            </span>
          </div>
        </div>
      </div>

      {/* ── 時間グリッド（縦線なし・横線のみ） ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {HOURS.map((hour) => (
          <div key={hour} className="flex" style={{ minHeight: 52 }}>

            {/* 時間ラベル */}
            <div className="w-12 flex-shrink-0 flex items-start justify-end pr-2 pt-0.5">
              <span className="text-[10px]" style={{ color: "#8E8E93", lineHeight: 1 }}>
                {hour}:00
              </span>
            </div>

            {/* 1日分のセル（縦線なし） */}
            <div
              className="flex-1"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
