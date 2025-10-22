'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SurveyDocument } from '@/types/survey';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const columns: ColumnDef<SurveyDocument>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => {
        const date = row.original.createdAt?.toDate();
        return date ? format(date, 'dd MMM yyyy, HH:mm') : 'N/A';
    },
  },
  {
    accessorKey: 'biodata.nama',
    header: 'Nama',
  },
  {
    accessorKey: 'biodata.sekolah',
    header: 'Sekolah',
  },
  {
    accessorKey: 'biodata.npsn',
    header: 'NPSN',
  },
  {
    accessorKey: 'answers',
    header: 'Jawaban',
    cell: ({ row }) => {
      const answers = row.original.answers;
      return <div className="font-mono">{answers.join(', ')}</div>;
    },
  },
  {
    accessorKey: 'finalLevel.key',
    header: 'Tingkat',
    cell: ({ row }) => {
      const level = row.original.finalLevel.key;
      const variant: 'default' | 'secondary' | 'outline' | 'destructive' = 
        level === 'D' ? 'default' :
        level === 'C' ? 'secondary' :
        level === 'B' ? 'outline' : 'destructive';
        
      const levelText = 
        level === 'D' ? 'Optimal' :
        level === 'C' ? 'Lanjut' :
        level === 'B' ? 'Menengah' : 'Dasar';

      // Manually set colors for destructive variant as it's not ideal
      const style = level === 'A' ? { backgroundColor: 'hsl(var(--chart-5))', color: 'white' } : {};

      return <Badge variant={variant} style={style}>{levelText}</Badge>;
    },
  },
];
