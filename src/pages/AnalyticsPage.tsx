import Icon from "@/components/ui/icon";
import type { Meal } from "@/hooks/useAppStorage";

const MOOD_META: Record<string, { label: string; color: string }> = {
  "😊": { label: "Хорошо", color: "#20C997" },
  "🥰": { label: "Радостно", color: "#FF6B9D" },
  "😐": { label: "Нейтрально", color: "#FFD32A" },
  "😔": { label: "Грустно", color: "#54A0FF" },
  "😰": { label: "Тревожно", color: "#845EF7" },
  "😤": { label: "Стресс", color: "#FF6B6B" },
};

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

interface AnalyticsPageProps {
  meals: Meal[];
}

export default function AnalyticsPage({ meals }: AnalyticsPageProps) {
  // Строим данные за последние 7 дней
  const today = new Date();
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayMeals = meals.filter((m) => m.date === dateStr);
    const hunger = dayMeals.length
      ? dayMeals.reduce((a, m) => a + m.hungerBefore, 0) / dayMeals.length
      : 0;
    const satiety = dayMeals.length
      ? dayMeals.reduce((a, m) => a + m.hungerAfter, 0) / dayMeals.length
      : 0;
    const topMood = dayMeals.length
      ? Object.entries(
          dayMeals.reduce<Record<string, number>>((acc, m) => {
            acc[m.mood] = (acc[m.mood] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "";
    return {
      day: DAY_NAMES[d.getDay()],
      dateStr,
      hunger: Math.round(hunger * 10) / 10,
      satiety: Math.round(satiety * 10) / 10,
      meals: dayMeals.length,
      emoji: topMood,
    };
  });

  // Настроения
  const moodCounts = meals.reduce<Record<string, number>>((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});
  const moodData = Object.entries(moodCounts)
    .map(([mood, count]) => ({ mood, count, ...(MOOD_META[mood] ?? { label: mood, color: "#9ca3af" }) }))
    .sort((a, b) => b.count - a.count);
  const maxMoodCount = moodData.length ? Math.max(...moodData.map((m) => m.count)) : 1;

  // Общая статистика
  const avgHunger = meals.length
    ? (meals.reduce((a, m) => a + m.hungerBefore, 0) / meals.length).toFixed(1)
    : "—";
  const avgSatiety = meals.length
    ? (meals.reduce((a, m) => a + m.hungerAfter, 0) / meals.length).toFixed(1)
    : "—";

  // Лучший день (по сытости)
  const daysWithMeals = weekData.filter((d) => d.satiety > 0);
  const bestDay = daysWithMeals.length
    ? daysWithMeals.reduce((best, d) => (d.satiety > best.satiety ? d : best))
    : null;

  // Инсайты из реальных данных
  const insights: { icon: string; color: string; bg: string; text: string }[] = [];

  if (meals.length === 0) {
    insights.push({ icon: "Info", color: "#845EF7", bg: "#f5f0ff", text: "Добавь первые записи в Дневник — и здесь появится твоя личная аналитика!" });
  } else {
    if (avgHunger !== "—" && Number(avgHunger) <= 4.5 && Number(avgHunger) >= 3) {
      insights.push({ icon: "TrendingUp", color: "#20C997", bg: "#edfff9", text: `Средний уровень голода перед едой — ${avgHunger}. Отличный диапазон для начала приёма пищи!` });
    } else if (avgHunger !== "—" && Number(avgHunger) < 3) {
      insights.push({ icon: "AlertCircle", color: "#FF6B6B", bg: "#fff0f0", text: `Ты часто начинаешь есть при очень сильном голоде (${avgHunger}/10). Попробуй есть немного раньше.` });
    }

    if (avgSatiety !== "—" && Number(avgSatiety) >= 7) {
      insights.push({ icon: "Heart", color: "#FF6B6B", bg: "#fff0f0", text: `Средняя сытость после еды — ${avgSatiety}/10. Ты хорошо чувствуешь момент насыщения.` });
    }

    if (bestDay) {
      insights.push({ icon: "Star", color: "#FF9F43", bg: "#fff8f0", text: `Лучший день — ${bestDay.day}, средняя сытость ${bestDay.satiety}/10.` });
    }

    const streak = weekData.filter((d) => d.meals > 0).length;
    if (streak >= 5) {
      insights.push({ icon: "Award", color: "#845EF7", bg: "#f5f0ff", text: `${streak} из 7 дней с записями! Продолжай в том же духе.` });
    }

    const positiveMoods = ["😊", "🥰", "😋"];
    const positiveCount = meals.filter((m) => positiveMoods.includes(m.mood)).length;
    if (meals.length > 0 && positiveCount / meals.length >= 0.5) {
      insights.push({ icon: "Smile", color: "#20C997", bg: "#edfff9", text: `${Math.round((positiveCount / meals.length) * 100)}% приёмов пищи сопровождаются позитивными эмоциями. Отлично!` });
    }
  }

  const hasData = meals.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="gradient-cool noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Аналитика</h1>
          <p className="text-white/70 text-sm mb-4">Прогресс за последние 7 дней</p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Ср. голод", value: avgHunger, sub: "до еды" },
              { label: "Ср. сытость", value: avgSatiety, sub: "после еды" },
              { label: "Всего", value: meals.length, sub: "записей" },
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
        {/* Hunger/Satiety chart */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-800">Голод и сытость по дням</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral inline-block" />До</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-mint inline-block" />После</span>
            </div>
          </div>

          {!hasData ? (
            <div className="h-28 flex items-center justify-center text-gray-400 text-sm">Данных пока нет</div>
          ) : (
            <div className="flex items-end gap-2 h-28">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-0.5 flex-1 w-full">
                    <div
                      className="flex-1 rounded-t-lg transition-all"
                      style={{ height: d.hunger > 0 ? `${(d.hunger / 10) * 100}%` : "4px", backgroundColor: "#FF6B6B", opacity: d.hunger > 0 ? 0.85 : 0.2 }}
                    />
                    <div
                      className="flex-1 rounded-t-lg transition-all"
                      style={{ height: d.satiety > 0 ? `${(d.satiety / 10) * 100}%` : "4px", backgroundColor: "#20C997", opacity: d.satiety > 0 ? 0.85 : 0.2 }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{d.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best day */}
        {bestDay && (
          <div className="gradient-mint noise-overlay rounded-3xl p-5 mb-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
              <div>
                <p className="text-white/70 text-xs">Лучший день недели</p>
                <p className="text-white font-display font-bold text-lg">
                  {bestDay.day} — {bestDay.satiety}/10 сытость
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Meals per day */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Приёмы пищи по дням</h3>
          {!hasData ? (
            <div className="h-20 flex items-center justify-center text-gray-400 text-sm">Данных пока нет</div>
          ) : (
            <div className="flex items-end gap-2 h-20">
              {weekData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  {d.meals > 0 && <span className="text-xs text-gray-400">{d.meals}</span>}
                  <div
                    className="w-full rounded-t-xl transition-all"
                    style={{
                      height: d.meals > 0 ? `${(d.meals / Math.max(...weekData.map((x) => x.meals), 1)) * 60}px` : "4px",
                      background: d.meals > 0 ? "linear-gradient(to top, #845EF7, #FF6B9D)" : "#f3f4f6",
                    }}
                  />
                  <span className="text-gray-400 text-xs">{d.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mood distribution */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Настроение за приёмами пищи</h3>
          {moodData.length === 0 ? (
            <div className="py-4 text-center text-gray-400 text-sm">Данных пока нет</div>
          ) : (
            <div className="space-y-3">
              {moodData.map((m) => (
                <div key={m.mood} className="flex items-center gap-3">
                  <span className="text-xl w-7">{m.mood}</span>
                  <span className="text-gray-700 text-sm w-20 flex-shrink-0">{m.label}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full">
                    <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${(m.count / maxMoodCount) * 100}%`, backgroundColor: m.color }} />
                  </div>
                  <span className="text-gray-500 text-sm w-4 flex-shrink-0">{m.count}</span>
                </div>
              ))}
            </div>
          )}
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
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ins.color + "30" }}>
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
