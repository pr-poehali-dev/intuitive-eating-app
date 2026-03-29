import { useState } from "react";
import Icon from "@/components/ui/icon";

interface OnboardingPageProps {
  onComplete: (name: string, goal: string) => void;
}

const GOALS = [
  { emoji: "🌿", text: "Восстановить связь с телом" },
  { emoji: "🕊", text: "Избавиться от диетного мышления" },
  { emoji: "😌", text: "Перестать заедать эмоции" },
  { emoji: "⚖️", text: "Найти комфортный вес без диет" },
  { emoji: "✨", text: "Научиться есть с удовольствием" },
];

const STEPS = ["welcome", "name", "goal", "ready"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const handleFinish = () => {
    onComplete(name.trim() || "Гость", goal || customGoal || "Осознанное питание");
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress dots */}
      {step !== "welcome" && (
        <div className="flex justify-center gap-2 pt-12 pb-2">
          {STEPS.slice(1).map((s, i) => (
            <div
              key={s}
              className="rounded-full transition-all duration-300"
              style={{
                width: STEPS.indexOf(step) - 1 === i ? 24 : 8,
                height: 8,
                background: STEPS.indexOf(step) - 1 >= i
                  ? "linear-gradient(90deg, #845EF7, #FF6B9D)"
                  : "#e5e7eb",
              }}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">

        {/* STEP: welcome */}
        {step === "welcome" && (
          <div className="text-center animate-fade-in">
            <div className="w-28 h-28 gradient-violet rounded-[2rem] flex items-center justify-center text-6xl mx-auto mb-8 shadow-xl">
              🌸
            </div>
            <h1 className="font-display font-bold text-gray-900 text-3xl mb-3">
              NutriMind
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-2">
              Дневник осознанного питания
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
              Учись слушать своё тело, а не считать калории
            </p>

            <div className="space-y-3 mb-10">
              {[
                { icon: "BookOpen", text: "Дневник питания с отметкой голода" },
                { icon: "Activity", text: "Шкала голода и сытости 1–10" },
                { icon: "Lightbulb", text: "Теория интуитивного питания" },
                { icon: "Target", text: "Практические упражнения" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 gradient-violet rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon as "BookOpen"} size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={next}
              className="w-full gradient-violet text-white font-semibold py-4 rounded-2xl text-base shadow-lg"
            >
              Начать
            </button>
          </div>
        )}

        {/* STEP: name */}
        {step === "name" && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="font-display font-bold text-gray-900 text-2xl mb-2">
                Как тебя зовут?
              </h2>
              <p className="text-gray-400 text-sm">
                Это поможет сделать приложение более личным
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
              placeholder="Твоё имя..."
              autoFocus
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg text-center font-medium focus:outline-none focus:border-violet transition-colors mb-6"
              style={{ caretColor: "#845EF7" }}
            />

            <button
              onClick={next}
              disabled={!name.trim()}
              className="w-full gradient-violet text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40 transition-opacity"
            >
              Продолжить
            </button>
            <button onClick={next} className="w-full text-gray-400 text-sm py-3 mt-1">
              Пропустить
            </button>
          </div>
        )}

        {/* STEP: goal */}
        {step === "goal" && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="font-display font-bold text-gray-900 text-2xl mb-2">
                {name ? `${name}, какова твоя цель?` : "Какова твоя цель?"}
              </h2>
              <p className="text-gray-400 text-sm">
                Выбери или напиши своими словами
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {GOALS.map((g) => (
                <button
                  key={g.text}
                  onClick={() => { setGoal(g.text); setCustomGoal(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all"
                  style={{
                    borderColor: goal === g.text ? "#845EF7" : "#e5e7eb",
                    background: goal === g.text ? "#845EF710" : "white",
                  }}
                >
                  <span className="text-xl">{g.emoji}</span>
                  <span className="text-gray-700 text-sm font-medium">{g.text}</span>
                  {goal === g.text && (
                    <Icon name="Check" size={16} className="ml-auto text-violet flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => { setCustomGoal(e.target.value); setGoal(""); }}
                placeholder="Или напиши свою цель..."
                className="w-full border-2 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{ borderColor: customGoal ? "#845EF7" : "#e5e7eb" }}
              />
            </div>

            <button
              onClick={next}
              disabled={!goal && !customGoal.trim()}
              className="w-full gradient-violet text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40"
            >
              Продолжить
            </button>
            <button onClick={next} className="w-full text-gray-400 text-sm py-3 mt-1">
              Пропустить
            </button>
          </div>
        )}

        {/* STEP: ready */}
        {step === "ready" && (
          <div className="text-center animate-fade-in">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="w-32 h-32 gradient-coral rounded-[2.5rem] flex items-center justify-center text-6xl shadow-xl">
                🌱
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 gradient-violet rounded-full flex items-center justify-center shadow-md">
                <Icon name="Check" size={18} className="text-white" />
              </div>
            </div>

            <h2 className="font-display font-bold text-gray-900 text-2xl mb-3">
              {name ? `Всё готово, ${name}!` : "Всё готово!"}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-2 max-w-xs mx-auto">
              Начни с первой записи в дневнике — это займёт меньше минуты.
            </p>
            {(goal || customGoal) && (
              <div className="inline-flex items-center gap-2 bg-violet/10 rounded-2xl px-4 py-2 mb-8 mt-2">
                <span className="text-violet text-sm font-medium">🎯 {goal || customGoal}</span>
              </div>
            )}
            {!(goal || customGoal) && <div className="mb-8" />}

            <button
              onClick={handleFinish}
              className="w-full gradient-violet text-white font-semibold py-4 rounded-2xl text-base shadow-lg"
            >
              Открыть приложение
            </button>
          </div>
        )}
      </div>

      {/* Back button */}
      {stepIndex > 0 && step !== "ready" && (
        <button
          onClick={() => setStep(STEPS[stepIndex - 1])}
          className="flex items-center gap-1 text-gray-400 text-sm mx-auto pb-8"
        >
          <Icon name="ChevronLeft" size={16} />
          Назад
        </button>
      )}
    </div>
  );
}
