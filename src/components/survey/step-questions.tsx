'use client';

import { useFormContext } from 'react-hook-form';
import { surveyQuestions } from '@/lib/survey-data';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, HelpCircle } from 'lucide-react';
import { SurveyFormData } from './survey-page';

export default function StepQuestions() {
  const { control, watch } = useFormContext<SurveyFormData>();
  const answers = watch('answers');

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                <HelpCircle />
                Langkah 2: Pertanyaan Survei
            </CardTitle>
            <CardDescription>Pilih salah satu opsi yang paling sesuai dengan kondisi di sekolah Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
        {surveyQuestions.map((q, index) => {
            const selectedChoice = answers[index];
            const selectedOption = selectedChoice ? q.options[selectedChoice] : null;

            return (
            <div key={q.id}>
                <FormField
                control={control}
                name={`answers.${index}`}
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-md font-bold text-foreground">
                        {index + 1}. {q.text}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                        >
                        {Object.entries(q.options).map(([key, option]) => (
                            <FormItem
                            key={key}
                            className="flex items-center space-x-3 space-y-0"
                            >
                            <FormControl>
                                <RadioGroupItem value={key} />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {option.text}
                            </FormLabel>
                            </FormItem>
                        ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {selectedOption && (
                <Alert className="mt-4 bg-accent/20 border-accent/50">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <AlertTitle className="font-semibold text-accent/90">Rekomendasi Langsung</AlertTitle>
                    <AlertDescription>
                        {selectedOption.feedback}
                    </AlertDescription>
                </Alert>
                )}
            </div>
            );
        })}
        </CardContent>
    </Card>
  );
}
