import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Article {
  id: number;
  category: string;
  title: string;
  duration: string;
  emoji: string;
  gradient: string;
  content: string;
  completed: boolean;
}

const articles: Article[] = [
  {
    id: 1, category: "Основы", title: "Что такое интуитивное питание?",
    duration: "5 мин", emoji: "🌱", gradient: "gradient-mint", completed: true,
    content: `Интуитивное питание (ИП) — это подход к питанию, разработанный диетологами Эвелин Трибол и Элизой Реш в 1995 году. Он основан на 10 принципах, которые помогают восстановить естественную связь с телом.

**Ключевая идея:** Твоё тело уже знает, что ему нужно. Нужно только научиться его слушать.

В отличие от диет, ИП не запрещает продукты и не считает калории. Вместо этого ты учишься:
• Распознавать физический голод и сытость
• Отличать эмоциональный голод от физического  
• Есть то, что действительно хочется
• Получать удовольствие от еды без вины`
  },
  {
    id: 2, category: "Основы", title: "10 принципов интуитивного питания",
    duration: "8 мин", emoji: "📋", gradient: "gradient-coral", completed: true,
    content: `**1. Откажись от диетного мышления** — Диеты не работают долгосрочно. 95% людей возвращают вес.

**2. Уважай голод** — Еда при физическом голоде — это необходимость, не слабость.

**3. Помирись с едой** — Нет "плохих" продуктов. Запреты создают тягу.

**4. Брось вызов пищевой полиции** — Внутренний голос, осуждающий выбор еды — это не твой друг.

**5. Открой для себя фактор удовлетворения** — Удовольствие от еды — это норма и здорово.

**6. Чувствуй насыщение** — Пауза в середине еды: "Как я сейчас себя чувствую?"

**7. Справляйся с эмоциями с добротой** — Найди способы справляться со стрессом без еды.

**8. Уважай своё тело** — Генетика влияет на форму тела. Прими себя.

**9. Движение — почувствуй разницу** — Двигайся ради удовольствия, не наказания.

**10. Береги своё здоровье** — Здоровое питание — это не перфекционизм, а долгосрочный баланс.`
  },
  {
    id: 3, category: "Психология", title: "Эмоциональный голод vs физический",
    duration: "6 мин", emoji: "🧠", gradient: "gradient-violet", completed: false,
    content: `Умение отличать эмоциональный голод от физического — один из ключевых навыков ИП.

**Физический голод:**
• Нарастает постепенно
• Любая еда подойдёт
• Чувствуется в животе (урчание, пустота)
• Проходит после еды
• Не вызывает чувства вины

**Эмоциональный голод:**
• Появляется внезапно
• Хочется конкретное (чаще сладкое/солёное)
• "Чувствуется" в голове и груди
• Еда не помогает — хочется ещё
• Часто следует чувство вины

**Триггеры эмоционального голода:**
Стресс, скука, одиночество, тревога, радость, усталость.

**Что делать?** Остановись и спроси себя: "Что я сейчас чувствую? Что мне на самом деле нужно?"`
  },
  {
    id: 4, category: "Психология", title: "Диетное мышление и как от него избавиться",
    duration: "7 мин", emoji: "🔓", gradient: "gradient-warm", completed: false,
    content: `Диетное мышление формируется годами и проявляется в убеждениях типа:
"Этот продукт нельзя", "Я плохо поел — надо отработать в зале", "С понедельника начну правильно питаться".

**Признаки диетного мышления:**
• Деление еды на "хорошую" и "плохую"
• Чувство вины после еды
• Мысли об "отработке" калорий
• Правила и ограничения вокруг еды
• Страх определённых продуктов

**Шаги к освобождению:**
1. Замечай осуждающие мысли без самокритики
2. Замени "Я не должен есть X" на "Я выбираю есть или не есть X"
3. Практикуй нейтральный язык о еде
4. Позволь себе есть "запрещённые" продукты в спокойной обстановке`
  },
  {
    id: 5, category: "Тело", title: "Как слышать сигналы тела",
    duration: "5 мин", emoji: "👂", gradient: "gradient-cool", completed: false,
    content: `Многие из нас потеряли связь с сигналами тела из-за лет диет, правил питания и еды "по расписанию".

**Сигналы голода:**
Урчание в животе, лёгкая слабость, трудности с концентрацией, раздражительность, пустота в желудке.

**Сигналы сытости:**
Замедление темпа еды, ощущение заполненности, снижение интереса к еде, удовлетворение.

**Практика восстановления чувствительности:**
1. Ешь без гаджетов и отвлечений
2. Делай паузы в середине приёма пищи
3. Оценивай голод и сытость перед, во время и после еды
4. Веди дневник — записывай ощущения, а не калории`
  },
  {
    id: 6, category: "Наука", title: "Гормоны голода: лептин и грелин",
    duration: "6 мин", emoji: "🔬", gradient: "gradient-mint", completed: false,
    content: `Два главных гормона регулируют голод и насыщение.

**Грелин — гормон голода:**
Вырабатывается желудком, когда он пуст. Повышается перед едой, снижается после. Сигнал: "Пора есть!"

**Лептин — гормон насыщения:**
Вырабатывается жировыми клетками. Сообщает мозгу: "Энергии достаточно, хватит есть!"

**Что нарушает баланс:**
• Хронический стресс (кортизол мешает лептину)
• Недосыпание (грелин растёт на 15-20% после плохого сна)
• Быстрая еда (лептин не успевает сработать — нужно 20 минут)
• Хронические диеты (снижают уровень лептина)

**Вывод:** Еда медленно, сон и снижение стресса — это биохимия, не сила воли.`
  },
];

