import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Gizlilik Politikası - Posta Kodum | Kişisel Verilerin Korunması';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodum gizlilik politikası. Kişisel verilerinizin korunması, çerez kullanımı ve Google reklam iş ortakları hakkında bilgi edinin.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/gizlilik-politikasi`);
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
          <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-sm text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Posta Kodum olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. 
              Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde kişisel verilerinizin 
              nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Toplanan Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Web sitemizi kullanırken, aşağıdaki bilgiler toplanabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>IP adresi ve tarayıcı bilgileri</li>
              <li>Ziyaret edilen sayfalar ve ziyaret süreleri</li>
              <li>Arama sorguları ve kullanım istatistikleri</li>
              <li>Çerezler aracılığıyla toplanan teknik veriler</li>
            </ul>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>2. Çerez Kullanımı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Web sitemiz, kullanıcı deneyimini iyileştirmek ve site performansını analiz etmek 
              için çerezler kullanmaktadır. Çerezler, tarayıcınız tarafından bilgisayarınızda 
              saklanan küçük metin dosyalarıdır.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kullandığımız çerez türleri:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gerekli temel çerezler</li>
              <li><strong>Analitik Çerezler:</strong> Site kullanımını analiz etmek için kullanılan çerezler</li>
              <li><strong>Reklam Çerezleri:</strong> Kişiselleştirilmiş reklamlar göstermek için kullanılan çerezler</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Google Reklam İş Ortakları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sitemiz, Google AdSense ve diğer Google reklam iş ortakları tarafından sunulan 
              reklamlar içermektedir. Bu iş ortakları, size daha ilgili reklamlar göstermek 
              amacıyla çerezler kullanabilir.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google'ın reklam çerezleri hakkında daha fazla bilgi edinmek ve kişiselleştirilmiş 
              reklamları devre dışı bırakmak için{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Reklam Ayarları
              </a>
              {' '}sayfasını ziyaret edebilirsiniz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Kişisel Verilerin Korunması</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
              kapsamında korunmaktadır. Verileriniz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Sadece belirtilen amaçlar doğrultusunda kullanılır</li>
              <li>Yetkisiz erişime karşı korunur</li>
              <li>Üçüncü şahıslarla paylaşılmaz (yasal zorunluluklar hariç)</li>
              <li>Gerekli süre boyunca saklanır</li>
            </ul>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi 2 */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>5. Kullanıcı Hakları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Verilerinizin düzeltilmesini veya silinmesini talep etme</li>
              <li>İşleme faaliyetlerine itiraz etme</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Üçüncü Taraf Bağlantılar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin 
              gizlilik politikalarından sorumlu değiliz. Lütfen bu siteleri ziyaret 
              etmeden önce gizlilik politikalarını inceleyin.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Değişiklikler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
              yapıldığında, bu sayfada bildirimde bulunulacaktır. Politikayı düzenli 
              olarak kontrol etmenizi öneririz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. İletişim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
