'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { revalidatePath } from 'next/cache';

// Function to get the initialized Firebase Admin app
function getAdminApp(): App {
    const appName = 'admin-server-actions';
    const existingApp = getApps().find(app => app?.name === appName);
    if (existingApp) {
        return existingApp;
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;

    if (!serviceAccount) {
        throw new Error('Firebase service account credentials are not set in environment variables.');
    }

    return initializeApp({
        credential: cert(serviceAccount),
    }, appName);
}

// Function to get the Firestore instance
function getAdminDb(): Firestore {
    return getFirestore(getAdminApp());
}


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
    const db = getAdminDb();
    const docData = {
      ...parsed.data,
      createdAt: serverTimestamp(),
    };
    // Note: Firestore Admin SDK is used here, so client-side non-blocking logic doesn't apply
    await addDoc(collection(db, 'surveys'), docData);
    
    // Revalidate admin path to show new data
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding document: ', error);
    // Check if the error is a known type to provide a more specific message
    if (error instanceof Error) {
        return { success: false, error: `Gagal menyimpan data ke server: ${error.message}` };
    }
    return { success: false, error: 'Gagal menyimpan data ke server.' };
  }
}