const categories = ["Все", "Основы", "Психология", "Тело", "Наука"];

export default function TheoryPage() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const filtered = activeCategory === "Все" ? articles : articles.filter((a) => a.category === activeCategory);
  const completedCount = articles.filter((a) => a.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-mint noise-overlay px-6 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Теория</h1>
          <p className="text-white/70 text-sm mb-4">Изучи основы интуитивного питания</p>

          <div className="glass-dark rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name="BookOpen" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-white text-xs mb-1">
                <span>Прочитано</span>
                <span className="font-bold">{completedCount}/{articles.length}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full">
                <div
                  className="h-2 bg-white rounded-full transition-all"
                  style={{ width: `${(completedCount / articles.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? "gradient-mint text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-3 mb-6">
          {filtered.map((article, i) => (
            <button
              key={article.id}
              onClick={() => setOpenArticle(article)}
              className="w-full glass rounded-3xl overflow-hidden shadow-sm card-hover text-left animate-fade-in"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`${article.gradient} p-4 noise-overlay`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{article.emoji}</span>
                  <div className="flex items-center gap-2">
                    {article.completed && (
                      <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                    )}
                    <span className="text-white/70 text-xs">{article.duration}</span>
                  </div>
                </div>
                <p className="text-white/70 text-xs mt-2">{article.category}</p>
                <p className="text-white font-display font-bold text-base mt-0.5">{article.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Article modal */}
      {openArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className={`${openArticle.gradient} p-5 noise-overlay flex-shrink-0`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{openArticle.emoji}</span>
                <button
                  onClick={() => setOpenArticle(null)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Icon name="X" size={16} className="text-white" />
                </button>
              </div>
              <p className="text-white/70 text-xs">{openArticle.category} · {openArticle.duration}</p>
              <h2 className="text-white font-display font-bold text-xl mt-1">{openArticle.title}</h2>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              {openArticle.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-700 text-sm leading-relaxed mb-4 last:mb-0">
                  {para.split("\n").map((line, j) => (
                    <span key={j}>
                      {line.startsWith("**") && line.endsWith("**") ? (
                        <strong className="font-semibold text-gray-900">{line.slice(2, -2)}</strong>
                      ) : line.startsWith("• ") ? (
                        <span className="block pl-4">• {line.slice(2)}</span>
                      ) : (
                        line
                      )}
                      {j < para.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}

              <button
                onClick={() => setOpenArticle(null)}
                className="w-full gradient-mint text-white font-semibold py-4 rounded-2xl mt-4"
              >
                ✅ Прочитано
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
