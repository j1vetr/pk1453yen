import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'İletişim - Posta Kodum | Bize Ulaşın';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodum ile iletişime geçin. E-posta, telefon veya WhatsApp üzerinden bize ulaşabilir, sorularınızı iletebilirsiniz.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/iletisim`);
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
          <h1 className="text-3xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-muted-foreground">
            Sorularınız için bize ulaşın
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Posta Kodum hakkında sorularınız, önerileriniz veya geri bildirimleriniz için 
              bizimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapmaya çalışacağız.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-muted/30">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">E-posta</h3>
                  <a 
                    href="mailto:info@postakodum.tr"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    info@postakodum.tr
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-muted/30">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <a 
                    href="tel:+905308616785"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    0530 861 67 85
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-muted/30">
                <MessageCircle className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a 
                    href="https://wa.me/905308616785"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    WhatsApp ile ulaşın
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reklam Alanı - İçerik İçi */}
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sık Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Posta kodu verileriniz ne kadar güncel?</h3>
              <p className="text-sm text-muted-foreground">
                Platformumuz düzenli olarak güncellenmekte ve en güncel posta kodu bilgilerini içermektedir.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Arama özelliği nasıl çalışır?</h3>
              <p className="text-sm text-muted-foreground">
                Türkçe karakter desteği ile il, ilçe, mahalle veya posta kodu numarası üzerinden arama yapabilirsiniz. 
                Arama sonuçları anında görüntülenir.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mobil cihazlardan erişebilir miyim?</h3>
              <p className="text-sm text-muted-foreground">
                Evet, platformumuz tüm mobil cihazlarda sorunsuz çalışacak şekilde tasarlanmıştır.
              </p>
            </div>
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
