# AI Automation Learning Platform

The preview app stays on TanStack Start, React, and Tailwind. This environment cannot run a second Next.js app, an Expo build, Supabase, Mux, or Stripe. Those items stay open until credentials and a host exist.

## Done in this preview

- [x] Course catalog with search, category, and the 50 profession paths
- [x] Curriculum shape: course, module, lesson
- [x] Lesson types: video segment, picture walkthrough, text, quiz
- [x] Course page with objectives and curriculum
- [x] Lesson player: next and previous, notes, bookmarks
- [x] Video resume inside a lesson, without treating a seek-to-the-end as completion
- [x] Quiz with a retake and a recorded score
- [x] Dashboard: continue, progress, bookmarks
- [x] Completion card with an id stored on this device
- [x] Free enrollment on this device

## Not done — needs services this sandbox does not have

- [x] Google and email sign-in through Firebase Auth
- [x] Course progress saved in Firebase Realtime Database under the signed-in user
- [ ] Email verification, password recovery, and role-based instructor access
- [ ] Server authorization and row-level security
- [ ] Instructor publishing, drafts, reorder, archive
- [ ] Postgres, migrations, and multi-device sync
- [ ] Mux or Cloudflare Stream, signed playback, captions pipeline
- [ ] Stripe or Philippine payments, webhooks, refunds
- [ ] Email notifications
- [ ] React Native / Expo apps, push, deep links
- [ ] Public certificate registry
- [ ] AI tutor grounded in transcripts
- [ ] Admin revenue, audit log, CI/CD, production monitoring

## Acceptance for this slice

A guest can open a course, enroll on this device, play a lesson, pass a quiz, and see a completion id. Refresh keeps the progress. A seek to the end of a video does not mark the lesson complete.
