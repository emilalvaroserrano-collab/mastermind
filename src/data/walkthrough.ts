import type { Profession } from "@/data/professions";

export type ScreenId =
  | "outcome"
  | "gmail"
  | "email"
  | "account"
  | "allow"
  | "app"
  | "connect"
  | "draft"
  | "approve"
  | "done";

export type GuideStep = {
  id: string;
  screen: ScreenId;
  eyebrow: string;
  title: string;
  say: string;
  doThis: string;
};

export function guideFor(course: Profession): GuideStep[] {
  const app = course.apps[0];
  const other = course.apps[1];
  return [
    {
      id: "goal",
      screen: "outcome",
      eyebrow: "Read this first",
      title: "What you will be able to do",
      say: `You do not need to know how to connect email. We will do that together. When you finish, a message that arrives in Gmail becomes a draft inside ${app}. You still look at it. Nothing is saved until you press Approve.`,
      doThis: `${course.worth} ${course.gate}`,
    },
    {
      id: "open-gmail",
      screen: "gmail",
      eyebrow: "Step 1 · Gmail",
      title: "Open Gmail",
      say: "Gmail is the mailbox from Google. On a computer, open the Chrome browser. In the address bar at the very top, type gmail.com and press Enter.",
      doThis: "You should see a list of emails, like the picture. If Google asks you to sign in, type the email and password you already use for work.",
    },
    {
      id: "open-mail",
      screen: "email",
      eyebrow: "Step 2 · The message",
      title: "Open the email that has the work",
      say: `This is the message ${app} will read. It might be a bill, a form, or a note from a customer. You only need one real example to learn the path.`,
      doThis: "Click that email once. It opens on the right, or on the next screen. Do not delete it.",
    },
    {
      id: "account",
      screen: "account",
      eyebrow: "Step 3 · Your Google account",
      title: "Choose the Google account you work with",
      say: `A small window asks which Google account to use. This is normal the first time. It is how ${app} is allowed to see the mailbox. It is not a new password.`,
      doThis: "Click the work account. If you only have one account, there will be only one row. Click it.",
    },
    {
      id: "allow",
      screen: "allow",
      eyebrow: "Step 4 · Allow",
      title: "Press Allow",
      say: `${app} is asking to read mail so it can prepare a draft. It should not send mail, delete mail, or change your password. If you see those words, press Cancel and stop.`,
      doThis: "Press the Allow button. The window will close by itself. That means the connection worked.",
    },
    {
      id: "open-app",
      screen: "app",
      eyebrow: "Step 5 · Your software",
      title: `Open ${app}`,
      say: `Leave Gmail open. Now open the program you already pay for. If you also use ${other}, start with ${app}. Same clicks, different name.`,
      doThis: "Look at the top right for a gear, or the word Settings. The picture marks the spot.",
    },
    {
      id: "connect",
      screen: "connect",
      eyebrow: "Step 6 · Connect",
      title: "Connect email inside the software",
      say: "Settings is where this program keeps outside connections. You are telling it which mailbox to watch. You are not moving your old records.",
      doThis: "Click Connect next to Gmail. If it asks again, choose the same Google account and press Allow.",
    },
    {
      id: "draft",
      screen: "draft",
      eyebrow: "Step 7 · Check the draft",
      title: "Read what it prepared",
      say: `${course.agent} The fields on the screen came from the email. If a line is wrong or blank, type the right one. Do not trust a blank.`,
      doThis: course.prompt,
    },
    {
      id: "approve",
      screen: "approve",
      eyebrow: "Step 8 · You decide",
      title: "Press Approve only if it is right",
      say: `${course.gate} ${course.risk}`,
      doThis: "Press Approve to save it in the software. Press Back to fix a line first. Closing the page does not save it.",
    },
    {
      id: "done",
      screen: "done",
      eyebrow: "You finished the path",
      title: "This is the result",
      say: `A new email can now become a draft in ${app}. You still approve every one. That is the whole job. Next time, start at the email. The connection is already on.`,
      doThis: course.worth,
    },
  ];
}
