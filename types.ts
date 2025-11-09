
export enum QuestionType {
  TRUE_FALSE = 'TRUE_FALSE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: Option[];
  correctAnswer: string | string[];
  explanation: string;
}

export type UserAnswer = string | string[];

export type UserAnswers = Record<number, UserAnswer>;
