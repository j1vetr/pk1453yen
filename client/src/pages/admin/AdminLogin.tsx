import { useState } from 'react';
import { useLocation } from 'wouter';
import { Lock, LogIn } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/login', { username, password });
    },
    onSuccess: () => {
      toast({
        title: 'Giriş Başarılı',
        description: 'Yönetim paneline yönlendiriliyorsunuz...',
      });
      setLocation('/admin/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Giriş Başarısız',
        description: error.message || 'Kullanıcı adı veya şifre hatalı.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Yönetim Paneli</CardTitle>
          <CardDescription>
            Türkiye Posta Kodları Admin Girişi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınızı girin"
                autoComplete="username"
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                autoComplete="current-password"
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                'Giriş yapılıyor...'
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
