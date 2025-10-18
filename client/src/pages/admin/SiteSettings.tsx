import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Settings, Save } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  metaKeywords: string;
}

export default function SiteSettings() {
  const { toast } = useToast();
  
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/admin/settings'],
  });

  const [formData, setFormData] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    metaKeywords: '',
  });

  // Update form when data loads
  useState(() => {
    if (settings) {
      setFormData(settings);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      return await apiRequest('PUT', '/api/admin/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: 'Ayarlar Kaydedildi',
        description: 'Site ayarları başarıyla güncellendi.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Ayarlar kaydedilemedi.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Ayarları</h1>
          <p className="text-muted-foreground">
            Web sitenizin genel ayarlarını yönetin
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Genel Ayarlar
            </CardTitle>
            <CardDescription>
              Site genelinde kullanılacak bilgileri düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    placeholder="Türkiye Posta Kodları"
                    data-testid="input-site-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    placeholder="Türkiye'nin en kapsamlı posta kodu rehberi..."
                    rows={3}
                    data-testid="input-site-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">İletişim E-posta</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="info@example.com"
                    data-testid="input-contact-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Anahtar Kelimeler</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder="posta kodu, türkiye, il, ilçe, mahalle"
                    data-testid="input-meta-keywords"
                  />
                  <p className="text-sm text-muted-foreground">
                    Virgül ile ayırarak birden fazla kelime girebilirsiniz
                  </p>
                </div>

                <Button
                  type="submit"
                  className="gap-2"
                  disabled={saveMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="w-4 h-4" />
                  {saveMutation.isPending ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
