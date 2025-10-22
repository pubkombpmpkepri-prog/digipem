'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki hak akses ke halaman admin.',
      });
      router.replace('/login');
    }
  }, [user, isAdmin, loading, router, toast]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
             <Skeleton className="h-80 w-full" />
             <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
