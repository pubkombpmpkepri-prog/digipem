'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ALLOWED_ADMIN_EMAILS } from '@/config/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const idTokenResult = await user.getIdTokenResult();
        const userIsAdmin =
          idTokenResult.claims.admin === true ||
          (user.email && ALLOWED_ADMIN_EMAILS.includes(user.email));

        if (!userIsAdmin) {
          toast({
            variant: 'destructive',
            title: 'Akses Ditolak',
            description: 'Anda tidak memiliki hak akses ke halaman admin.',
          });
          router.replace('/login');
        }
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
            variant: 'destructive',
            title: 'Gagal Memverifikasi Akses',
            description: 'Terjadi kesalahan saat memeriksa status admin Anda.',
        });
        router.replace('/login');
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, isUserLoading, router, toast, auth]);

  if (isUserLoading || isCheckingAdmin || !isAdmin) {
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
