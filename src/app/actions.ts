'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
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


export async function submitSurvey(data: unknown) {
  const parsed = surveySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Data tidak valid.',
      issues: parsed.error.issues,
    };
  }

  try {
    const docData = {
      ...parsed.data,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'surveys'), docData);
    
    // Revalidate admin path to show new data
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: 'Gagal menyimpan data ke server.' };
  }
}
