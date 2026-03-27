import { useState } from "react";
import Icon from "@/components/ui/icon";

const achievements = [
  { id: 1, emoji: "🌱", title: "Первый шаг", desc: "Первая запись в дневнике", unlocked: true },
  { id: 2, emoji: "🔥", title: "7 дней", desc: "Неделя без пропусков", unlocked: true },
  { id: 3, emoji: "🧘", title: "Медитатор", desc: "5 практик выполнено", unlocked: true },
  { id: 4, emoji: "📚", title: "Знаток", desc: "Прочитано 5 статей", unlocked: false },
  { id: 5, emoji: "🎯", title: "Точный голод", desc: "10 раз начал(а) есть на уровне 3-4", unlocked: false },
  { id: 6, emoji: "🌟", title: "Мастер сытости", desc: "10 раз закончил(а) на 7-8", unlocked: false },
  { id: 7, emoji: "💪", title: "Месяц", desc: "30 дней подряд", unlocked: false },
  { id: 8, emoji: "🦋", title: "Трансформация", desc: "Завершил(а) все практики", unlocked: false },
];

const reminders = [
  { time: "08:00", label: "Утренний опрос", active: true },
  { time: "13:00", label: "Обеденная пауза", active: true },
  { time: "19:00", label: "Вечерний рефлекс", active: false },
];

export default function ProfilePage() {
  const [name, setName] = useState("Анна");
  const [editName, setEditName] = useState(false);
  const [reminderState, setReminderState] = useState(reminders);
  const [goal, setGoal] = useState("Восстановить связь с телом");

  const toggleReminder = (i: number) => {
    const updated = [...reminderState];
    updated[i] = { ...updated[i], active: !updated[i].active };
    setReminderState(updated);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-violet noise-overlay px-6 pt-10 pb-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 gradient-coral rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
            🌸
          </div>
          {editName ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 text-white font-display font-bold text-2xl text-center rounded-xl px-3 py-1 border border-white/30 focus:outline-none"
              />
              <button onClick={() => setEditName(false)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="Check" size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="font-display font-bold text-white text-2xl">{name}</h1>
              <button onClick={() => setEditName(true)} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="Pencil" size={12} className="text-white" />
              </button>
            </div>
          )}
          <p className="text-white/70 text-sm">7 дней в приложении · {unlockedCount} достижений</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Записей", value: "23", icon: "📝" },
            { label: "Практик", value: "5", icon: "✅" },
            { label: "Статей", value: "8", icon: "📚" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center shadow-sm">
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className="font-display font-bold text-xl text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Goal */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display font-semibold text-gray-800">🎯 Моя цель</p>
          </div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-gray-50 rounded-2xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet/30"
            rows={2}
          />
        </div>

        {/* Reminders */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 gradient-violet rounded-xl flex items-center justify-center">
              <Icon name="Bell" size={16} className="text-white" />
            </div>
            <p className="font-display font-semibold text-gray-800">Напоминания</p>
          </div>

          <div className="space-y-3">
            {reminderState.map((rem, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
                    style={{
                      background: rem.active
                        ? "linear-gradient(135deg, #845EF7 0%, #FF6B9D 100%)"
                        : "#f3f4f6",
                      color: rem.active ? "white" : "#9ca3af",
                    }}
                  >
                    {rem.time}
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{rem.label}</p>
                    <p className="text-gray-400 text-xs">{rem.active ? "Включено" : "Выключено"}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleReminder(i)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    rem.active ? "bg-violet" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      rem.active ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-gray-400 text-sm font-medium flex items-center justify-center gap-2 hover:border-violet/40 hover:text-violet transition-all">
            <Icon name="Plus" size={16} />
            Добавить напоминание
          </button>
        </div>

        {/* Achievements */}
        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-gray-800">🏆 Достижения</p>
            <span className="text-gray-400 text-sm">{unlockedCount}/{achievements.length}</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex flex-col items-center gap-1"
                title={ach.desc}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                  style={{
                    background: ach.unlocked
                      ? "linear-gradient(135deg, #FF6B6B20, #845EF720)"
                      : "#f3f4f6",
                    filter: ach.unlocked ? "none" : "grayscale(1) opacity(0.4)",
                    border: ach.unlocked ? "2px solid #845EF730" : "2px solid transparent",
                  }}
                >
                  {ach.emoji}
                </div>
                <p className="text-gray-600 text-xs text-center leading-tight">{ach.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="glass rounded-3xl overflow-hidden mb-6 shadow-sm">
          {[
            { icon: "Shield", label: "Конфиденциальность" },
            { icon: "HelpCircle", label: "Поддержка" },
            { icon: "Info", label: "О приложении" },
          ].map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50 transition-all text-left ${
                i < 2 ? "border-b border-gray-100" : ""
              }`}
            >
              <Icon name={item.icon as "Shield"} fallback="Circle" size={18} className="text-gray-400" />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <Icon name="ChevronRight" size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
