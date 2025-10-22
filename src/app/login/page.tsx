
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // The AdminLayout will handle redirection for logged-in admins.
  // This useEffect will redirect any logged-in NON-admin user away from the login page
  // to prevent confusion.
  useEffect(() => {
    if (!isUserLoading && user) {
      // Check if the user is already on the admin page to avoid loops
      // Or just redirect to home and let them click the admin link
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await signInWithEmailAndPassword(auth, email, password);
      // After successful sign-in, redirect to the admin page.
      // The AdminLayout will then take over to verify admin claims.
      router.push('/admin');
    } catch (error) {
      console.error('Error signing in: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Email atau password salah. Silakan coba lagi.',
      });
    } finally {
        setIsLoggingIn(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="w-full max-w-sm space-y-4">
                <Skeleton className="h-10 w-3/4 mx-auto"/>
                <Skeleton className="h-8 w-full mx-auto"/>
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-12 w-full"/>
                    <Skeleton className="h-12 w-full"/>
                    <Skeleton className="h-12 w-full"/>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Gunakan email dan password untuk mengakses dasbor admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
