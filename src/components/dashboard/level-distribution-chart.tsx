'use client';
import { Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { AnswerChoice } from '@/types/survey';

const chartConfig = {
  A: { label: 'Dasar (A)', color: 'hsl(var(--chart-5))' },
  B: { label: 'Menengah (B)', color: 'hsl(var(--chart-4))' },
  C: { label: 'Lanjut (C)', color: 'hsl(var(--chart-2))' },
  D: { label: 'Optimal (D)', color: 'hsl(var(--chart-1))' },
};

interface LevelDistributionChartProps {
    levelCounts: Record<AnswerChoice, number>
}

export default function LevelDistributionChart({ levelCounts }: LevelDistributionChartProps) {
    const chartData = Object.entries(levelCounts).map(([key, value]) => ({
        level: key as AnswerChoice,
        count: value,
        fill: chartConfig[key as AnswerChoice].color,
    }));
    
    const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col lg:col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Distribusi Tingkat Akhir</CardTitle>
        <CardDescription>Berdasarkan semua respon</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="level"
              innerRadius={60}
              strokeWidth={5}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              className="stroke-background"
            >
              {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="level" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
