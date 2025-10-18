import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiePage() {
  useEffect(() => {
    document.title = 'Çerez Politikası - Posta Kodları | Cookie Policy';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodları çerez politikası. Web sitemizde kullanılan çerezler, çerez türleri ve yönetimi hakkında detaylı bilgi edinin.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/cerez-politikasi`);
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
          <h1 className="text-3xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-sm text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Bu çerez politikası, Posta Kodları web sitesinde çerezlerin nasıl kullanıldığını 
              ve yönetildiğini açıklamaktadır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Çerez Nedir?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Çerezler, web sitelerini ziyaret ettiğinizde tarayıcınız tarafından cihazınızda 
              saklanan küçük metin dosyalarıdır. Çerezler, web sitelerinin daha verimli 
              çalışmasını sağlar ve site sahiplerine bilgi sağlar.
            </p>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kullandığımız Çerez Türleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm">1. Zorunlu Çerezler</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu çerezler, web sitesinin temel işlevlerini yerine getirmesi için gereklidir. 
                Bu çerezler olmadan site düzgün çalışmaz. Oturum yönetimi ve güvenlik için kullanılır.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">2. Performans ve Analitik Çerezler</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu çerezler, ziyaretçilerin web sitesini nasıl kullandığı hakkında bilgi toplar. 
                Hangi sayfaların en çok ziyaret edildiği, kullanıcıların sitede ne kadar zaman 
                geçirdiği gibi anonim istatistikler toplar. Bu bilgiler, site performansını 
                iyileştirmek için kullanılır.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Kullanılan servisler: Google Analytics
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">3. Reklam Çerezleri</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu çerezler, size ve ilgi alanlarınıza daha uygun reklamlar göstermek için 
                kullanılır. Ayrıca, aynı reklamın kaç kez gösterildiğini sınırlamak ve reklam 
                kampanyalarının etkinliğini ölçmek için kullanılır.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Kullanılan servisler: Google AdSense ve diğer Google reklam iş ortakları
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">4. İşlevsellik Çerezleri</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu çerezler, web sitesinin tercihlerinizi hatırlamasını sağlar. Örneğin, 
                dil tercihiniz, konum bilginiz veya tema seçiminiz gibi ayarları saklar.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Üçüncü Taraf Çerezler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bazı durumlarda, güvenilir üçüncü tarafların çerezlerini de kullanırız. 
              Aşağıdaki bölüm, bu site üzerinden karşılaşabileceğiniz üçüncü taraf 
              çerezlerini detaylandırmaktadır:
            </p>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Google AdSense</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu site, Google AdSense kullanarak gelir elde etmektedir. Google AdSense, 
                size daha ilgili reklamlar sunmak için çerezler kullanır. Google'ın çerez 
                kullanımı hakkında daha fazla bilgi için{' '}
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Reklam ve Gizlilik politikası
                </a>
                {' '}sayfasını ziyaret edebilirsiniz.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Google Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Analytics, web sitesi trafiğini analiz etmek için kullanılır. 
                Toplanan bilgiler anonim olup, ziyaretçi davranışlarını anlamak ve 
                site deneyimini iyileştirmek için kullanılır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi 2 */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Çerezleri Nasıl Kontrol Edebilirsiniz?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Çerezleri kontrol etmek ve yönetmek için aşağıdaki seçeneklere sahipsiniz:
            </p>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Tarayıcı Ayarları</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Çoğu web tarayıcısı, çerezleri kontrol etmenize izin verir. Tarayıcı 
                ayarlarınızdan çerezleri kabul etmeyi, reddetmeyi veya mevcut çerezleri 
                silmeyi seçebilirsiniz. Ancak, çerezleri devre dışı bırakırsanız, 
                web sitesinin bazı özellikleri düzgün çalışmayabilir.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Reklam Tercihlerini Yönetme</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kişiselleştirilmiş reklamları devre dışı bırakmak için:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
                <li>
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Reklam Ayarları
                  </a>
                </li>
                <li>
                  <a 
                    href="http://www.youronlinechoices.com/tr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Your Online Choices (Avrupa)
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Çerez Politikasındaki Değişiklikler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bu çerez politikasını zaman zaman güncelleyebiliriz. Değişiklikler 
              bu sayfada yayınlandığında yürürlüğe girer. Lütfen bu sayfayı düzenli 
              olarak kontrol edin.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>İletişim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Çerez kullanımı hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              E-posta: <a href="mailto:info@postakodrehberi.com" className="text-primary hover:underline">info@postakodrehberi.com</a>
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
