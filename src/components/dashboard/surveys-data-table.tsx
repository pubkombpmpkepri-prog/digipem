'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SurveyDocument } from '@/types/survey';
import { Download } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SurveysDataTable<TData extends SurveyDocument, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleDownload = () => {
    const dataToExport = data.map(survey => {
        const createdAt = survey.createdAt as Timestamp;
        const levelKey = survey.finalLevel.key;
        const levelText =
            levelKey === 'D' ? 'Optimal' :
            levelKey === 'C' ? 'Lanjut' :
            levelKey === 'B' ? 'Menengah' : 'Dasar';

        return {
            'Tanggal': createdAt ? format(createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
            'Nama': survey.biodata.nama,
            'Sekolah': survey.biodata.sekolah,
            'NPSN': survey.biodata.npsn,
            'Jawaban': survey.answers.join(', '),
            'Tingkat': levelText
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Survei');
    XLSX.writeFile(workbook, 'data_survei_digitalisasi.xlsx');
  };

  return (
    <div>
        <div className="flex items-center justify-end py-4">
            <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Unduh Excel
            </Button>
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    );
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    Belum ada data.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
}
