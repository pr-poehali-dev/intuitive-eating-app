import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Exercise {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: "Лёгкое" | "Среднее" | "Сложное";
  emoji: string;
  gradient: string;
  description: string;
  steps: string[];
}

const exercises: Exercise[] = [
  {
    id: 1, title: "Проверка голода",
    category: "Осознанность", duration: "2 мин", difficulty: "Лёгкое",
    emoji: "🎯", gradient: "gradient-coral",
    description: "Практикуй оценку голода перед каждым приёмом пищи в течение одного дня.",
    steps: [
      "Перед едой остановись на 30 секунд",
      "Закрой глаза и сосредоточься на ощущениях в теле",
      "Оцени голод по шкале от 1 до 10",
      "Запиши число в дневник",
      "Повтори оценку в середине и конце еды",
    ]
  },
  {
    id: 2, title: "Медленное поедание",
    category: "Осознанность", duration: "20 мин", difficulty: "Среднее",
    emoji: "🐢", gradient: "gradient-violet",
    description: "Съешь один приём пищи в 2 раза медленнее обычного, полностью сосредоточившись на процессе.",
    steps: [
      "Выключи все экраны и убери телефон",
      "Накрой стол — сервируй еду красиво",
      "Перед первым кусочком: сделай 3 глубоких вдоха",
      "Клади вилку/ложку между каждым укусом",
      "Пережёвывай не менее 20 раз",
      "Делай паузы каждые 5 минут — оцени сытость",
    ]
  },
  {
    id: 3, title: "Дневник эмоций перед едой",
    category: "Психология", duration: "5 мин", difficulty: "Лёгкое",
    emoji: "📔", gradient: "gradient-warm",
    description: "Перед каждым приёмом пищи за неделю записывай своё эмоциональное состояние.",
    steps: [
      "Заведи блокнот или используй дневник в приложении",
      "Перед едой запиши: какую эмоцию ты сейчас чувствуешь?",
      "Физически ли ты голоден или ищешь утешение в еде?",
      "После недели — посмотри на паттерны",
      "Какие эмоции чаще всего приводят к еде?",
    ]
  },
  {
    id: 4, title: "Разрешение еды",
    category: "Свобода от диет", duration: "15 мин", difficulty: "Сложное",
    emoji: "🔓", gradient: "gradient-mint",
    description: "Купи и съешь 'запрещённый' продукт в спокойной обстановке, без спешки и чувства вины.",
    steps: [
      "Выбери продукт, который ты обычно запрещаешь себе",
      "Купи его и сервируй красиво на тарелке",
      "Ешь медленно, смакуя каждый кусочек",
      "Заметь: это так вкусно, как ты думал(а)?",
      "Остановись, когда насытишься — можно не доедать",
      "Запиши ощущения без осуждения",
    ]
  },
  {
    id: 5, title: "Сканирование тела",
    category: "Тело", duration: "10 мин", difficulty: "Среднее",
    emoji: "🧘", gradient: "gradient-cool",
    description: "Медитация для восстановления связи с телом и его сигналами.",
    steps: [
      "Сядь удобно или ляг на спину",
      "Закрой глаза, несколько глубоких вдохов",
      "Начни с макушки, медленно двигайся вниз",
      "Замечай любые ощущения без оценки",
      "Дойдя до живота: есть ли голод, напряжение?",
      "Запиши 3 ощущения после медитации",
    ]
  },
  {
    id: 6, title: "Еда с удовольствием",
    category: "Удовольствие", duration: "30 мин", difficulty: "Лёгкое",
    emoji: "😋", gradient: "gradient-coral",
    description: "Приготовь или закажи любимое блюдо и наслаждайся им без угрызений совести.",
    steps: [
      "Вспомни блюдо, которое приносит настоящую радость",
      "Приготовь или закажи его — без компромиссов",
      "Создай приятную атмосферу: свечи, красивая посуда, музыка",
      "Ешь медленно, замечая каждый аспект вкуса",
      "После: напиши 3 вещи, которые понравились",
    ]
  },
];

const categories = ["Все", "Осознанность", "Психология", "Свобода от диет", "Тело", "Удовольствие"];
const diffColors: Record<string, string> = {
  "Лёгкое": "#20C997",
  "Среднее": "#FF9F43",
  "Сложное": "#845EF7",
};

interface PracticePageProps {
  completedPractices: number[];
  onTogglePractice: (id: number) => void;
}

export default function PracticePage({ completedPractices, onTogglePractice }: PracticePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [openExercise, setOpenExercise] = useState<Exercise | null>(null);

  const filtered = activeCategory === "Все" ? exercises : exercises.filter((e) => e.category === activeCategory);
  const totalCompleted = completedPractices.length;

  const handleComplete = (id: number) => {
    onTogglePractice(id);
    setOpenExercise(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="gradient-warm noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Практика</h1>
          <p className="text-white/70 text-sm mb-4">Упражнения для осознанного питания</p>

          <div className="flex items-center gap-3">
            <div className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-2">
              <Icon name="CheckCircle" size={18} className="text-white" />
              <span className="text-white font-bold">{totalCompleted}</span>
              <span className="text-white/70 text-sm">выполнено</span>
            </div>
            <div className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-2">
              <Icon name="Target" size={18} className="text-white" />
              <span className="text-white font-bold">{exercises.length}</span>
              <span className="text-white/70 text-sm">всего</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        <div className="glass rounded-3xl p-4 mb-5 shadow-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 font-semibold text-sm">Прогресс</span>
            <span className="text-gray-500 text-sm">{totalCompleted}/{exercises.length}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full">
            <div className="h-3 gradient-warm rounded-full transition-all duration-700" style={{ width: `${(totalCompleted / exercises.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat ? "gradient-warm text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {filtered.map((ex, i) => {
            const isCompleted = completedPractices.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => setOpenExercise(ex)}
                className="w-full glass rounded-3xl overflow-hidden shadow-sm card-hover text-left animate-fade-in relative"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-mint rounded-full flex items-center justify-center shadow-sm">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                )}
                <div className={`${ex.gradient} p-4 noise-overlay ${isCompleted ? "opacity-80" : ""}`}>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl">{ex.emoji}</span>
                      <p className="text-white/70 text-xs mt-2">{ex.category}</p>
                      <p className="text-white font-display font-bold text-base mt-0.5">{ex.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-white/70 text-xs">{ex.duration}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: diffColors[ex.difficulty] + "80" }}>
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-gray-500 text-xs line-clamp-2">{ex.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {openExercise && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className={`${openExercise.gradient} p-6 noise-overlay rounded-t-3xl`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl">{openExercise.emoji}</span>
                  <p className="text-white/70 text-sm mt-2">{openExercise.category} · {openExercise.duration}</p>
                  <h3 className="text-white font-display font-bold text-xl mt-1">{openExercise.title}</h3>
                </div>
                <button onClick={() => setOpenExercise(null)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="X" size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">{openExercise.description}</p>

              <h4 className="font-display font-bold text-gray-800 mb-3">Шаги выполнения:</h4>
              <div className="space-y-3 mb-6">
                {openExercise.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-7 h-7 ${openExercise.gradient} rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5`}>
                      {i + 1}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleComplete(openExercise.id)}
                className={`w-full font-semibold py-3.5 rounded-2xl transition-all ${completedPractices.includes(openExercise.id) ? "bg-gray-100 text-gray-500" : `${openExercise.gradient} text-white`}`}
              >
                {completedPractices.includes(openExercise.id) ? "✓ Выполнено (снять отметку)" : "Отметить как выполненное"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
