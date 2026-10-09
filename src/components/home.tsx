import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useLearn } from "@/components/use-learn";
import { fields } from "@/data/professions";
import { courses, studyLessons, type Course } from "@/data/school";

const filters = ["All", "Foundations", "Tools", ...fields.filter((field) => field !== "All")];

export function Home() {
  const { state } = useLearn();
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (field !== "All" && course.category !== field) return false;
      if (!q) return true;
      return `${course.title} ${course.category} ${course.apps?.join(" ") ?? ""}`.toLowerCase().includes(q);
    });
  }, [query, field]);

  const continueCourse = courses.find((course) => {
    if (!state.enrolled.includes(course.slug)) return false;
    const done = state.done[course.slug] ?? [];
    return studyLessons(course).some((lesson) => !done.includes(lesson.id));
  });
  const nextLesson = continueCourse
    ? studyLessons(continueCourse).find((lesson) => !(state.done[continueCourse.slug] ?? []).includes(lesson.id))
    : undefined;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="max-w-xl font-serif text-4xl leading-tight text-balance text-fg">Courses</h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-pretty text-muted">
          Follow the pictures for your profession. Sign in and the place you left is kept on your account.
        </p>

        {continueCourse && nextLesson ? (
          <Link
            to="/course/$slug/lesson/$lessonId"
            params={{ slug: continueCourse.slug, lessonId: nextLesson.id }}
            className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5"
          >
            <span>
              <p className="text-xs text-muted">Continue</p>
              <p className="mt-1 font-serif text-2xl leading-tight text-fg">{continueCourse.title}</p>
              <p className="mt-1 text-sm text-muted">{nextLesson.title}</p>
            </span>
            <span className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-fg px-4 text-sm font-medium text-surface">Continue</span>
          </Link>
        ) : null}

        <label className="mt-8 block">
          <span className="sr-only">Search courses</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a profession or app"
            suppressHydrationWarning
            className="min-h-11 w-full rounded-xl border border-line bg-surface px-4 text-base text-fg outline-none"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setField(item)}
              className={`min-h-11 shrink-0 border-b-2 px-2 text-sm ${item === field ? "border-fg text-fg" : "border-transparent text-muted"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm tabular-nums text-dim">{shown.length} courses</p>
        {shown.length === 0 ? (
          <p className="mt-8 text-muted">Nothing matches that search.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((course) => {
              const study = studyLessons(course);
              const finished = (state.done[course.slug] ?? []).filter((id) => study.some((lesson) => lesson.id === id)).length;
              return (
                <li key={course.slug}>
                  <CourseCard course={course} finished={finished} total={study.length} />
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}

function CourseCard({ course, finished, total }: { course: Course; finished: number; total: number }) {
  return (
    <Link to="/course/$slug" params={{ slug: course.slug }} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4">
      <p className="text-xs text-muted">{course.category}</p>
      <h2 className="mt-2 font-serif text-2xl leading-snug text-balance text-fg">{course.title}</h2>
      <p className="mt-2 text-sm text-muted">{course.apps ? `${course.apps[0]} · ${course.apps[1]}` : `${total} lessons`}</p>
      <p className="mt-auto pt-6 text-sm tabular-nums text-dim">{finished > 0 ? `${finished} of ${total}` : `${total} lessons`}</p>
      <span className="mt-2 block h-px overflow-hidden bg-line">
        <span className="block h-full bg-fg" style={{ width: `${total ? (finished / total) * 100 : 0}%` }} />
      </span>
    </Link>
  );
}

