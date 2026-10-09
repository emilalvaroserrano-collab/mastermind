import type { Profession } from "@/data/professions";

export function briefFor(course: Profession, lessonId: string) {
  const apps = `${course.apps[0]} and ${course.apps[1]}`;
  if (lessonId === "01") {
    return {
      lead: `In ${course.name.toLowerCase()}, people already paste exports from ${apps} into a chat box. ${course.pain} This lesson is about naming the one task you will not leave in chat.`,
      points: [course.job, course.agent, course.worth],
    };
  }
  if (lessonId === "02") {
    return {
      lead: `The brain reads the work. The tools are ${apps}. Memory is your last approved examples. Planning is the four steps below. Do not build a second system of record.`,
      points: [...course.steps],
    };
  }
  if (lessonId === "03") {
    return {
      lead: "Keep the temperature low. Force a structured answer. Call the tool only after the fields are real. Use this as the system instruction for the first draft.",
      points: [course.prompt, `Write the result back to ${course.apps[0]} or ${course.apps[1]} only after the next lesson’s approval.`],
    };
  }
  return {
    lead: `${course.gate} ${course.risk}`,
    points: [course.worth, `The product is a layer on ${apps}, not a replacement.`],
  };
}
