'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';
import { ALLOWED_ADMIN_EMAILS } from '@/config/admin';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      setIsCheckingAdmin(false);
      return;
    }
    
    const checkAdminStatus = async () => {
        try {
            const idTokenResult = await user.getIdTokenResult();
            const userIsAdmin =
            idTokenResult.claims.admin === true ||
            (user.email && ALLOWED_ADMIN_EMAILS.includes(user.email));
            
            setIsAdmin(userIsAdmin);

            if (userIsAdmin) {
                router.push('/admin');
            }
        } catch (error) {
             console.error("Error checking admin status:", error);
             // Stay on login page if admin check fails
        } finally {
            setIsCheckingAdmin(false);
        }
    };
    
    checkAdminStatus();

  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle the redirect after state change
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.',
      });
    }
  };
  
  if (isUserLoading || isCheckingAdmin || isAdmin) {
    return <div className="flex h-[80vh] items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Masuk untuk mengakses dasbor admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSignIn}
            className="w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Masuk dengan Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
