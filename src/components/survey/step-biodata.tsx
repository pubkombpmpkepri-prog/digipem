'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyFormData } from './survey-page';
import { User } from 'lucide-react';

export default function StepBiodata() {
  const { control } = useFormContext<SurveyFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
            <User />
            Langkah 1: Biodata Responden
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="biodata.nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="cth: Budi Hartono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="biodata.sekolah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl>
                <Input placeholder="cth: SMA Negeri 1 Tanjungpinang" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="biodata.npsn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NPSN (Nomor Pokok Sekolah Nasional)</FormLabel>
              <FormControl>
                <Input placeholder="8 digit angka, cth: 11001100" {...field} maxLength={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
