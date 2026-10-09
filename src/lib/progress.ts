const KEY = "fieldlayer-progress";
const GUIDE_KEY = "fieldlayer-guide";

export type ProgressMap = Record<string, string[]>;
export type GuideMap = Record<string, number>;

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeProgress(next: ProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function isDone(map: ProgressMap, slug: string, lessonId: string) {
  return (map[slug] ?? []).includes(lessonId);
}

export function markDone(map: ProgressMap, slug: string, lessonId: string): ProgressMap {
  const current = map[slug] ?? [];
  if (current.includes(lessonId)) return map;
  return { ...map, [slug]: [...current, lessonId] };
}

export function readGuide(): GuideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GUIDE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as GuideMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeGuideStep(slug: string, step: number) {
  const current = readGuide();
  localStorage.setItem(GUIDE_KEY, JSON.stringify({ ...current, [slug]: step }));
}