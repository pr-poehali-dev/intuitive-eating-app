import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Meal {
  id: number;
  time: string;
  food: string;
  hungerBefore: number;
  hungerAfter: number;
  mood: string;
  notes: string;
}

const MOODS = ["😊", "😐", "😔", "😰", "🥰", "😤"];
const MOOD_LABELS: Record<string, string> = {
  "😊": "Хорошо", "😐": "Нейтрально", "😔": "Грустно",
  "😰": "Тревожно", "🥰": "Радостно", "😤": "Стресс"
};

const sampleMeals: Meal[] = [
  { id: 1, time: "08:30", food: "Овсянка с ягодами и мёдом", hungerBefore: 3, hungerAfter: 7, mood: "😊", notes: "Приятное утро, ела без спешки" },
  { id: 2, time: "13:00", food: "Греческий салат, хлеб с авокадо", hungerBefore: 4, hungerAfter: 8, mood: "🥰", notes: "Обедала с подругой, атмосфера супер" },
  { id: 3, time: "16:30", food: "Яблоко и горсть орехов", hungerBefore: 5, hungerAfter: 6, mood: "😐", notes: "Перекус между делами" },
];

export default function DiaryPage() {
  const [meals, setMeals] = useState<Meal[]>(sampleMeals);
  const [showAdd, setShowAdd] = useState(false);
  const [newMeal, setNewMeal] = useState({
    food: "", hungerBefore: 5, hungerAfter: 5, mood: "😊", notes: "", time: ""
  });
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");

  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" });

  const handleAdd = () => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const meal: Meal = {
      id: Date.now(),
      time: newMeal.time || time,
      food: newMeal.food,
      hungerBefore: newMeal.hungerBefore,
      hungerAfter: newMeal.hungerAfter,
      mood: newMeal.mood,
      notes: newMeal.notes,
    };
    setMeals([meal, ...meals]);
    setNewMeal({ food: "", hungerBefore: 5, hungerAfter: 5, mood: "😊", notes: "", time: "" });
    setShowAdd(false);
  };

  const getHungerColor = (val: number) => {
    if (val <= 3) return "text-coral";
    if (val <= 5) return "text-amber-500";
    return "text-mint";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-coral noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Дневник питания</h1>
          <p className="text-white/70 text-sm capitalize">{today}</p>

          <div className="flex gap-2 mt-5">
            {(["today", "week"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-white text-coral shadow-sm"
                    : "glass-dark text-white"
                }`}
              >
                {tab === "today" ? "Сегодня" : "Неделя"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Приёмов", value: meals.length },
            { label: "Ср. голод до", value: (meals.reduce((a, m) => a + m.hungerBefore, 0) / meals.length).toFixed(1) },
            { label: "Ср. сытость", value: (meals.reduce((a, m) => a + m.hungerAfter, 0) / meals.length).toFixed(1) },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center shadow-sm">
              <div className="font-display font-bold text-xl text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Meals list */}
        <div className="space-y-3 mb-6">
          {meals.map((meal, i) => (
            <div
              key={meal.id}
              className="glass rounded-3xl p-4 shadow-sm card-hover animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 gradient-coral rounded-2xl flex items-center justify-center text-lg shadow-sm">
                    {meal.mood}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{meal.food}</p>
                    <p className="text-gray-400 text-xs">{meal.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-400">До еды</p>
                  <p className={`font-display font-bold text-lg ${getHungerColor(meal.hungerBefore)}`}>{meal.hungerBefore}</p>
                </div>
                <div className="flex items-center">
                  <Icon name="ArrowRight" size={14} className="text-gray-300" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-400">После еды</p>
                  <p className={`font-display font-bold text-lg ${getHungerColor(meal.hungerAfter)}`}>{meal.hungerAfter}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-400">Настрой</p>
                  <p className="text-sm">{MOOD_LABELS[meal.mood]}</p>
                </div>
              </div>

              {meal.notes && (
                <p className="text-gray-500 text-xs mt-2 italic">"{meal.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add meal modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-gray-800 text-lg">Добавить приём пищи</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon name="X" size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Что ел(а)?</label>
                <textarea
                  value={newMeal.food}
                  onChange={(e) => setNewMeal({ ...newMeal, food: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-coral/30"
                  rows={2}
                  placeholder="Опиши блюдо..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Голод ДО: <span className="text-coral font-bold">{newMeal.hungerBefore}</span>
                </label>
                <input
                  type="range" min={1} max={10} value={newMeal.hungerBefore}
                  onChange={(e) => setNewMeal({ ...newMeal, hungerBefore: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>😫 Очень голоден</span><span>😊 Нейтрально</span><span>🤤 Сыт</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Сытость ПОСЛЕ: <span className="text-mint font-bold">{newMeal.hungerAfter}</span>
                </label>
                <input
                  type="range" min={1} max={10} value={newMeal.hungerAfter}
                  onChange={(e) => setNewMeal({ ...newMeal, hungerAfter: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Настроение</label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setNewMeal({ ...newMeal, mood: m })}
                      className={`w-12 h-12 rounded-2xl text-xl transition-all ${
                        newMeal.mood === m ? "ring-2 ring-coral bg-coral/10 scale-110" : "bg-gray-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Заметки</label>
                <textarea
                  value={newMeal.notes}
                  onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-coral/30"
                  rows={2}
                  placeholder="Как ты себя чувствовал(а)?"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!newMeal.food.trim()}
                className="w-full gradient-coral text-white font-semibold py-4 rounded-2xl disabled:opacity-40 transition-all"
              >
                Сохранить запись
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-24 right-6 w-14 h-14 gradient-coral rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <Icon name="Plus" size={24} className="text-white" />
      </button>
    </div>
  );
}
