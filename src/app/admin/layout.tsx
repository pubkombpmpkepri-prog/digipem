
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ALLOWED_ADMIN_EMAILS } from '@/config/admin';

// This function checks if the user's email is in the allowed list.
function userIsAdmin(user: any): boolean {
  if (!user || !user.email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(user.email);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }
    
    if (userIsAdmin(user)) {
      setIsAuthorized(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Akses Ditolak',
        description: 'Akun Anda tidak terdaftar sebagai admin.',
      });
      router.replace('/login');
    }
  }, [user, isUserLoading, router, toast]);

  if (isUserLoading || !isAuthorized) {
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
