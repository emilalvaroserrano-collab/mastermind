import type { ReactNode } from "react";
import type { Profession } from "@/data/professions";
import type { ScreenId } from "@/data/walkthrough";

const PAPER = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&q=80";

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-sm">
      <div className="flex items-center gap-2 border-b border-line bg-bg px-3 py-2">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <p className="ml-2 truncate text-xs text-muted">{title}</p>
      </div>
      {children}
    </div>
  );
}

function MailRow({ from, subject, hot }: { from: string; subject: string; hot?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-3 ${hot ? "hot bg-bg" : ""}`}>
      <span className="size-8 shrink-0 rounded-full bg-line" />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{from}</span>
        <span className="block truncate text-xs text-muted">{subject}</span>
      </span>
    </div>
  );
}

export function SoftwareMock({ screen, course }: { screen: ScreenId; course: Profession }) {
  const app = course.apps[0];
  if (screen === "outcome") {
    return (
      <Frame title="What changes">
        <div className="grid gap-3 p-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted">Before</p>
            <img src={PAPER} alt="A paper form someone would otherwise retype" className="mt-2 h-36 w-full rounded-xl object-cover" />
            <p className="mt-2 text-xs text-muted">You retype this by hand.</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-xs text-muted">After, inside {app}</p>
            <p className="mt-3 text-sm">Draft ready</p>
            <p className="mt-1 text-xs text-muted">{course.agent}</p>
            <p className="hot mt-4 inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm text-bg">Waiting for your Approve</p>
          </div>
        </div>
      </Frame>
    );
  }

  if (screen === "gmail" || screen === "email") {
    return (
      <Frame title="mail.google.com">
        <div className="border-b border-line px-3 py-3">
          <p className="text-sm font-medium text-mark">Gmail</p>
          <p className="mt-2 rounded-full border border-line px-3 py-2 text-xs text-dim">Search mail</p>
        </div>
        <MailRow from="North Supply" subject={course.steps[0]} hot />
        <MailRow from="Team calendar" subject="Tomorrow’s meeting" />
        <MailRow from="No reply" subject="Your receipt" />
        {screen === "email" ? (
          <div className="border-t border-line p-3">
            <p className="text-sm font-medium">Please process this</p>
            <img src={PAPER} alt="The file attached to the email" className="mt-3 h-32 w-full rounded-xl object-cover" />
            <p className="mt-2 text-xs text-muted">Attachment · open this email, do not delete it</p>
          </div>
        ) : null}
      </Frame>
    );
  }

  if (screen === "account" || screen === "allow") {
    return (
      <Frame title="accounts.google.com">
        <div className="mx-auto max-w-sm p-4">
          <p className="text-sm text-mark">Google</p>
          <h3 className="mt-2 text-lg">{screen === "account" ? "Choose an account" : `${app} wants to read mail`}</h3>
          {screen === "account" ? (
            <div className="hot mt-4 flex items-center gap-3 rounded-xl border border-line px-3 py-3">
              <span className="size-8 rounded-full bg-line" />
              <span>
                <span className="block text-sm">Work</span>
                <span className="block text-xs text-muted">you@studio.com</span>
              </span>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>See the subject and the file</li>
                <li>Prepare a draft in {app}</li>
                <li>Will not send or delete mail</li>
              </ul>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm">Cancel</span>
                <span className="hot inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm text-bg">Allow</span>
              </div>
            </>
          )}
        </div>
      </Frame>
    );
  }

  if (screen === "done") {
    return (
      <Frame title={app}>
        <div className="p-4">
          <p className="text-sm text-mark">Saved</p>
          <p className="mt-2 text-lg">The draft is in {app}.</p>
          <p className="mt-2 text-sm text-muted">You pressed Approve. The mailbox stayed where it was.</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame title={app}>
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)]">
        <div className="border-r border-line p-3 text-xs text-muted">
          <p>Home</p>
          <p className="mt-3">Inbox</p>
          <p className={`mt-3 ${screen === "app" ? "hot rounded-lg px-1 py-2 text-fg" : ""}`}>Settings</p>
        </div>
        <div className="p-3">
          {screen === "app" ? (
            <>
              <p className="text-sm font-medium">{app}</p>
              <p className="mt-1 text-xs text-muted">Also used: {course.apps[1]}</p>
              <p className="mt-4 text-sm text-muted">The gear at the top right is Settings.</p>
            </>
          ) : null}
          {screen === "connect" ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
              <span>
                <span className="block text-sm">Gmail</span>
                <span className="block text-xs text-muted">Not connected yet</span>
              </span>
              <span className="hot inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm text-bg">Connect</span>
            </div>
          ) : null}
          {screen === "draft" || screen === "approve" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Draft from the email</p>
              {course.steps.slice(0, 3).map((step) => (
                <p key={step} className="rounded-lg border border-line px-3 py-2 text-xs text-muted">
                  {step}
                </p>
              ))}
              {screen === "approve" ? (
                <p className="hot mt-3 inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm text-bg">Approve</p>
              ) : (
                <p className="pt-2 text-xs text-dim">Check every line before you approve.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Frame>
  );
}
