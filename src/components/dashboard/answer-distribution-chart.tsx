'use client';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { AnswerChoice } from '@/types/survey';

const chartConfig = {
  A: { label: 'A', color: 'hsl(var(--chart-5))' },
  B: { label: 'B', color: 'hsl(var(--chart-4))' },
  C: { label: 'C', color: 'hsl(var(--chart-2))' },
  D: { label: 'D', color: 'hsl(var(--chart-1))' },
};

interface AnswerDistributionChartProps {
    answerCounts: { question: string, A: number, B: number, C: number, D: number }[];
}

export default function AnswerDistributionChart({ answerCounts }: AnswerDistributionChartProps) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="font-headline">Distribusi Jawaban per Pertanyaan</CardTitle>
        <CardDescription>
            Menunjukkan sebaran pilihan jawaban untuk setiap pertanyaan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={answerCounts}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="question"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {(Object.keys(chartConfig) as AnswerChoice[]).map((key) => (
                <Bar key={key} dataKey={key} stackId="a" fill={chartConfig[key].color} radius={5} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
