export type LessonMeta = {
  id: string;
  title: string;
  start: number;
  end: number;
};

/** Cuts of the masterclass. Each block is longer than 15 minutes. */
export const lessons: LessonMeta[] = [
  { id: "01", title: "Stop leaving the work in the chat box", start: 0, end: 950.48 },
  { id: "02", title: "Give the model hands in the software you already use", start: 950.48, end: 2101.56 },
  { id: "03", title: "Make it return data, then call the tool", start: 2101.56, end: 3619.34 },
  { id: "04", title: "Approve, then write it back", start: 3619.34, end: 4908 },
];

export const COURSE_SECONDS = 4908;

export function lessonDuration(lesson: LessonMeta) {
  return lesson.end - lesson.start;
}
