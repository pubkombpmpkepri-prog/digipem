
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// This function checks for the admin custom claim in the user's ID token.
async function userIsAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  try {
    const idTokenResult = await user.getIdTokenResult(true); // Force refresh the token
    return !!idTokenResult.claims.admin;
  } catch (error) {
    console.error("Error getting ID token result:", error);
    return false;
  }
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
  const [isCheckingClaims, setIsCheckingClaims] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    setIsCheckingClaims(true);
    userIsAdmin(user).then(isAdmin => {
      if (isAdmin) {
        setIsAuthorized(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Akses Ditolak',
          description: 'Anda tidak memiliki hak akses admin (custom claim).',
        });
        router.replace('/login');
      }
      setIsCheckingClaims(false);
    });

  }, [user, isUserLoading, router, toast]);

  if (isUserLoading || isCheckingClaims || !isAuthorized) {
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
