import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import HungerPage from "@/pages/HungerPage";
import TheoryPage from "@/pages/TheoryPage";
import PracticePage from "@/pages/PracticePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ProfilePage from "@/pages/ProfilePage";

type Page = "home" | "diary" | "hunger" | "theory" | "practice" | "analytics" | "profile";

const navItems = [
  { id: "home" as Page, icon: "Home", label: "Главная" },
  { id: "diary" as Page, icon: "BookOpen", label: "Дневник" },
  { id: "hunger" as Page, icon: "Activity", label: "Шкала" },
  { id: "theory" as Page, icon: "Lightbulb", label: "Теория" },
  { id: "practice" as Page, icon: "Target", label: "Практика" },
];

const activeColors: Record<Page, string> = {
  home: "#845EF7",
  diary: "#FF6B6B",
  hunger: "#845EF7",
  theory: "#20C997",
  practice: "#FF9F43",
  analytics: "#54A0FF",
  profile: "#845EF7",
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");

  const navigate = (page: string) => setActivePage(page as Page);

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={navigate} />;
      case "diary": return <DiaryPage />;
      case "hunger": return <HungerPage />;
      case "theory": return <TheoryPage />;
      case "practice": return <PracticePage />;
      case "analytics": return <AnalyticsPage />;
      case "profile": return <ProfilePage />;
    }
  };

  const color = activeColors[activePage];

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="max-w-lg mx-auto relative min-h-screen bg-gray-50">
        {/* Page content */}
        <div key={activePage} className="animate-fade-in pb-20">
          {renderPage()}
        </div>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 backdrop-blur-xl border-t border-gray-100 z-30">
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const itemColor = isActive ? activeColors[item.id] : "#9ca3af";
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all relative flex-1"
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{ backgroundColor: itemColor + "15" }}
                    />
                  )}
                  <Icon
                    name={item.icon}
                    size={20}
                    className="transition-all relative z-10"
                    style={{ color: itemColor, transform: isActive ? "scale(1.1)" : "scale(1)" }}
                  />
                  <span
                    className="text-xs font-medium relative z-10 transition-all"
                    style={{ color: itemColor }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setActivePage("analytics")}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all relative flex-1"
            >
              {activePage === "analytics" && (
                <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: "#54A0FF15" }} />
              )}
              <Icon
                name="BarChart2"
                size={20}
                style={{ color: activePage === "analytics" ? "#54A0FF" : "#9ca3af" }}
                className="relative z-10 transition-all"
              />
              <span
                className="text-xs font-medium relative z-10"
                style={{ color: activePage === "analytics" ? "#54A0FF" : "#9ca3af" }}
              >
                Прогресс
              </span>
            </button>

            <button
              onClick={() => setActivePage("profile")}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all relative flex-1"
            >
              {activePage === "profile" && (
                <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: "#845EF715" }} />
              )}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs relative z-10"
                style={{
                  background: activePage === "profile"
                    ? "linear-gradient(135deg, #FF6B6B, #FF9F43)"
                    : "#e5e7eb"
                }}
              >
                {activePage === "profile" ? "🌸" : <Icon name="User" size={12} className="text-gray-400" />}
              </div>
              <span
                className="text-xs font-medium relative z-10"
                style={{ color: activePage === "profile" ? "#845EF7" : "#9ca3af" }}
              >
                Профиль
              </span>
            </button>
          </div>

          {/* Active indicator bar */}
          <div
            className="h-1 rounded-full mx-4 mb-1 transition-all duration-300"
            style={{ background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)` }}
          />
        </nav>
      </div>
    </TooltipProvider>
  );
}
