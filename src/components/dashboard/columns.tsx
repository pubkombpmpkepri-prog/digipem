'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SurveyDocument } from '@/types/survey';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The 'actions' column definition will be passed a 'deleteSurvey' function from the DataTable component.
export const getColumns = (
  deleteSurvey: (surveyId: string) => void,
  openDeleteDialog: (surveyId: string) => void
): ColumnDef<SurveyDocument>[] => [
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt as Timestamp;
      if (createdAt && typeof createdAt.toDate === 'function') {
        return format(createdAt.toDate(), 'dd MMM yyyy, HH:mm');
      }
      return 'N/A';
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
        level === 'D'
          ? 'default'
          : level === 'C'
          ? 'secondary'
          : level === 'B'
          ? 'outline'
          : 'destructive';

      const levelText =
        level === 'D'
          ? 'Optimal'
          : level === 'C'
          ? 'Lanjut'
          : level === 'B'
          ? 'Menengah'
          : 'Dasar';

      const style =
        level === 'A'
          ? { backgroundColor: 'hsl(var(--chart-5))', color: 'white' }
          : {};

      return (
        <Badge variant={variant} style={style}>
          {levelText}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const survey = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openDeleteDialog(survey.id)}>
              Hapus Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
