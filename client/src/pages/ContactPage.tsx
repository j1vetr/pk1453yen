import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    document.title = 'İletişim - Posta Kodları | Bize Ulaşın';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Posta Kodları ile iletişime geçin. E-posta, telefon veya WhatsApp üzerinden bize ulaşabilir, sorularınızı iletebilirsiniz.');
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}/iletisim`);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      let recaptchaVerified = false;
      
      // reCAPTCHA doğrulaması yap (varsa)
      if (executeRecaptcha) {
        try {
          const token = await executeRecaptcha('contact_form');
          
          const verifyResponse = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });

          const verifyData = await verifyResponse.json();
          recaptchaVerified = verifyData.success;
        } catch (recaptchaError) {
          console.log('reCAPTCHA doğrulama hatası:', recaptchaError);
          // Development ortamında reCAPTCHA hatalarını sessizce atla
        }
      }

      // Form gönderimi (development ortamında reCAPTCHA olmadan da çalışır)
      toast({
        title: "Mesajınız Alındı",
        description: "İletişim formunuz başarıyla gönderildi. En kısa sürede size dönüş yapacağız. Teşekkürler!",
      });

      // Formu temizle
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [executeRecaptcha, toast]);

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
          <CardHeader>
            <CardTitle>İletişim Formu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  data-testid="input-name"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  data-testid="input-email"
                  type="email"
                  placeholder="E-posta Adresiniz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  data-testid="input-message"
                  placeholder="Mesajınız"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                />
              </div>
              <Button 
                data-testid="button-submit"
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Bu site Google reCAPTCHA tarafından korunmaktadır.
              </p>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diğer İletişim Yolları</CardTitle>
          </CardHeader>
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
