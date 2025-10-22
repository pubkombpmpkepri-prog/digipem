'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Wait until Firebase has determined the user's auth state
    if (isUserLoading) {
      return;
    }
    
    // If a user is logged in, check if they are an admin
    if (user) {
      const userIsAdmin = user.email && ALLOWED_ADMIN_EMAILS.includes(user.email);
      if (userIsAdmin) {
        // If they are an admin, redirect them to the dashboard
        router.push('/admin');
      }
    }
    // If no user or not an admin, stay on the login page
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Login Gagal',
            description: 'Layanan otentikasi tidak tersedia. Coba lagi nanti.',
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect hook will handle redirection on successful login
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.',
      });
    }
  };
  
  // Show a loading message while Firebase is checking the auth state
  if (isUserLoading) {
    return <div className="flex h-[80vh] items-center justify-center">Memuat...</div>;
  }

  // If a user is logged in but not an admin, they should still see the login page
  // The redirection to /admin happens inside the useEffect if they are an admin
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
