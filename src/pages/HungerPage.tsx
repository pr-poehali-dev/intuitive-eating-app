import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { HungerEntry } from "@/hooks/useAppStorage";

const SCALE = [
  { val: 1, emoji: "😫", label: "Голодный обморок", color: "#FF4757", bg: "#fff0f0", desc: "Сильная слабость, головокружение, сложно думать" },
  { val: 2, emoji: "🥺", label: "Очень голоден", color: "#FF6B6B", bg: "#fff3f3", desc: "Урчит в животе, раздражение, трудно сосредоточиться" },
  { val: 3, emoji: "😕", label: "Голоден", color: "#FF9F43", bg: "#fff8f0", desc: "Ощущаешь голод, готов поесть прямо сейчас" },
  { val: 4, emoji: "😐", label: "Немного голоден", color: "#FFD32A", bg: "#fffcf0", desc: "Лёгкое чувство пустоты, скоро захочется есть" },
  { val: 5, emoji: "😊", label: "Нейтрально", color: "#7BED9F", bg: "#f0fff5", desc: "Не голоден и не сыт — идеальное начало для еды" },
  { val: 6, emoji: "🙂", label: "Чуть сыт", color: "#2ED573", bg: "#f0fff4", desc: "Лёгкое удовлетворение, ещё можно съесть немного" },
  { val: 7, emoji: "😌", label: "Сыт", color: "#20C997", bg: "#edfff9", desc: "Комфортное насыщение, хорошее самочувствие" },
  { val: 8, emoji: "😋", label: "Хорошо насыщен", color: "#54A0FF", bg: "#f0f8ff", desc: "Наелся, приятное тепло в животе" },
  { val: 9, emoji: "😅", label: "Слишком много", color: "#845EF7", bg: "#f5f0ff", desc: "Ощущение тяжести, чуть больше чем надо" },
  { val: 10, emoji: "🤢", label: "Переел", color: "#FF6B9D", bg: "#fff0f7", desc: "Дискомфорт, хочется полежать, сожаление" },
];

interface HungerPageProps {
  entries: HungerEntry[];
  onAddEntry: (entry: Omit<HungerEntry, "id" | "date">) => void;
}

export default function HungerPage({ entries, onAddEntry }: HungerPageProps) {
  const [currentVal, setCurrentVal] = useState(5);
  const [note, setNote] = useState("");
  const [entryType, setEntryType] = useState<"before" | "after">("before");
  const [saved, setSaved] = useState(false);

  const current = SCALE[currentVal - 1];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === todayStr);

  const handleSave = () => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    onAddEntry({ time, level: currentVal, type: entryType, note });
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="gradient-violet noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Шкала голода и сытости</h1>
          <p className="text-white/70 text-sm">Тренируй осознанность</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        <div
          className="rounded-3xl p-6 mb-5 shadow-sm transition-all duration-500"
          style={{ backgroundColor: current.bg, border: `2px solid ${current.color}30` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Текущее состояние</p>
              <h2 className="font-display font-bold text-gray-800 text-xl">{current.label}</h2>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{current.desc}</p>
            </div>
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-sm"
              style={{ backgroundColor: current.color + "20" }}
            >
              {current.emoji}
            </div>
          </div>

          <div className="relative mb-3">
            <div className="w-full h-4 rounded-full" style={{ background: "linear-gradient(to right, #FF4757, #FF9F43, #7BED9F, #20C997, #845EF7)" }} />
            <input
              type="range" min={1} max={10} value={currentVal}
              onChange={(e) => setCurrentVal(Number(e.target.value))}
              className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
              style={{ margin: 0 }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border-2 transition-all duration-200"
              style={{ left: `calc(${(currentVal - 1) / 9 * 100}% - 12px)`, borderColor: current.color }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>1 — Голоден</span>
            <span className="font-bold" style={{ color: current.color }}>{currentVal}</span>
            <span>10 — Переел</span>
          </div>
        </div>

        <div className="glass rounded-3xl p-4 mb-5 shadow-sm">
          <p className="text-gray-700 font-semibold text-sm mb-3">Вся шкала</p>
          <div className="grid grid-cols-5 gap-2">
            {SCALE.map((s) => (
              <button
                key={s.val}
                onClick={() => setCurrentVal(s.val)}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all"
                style={{ backgroundColor: currentVal === s.val ? s.color + "20" : "transparent", transform: currentVal === s.val ? "scale(1.1)" : "scale(1)" }}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-xs font-bold" style={{ color: s.color }}>{s.val}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5 mb-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3">Записать состояние</p>

          <div className="flex gap-2 mb-4">
            {(["before", "after"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setEntryType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${entryType === t ? "gradient-violet text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {t === "before" ? "🍽 Перед едой" : "✅ После еды"}
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet/30 mb-3"
            rows={2}
            placeholder="Заметка (необязательно)..."
          />

          <button
            onClick={handleSave}
            className={`w-full font-semibold py-3 rounded-2xl transition-all ${saved ? "bg-mint text-white" : "gradient-violet text-white hover:opacity-90"}`}
          >
            {saved ? "✓ Сохранено!" : `Сохранить — уровень ${currentVal} ${current.emoji}`}
          </button>
        </div>

        <h3 className="font-display font-semibold text-gray-800 mb-3">История сегодня</h3>
        {todayEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Записей пока нет. Отметь своё первое состояние!</p>
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            {[...todayEntries].reverse().map((entry) => {
              const scale = SCALE[entry.level - 1];
              return (
                <div key={entry.id} className="glass rounded-2xl p-3 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: scale.color + "20" }}>
                    {scale.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{scale.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: scale.color + "20", color: scale.color }}>
                        {entry.type === "before" ? "до еды" : "после еды"}
                      </span>
                    </div>
                    {entry.note && <p className="text-gray-400 text-xs">{entry.note}</p>}
                  </div>
                  <span className="text-gray-400 text-xs">{entry.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
