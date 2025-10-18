import { Link } from 'wouter';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import logoUrl from '@/assets/logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src={logoUrl} alt="Posta Kodları Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Türkiye'nin en kapsamlı posta kodu rehberi. 73.000+ posta kodu bilgisi ile tüm il, ilçe ve mahallelerin posta kodlarını hızlıca sorgulayın.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/ara" className="text-muted-foreground hover:text-foreground transition-colors">
                  Posta Kodu Ara
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-muted-foreground hover:text-foreground transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gizlilik-politikasi" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-sartlari" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-muted-foreground hover:text-foreground transition-colors">
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:info@postakodrehberi.com" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@postakodrehberi.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+905308616785" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  0530 861 67 85
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/905308616785" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">© {currentYear} Posta Kodları. Tüm hakları saklıdır.</p>
          <p className="text-sm text-muted-foreground">
            made with <span className="text-primary">❤</span> by{' '}
            <a 
              href="https://toov.com.tr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-toov"
            >
              TOOV
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Bu site, Google reklam iş ortakları tarafından sunulan reklamlar içerebilir. 
            Çerez kullanımı ve kişisel verilerin korunması hakkında daha fazla bilgi için{' '}
            <Link href="/gizlilik-politikasi" className="text-primary hover:underline">
              Gizlilik Politikası
            </Link>
            'nı inceleyebilirsiniz.
          </p>
        </div>
      </div>
    </footer>
  );
}
