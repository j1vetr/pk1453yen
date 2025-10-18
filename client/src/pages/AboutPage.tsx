import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Zap } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Hakkımızda - Posta Kodları | Türkiye Posta Kodları Rehberi';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodları, Türkiye\'nin 73.000+ posta kodunu içeren en kapsamlı posta kodu rehberidir. Tüm il, ilçe ve mahallelerin posta kodlarını kolayca sorgulayın.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/hakkimizda`);
    }
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Reklam Alanı - Header */}
      <div className="mb-8 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
        Reklam Alanı
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-lg text-muted-foreground">
            Türkiye'nin en kapsamlı posta kodu rehberi
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Posta Kodları, Türkiye'deki tüm il, ilçe ve mahallelerin posta kodlarını 
              kolayca bulabileceğiniz kapsamlı bir posta kodu rehberidir. 73.000'den fazla 
              posta kodu bilgisini içeren platformumuz, kullanıcılarımızın ihtiyaç duydukları 
              posta kodu bilgisine hızlı ve kolay bir şekilde ulaşmalarını sağlar.
            </p>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Kapsamlı Veri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                73.000+ posta kodu bilgisi ile Türkiye'nin tüm bölgelerini kapsıyoruz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Kolay Arama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gelişmiş arama özelliğimizle aradığınız posta kodunu anında bulun.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Hızlı Erişim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mobil uyumlu ve hızlı platformumuzla her yerden erişin.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Misyonumuz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Misyonumuz, Türkiye'deki herkesin ihtiyaç duyduğu posta kodu bilgisine 
              en hızlı ve en kolay şekilde ulaşmasını sağlamaktır. Güncel, doğru ve 
              kullanıcı dostu bir platform sunarak, posta kodu sorgulamalarınızı 
              basitleştirmeyi hedefliyoruz.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Platformumuz sürekli olarak güncellenmekte ve geliştirilmektedir. 
              Kullanıcı geri bildirimleriniz doğrultusunda yeni özellikler ekliyor 
              ve mevcut hizmetlerimizi iyileştiriyoruz.
            </p>
          </CardContent>
        </Card>

        {/* Reklam Alanı - Footer */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>
      </div>
    </div>
  );
}
