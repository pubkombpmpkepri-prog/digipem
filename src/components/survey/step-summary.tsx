'use client';

import { AnswerChoice, FinalLevelResult } from '@/types/survey';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, CheckCircle, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepSummaryProps {
  answers: AnswerChoice[];
  calculateFinalLevel: (answers: AnswerChoice[]) => FinalLevelResult;
}

const levelColors = {
  A: 'bg-red-500',
  B: 'bg-yellow-500',
  C: 'bg-blue-500',
  D: 'bg-green-500',
};

const levelTextColors = {
  A: 'text-red-500',
  B: 'text-yellow-500',
  C: 'text-blue-500',
  D: 'text-green-500',
}

export default function StepSummary({ answers, calculateFinalLevel }: StepSummaryProps) {
  const finalLevelResult = calculateFinalLevel(answers);

  const getBadgeVariant = (key: AnswerChoice) => {
    switch (key) {
        case 'D': return 'default';
        case 'C': return 'secondary';
        case 'B': return 'outline';
        case 'A': return 'destructive';
        default: return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
            <CheckCircle />
            Simpulan Akhir
        </CardTitle>
        <CardDescription>
          Berikut adalah hasil analisis otomatis berdasarkan jawaban Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Tingkat Kesiapan Digital Anda</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
             <Badge variant={getBadgeVariant(finalLevelResult.key)} className="px-6 py-2 text-2xl font-bold">
              {finalLevelResult.key}
            </Badge>
            <h3 className={cn("text-3xl font-bold font-headline", levelTextColors[finalLevelResult.key])}>{finalLevelResult.level}</h3>
            <p className="text-muted-foreground">{finalLevelResult.characteristic}</p>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
            <h4 className="font-semibold text-lg flex items-center gap-2"><BarChart className="text-primary"/> Ringkasan Jawaban</h4>
            <div className="flex justify-around rounded-lg bg-muted p-4">
                {Object.entries(finalLevelResult.counts).map(([key, value]) => (
                    <div key={key} className="text-center">
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="font-mono text-sm font-semibold text-muted-foreground">Level {key}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-lg flex items-center gap-2"><ListChecks className="text-primary"/> Rekomendasi Utama</h4>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            {finalLevelResult.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>Klik 'Kirim Survei' di bawah untuk menyimpan hasil Anda.</p>
        </div>
      </CardContent>
    </Card>
  );
}
