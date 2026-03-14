import { QuizQuestion } from "../types";

export function shuffleQuestions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function computeQuestionOfDay(questions: QuizQuestion[]): QuizQuestion {
  const now = new Date();
  const daySeed =
    now.getUTCFullYear() * 1000 +
    (now.getUTCMonth() + 1) * 50 +
    now.getUTCDate();
  const index = daySeed % questions.length;
  return questions[index];
}

export function getTimerForQuestion(question: QuizQuestion): number {
  return question.timerSeconds ?? 0;
}
