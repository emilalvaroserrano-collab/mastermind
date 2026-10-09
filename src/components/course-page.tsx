import { Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { useLearn } from "@/components/use-learn";
import { getCourse, studyLessons } from "@/data/school";

export function CoursePage({ slug }: { slug: string }) {
  const course = getCourse(slug);
  const { state, update } = useLearn();
  const navigate = useNavigate();

  if (!course) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-muted">That course is not on the list.</p>
        </main>
      </>
    );
  }

  const study = studyLessons(course);
  const done = state.done[course.slug] ?? [];
  const next = study.find((lesson) => !done.includes(lesson.id)) ?? study[0];
  const enrolled = state.enrolled.includes(course.slug);

  function start() {
    update((current) => ({
      ...current,
      enrolled: current.enrolled.includes(course!.slug) ? current.enrolled : [...current.enrolled, course!.slug],
    }));
    void navigate({ to: "/course/$slug/lesson/$lessonId", params: { slug: course!.slug, lessonId: next.id } });
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-10">
        <div>
          <Link to="/" className="text-sm text-muted">
            All courses
          </Link>
          <p className="mt-6 text-xs text-muted">{course.category}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-balance text-fg">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted">{course.summary}</p>
          {course.apps ? (
            <p className="mt-3 text-sm text-fg">
              {course.apps[0]} and {course.apps[1]}
            </p>
          ) : null}
          <button type="button" onClick={start} className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-fg px-5 text-sm font-medium text-surface lg:hidden">
            {enrolled ? "Continue" : "Start course"}
          </button>

          <section className="mt-8 rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-base font-semibold text-fg">What you'll learn</h2>
            <ul className="mt-3 space-y-2">
              {course.objectives.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
            <h2 className="border-b border-line px-4 py-3 text-base font-semibold text-fg">Course content</h2>
            {course.modules.map((module) => (
              <div key={module.id}>
                <h3 className="border-t border-line bg-bg px-4 py-3 text-sm font-medium text-fg">
                  {module.title}
                  <span className="ml-2 font-normal text-dim">{module.lessons.length} lessons</span>
                </h3>
                <ol>
                  {module.lessons.map((lesson) => {
                    const complete = done.includes(lesson.id) || (lesson.kind === "quiz" && state.quizzes[course.slug]?.passed);
                    return (
                      <li key={lesson.id} className="border-t border-line">
                        <Link
                          to="/course/$slug/lesson/$lessonId"
                          params={{ slug: course.slug, lessonId: lesson.id }}
                          className="flex min-h-12 items-center gap-3 px-4 py-3 text-sm text-fg"
                        >
                          <Check on={complete} />
                          <span className="min-w-0 flex-1">{lesson.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>

          {course.resources.length > 0 ? (
            <p className="mt-6 text-sm text-muted">
              {course.resources.map((resource, index) => (
                <span key={resource.href}>
                  {index > 0 ? " · " : null}
                  <a className="text-mark" href={resource.href} download>
                    {resource.label}
                  </a>
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-muted">{study.length} lessons</p>
            <button type="button" onClick={start} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-fg text-sm font-medium text-surface">
              {enrolled ? "Continue" : "Start course"}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-dim">Free on this device. Payments are not connected.</p>
          </div>
        </aside>
      </main>
    </>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${on ? "border-done bg-done text-check" : "border-line bg-surface"}`}>
      {on ? (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M2 6.2 4.6 9 10 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : null}
    </span>
  );
}
