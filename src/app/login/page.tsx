'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, loading, router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener in AuthProvider will handle the redirect
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.',
      });
    }
  };
  
  if (loading || (user && isAdmin)) {
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
