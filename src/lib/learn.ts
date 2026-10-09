export type QuizResult = { score: number; total: number; passed: boolean; attempts: number };

export type LearnState = {
  name: string;
  enrolled: string[];
  done: Record<string, string[]>;
  position: Record<string, number>;
  notes: Record<string, string>;
  bookmarks: string[];
  quizzes: Record<string, QuizResult>;
  certificates: Record<string, string>;
};

const KEY = "school-learn-v1";

export function emptyLearn(): LearnState {
  return { name: "", enrolled: [], done: {}, position: {}, notes: {}, bookmarks: [], quizzes: {}, certificates: {} };
}

export function lessonKey(slug: string, lessonId: string) {
  return `${slug}:${lessonId}`;
}

export function loadLearn(): LearnState {
  if (typeof window === "undefined") return emptyLearn();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyLearn();
    return { ...emptyLearn(), ...(JSON.parse(raw) as LearnState) };
  } catch {
    return emptyLearn();
  }
}

export function saveLearn(state: LearnState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
