import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  onNavigate: (page: string) => void;
  totalMeals: number;
  totalPractices: number;
  daysActive: number;
}

const quotes = [
  "Доверяй своему телу — оно знает, что ему нужно",
  "Каждый приём пищи — это забота о себе",
  "Голод — не враг, а сигнал мудрости тела",
  "Еда — это удовольствие, а не наказание",
];

export default function HomePage({ onNavigate, totalMeals, totalPractices, daysActive }: HomePageProps) {
  const [quote, setQuote] = useState(quotes[0]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [hunger, setHunger] = useState(5);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    setTimeStr(`${h}:${m}`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (quoteIdx + 1) % quotes.length;
      setQuoteIdx(next);
      setQuote(quotes[next]);
    }, 5000);
    return () => clearInterval(interval);
  }, [quoteIdx]);

  const getHungerEmoji = (val: number) => {
    if (val <= 2) return "😫";
    if (val <= 4) return "😕";
    if (val <= 6) return "😊";
    if (val <= 8) return "😄";
    return "🤤";
  };

  const getHungerLabel = (val: number) => {
    if (val <= 2) return "Очень голоден";
    if (val <= 4) return "Немного голоден";
    if (val <= 5) return "Нейтрально";
    if (val <= 7) return "Сыт";
    if (val <= 9) return "Хорошо насыщен";
    return "Переел";
  };

  const navItems = [
    { id: "diary", icon: "BookOpen", label: "Дневник", gradient: "gradient-coral", desc: "Записи питания" },
    { id: "hunger", icon: "Activity", label: "Шкала", gradient: "gradient-violet", desc: "Голод и сытость" },
    { id: "theory", icon: "Lightbulb", label: "Теория", gradient: "gradient-mint", desc: "Знания и основы" },
    { id: "practice", icon: "Target", label: "Практика", gradient: "gradient-warm", desc: "Упражнения" },
    { id: "analytics", icon: "BarChart2", label: "Аналитика", gradient: "gradient-cool", desc: "Мой прогресс" },
    { id: "profile", icon: "User", label: "Профиль", gradient: "gradient-violet", desc: "Личный кабинет" },
  ];

  const today = new Date();
  const dayName = today.toLocaleDateString("ru-RU", { weekday: "long" });
  const dateStr = today.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative overflow-hidden gradient-hero noise-overlay pb-8 pt-10 px-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 animate-float" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm capitalize">{dayName}</p>
              <h1 className="text-white font-display font-bold text-2xl">{dateStr}</h1>
            </div>
            <div className="glass-dark rounded-2xl px-4 py-2 text-white font-display font-bold text-xl">
              {timeStr}
            </div>
          </div>

          {/* Quote carousel */}
          <div className="glass-dark rounded-3xl p-5 mb-6">
            <p className="text-white/60 text-xs mb-2 font-medium tracking-wider uppercase">💫 Мысль дня</p>
            <p key={quote} className="text-white font-medium text-base leading-relaxed animate-fade-in">
              "{quote}"
            </p>
          </div>

          {/* Quick hunger check */}
          <div className="glass-dark rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm">Как ты сейчас?</p>
              <span className="text-2xl">{getHungerEmoji(hunger)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={hunger}
              onChange={(e) => setHunger(Number(e.target.value))}
              className="w-full accent-white h-2 rounded-full mb-2"
              style={{ accentColor: 'white' }}
            />
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-xs">Голоден</span>
              <span className="text-white font-semibold text-sm">{getHungerLabel(hunger)}</span>
              <span className="text-white/70 text-xs">Сыт</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & stats */}
      <div className="max-w-lg mx-auto px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Дней в приложении", value: String(daysActive), icon: "🔥" },
            { label: "Записей", value: String(totalMeals), icon: "📝" },
            { label: "Упражнений", value: String(totalPractices), icon: "✅" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center card-hover shadow-sm">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-xl text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Nav grid */}
        <h2 className="font-display font-bold text-gray-800 text-lg mb-3">Разделы</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="card-hover rounded-3xl overflow-hidden text-left shadow-sm"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`${item.gradient} p-5 relative noise-overlay`}>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name={item.icon} fallback="Circle" size={16} className="text-white" />
                </div>
                <p className="text-white/80 text-xs mb-1">{item.desc}</p>
                <p className="text-white font-display font-bold text-lg">{item.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Daily tip */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 gradient-warm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon name="Sparkles" size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-gray-800 mb-1">Совет дня</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Попробуй сегодня съесть одно блюдо без телефона и TV. Сосредоточься на вкусе, текстуре и аромате.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}