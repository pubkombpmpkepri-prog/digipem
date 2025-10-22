
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import StepIndicator from './step-indicator';
import StepBiodata from './step-biodata';
import StepQuestions from './step-questions';
import StepSummary from './step-summary';
import { Card } from '@/components/ui/card';
import { surveyQuestions, finalLevels } from '@/lib/survey-data';
import { useToast } from '@/hooks/use-toast';
import { AnswerChoice, FinalLevelResult } from '@/types/survey';
import ThankYouMessage from './thank-you';

import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Zod schemas for validation, moved from actions.ts
const biodataSchema = z.object({
  nama: z.string().min(3, 'Nama harus diisi, minimal 3 karakter'),
  sekolah: z.string().min(3, 'Nama sekolah harus diisi'),
  npsn: z.string().regex(/^[0-9]{8}$/, 'NPSN harus terdiri dari 8 digit angka'),
});

const answerChoiceSchema = z.enum(['A', 'B', 'C', 'D']);

const surveyFormSchema = z.object({
  biodata: biodataSchema,
  answers: z.array(answerChoiceSchema).length(5, 'Semua 5 pertanyaan harus dijawab'),
});

const submissionSchema = z.object({
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


export type SurveyFormData = z.infer<typeof surveyFormSchema>;

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const methods = useForm<SurveyFormData>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      biodata: {
        nama: '',
        sekolah: '',
        npsn: '',
      },
      answers: [],
    },
    mode: 'onChange',
  });

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await methods.trigger('biodata');
    } else if (step === 2) {
      isValid = await methods.trigger('answers');
    }

    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const calculateFinalLevel = (answers: AnswerChoice[]): FinalLevelResult => {
    const counts: Record<AnswerChoice, number> = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((ans) => {
        if (ans) counts[ans]++;
    });

    if (counts.D >= 4) {
      return { ...finalLevels['D'], counts };
    }

    let majorityVote: AnswerChoice = 'A';
    let maxCount = 0;

    const priority: AnswerChoice[] = ['C', 'B', 'A'];
    
    for (const level of priority) {
        if (counts[level] >= maxCount) {
            maxCount = counts[level];
            majorityVote = level;
        }
    }
    
    if (counts.D > maxCount) {
        majorityVote = 'C';
    }


    return { ...finalLevels[majorityVote], counts };
  };
  
  // Client-side validation function
  function validateSurvey(data: unknown) {
    const parsed = submissionSchema.safeParse(data);
    if (!parsed.success) {
        return {
        success: false,
        error: 'Data tidak valid.',
        issues: parsed.error.issues,
        };
    }
    return { success: true, data: parsed.data };
  }


  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: 'Gagal Mengirim',
            description: 'Koneksi ke server bermasalah. Mohon coba lagi.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const formData = methods.getValues();
        const finalLevel = calculateFinalLevel(formData.answers);
        const perQuestionFeedback = formData.answers.map((choice, index) => {
            const question = surveyQuestions[index];
            return {
                id: question.id,
                choice,
                feedback: question.options[choice].feedback
            }
        });

        const submissionData = {
            biodata: formData.biodata,
            answers: formData.answers,
            perQuestionFeedback,
            finalLevel: {
                key: finalLevel.key,
                level: finalLevel.level,
                characteristic: finalLevel.characteristic,
                counts: finalLevel.counts,
            },
            createdAt: serverTimestamp(),
        };

        // Validate data before submitting
        const validation = validateSurvey(submissionData);
        if (!validation.success) {
            toast({
                variant: 'destructive',
                title: 'Data Tidak Valid',
                description: validation.error,
            });
            setIsSubmitting(false);
            return;
        }


        const surveysColRef = collection(firestore, 'surveys');
        
        addDoc(surveysColRef, submissionData)
          .then(() => {
            toast({
                title: 'Survei Terkirim!',
                description: 'Terima kasih atas partisipasi Anda.',
            });
            setIsSubmitted(true);
            setIsSubmitting(false);
          })
          .catch((serverError) => {
              const permissionError = new FirestorePermissionError({
                path: surveysColRef.path,
                operation: 'create',
                requestResourceData: submissionData,
              });
              errorEmitter.emit('permission-error', permissionError);
              
              toast({
                  variant: 'destructive',
                  title: 'Gagal Mengirim',
                  description: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
              });
              setIsSubmitting(false);
          });

    } catch (error) {
        console.error('Error during submission preparation: ', error);
        toast({
            variant: 'destructive',
            title: 'Gagal Mengirim',
            description: 'Terjadi kesalahan sebelum menyimpan data. Silakan coba lagi.',
        });
        setIsSubmitting(false);
    }
  };
  
  if(isSubmitted) {
    return <ThankYouMessage />;
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        <StepIndicator currentStep={step} />

        <form>
          {step === 1 && <StepBiodata />}
          {step === 2 && <StepQuestions />}
          {step === 3 && (
            <StepSummary
              answers={methods.getValues('answers')}
              calculateFinalLevel={calculateFinalLevel}
            />
          )}
        </form>

        <Card className="mt-8 bg-secondary/50 p-4">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-opacity ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
              disabled={step === 1}
            >
              Kembali
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Berikutnya
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-semibold rounded-md bg-accent text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Survei'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </FormProvider>
  );
}
