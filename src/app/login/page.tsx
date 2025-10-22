
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ALLOWED_ADMIN_EMAILS } from '@/config/admin';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // This effect now only handles redirecting an already logged-in admin
    // It will not handle the redirection immediately after login anymore.
    // The admin layout will handle pulling the user into the admin page.
    if (!isUserLoading && user) {
      const userIsAdmin = user.email && ALLOWED_ADMIN_EMAILS.includes(user.email);
      if (userIsAdmin) {
        router.replace('/admin');
      }
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Login Gagal',
            description: 'Layanan otentikasi tidak tersedia. Coba lagi nanti.',
        });
        setIsLoggingIn(false);
        return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // After successful sign-in, the onAuthStateChanged listener will update the `user` state.
      // The useEffect hook above will then trigger the redirection.
    } catch (error) {
      console.error('Error signing in with email/password: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Email atau password salah. Silakan coba lagi.',
      });
    } finally {
        setIsLoggingIn(false);
    }
  };
  
  // Show a loading state while Firebase is initializing or checking auth status.
  // This prevents a flash of the login form if the user is already logged in.
  if (isUserLoading) {
    return <div className="flex h-[80vh] items-center justify-center">Memuat...</div>;
  }
  
  // If the user is logged in but not an admin, they shouldn't see the login form.
  // You might want to redirect them to the home page or show a message.
  if (user && !ALLOWED_ADMIN_EMAILS.includes(user.email || '')) {
     return (
      <div className="flex h-[80vh] items-center justify-center">
        <p>Anda sudah login, tetapi tidak memiliki akses admin.</p>
      </div>
    );
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
              <LogIn className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

