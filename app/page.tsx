"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import WeekBar from "./components/WeekBar";
import CalendarGrid from "./components/CalendarGrid";
import FAB from "./components/FAB";
import TasksView from "./components/TasksView";
import SettingsView from "./components/SettingsView";

type Tab = "calendar" | "tasks" | "settings";

// ── スライドアニメーション定義 ──────────────────────────
const slideVariants = {
  // 入場: スワイプ方向の外側から入ってくる
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
  }),
  // 中央: 静止
  center: {
    x: 0,
  },
  // 退場: スワイプ方向の逆側へ出ていく
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
  }),
};

// iOSのページ遷移に近いスプリング設定
const springTransition = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.85,
};

export default function App() {
  const today = new Date();
  const [activeTab, setActiveTab]       = useState<Tab>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewYear,  setViewYear]        = useState(today.getFullYear());
  const [viewMonth, setViewMonth]       = useState(today.getMonth());
  const [slideDir, setSlideDir]         = useState(0); // 1=次月, -1=前月

  // ── 月移動（方向付き）──
  const changeMonth = (dir: number) => {
    setSlideDir(dir);
    if (dir > 0) {
      // 次月
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
      else setViewMonth(m => m + 1);
    } else {
      // 前月
      if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
      else setViewMonth(m => m - 1);
    }
  };

  // ── 日付選択 ──
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const dir = date.getMonth() > viewMonth ||
                (date.getMonth() === 0 && viewMonth === 11)
                  ? 1 : date.getMonth() < viewMonth ? -1 : 0;
    setSlideDir(dir);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  };

  // ── スワイプ検出 ──
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) changeMonth(dx < 0 ? 1 : -1);
  };

  const pageTitles: Record<Tab, string> = {
    calendar: "カレンダー",
    tasks:    "タスク",
    settings: "設定",
  };

  return (
    <div className="h-screen overflow-hidden flex justify-center" style={{ background: "#E5E5EA" }}>
      <div
        className="relative flex flex-col w-full max-w-md h-full"
        style={{ background: "var(--ios-bg)" }}
      >
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
          {activeTab !== "calendar" && (
            <div className="px-4 py-4">
              <h1 className="text-[22px] font-bold" style={{ color: "#1C1C1E" }}>
                {pageTitles[activeTab]}
              </h1>
            </div>
          )}

          {activeTab === "calendar" && (
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
          {/* ── カレンダービュー（アニメーション付き） ── */}
          {activeTab === "calendar" && (
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
                    onSelectDate={handleSelectDate}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="h-full overflow-y-auto pt-3"
                 style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}>
              <TasksView />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto pt-3"
                 style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)" }}>
              <SettingsView />
            </div>
          )}
        </main>

        {/* ══ FAB ══ */}
        {(activeTab === "calendar" || activeTab === "tasks") && (
          <FAB onClick={() => console.log("新規追加")} />
        )}

        {/* ══ ボトムナビ ══ */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
