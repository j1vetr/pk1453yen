import { useMutation } from '@tanstack/react-query';
import { Search, RefreshCw, FileText } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function SEOManagement() {
  const { toast } = useToast();

  const generateSitemapMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/generate-sitemap', {});
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Sitemap Oluşturuldu',
        description: `${data.sitemapCount} sitemap dosyası başarıyla oluşturuldu.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Sitemap oluşturulamadı.',
        variant: 'destructive',
      });
    },
  });

  const generateRobotsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/generate-robots', {});
    },
    onSuccess: () => {
      toast({
        title: 'Robots.txt Oluşturuldu',
        description: 'Robots.txt dosyası başarıyla güncellendi.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Robots.txt oluşturulamadı.',
        variant: 'destructive',
      });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">SEO Yönetimi</h1>
          <p className="text-muted-foreground">
            Arama motoru optimizasyonu araçlarını yönetin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sitemap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Sitemap Yönetimi
              </CardTitle>
              <CardDescription>
                Tüm sayfalarınız için sitemap oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Sitemap, arama motorlarının sitenizin yapısını anlamasına yardımcı olur.
                  50.000 URL sınırı ile otomatik olarak parçalanır.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>/sitemap.xml (ana index)</li>
                  <li>/sitemaps/cities.xml</li>
                  <li>/sitemaps/districts.xml</li>
                  <li>/sitemaps/mahalleler-1.xml</li>
                </ul>
              </div>
              <Button
                onClick={() => generateSitemapMutation.mutate()}
                disabled={generateSitemapMutation.isPending}
                className="w-full gap-2"
                data-testid="button-generate-sitemap"
              >
                <RefreshCw className={`w-4 h-4 ${generateSitemapMutation.isPending ? 'animate-spin' : ''}`} />
                {generateSitemapMutation.isPending ? 'Oluşturuluyor...' : 'Sitemap Oluştur'}
              </Button>
            </CardContent>
          </Card>

          {/* Robots.txt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Robots.txt
              </CardTitle>
              <CardDescription>
                Arama motoru botları için kurallar belirleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Robots.txt dosyası, arama motorlarına hangi sayfaların taranabileceğini belirtir.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>API ve admin panel engellenir</li>
                  <li>İçerik sayfalarına izin verilir</li>
                  <li>Sitemap konumu belirtilir</li>
                </ul>
              </div>
              <Button
                onClick={() => generateRobotsMutation.mutate()}
                disabled={generateRobotsMutation.isPending}
                className="w-full gap-2"
                data-testid="button-generate-robots"
              >
                <RefreshCw className={`w-4 h-4 ${generateRobotsMutation.isPending ? 'animate-spin' : ''}`} />
                {generateRobotsMutation.isPending ? 'Oluşturuluyor...' : 'Robots.txt Oluştur'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* SEO Tips */}
        <Card>
          <CardHeader>
            <CardTitle>SEO İpuçları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Meta Etiketleri Optimize Edin</p>
                  <p className="text-muted-foreground">
                    Her sayfa için benzersiz ve açıklayıcı title ve description kullanın
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Sitemap'i Düzenli Güncelleyin</p>
                  <p className="text-muted-foreground">
                    Yeni veri ekledikten sonra sitemap'i yeniden oluşturun
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">İç Linkleme Yapısını Güçlendirin</p>
                  <p className="text-muted-foreground">
                    İl, ilçe ve mahalle sayfaları arasında güçlü bağlantılar oluşturun
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
