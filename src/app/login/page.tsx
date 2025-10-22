
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

async function userIsAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  try {
    const idTokenResult = await user.getIdTokenResult();
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // After successful sign-in, the useUser hook will update,
      // and the useEffect will handle redirection if the user is an admin.
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
  
  if (isUserLoading) {
    return <div className="flex h-[80vh] items-center justify-center">Memuat...</div>;
  }
  
  if (user) {
    // If user is logged in, show a message and a sign out button,
    // as they might not be an admin and need to sign out to try another account.
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <Card className="w-full max-w-sm p-6">
            <CardTitle>Anda Sudah Masuk</CardTitle>
            <CardDescription className="mt-2">
                Anda sudah login sebagai {user.email}. <br/>
                Jika Anda bukan admin, silakan keluar dan coba lagi.
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

