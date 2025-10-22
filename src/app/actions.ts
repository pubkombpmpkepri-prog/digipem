
// This file is no longer a server action file.
// It is now a standard module for data validation schemas.
import { z } from 'zod';

export const biodataSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  sekolah: z.string().min(1, 'Sekolah wajib diisi'),
  npsn: z.string().regex(/^[0-9]{8}$/, 'NPSN harus 8 digit angka'),
});

export const answerChoiceSchema = z.enum(['A', 'B', 'C', 'D']);

export const surveySchema = z.object({
  biodata: biodataSchema,
  answers: z.array(answerChoiceSchema).length(5, 'Harus ada 5 jawaban'),
  perQuestionFeedback: z.array(z.object({
      id: z.string(),
      choice: answerChoiceSchema,
      feedback: z.string(),
  })).length(5),
  finalLevel: z.object({
    key: answerChoiceSchema,
    level: z.string(),
    characteristic: z.string(),
    counts: z.object({
        A: z.number(),
        B: z.number(),
        C: z.number(),
        D: z.number(),
    }),
  }),
});

// This function is no longer a Server Action and doesn't perform server-side logic.
// It's a simple data validator. The revalidation logic has been removed as it's not
// compatible with static export.
export function validateSurvey(data: unknown) {
  const parsed = surveySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid.',
      issues: parsed.error.issues,
    };
  }

  // The revalidatePath call is removed.
  // In a static site, data changes on the admin page will be visible
  // upon a fresh page load due to real-time listeners.
  return { success: true, data: parsed.data };
}
