import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { useLearn } from "@/components/use-learn";
import { getCourse, studyLessons } from "@/data/school";

export function Certificate({ slug }: { slug: string }) {
  const course = getCourse(slug);
  const { state, ready, update } = useLearn();
  const study = course ? studyLessons(course) : [];
  const done = state.done[slug] ?? [];
  const missing = study.filter((lesson) => !done.includes(lesson.id));
  const passed = Boolean(state.quizzes[slug]?.passed);
  const readyCard = Boolean(course) && missing.length === 0 && passed;
  const id = state.certificates[slug];

  useEffect(() => {
    if (!ready || !readyCard || id) return;
    update((current) => {
      if (current.certificates[slug]) return current;
      return { ...current, certificates: { ...current.certificates, [slug]: crypto.randomUUID() } };
    });
  }, [ready, readyCard, id, slug, update]);

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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-8">
        <Link to="/course/$slug" params={{ slug: course.slug }} className="text-sm text-muted">
          {course.title}
        </Link>
        {readyCard ? (
          <article className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs text-muted">Completed</p>
            <h1 className="mt-3 font-serif text-3xl text-fg">{course.title}</h1>
            <p className="mt-4 text-lg text-fg">{state.name.trim() || "Name not set"}</p>
            <p className="mt-6 text-xs text-dim">Card id</p>
            <p className="mt-1 break-all font-mono text-sm text-fg">{id ?? "Saving…"}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              This id is not checked by a public registry. Add your name on the dashboard if the line above is empty.
            </p>
          </article>
        ) : (
          <>
            <h1 className="mt-4 font-serif text-3xl text-fg">Not finished yet</h1>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {missing.slice(0, 6).map((lesson) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
              {missing.length > 6 ? <li>And {missing.length - 6} more lessons.</li> : null}
              {missing.length === 0 ? null : <li>Finish those lessons first.</li>}
              {passed ? null : <li>Pass the three-question check.</li>}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
