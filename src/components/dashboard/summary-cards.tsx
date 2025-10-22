'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Star, AlertTriangle } from 'lucide-react';

interface SummaryCardsProps {
    totalResponses: number;
    ratioOptimal: number;
    ratioDasar: number;
}

export default function SummaryCards({ totalResponses, ratioOptimal, ratioDasar }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Respon</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah survei yang telah diisi
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rasio Optimal (D)</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ratioOptimal.toFixed(1)}%</div>
           <p className="text-xs text-muted-foreground">
            Persentase sekolah di level optimal
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rasio Dasar (A)</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ratioDasar.toFixed(1)}%</div>
           <p className="text-xs text-muted-foreground">
            Persentase sekolah di level dasar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
