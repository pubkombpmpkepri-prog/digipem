'use client';

import { useUser } from '@/firebase';
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
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait until the initial user loading is complete
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, redirect to the login page
    if (!user) {
      router.replace('/login');
      return;
    }

    // Check if the logged-in user's email is in the allowed list
    const userIsAdmin = user.email && ALLOWED_ADMIN_EMAILS.includes(user.email);

    if (userIsAdmin) {
      setIsAuthorized(true);
    } else {
      // If not an admin, show an error and redirect
      toast({
        variant: 'destructive',
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki hak akses ke halaman admin.',
      });
      router.replace('/login');
    }
  }, [user, isUserLoading, router, toast]);

  // While loading or if not authorized, show a skeleton loading screen
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

  // If authorized, render the admin content
  return <>{children}</>;
}
