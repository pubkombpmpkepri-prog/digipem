
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
import { submitSurvey } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AnswerChoice, FinalLevelResult } from '@/types/survey';
import ThankYouMessage from './thank-you';

import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const biodataSchema = z.object({
  nama: z.string().min(3, 'Nama harus diisi, minimal 3 karakter'),
  sekolah: z.string().min(3, 'Nama sekolah harus diisi'),
  npsn: z.string().regex(/^[0-9]{8}$/, 'NPSN harus terdiri dari 8 digit angka'),
});

const formSchema = z.object({
  biodata: biodataSchema,
  answers: z.array(z.enum(['A', 'B', 'C', 'D'])).length(5, 'Semua 5 pertanyaan harus dijawab'),
});

export type SurveyFormData = z.infer<typeof formSchema>;

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const methods = useForm<SurveyFormData>({
    resolver: zodResolver(formSchema),
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

    // New rule: If there are 4 or more 'D' answers, the level is Optimal.
    if (counts.D >= 4) {
      return { ...finalLevels['D'], counts };
    }

    // If not, fall back to the previous logic but exclude 'D' since it didn't meet the threshold.
    let majorityVote: AnswerChoice = 'A';
    let maxCount = 0;

    // We check C, B, A. If 'D' was the majority but less than 4, it will fall to the next highest.
    const priority: AnswerChoice[] = ['C', 'B', 'A'];
    
    // First, find the max count among C, B, A
    for (const level of priority) {
        if (counts[level] > maxCount) {
            maxCount = counts[level];
            majorityVote = level;
        }
    }
    
    // If D has more votes than C, B, A, but less than 4, it defaults to C (Lanjut)
    if (counts.D > maxCount) {
        majorityVote = 'C';
    }


    return { ...finalLevels[majorityVote], counts };
  };

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

        const surveysColRef = collection(firestore, 'surveys');
        
        addDoc(surveysColRef, submissionData)
          .then(async () => {
            await submitSurvey(submissionData);

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
              
              // Also show a toast to the user
              toast({
                  variant: 'destructive',
                  title: 'Gagal Mengirim',
                  description: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
              });
              setIsSubmitting(false);
          });

    } catch (error) {
        // This will catch errors from data preparation
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
