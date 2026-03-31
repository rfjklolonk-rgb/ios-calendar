"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BottomNav from "./components/BottomNav";
import WeekBar from "./components/WeekBar";
import CalendarGrid from "./components/CalendarGrid";
import FAB from "./components/FAB";
import TasksView from "./components/TasksView";
import SettingsView from "./components/SettingsView";

type Tab = "calendar" | "tasks" | "settings";

const MONTHS_JA = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

export default function App() {
  const today = new Date();
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // When user selects a date in week bar → sync calendar view month
  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setSelectedDate(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const pageTitles: Record<Tab, string> = {
    calendar: "カレンダー",
    tasks:    "タスク",
    settings: "設定",
  };

  return (
    /* Outer shell — centers the phone-width column */
    <div className="min-h-full flex justify-center" style={{ background: "#E5E5EA" }}>
      {/* iPhone-width container */}
      <div
        className="relative flex flex-col w-full max-w-md min-h-screen"
        style={{ background: "var(--ios-bg)" }}
      >
        {/* STATUS BAR SPACER */}
        <div style={{ height: "env(safe-area-inset-top, 44px)" }} />

        {/* ══ NAVIGATION HEADER ══ */}
        <header
          className="sticky top-0 z-30 flex flex-col"
          style={{
            background: "rgba(242,242,247,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between px-4 py-3">
            {activeTab === "calendar" ? (
              <>
                <button onClick={prevMonth} className="ios-press p-1 rounded-full" style={{ color: "var(--ios-blue)" }}>
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>

                <button onClick={goToday} className="ios-press">
                  <h1 className="text-[17px] font-semibold" style={{ color: "#1C1C1E" }}>
                    {viewYear}年&nbsp;{MONTHS_JA[viewMonth]}
                  </h1>
                </button>

                <button onClick={nextMonth} className="ios-press p-1 rounded-full" style={{ color: "var(--ios-blue)" }}>
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <h1 className="text-[22px] font-bold" style={{ color: "#1C1C1E" }}>
                {pageTitles[activeTab]}
              </h1>
            )}
          </div>

          {/* Week date bar — calendar tab only */}
          {activeTab === "calendar" && (
            <WeekBar
              baseDate={new Date(viewYear, viewMonth, 1)}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}

          {/* Bottom hairline */}
          <div className="h-px w-full" style={{ background: "rgba(0,0,0,0.1)" }} />
        </header>

        {/* ══ MAIN CONTENT ══ */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}
        >
          {activeTab === "calendar" && (
            <div className="pt-3">
              <CalendarGrid
                year={viewYear}
                month={viewMonth}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />

              {/* Selected date label */}
              <div className="px-4 pt-2 pb-1">
                <p className="text-[13px] font-medium" style={{ color: "#8E8E93" }}>
                  {selectedDate.getFullYear()}年
                  {selectedDate.getMonth() + 1}月
                  {selectedDate.getDate()}日のイベント
                </p>
              </div>

              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: "rgba(0,122,255,0.1)" }}
                >
                  📅
                </div>
                <p className="text-[15px] font-medium" style={{ color: "#8E8E93" }}>
                  予定はありません
                </p>
                <p className="text-[13px]" style={{ color: "#C7C7CC" }}>
                  右下の＋から追加できます
                </p>
              </div>
            </div>
          )}

          {activeTab === "tasks"    && <div className="pt-3"><TasksView /></div>}
          {activeTab === "settings" && <div className="pt-3"><SettingsView /></div>}
        </main>

        {/* ══ FAB ══ */}
        {(activeTab === "calendar" || activeTab === "tasks") && (
          <FAB onClick={() => console.log("新規追加")} />
        )}

        {/* ══ BOTTOM NAV ══ */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
