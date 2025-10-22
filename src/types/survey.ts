import { type Timestamp } from 'firebase/firestore';

export type AnswerChoice = 'A' | 'B' | 'C' | 'D';

export interface Biodata {
  nama: string;
  sekolah: string;
  npsn: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    [key in AnswerChoice]: {
      text: string;
      feedback: string;
    };
  };
}

export interface PerQuestionFeedback {
  id: string;
  choice: AnswerChoice;
  feedback: string;
}

export interface FinalLevel {
  key: AnswerChoice;
  level: string;
  characteristic: string;
  recommendations: string[];
}

export interface FinalLevelResult extends FinalLevel {
  counts: Record<AnswerChoice, number>;
}

export interface SurveySubmission {
  biodata: Biodata;
  answers: AnswerChoice[];
  perQuestionFeedback: PerQuestionFeedback[];
  finalLevel: {
    key: AnswerChoice;
    level: string;
    characteristic: string;
    counts: Record<AnswerChoice, number>;
  };
  createdAt: Timestamp;
}

export interface SurveyDocument extends SurveySubmission {
  id: string;
}
