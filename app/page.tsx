"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import WeekBar from "./components/WeekBar";
import CalendarGrid from "./components/CalendarGrid";
import FAB from "./components/FAB";
import ViewToggleButton from "./components/ViewToggleButton";
import WeeklyCalendarView from "./components/WeeklyCalendarView";
import DailyCalendarView from "./components/DailyCalendarView";
import TasksView from "./components/TasksView";
import SettingsView from "./components/SettingsView";

type Tab          = "calendar" | "tasks" | "settings";
type CalendarMode = "monthly" | "weekly" | "daily";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// ── スライドアニメーション（月間・週間スワイプ用） ──
const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit:   (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

// ── フェードアニメーション（デイリービュー遷移用） ──
const fadeVariants = {
  enter:  { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1 },
  exit:   { opacity: 0, scale: 0.97 },
};

const springTransition = { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.85 };
const fadeTransition   = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

export default function App() {
  const today = new Date();

  const [activeTab,     setActiveTab]     = useState<Tab>("calendar");
  const [calendarMode,  setCalendarMode]  = useState<CalendarMode>("monthly");
  const [selectedDate,  setSelectedDate]  = useState<Date>(today);
  const [viewYear,      setViewYear]      = useState(today.getFullYear());
  const [viewMonth,     setViewMonth]     = useState(today.getMonth());
  const [slideDir,      setSlideDir]      = useState(0);
  const [weekOffset,    setWeekOffset]    = useState(0);

  // ── ビュー切り替えボタン ──
  const toggleCalendarMode = () => {
    if (calendarMode === "daily") {
      // デイリー → 月間に戻る
      setCalendarMode("monthly");
    } else {
      // 月間 ↔ 週間
      setCalendarMode(m => m === "monthly" ? "weekly" : "monthly");
      setWeekOffset(0);
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setSelectedDate(today);
    }
  };

  // ── 月移動 ──
  const changeMonth = (dir: number) => {
    setSlideDir(dir);
    if (dir > 0) {
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
      else setViewMonth(m => m + 1);
    } else {
      if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
      else setViewMonth(m => m - 1);
    }
  };

  // ── 週移動 ──
  const changeWeek = (dir: number) => {
    setSlideDir(dir);
    setWeekOffset(o => o + dir);
  };

  // ── WeekBar 用: 日付・月を同期するだけ ──
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const dir = date.getMonth() > viewMonth ||
                (date.getMonth() === 0 && viewMonth === 11) ? 1
              : date.getMonth() < viewMonth ? -1 : 0;
    setSlideDir(dir);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  };

  // ── CalendarGrid 用: デイリービューへ遷移 ──
  const handleDailyTap = (date: Date) => {
    setSelectedDate(date);
    setCalendarMode("daily");
  };

  // ── スワイプ検出 ──
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      const dir = dx < 0 ? 1 : -1;
      if (calendarMode === "monthly") changeMonth(dir);
      if (calendarMode === "weekly")  changeWeek(dir);
      // daily モードはスワイプ無効
    }
  };

  const pageTitles: Record<Tab, string> = {
    calendar: "カレンダー",
    tasks:    "タスク",
    settings: "設定",
  };

  return (
    <div className="h-screen overflow-hidden flex justify-center" style={{ background: "#E5E5EA" }}>
      <div className="relative flex flex-col w-full max-w-md h-full" style={{ background: "var(--ios-bg)" }}>

        {/* ステータスバースペーサー */}
        <div className="flex-shrink-0" style={{ height: "env(safe-area-inset-top, 44px)" }} />

        {/* ══ ヘッダー ══ */}
        <header
          className="flex-shrink-0 flex flex-col z-30"
          style={{
            background: "rgba(242,242,247,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* 非カレンダータブのタイトル */}
          {activeTab !== "calendar" && (
            <div className="px-4 py-4">
              <h1 className="text-[22px] font-bold" style={{ color: "#1C1C1E" }}>
                {pageTitles[activeTab]}
              </h1>
            </div>
          )}

          {/* 月表示バー（カレンダータブのみ） */}
          {activeTab === "calendar" && (() => {
            // モードごとに表示する月を計算
            let m: number, y: number;
            if (calendarMode === "monthly") {
              m = viewMonth; y = viewYear;
            } else if (calendarMode === "daily") {
              m = selectedDate.getMonth(); y = selectedDate.getFullYear();
            } else {
              // weekly: 表示週の先頭日（today + weekOffset*7）の月
              const d = new Date(today);
              d.setDate(today.getDate() + weekOffset * 7);
              m = d.getMonth(); y = d.getFullYear();
            }
            return (
              <div className="flex items-baseline justify-center gap-1.5 pt-2 pb-1">
                <span className="text-[18px] font-bold tracking-wide" style={{ color: "#1C1C1E" }}>
                  {MONTH_ABBR[m]}
                </span>
                <span className="text-[13px] font-medium" style={{ color: "#8E8E93" }}>
                  {y}
                </span>
              </div>
            );
          })()}

          {/* WeekBar: 月間モードのみ */}
          {activeTab === "calendar" && calendarMode === "monthly" && (
            <WeekBar
              baseDate={new Date(viewYear, viewMonth, 1)}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}

          <div className="h-px w-full flex-shrink-0" style={{ background: "rgba(0,0,0,0.1)" }} />
        </header>

        {/* ══ メインコンテンツ ══ */}
        <main
          className="flex-1 min-h-0 overflow-hidden"
          onTouchStart={activeTab === "calendar" ? handleTouchStart : undefined}
          onTouchEnd={activeTab   === "calendar" ? handleTouchEnd   : undefined}
        >

          {/* ── 月間カレンダー ── */}
          {activeTab === "calendar" && calendarMode === "monthly" && (
            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence initial={false} custom={slideDir}>
                <motion.div
                  key={`${viewYear}-${viewMonth}`}
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springTransition}
                  className="absolute inset-0 pt-2"
                  style={{ paddingBottom: 72 }}
                >
                  <CalendarGrid
                    year={viewYear}
                    month={viewMonth}
                    selectedDate={selectedDate}
                    onSelectDate={handleDailyTap}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ── 週間カレンダー ── */}
          {activeTab === "calendar" && calendarMode === "weekly" && (
            <div className="relative h-full w-full overflow-hidden" style={{ paddingBottom: 72 }}>
              <AnimatePresence initial={false} custom={slideDir}>
                <motion.div
                  key={weekOffset}
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springTransition}
                  className="absolute inset-0"
                >
                  <WeeklyCalendarView weekOffset={weekOffset} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ── デイリーカレンダー ── */}
          {activeTab === "calendar" && calendarMode === "daily" && (
            <div className="relative h-full w-full overflow-hidden" style={{ paddingBottom: 72 }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={selectedDate.toDateString()}
                  variants={fadeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={fadeTransition}
                  className="absolute inset-0"
                >
                  <DailyCalendarView date={selectedDate} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* タスク */}
          {activeTab === "tasks" && (
            <div className="h-full overflow-y-auto pt-3"
                 style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}>
              <TasksView />
            </div>
          )}

          {/* 設定 */}
          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto pt-3"
                 style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}>
              <SettingsView />
            </div>
          )}
        </main>

        {/* ══ ビュー切り替えボタン（左下） ══ */}
        {activeTab === "calendar" && (
          <ViewToggleButton mode={calendarMode} onClick={toggleCalendarMode} />
        )}

        {/* ══ FAB（右下） ══ */}
        {(activeTab === "calendar" || activeTab === "tasks") && (
          <FAB onClick={() => console.log("新規追加")} />
        )}

        {/* ══ ボトムナビ ══ */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
