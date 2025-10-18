import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Kullanım Şartları - Posta Kodları | Hizmet Koşulları';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodları kullanım şartları ve hizmet koşulları. Siteyi kullanırken uymanız gereken kurallar ve koşullar hakkında bilgi edinin.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/kullanim-sartlari`);
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
          <h1 className="text-3xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-sm text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Posta Kodları web sitesini kullanarak, aşağıdaki kullanım şartlarını kabul 
              etmiş sayılırsınız. Lütfen siteyi kullanmadan önce bu şartları dikkatlice okuyun.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Genel Hükümler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Posta Kodları, Türkiye'deki posta kodlarını ücretsiz olarak sorgulayabileceğiniz 
              bir platformdur. Site üzerinde sunulan bilgiler, kullanıcıların bilgilendirilmesi 
              amacıyla sağlanmaktadır.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Posta Kodları, site içeriğini herhangi bir zamanda ve önceden haber vermeksizin 
              değiştirme, güncelleme veya kaldırma hakkını saklı tutar.
            </p>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>2. Kullanım Koşulları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Site içeriğini yasadışı amaçlarla kullanmamak</li>
              <li>Otomatik sistemler veya botlar kullanarak site verilerini toplamaya çalışmamak</li>
              <li>Site güvenliğini tehlikeye atacak faaliyetlerde bulunmamak</li>
              <li>Diğer kullanıcıların site deneyimini olumsuz etkileyecek davranışlarda bulunmamak</li>
              <li>Telif haklarına ve fikri mülkiyet haklarına saygı göstermek</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Fikri Mülkiyet Hakları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Site üzerindeki tüm içerik, tasarım, logo, yazılım ve diğer materyaller 
              Posta Kodları'nın mülkiyetindedir ve telif hakkı yasaları ile korunmaktadır.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Site içeriğini kişisel ve ticari olmayan amaçlarla kullanabilirsiniz. 
              Ancak içeriğin çoğaltılması, dağıtılması veya ticari amaçlarla kullanılması 
              için önceden yazılı izin alınması gerekmektedir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sorumluluk Reddi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Posta Kodları, site üzerinde sunulan bilgilerin doğruluğunu ve güncelliğini 
              sağlamak için makul çabayı göstermektedir. Ancak:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Bilgilerin %100 doğruluğunu garanti etmemekteyiz</li>
              <li>Site hizmetinin kesintisiz ve hatasız olacağını garanti etmemekteyiz</li>
              <li>Sitedeki bilgilere dayanarak yapılan işlemlerden sorumluluk kabul etmemekteyiz</li>
              <li>Üçüncü taraf sitelere verilen bağlantılardan sorumlu değiliz</li>
            </ul>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi 2 */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>5. Reklamlar ve Üçüncü Taraflar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sitemiz, Google AdSense dahil olmak üzere üçüncü taraf reklam ağları 
              aracılığıyla reklamlar göstermektedir. Bu reklamlar:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Kullanıcı deneyiminizi kişiselleştirmek için çerezler kullanabilir</li>
              <li>Posta Kodları tarafından onaylanmış veya garanti edilmiş değildir</li>
              <li>Reklam verenin sorumluluğundadır</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reklam içeriklerinden ve reklam verenlerle olan etkileşimlerinizden 
              Posta Kodları sorumlu tutulamaz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Gizlilik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kişisel verilerinizin nasıl toplandığı ve kullanıldığı hakkında ayrıntılı 
              bilgi için lütfen{' '}
              <a href="/gizlilik-politikasi" className="text-primary hover:underline">
                Gizlilik Politikası
              </a>
              {' '}sayfamızı inceleyin.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Değişiklikler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bu kullanım şartları zaman zaman güncellenebilir. Değişiklikler bu sayfada 
              yayınlandığı anda yürürlüğe girer. Siteyi kullanmaya devam ederek, 
              güncellenmiş şartları kabul etmiş sayılırsınız.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Uygulanacak Hukuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bu kullanım şartları, Türkiye Cumhuriyeti yasalarına tabidir. Şartlardan 
              kaynaklanan her türlü uyuşmazlık, Türkiye mahkemelerinde çözümlenir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. İletişim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              E-posta: <a href="mailto:info@postakodum.tr" className="text-primary hover:underline">info@postakodum.tr</a>
              <br />
              Telefon: <a href="tel:+905308616785" className="text-primary hover:underline">0530 861 67 85</a>
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
