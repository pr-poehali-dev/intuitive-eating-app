import { useState, useEffect, useCallback } from "react";

export interface Meal {
  id: number;
  date: string;
  time: string;
  food: string;
  hungerBefore: number;
  hungerAfter: number;
  mood: string;
  notes: string;
}

export interface HungerEntry {
  id: number;
  date: string;
  time: string;
  level: number;
  type: "before" | "after";
  note: string;
}

export interface AppData {
  userName: string;
  userGoal: string;
  email: string;
  completedPractices: number[];
  readArticles: number[];
  meals: Meal[];
  hungerEntries: HungerEntry[];
  startDate: string;
}

const DEFAULT_DATA: AppData = {
  userName: "",
  userGoal: "",
  email: "",
  completedPractices: [],
  readArticles: [],
  meals: [],
  hungerEntries: [],
  startDate: new Date().toISOString().split("T")[0],
};

const STORAGE_KEY = "nutrimind_app_data";

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function save(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAppStorage() {
  const [data, setData] = useState<AppData>(load);

  const update = useCallback((patch: Partial<AppData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  const addMeal = useCallback((meal: Omit<Meal, "id" | "date">) => {
    setData((prev) => {
      const next = {
        ...prev,
        meals: [
          ...prev.meals,
          { ...meal, id: Date.now(), date: new Date().toISOString().split("T")[0] },
        ],
      };
      save(next);
      return next;
    });
  }, []);

  const deleteMeal = useCallback((id: number) => {
    setData((prev) => {
      const next = { ...prev, meals: prev.meals.filter((m) => m.id !== id) };
      save(next);
      return next;
    });
  }, []);

  const addHungerEntry = useCallback((entry: Omit<HungerEntry, "id" | "date">) => {
    setData((prev) => {
      const next = {
        ...prev,
        hungerEntries: [
          ...prev.hungerEntries,
          { ...entry, id: Date.now(), date: new Date().toISOString().split("T")[0] },
        ],
      };
      save(next);
      return next;
    });
  }, []);

  const togglePractice = useCallback((id: number) => {
    setData((prev) => {
      const ids = prev.completedPractices.includes(id)
        ? prev.completedPractices.filter((x) => x !== id)
        : [...prev.completedPractices, id];
      const next = { ...prev, completedPractices: ids };
      save(next);
      return next;
    });
  }, []);

  const markArticleRead = useCallback((id: number) => {
    setData((prev) => {
      if (prev.readArticles.includes(id)) return prev;
      const next = { ...prev, readArticles: [...prev.readArticles, id] };
      save(next);
      return next;
    });
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMeals = data.meals.filter((m) => m.date === todayStr);
  const todayHunger = data.hungerEntries.filter((e) => e.date === todayStr);

  const daysActive = Math.max(
    1,
    Math.round(
      (Date.now() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );

  return {
    data,
    update,
    addMeal,
    deleteMeal,
    addHungerEntry,
    togglePractice,
    markArticleRead,
    todayMeals,
    todayHunger,
    daysActive,
  };
}
