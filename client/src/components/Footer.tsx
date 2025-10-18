import { Link } from 'wouter';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Türkiye Posta Kodları</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye'nin tüm il, ilçe ve mahallelerinin posta kodlarını
              kolayca sorgulayabileceğiniz güncel rehber.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" data-testid="footer-home">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Ana Sayfa
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/ara" data-testid="footer-search">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Posta Kodu Ara
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Bilgi</h3>
            <p className="text-sm text-muted-foreground">
              73.000+ posta kodu bilgisi ile Türkiye'nin en kapsamlı
              posta kodu rehberi.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Türkiye Posta Kodları. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
