import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SoftwareMock } from "@/components/mocks";
import { SiteHeader } from "@/components/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLearn } from "@/components/use-learn";
import { lessonDuration } from "@/data/curriculum";
import { allLessons, findLesson, getCourse, type Lesson } from "@/data/school";
import { formatClock } from "@/data/session";
import { lessonKey, loadLearn, type QuizResult } from "@/lib/learn";

export function Player({ slug, lessonId }: { slug: string; lessonId: string }) {
  const course = getCourse(slug);
  const lesson = course ? findLesson(course, lessonId) : undefined;
  const { state, update } = useLearn();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTime = useRef(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPicked([]);
    setSubmitted(false);
  }, [lessonId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lesson || lesson.kind !== "video") return;
    const bounds = lesson;
    const go = () => {
      const saved = loadLearn().position[lessonKey(slug, bounds.id)] ?? bounds.start;
      const resume = saved > bounds.start && saved < bounds.end - 1 ? saved : bounds.start;
      video.currentTime = resume;
      lastTime.current = resume;
    };
    if (video.readyState >= 1) go();
    else video.addEventListener("loadedmetadata", go, { once: true });
  }, [lesson, slug]);

  if (!course || !lesson) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-muted">That lesson is not in this course.</p>
        </main>
      </>
    );
  }

  const flat = allLessons(course);
  const index = flat.findIndex((item) => item.id === lesson.id);
  const next = flat[index + 1];
  const done = (state.done[course.slug] ?? []).includes(lesson.id);
  const note = state.notes[lessonKey(course.slug, lesson.id)] ?? "";
  const marked = state.bookmarks.includes(lessonKey(course.slug, lesson.id));

  function markLesson() {
    if (!course || !lesson) return;
    const courseSlug = course.slug;
    const id = lesson.id;
    update((current) => {
      const list = current.done[courseSlug] ?? [];
      if (list.includes(id)) return current;
      return {
        ...current,
        enrolled: current.enrolled.includes(courseSlug) ? current.enrolled : [...current.enrolled, courseSlug],
        done: { ...current.done, [courseSlug]: [...list, id] },
      };
    });
  }

  function onTime() {
    const video = videoRef.current;
    if (!video || !course || !lesson || lesson.kind !== "video") return;
    const end = lesson.end;
    const courseSlug = course.slug;
    const id = lesson.id;
    const time = video.currentTime;
    const jumped = time - lastTime.current > 2.5;
    lastTime.current = time;
    const key = lessonKey(courseSlug, id);
    const known = loadLearn().position[key] ?? 0;
    if (Math.abs(known - time) > 5) {
      update((current) => ({ ...current, position: { ...current.position, [key]: time } }));
    }
    if (!jumped && time >= end - 0.4) {
      video.pause();
      markLesson();
    }
  }

  function submitQuiz() {
    if (!course || !lesson || lesson.kind !== "quiz") return;
    const questions = lesson.questions;
    const courseSlug = course.slug;
    const id = lesson.id;
    if (questions.some((_, i) => picked[i] === undefined)) return;
    const score = questions.filter((question, i) => picked[i] === question.answer).length;
    const passed = score === questions.length;
    setSubmitted(true);
    update((current) => {
      const prior = current.quizzes[courseSlug];
      const result: QuizResult = {
        score,
        total: questions.length,
        passed: passed || Boolean(prior?.passed),
        attempts: (prior?.attempts ?? 0) + 1,
      };
      const list = current.done[courseSlug] ?? [];
      return {
        ...current,
        enrolled: current.enrolled.includes(courseSlug) ? current.enrolled : [...current.enrolled, courseSlug],
        quizzes: { ...current.quizzes, [courseSlug]: result },
        done: passed && !list.includes(id) ? { ...current.done, [courseSlug]: [...list, id] } : current.done,
      };
    });
  }

  const doneList = state.done[course.slug] ?? [];
  const finishedCount = flat.filter((item) => doneList.includes(item.id)).length;
  const percent = Math.round((finishedCount / flat.length) * 100);

  function goOn() {
    if (!course || !lesson) return;
    const courseSlug = course.slug;
    const nextId = next?.id;
    if (lesson.kind !== "quiz" && !done) markLesson();
    if (nextId) void navigate({ to: "/course/$slug/lesson/$lessonId", params: { slug: courseSlug, lessonId: nextId } });
    else void navigate({ to: "/certificate/$slug", params: { slug: courseSlug } });
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 flex min-h-14 items-center gap-3 border-b border-line bg-surface px-3">
        <Link to="/course/$slug" params={{ slug: course.slug }} className="inline-flex min-h-11 shrink-0 items-center text-sm text-muted">
          Exit
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{course.title}</p>
        <p className="shrink-0 text-sm tabular-nums text-muted">{percent}%</p>
        <ThemeToggle />
        <Link to="/dashboard" className="hidden min-h-11 items-center text-sm text-muted sm:inline-flex">
          My courses
        </Link>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        <div className="min-w-0 flex-1">
          {lesson.kind === "video" ? (
            <div className="bg-ink">
              <video
                key={lesson.id}
                ref={videoRef}
                className="mx-auto aspect-video max-h-[70vh] w-full"
                controls
                playsInline
                preload="metadata"
                poster="/media/poster.png"
                src="/media/AI-Agents-Masterclass.mp4"
                onTimeUpdate={onTime}
              />
            </div>
          ) : (
            <div className="border-b border-line bg-surface px-4 py-4 lg:px-8">
              {lesson.kind === "picture" && course.profession ? <SoftwareMock screen={lesson.screen} course={course.profession} /> : null}
              {lesson.kind === "text" ? <TextLesson lesson={lesson} /> : null}
              {lesson.kind === "quiz" ? (
                <Quiz
                  lesson={lesson}
                  picked={picked}
                  reveal={submitted || Boolean(state.quizzes[course.slug]?.passed)}
                  saved={state.quizzes[course.slug]}
                  onPick={(questionIndex, choiceIndex) => {
                    const nextPicks = [...picked];
                    nextPicks[questionIndex] = choiceIndex;
                    setPicked(nextPicks);
                    setSubmitted(false);
                  }}
                  onSubmit={submitQuiz}
                />
              ) : null}
            </div>
          )}

          <div className="border-b border-line px-4 py-4 lg:px-8">
            <p className="text-xs tabular-nums text-dim">
              Lesson {index + 1} of {flat.length}
              {lesson.kind === "video" ? ` · ${formatClock(lessonDuration(lesson))}` : ""}
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="font-serif text-3xl leading-tight text-balance text-fg">{lesson.title}</h1>
              {lesson.kind === "quiz" ? (
                next && state.quizzes[course.slug]?.passed ? (
                  <Link to="/course/$slug/lesson/$lessonId" params={{ slug: course.slug, lessonId: next.id }} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-fg px-4 text-sm font-medium text-surface">
                    Continue
                  </Link>
                ) : null
              ) : (
                <button type="button" onClick={goOn} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-fg px-4 text-sm font-medium text-surface">
                  {next ? "Complete and continue" : "Complete course"}
                </button>
              )}
            </div>
            {lesson.kind !== "quiz" ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted">{lesson.say}</p> : null}
            {lesson.kind === "picture" ? <p className="mt-4 max-w-2xl rounded-lg border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-fg">{lesson.doThis}</p> : null}
          </div>

          {lesson.kind !== "quiz" ? (
            <div className="px-4 py-4 lg:px-8">
              <div className="flex gap-4 border-b border-line">
                <p className="border-b-2 border-fg py-2 text-sm font-medium text-fg">Notes</p>
                <button
                  type="button"
                  onClick={() => {
                    const key = lessonKey(course.slug, lesson.id);
                    update((current) => ({
                      ...current,
                      bookmarks: current.bookmarks.includes(key) ? current.bookmarks.filter((item) => item !== key) : [...current.bookmarks, key],
                    }));
                  }}
                  className="min-h-11 text-sm text-muted"
                >
                  {marked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
              <label className="mt-4 block text-sm text-muted">
                Kept on this device
                <textarea
                  value={note}
                  onChange={(event) => {
                    const value = event.target.value;
                    update((current) => ({ ...current, notes: { ...current.notes, [lessonKey(course.slug, lesson.id)]: value } }));
                  }}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-base text-fg outline-none"
                />
              </label>
            </div>
          ) : null}
        </div>

        <aside className="border-t border-line bg-surface lg:sticky lg:top-14 lg:max-h-screen lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <h2 className="border-b border-line px-4 py-3 text-sm font-semibold text-fg">Course content</h2>
          {course.modules.map((module) => (
            <div key={module.id}>
              <h3 className="bg-bg px-4 py-2 text-sm font-medium text-fg">{module.title}</h3>
              <ol>
                {module.lessons.map((item) => {
                  const on = item.id === lesson.id;
                  const complete = doneList.includes(item.id);
                  return (
                    <li key={item.id} className={on ? "bg-bg" : undefined}>
                      <Link to="/course/$slug/lesson/$lessonId" params={{ slug: course.slug, lessonId: item.id }} className="flex min-h-12 items-start gap-3 px-4 py-3">
                        <Check on={complete} />
                        <span className={`text-sm leading-snug ${on ? "font-medium text-fg" : "text-muted"}`}>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${on ? "border-done bg-done text-check" : "border-line"}`}>
      {on ? (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M2 6.2 4.6 9 10 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : null}
    </span>
  );
}

function TextLesson({ lesson }: { lesson: Extract<Lesson, { kind: "text" }> }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      {lesson.diagram ? (
        <div className="grid grid-cols-2 gap-2 text-center text-sm sm:grid-cols-4">
          {["Trigger", "Read", "Draft", "Approve"].map((label) => (
            <p key={label} className={`rounded-xl border border-line px-2 py-4 ${label === "Approve" ? "hot" : ""}`}>
              {label}
            </p>
          ))}
        </div>
      ) : null}
      <ul className="mt-4 space-y-2">
        {lesson.points.map((point) => (
          <li key={point} className="text-sm leading-relaxed text-fg">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Quiz({
  lesson,
  picked,
  reveal,
  saved,
  onPick,
  onSubmit,
}: {
  lesson: Extract<Lesson, { kind: "quiz" }>;
  picked: number[];
  reveal: boolean;
  saved?: QuizResult;
  onPick: (questionIndex: number, choiceIndex: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      {lesson.questions.map((question, questionIndex) => (
        <fieldset key={question.prompt} className="rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-sm font-medium text-fg">{question.prompt}</legend>
          <div className="mt-3 space-y-2">
            {question.choices.map((choice, choiceIndex) => (
              <button
                key={choice}
                type="button"
                onClick={() => onPick(questionIndex, choiceIndex)}
                className={`flex min-h-11 w-full items-center rounded-xl border px-3 text-left text-sm ${picked[questionIndex] === choiceIndex ? "border-fg text-fg" : "border-line text-fg"} ${reveal && choiceIndex === question.answer ? "text-mark" : ""}`}
              >
                {choice}
              </button>
            ))}
          </div>
          {reveal ? <p className="mt-3 text-sm text-muted">{question.why}</p> : null}
        </fieldset>
      ))}
      <button type="button" onClick={onSubmit} className="inline-flex min-h-11 items-center rounded-lg bg-fg px-5 text-sm font-medium text-surface">
        {saved ? `Score ${saved.score} of ${saved.total}${saved.passed ? " · passed" : ""} · try again` : "Check answers"}
      </button>
    </div>
  );
}

