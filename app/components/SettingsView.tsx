"use client";

import { ChevronRight, Bell, Palette, Globe, Shield, Info } from "lucide-react";

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  value?: string;
  iconBg: string;
}

const SETTINGS: SettingItem[] = [
  { icon: <Bell size={16} color="#fff" />,     label: "通知",           iconBg: "#FF3B30" },
  { icon: <Palette size={16} color="#fff" />,  label: "テーマ",         value: "ライト", iconBg: "#5856D6" },
  { icon: <Globe size={16} color="#fff" />,    label: "言語",           value: "日本語", iconBg: "#007AFF" },
  { icon: <Shield size={16} color="#fff" />,   label: "プライバシー",   iconBg: "#34C759" },
  { icon: <Info size={16} color="#fff" />,     label: "バージョン情報", value: "1.0.0",  iconBg: "#8E8E93" },
];

export default function SettingsView() {
  return (
    <div className="px-4 py-2 space-y-6">
      {/* Profile card */}
      <div
        className="rounded-2xl px-4 py-5 flex items-center gap-4"
        style={{ background: "#FFFFFF" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)" }}
        >
          A
        </div>
        <div>
          <p className="text-[17px] font-semibold" style={{ color: "#1C1C1E" }}>アカウント</p>
          <p className="text-[13px]" style={{ color: "#8E8E93" }}>Apple ID・iCloud・メディアと購入</p>
        </div>
        <ChevronRight size={18} style={{ color: "#C7C7CC", marginLeft: "auto" }} />
      </div>

      {/* Settings list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF" }}>
        {SETTINGS.map((item, i) => (
          <div key={item.label}>
            <button className="flex items-center gap-3 w-full px-4 py-3 ios-press">
              {/* Icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: item.iconBg }}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span className="flex-1 text-left text-[16px]" style={{ color: "#1C1C1E" }}>
                {item.label}
              </span>

              {/* Value + chevron */}
              <div className="flex items-center gap-1">
                {item.value && (
                  <span className="text-[15px]" style={{ color: "#8E8E93" }}>{item.value}</span>
                )}
                <ChevronRight size={16} style={{ color: "#C7C7CC" }} />
              </div>
            </button>

            {i < SETTINGS.length - 1 && (
              <div className="ml-14 h-px" style={{ background: "#E5E5EA" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
