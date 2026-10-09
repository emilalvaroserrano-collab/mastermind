import type { ScreenId } from "@/data/walkthrough";
import { guideFor } from "@/data/walkthrough";
import { lessons as videoLessons } from "@/data/curriculum";
import { professions, type Profession } from "@/data/professions";

export type Question = { prompt: string; choices: string[]; answer: number; why: string };

export type Lesson =
  | { id: string; kind: "video"; title: string; start: number; end: number; say: string }
  | { id: string; kind: "picture"; title: string; screen: ScreenId; say: string; doThis: string }
  | { id: string; kind: "text"; title: string; say: string; points: string[]; diagram?: boolean }
  | { id: string; kind: "quiz"; title: string; questions: Question[] };

export type Module = { id: string; title: string; lessons: Lesson[] };

export type Course = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  objectives: string[];
  apps?: [string, string];
  profession?: Profession;
  resources: { label: string; href: string }[];
  modules: Module[];
};

const foundationQuiz: Question[] = [
  {
    prompt: "What is still true after the model drafts the work?",
    choices: ["The software updates itself", "A person presses Approve", "The chat box is the system of record"],
    answer: 1,
    why: "The draft waits. Approve is the save.",
  },
  {
    prompt: "Why give the model a tool?",
    choices: ["So it can sound more human", "So it can read or write the software you already use", "So it can replace the password"],
    answer: 1,
    why: "A tool is the hand. The software stays the record.",
  },
  {
    prompt: "Where should a customer's password live?",
    choices: ["In the lesson notes", "In your own account settings", "In the chat"],
    answer: 1,
    why: "Shared course files never hold secrets.",
  },
];

const toolQuiz: Question[] = [
  {
    prompt: "What starts a workflow?",
    choices: ["A trigger, such as a new email", "The final Approve button", "A certificate"],
    answer: 0,
    why: "Something arrives. Then the steps run.",
  },
  {
    prompt: "How do n8n, Make, and Zapier differ for this class?",
    choices: ["Only one of them can read email", "The clicks differ. The shape is the same", "They replace your accounting software"],
    answer: 1,
    why: "Trigger, steps, then a person. The product is the place you click.",
  },
  {
    prompt: "Where do you paste an API key?",
    choices: ["Into a shared download", "Into your own tool account", "Into a quiz answer"],
    answer: 1,
    why: "Keys stay in the account that owns them.",
  },
];

const foundations: Course = {
  slug: "ai-agents",
  title: "AI agents, from the recording",
  category: "Foundations",
  summary: "Four parts of the masterclass. Each part is longer than fifteen minutes. You watch, then you answer three questions.",
  objectives: [
    "Tell a chatbot apart from a tool that can touch software",
    "Name the moment a person still has to approve",
    "Keep passwords out of the lesson",
  ],
  resources: [
    { label: "Download the video", href: "/media/AI-Agents-Masterclass.mp4" },
    { label: "Download the audio", href: "/media/AI-Agents-Masterclass.mp3" },
  ],
  modules: [
    {
      id: "watch",
      title: "Watch",
      lessons: [
        { id: "01", kind: "video", title: videoLessons[0].title, start: videoLessons[0].start, end: videoLessons[0].end, say: "The work dies in the chat box when nobody updates the software. Watch this part before you connect anything." },
        { id: "02", kind: "video", title: videoLessons[1].title, start: videoLessons[1].start, end: videoLessons[1].end, say: "Tools are how the model reads and writes the program you already pay for." },
        { id: "03", kind: "video", title: videoLessons[2].title, start: videoLessons[2].start, end: videoLessons[2].end, say: "Ask for fields, not a paragraph. Then call the tool." },
        { id: "04", kind: "video", title: videoLessons[3].title, start: videoLessons[3].start, end: videoLessons[3].end, say: "A teammate still waits for you. Closing the page is not an approval." },
      ],
    },
    { id: "check", title: "Check", lessons: [{ id: "quiz", kind: "quiz", title: "Three questions", questions: foundationQuiz }] },
  ],
};

