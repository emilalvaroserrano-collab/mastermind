import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { briefFor } from "@/data/briefs";
import { lessonDuration, lessons } from "@/data/curriculum";
import { getProfession } from "@/data/professions";
import { formatClock } from "@/data/session";
import { isDone, markDone, readProgress, writeProgress } from "@/lib/progress";

export function LessonPage({ slug, lessonId }: { slug: string; lessonId: string }) {
  const course = getProfession(slug);
  const lesson = lessons.find((item) => item.id === lessonId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!course || !lesson) return;
    setComplete(isDone(readProgress(), course.slug, lesson.id));
  }, [course, lesson]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !lesson) return;
    const jump = () => {
      if (video.currentTime < lesson.start || video.currentTime >= lesson.end - 0.2) {
        video.currentTime = lesson.start;
      }
    };
    if (video.readyState >= 1) jump();
    video.addEventListener("loadedmetadata", jump);
    return () => video.removeEventListener("loadedmetadata", jump);
  }, [lesson]);

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

  const index = lessons.findIndex((item) => item.id === lesson.id);
  const next = lessons[index + 1];
  const brief = briefFor(course, lesson.id);

  function finish() {
    const nextMap = markDone(readProgress(), course!.slug, lesson!.id);
    writeProgress(nextMap);
    setComplete(true);
  }

  function onTime() {
    const video = videoRef.current;
    if (!video || !lesson) return;
    if (video.currentTime >= lesson.end - 0.3) {
      video.pause();
      finish();
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-8">
        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-fg">
            <video
              key={lesson.id}
              ref={videoRef}
              className="aspect-video w-full"
              controls
              playsInline
              preload="metadata"
              poster="/media/poster.png"
              src="/media/AI-Agents-Masterclass.mp4"
              onTimeUpdate={onTime}
            />
          </div>

          <p className="mt-4 text-xs font-medium tabular-nums text-mark">
            Lesson {index + 1} of {lessons.length} · {formatClock(lessonDuration(lesson))}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-balance text-fg">{lesson.title}</h1>
          <p className="mt-3 text-base leading-relaxed text-pretty text-muted">{brief.lead}</p>
          <ul className="mt-4 space-y-2">
            {brief.points.map((point) => (
              <li key={point} className="rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-fg">
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={finish}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-medium text-bg"
            >
              {complete ? "Completed" : "Mark complete"}
            </button>
            {next ? (
              <Link
                to="/course/$slug/lesson/$lessonId"
                params={{ slug: course.slug, lessonId: next.id }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm text-fg"
              >
                Next lesson
              </Link>
            ) : (
              <Link
                to="/course/$slug"
                params={{ slug: course.slug }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm text-fg"
              >
                Back to course
              </Link>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="text-sm font-medium text-fg">In this course</h2>
          <ol className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
            {lessons.map((item, itemIndex) => {
              const on = item.id === lesson.id;
              return (
                <li key={item.id} className={on ? "bg-bg" : undefined}>
                  <Link
                    to="/course/$slug/lesson/$lessonId"
                    params={{ slug: course.slug, lessonId: item.id }}
                    className="flex min-h-14 items-start gap-3 px-3 py-3"
                  >
                    <span className={`w-6 shrink-0 text-sm tabular-nums ${on ? "text-mark" : "text-dim"}`}>{itemIndex + 1}</span>
                    <span className={`text-sm leading-snug ${on ? "text-fg" : "text-muted"}`}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
      </main>
    </>
  );
}
