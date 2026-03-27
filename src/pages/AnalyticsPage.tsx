import Icon from "@/components/ui/icon";

const weekData = [
  { day: "Пн", hunger: 3.5, satiety: 7.2, meals: 3, emoji: "😊" },
  { day: "Вт", hunger: 4.0, satiety: 7.8, meals: 4, emoji: "🥰" },
  { day: "Ср", hunger: 3.2, satiety: 6.5, meals: 3, emoji: "😐" },
  { day: "Чт", hunger: 3.8, satiety: 7.5, meals: 3, emoji: "😊" },
  { day: "Пт", hunger: 4.5, satiety: 8.0, meals: 4, emoji: "😋" },
  { day: "Сб", hunger: 3.0, satiety: 7.0, meals: 3, emoji: "🥰" },
  { day: "Вс", hunger: 4.2, satiety: 7.6, meals: 3, emoji: "😊" },
];

const moodData = [
  { mood: "😊", label: "Хорошо", count: 8, color: "#20C997" },
  { mood: "🥰", label: "Радостно", count: 5, color: "#FF6B9D" },
  { mood: "😐", label: "Нейтрально", count: 4, color: "#FFD32A" },
  { mood: "😔", label: "Грустно", count: 2, color: "#54A0FF" },
  { mood: "😰", label: "Тревожно", count: 1, color: "#845EF7" },
];

const insights = [
  { icon: "TrendingUp", color: "#20C997", bg: "#edfff9", text: "Твой средний уровень голода перед едой — 3.7. Это хороший диапазон для начала приёма пищи!" },
  { icon: "Star", color: "#FF9F43", bg: "#fff8f0", text: "Пятница — твой самый 'сытый' день. Ты наедаешься до 8/10 в среднем." },
  { icon: "Award", color: "#845EF7", bg: "#f5f0ff", text: "7 дней подряд без пропущенных записей! Отличная дисциплина!" },
  { icon: "Heart", color: "#FF6B6B", bg: "#fff0f0", text: "Большинство приёмов пищи сопровождаются позитивными эмоциями. Отличный прогресс!" },
];

const maxCount = Math.max(...moodData.map((m) => m.count));

export default function AnalyticsPage() {
  const avgHunger = (weekData.reduce((a, d) => a + d.hunger, 0) / weekData.length).toFixed(1);
  const avgSatiety = (weekData.reduce((a, d) => a + d.satiety, 0) / weekData.length).toFixed(1);
  const totalMeals = weekData.reduce((a, d) => a + d.meals, 0);

  const maxSatiety = Math.max(...weekData.map((d) => d.satiety));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-cool noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Аналитика</h1>
          <p className="text-white/70 text-sm mb-4">Твой прогресс за 7 дней</p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Ср. голод", value: avgHunger, sub: "до еды" },
              { label: "Ср. сытость", value: avgSatiety, sub: "после еды" },
              { label: "Всего", value: totalMeals, sub: "записей" },
            ].map((stat) => (
              <div key={stat.label} className="glass-dark rounded-2xl p-3 text-center">
                <div className="font-display font-bold text-white text-2xl">{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Hunger/Satiety bar chart */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-800">Голод и сытость по дням</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-coral inline-block" />
                До
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-mint inline-block" />
                После
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-28">
            {weekData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 flex-1 w-full">
                  <div
                    className="flex-1 rounded-t-lg transition-all"
                    style={{
                      height: `${(d.hunger / 10) * 100}%`,
                      backgroundColor: "#FF6B6B",
                      opacity: 0.85,
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-lg transition-all"
                    style={{
                      height: `${(d.satiety / 10) * 100}%`,
                      backgroundColor: "#20C997",
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span className="text-gray-400 text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best day highlight */}
        <div className="gradient-mint noise-overlay rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <p className="text-white/70 text-xs">Лучший день недели</p>
              <p className="text-white font-display font-bold text-lg">
                {weekData.find((d) => d.satiety === maxSatiety)?.day} — {maxSatiety}/10 сытость
              </p>
            </div>
          </div>
        </div>

        {/* Mood distribution */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Настроение за приёмами пищи</h3>
          <div className="space-y-3">
            {moodData.map((m) => (
              <div key={m.mood} className="flex items-center gap-3">
                <span className="text-xl w-7">{m.mood}</span>
                <span className="text-gray-700 text-sm w-20 flex-shrink-0">{m.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${(m.count / maxCount) * 100}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
                <span className="text-gray-500 text-sm w-4 flex-shrink-0">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meals per day */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Приёмы пищи по дням</h3>
          <div className="flex items-end gap-2 h-20">
            {weekData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{d.meals}</span>
                <div
                  className="w-full rounded-t-xl"
                  style={{
                    height: `${(d.meals / 5) * 60}px`,
                    background: "linear-gradient(to top, #845EF7, #FF6B9D)",
                  }}
                />
                <span className="text-gray-400 text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <h3 className="font-display font-semibold text-gray-800 mb-3">💡 Инсайты</h3>
        <div className="space-y-3 mb-6">
          {insights.map((ins, i) => (
            <div
              key={i}
              className="rounded-3xl p-4 flex items-start gap-3 animate-fade-in"
              style={{ backgroundColor: ins.bg, animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: ins.color + "30" }}
              >
                <Icon name={ins.icon as "TrendingUp"} fallback="Info" size={16} style={{ color: ins.color }} />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