const tools: Course = {
  slug: "workflow-tools",
  title: "n8n, Make, and Zapier",
  category: "Tools",
  summary: "The same workflow in three products. You do not install them in this lesson. You learn the shape, then where a key is allowed to live.",
  objectives: [
    "Point at the trigger, the steps, and the human check",
    "See why the product name is not the design",
    "Refuse to put a secret in a shared file",
  ],
  resources: [],
  modules: [
    {
      id: "shape",
      title: "The shape",
      lessons: [
        {
          id: "trigger",
          kind: "text",
          title: "Something has to arrive",
          diagram: true,
          say: "A workflow does not start because you opened a chat. It starts because something happened: a new email, a new row, a paid invoice.",
          points: ["The trigger is the event", "The steps are boring on purpose", "Approve is still a person"],
        },
        {
          id: "three",
          kind: "text",
          title: "Three products, one picture",
          say: "n8n, Make, and Zapier host that picture. n8n can sit on your own server. Make and Zapier are sites you log into. The lesson is the same in each.",
          points: ["Pick the one your team will actually open", "Do not rebuild your accounting software inside it", "Connect the tool you already use"],
        },
        {
          id: "keys",
          kind: "text",
          title: "Keys stay in your account",
          say: "A key is a password for software. This course will never ask you to paste one into a comment, a quiz, or a shared download.",
          points: ["Create the key in the tool’s own settings", "If a lesson file contains a key, delete it", "Turn a key off when a person leaves"],
        },
      ],
    },
    { id: "check", title: "Check", lessons: [{ id: "quiz", kind: "quiz", title: "Three questions", questions: toolQuiz }] },
  ],
};

function fieldCourse(profession: Profession): Course {
  const steps = guideFor(profession);
  const connect = steps.filter((step) => ["open-gmail", "open-mail", "account", "allow"].includes(step.id));
  const save = steps.filter((step) => ["open-app", "connect", "draft", "approve", "done"].includes(step.id));
  const toPicture = (step: (typeof steps)[number]): Lesson => ({
    id: step.id,
    kind: "picture",
    title: step.title,
    screen: step.screen,
    say: step.say,
    doThis: step.doThis,
  });
  return {
    slug: profession.slug,
    title: profession.name,
    category: profession.field,
    summary: profession.job,
    apps: profession.apps,
    profession,
    objectives: [
      `Say what will be waiting inside ${profession.apps[0]}`,
      "Connect Gmail without skipping the Allow screen",
      "Approve a draft only after you have read it",
    ],
    resources: [],
    modules: [
      { id: "goal", title: "Before you click", lessons: [toPicture(steps[0])] },
      { id: "gmail", title: "Connect Gmail", lessons: connect.map(toPicture) },
      { id: "save", title: `Save it in ${profession.apps[0]}`, lessons: save.map(toPicture) },
      {
        id: "check",
        title: "Check",
        lessons: [
          {
            id: "quiz",
            kind: "quiz",
            title: "Three questions",
            questions: [
              {
                prompt: "Which program do you open after Gmail?",
                choices: [profession.apps[0], "A blank spreadsheet", "A new email to yourself"],
                answer: 0,
                why: `${profession.apps[0]} already holds this work. ${profession.apps[1]} is the other system people in this job use.`,
              },
              {
                prompt: "When is the draft saved?",
                choices: ["When the email arrives", "When you press Approve", "When you close the tab"],
                answer: 1,
                why: profession.gate,
              },
              {
                prompt: "What must not happen by itself?",
                choices: [profession.gate, "Reading the email you opened", "Showing you the draft"],
                answer: 0,
                why: profession.risk,
              },
            ],
          },
        ],
      },
    ],
  };
}

export const courses: Course[] = [foundations, tools, ...professions.map(fieldCourse)];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function allLessons(course: Course) {
  return course.modules.flatMap((module) => module.lessons);
}

export function studyLessons(course: Course) {
  return allLessons(course).filter((lesson) => lesson.kind !== "quiz");
}

export function findLesson(course: Course, lessonId: string) {
  return allLessons(course).find((lesson) => lesson.id === lessonId);
}
