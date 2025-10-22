
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

async function userIsAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  try {
    const idTokenResult = await user.getIdTokenResult(true); // Force refresh
    return !!idTokenResult.claims.admin;
  } catch (error) {
    console.error("Error getting ID token result:", error);
    return false;
  }
}


export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
        userIsAdmin(user).then(isAdmin => {
            if (isAdmin) {
                router.replace('/admin');
            }
        });
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Login Gagal',
            description: 'Layanan otentikasi tidak tersedia.',
        });
        setIsLoggingIn(false);
        return;
    }
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // After successful sign-in, the useUser hook will update,
      // and the useEffect will handle redirection if the user is an admin.
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Tidak dapat masuk dengan Google. Silakan coba lagi.',
      });
    } finally {
        setIsLoggingIn(false);
    }
  };
  
  if (isUserLoading) {
    return <div className="flex h-[80vh] items-center justify-center">Memuat...</div>;
  }
  
  // If user is logged in but not an admin, show a message and options.
  if (user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <Card className="w-full max-w-sm p-6">
            <CardTitle>Anda Sudah Masuk</CardTitle>
            <CardDescription className="mt-2">
                Anda sudah masuk sebagai {user.email}. <br/>
                Jika akun ini bukan admin, silakan keluar dan coba lagi dengan akun admin.
            </CardDescription>
            <Button variant="outline" className="mt-4" onClick={() => auth && signOut(auth)}>Keluar</Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Masuk dengan Google untuk mengakses dasbor admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button
              onClick={handleGoogleSignIn}
              className="w-full"
              size="lg"
              disabled={isLoggingIn}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 106.5 280.2 96 248 96c-88.8 0-160 72.2-160 160s71.2 160 160 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
              {isLoggingIn ? 'Memproses...' : 'Masuk dengan Google'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
