'use client';

import type { SurveyDocument, AnswerChoice } from '@/types/survey';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryCards from './summary-cards';
import LevelDistributionChart from './level-distribution-chart';
import AnswerDistributionChart from './answer-distribution-chart';
import { SurveysDataTable } from './surveys-data-table';
import { columns } from './columns';
import { useMemo } from 'react';

interface DashboardClientProps {
  surveys: SurveyDocument[];
}

export default function DashboardClient({ surveys }: DashboardClientProps) {

  const analysisData = useMemo(() => {
    const totalResponses = surveys.length;
    if(totalResponses === 0) {
        return {
            totalResponses: 0,
            ratioD: 0,
            ratioA: 0,
            levelCounts: { A: 0, B: 0, C: 0, D: 0 },
            questionAnswerCounts: []
        }
    }

    const levelCounts: Record<AnswerChoice, number> = { A: 0, B: 0, C: 0, D: 0 };
    surveys.forEach((survey) => {
      levelCounts[survey.finalLevel.key]++;
    });

    const ratioD = (levelCounts.D / totalResponses) * 100;
    const ratioA = (levelCounts.A / totalResponses) * 100;

    const questionAnswerCounts = Array.from({ length: 5 }, (_, i) => ({
      question: `Q${i + 1}`,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    }));

    surveys.forEach((survey) => {
      survey.answers.forEach((answer, index) => {
        if (questionAnswerCounts[index]) {
          questionAnswerCounts[index][answer]++;
        }
      });
    });

    return {
        totalResponses,
        ratioD,
        ratioA,
        levelCounts,
        questionAnswerCounts
    }
  }, [surveys]);


  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Ringkasan</TabsTrigger>
        <TabsTrigger value="raw-data">Data Mentah</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <SummaryCards 
            totalResponses={analysisData.totalResponses}
            ratioOptimal={analysisData.ratioD}
            ratioDasar={analysisData.ratioA}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <LevelDistributionChart levelCounts={analysisData.levelCounts} />
          <AnswerDistributionChart answerCounts={analysisData.questionAnswerCounts}/>
        </div>
      </TabsContent>
      <TabsContent value="raw-data" className="space-y-4">
        <SurveysDataTable columns={columns} data={surveys} />
      </TabsContent>
    </Tabs>
  );
}
