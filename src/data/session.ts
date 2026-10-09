export type Chapter = {
  id: string;
  kicker: string;
  title: string;
  start: number;
};

export const SESSION_SECONDS = 4908;

export const chapters: Chapter[] = [
  { id: "01", kicker: "Part 1", title: "Origin Story and the Mindset Shift", start: 0 },
  { id: "02", kicker: "Part 2", title: "Deconstructing the AI Agent", start: 353.96 },
  { id: "03", kicker: "Part 3", title: "Real-World Execution and Human-in-the-Loop", start: 641.32 },
  { id: "04", kicker: "Architecture", title: "No-Code, APIs, and RAG", start: 950.48 },
  { id: "05", kicker: "Part 4", title: "The Copy-Paste Test and Impact vs Effort", start: 1424.44 },
  { id: "06", kicker: "Part 5", title: "The Tooling Landscape", start: 1709 },
  { id: "07", kicker: "Part 6", title: "Google AI Studio", start: 2101.56 },
  { id: "08", kicker: "Part 7", title: "Function Calling", start: 2473.56 },
  { id: "09", kicker: "Parts 7–8", title: "JSON Builds, Live Examples, and the Challenge", start: 2979.6 },
  { id: "10", kicker: "Part 9", title: "GrokBot Is an AI Teammate, Not a Chatbot", start: 3619.34 },
  { id: "11", kicker: "Part 10", title: "Bots, Skills, and Routines", start: 3925.02 },
  { id: "12", kicker: "Part 11", title: "Practical Use Cases", start: 4230.94 },
  { id: "13", kicker: "Part 12", title: "Trust, Limits, and the Final Challenge", start: 4546.14 },
];

export const audioFile = {
  href: "/media/AI-Agents-Masterclass.mp3",
  filename: "AI-Agents-Masterclass.mp3",
  kind: "Audio",
  format: "MP3",
};

export const videoFile = {
  href: "/media/AI-Agents-Masterclass.mp4",
  filename: "AI-Agents-Masterclass.mp4",
  kind: "Video",
  format: "MP4",
};

export function formatClock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${m}:${ss}`;
}

export function chapterIndexAt(seconds: number) {
  let index = 0;
  for (let i = 0; i < chapters.length; i += 1) {
    if (chapters[i].start <= seconds + 0.25) index = i;
  }
  return index;
}
