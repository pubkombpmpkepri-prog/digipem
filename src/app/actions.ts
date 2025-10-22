
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const biodataSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  sekolah: z.string().min(1, 'Sekolah wajib diisi'),
  npsn: z.string().regex(/^[0-9]{8}$/, 'NPSN harus 8 digit angka'),
});

const answerChoiceSchema = z.enum(['A', 'B', 'C', 'D']);

const surveySchema = z.object({
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

// This action now receives a plain object and will be called from a client component
// that has access to an initialized Firestore instance.
export async function submitSurvey(data: unknown) {
  const parsed = surveySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid.',
      issues: parsed.error.issues,
    };
  }

  // We are removing the server-side Firebase Admin logic from here.
  // The client will now be responsible for getting the Firestore instance
  // and passing the data to this action is no longer needed as the client will perform the write.
  // This server action is now a placeholder and the logic will be moved to the client.
  // The actual submission will be handled client-side in survey-page.tsx.
  
  try {
    // Revalidate the admin path to reflect new data.
    // The client will perform the write, and we still want to revalidate.
    revalidatePath('/admin');
    return { success: true, data: parsed.data };

  } catch (error) {
    console.error('Error during revalidation or data processing: ', error);
     if (error instanceof Error) {
        return { success: false, error: `Gagal memvalidasi data di server: ${error.message}` };
    }
    return { success: false, error: 'Gagal memvalidasi data di server.' };
  }
}
