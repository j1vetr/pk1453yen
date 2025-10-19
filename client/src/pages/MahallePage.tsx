import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MapPin, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CopyButton } from '@/components/CopyButton';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { EmptyState } from '@/components/EmptyState';
import { SimilarMahallerWidget } from '@/components/SimilarMahallerWidget';
import { FAQSection } from '@/components/FAQSection';
import { getCanonicalUrl, generateMetaDescription, formatPostalCode, generateMahalleDescription, generateMahalleFAQ } from '@shared/utils';
import NotFound from './not-found';

interface MahalleData {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
  postalCodes: string[];
  semt?: string;
  relatedMahalleler: Array<{
    mahalle: string;
    mahalleSlug: string;
  }>;
}

export default function MahallePage() {
  const [, params] = useRoute('/:ilSlug/:ilceSlug/:mahalleSlug');
  const { ilSlug, ilceSlug, mahalleSlug } = params || {};

  const { data, isLoading, isError } = useQuery<MahalleData>({
    queryKey: ['/api/mahalle', ilSlug, ilceSlug, mahalleSlug],
    enabled: !!ilSlug && !!ilceSlug && !!mahalleSlug,
  });

  if (!ilSlug || !ilceSlug || !mahalleSlug) return null;
  
  if (isError && !isLoading) {
    return <NotFound />;
  }

  const jsonLd = data ? [
    {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      streetAddress: `${data.mahalle} Mahallesi`,
      addressLocality: data.ilce,
      addressRegion: data.il,
      postalCode: data.postalCodes.join(', '),
      addressCountry: 'TR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Anasayfa',
          item: 'https://postakodrehberi.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: data.il,
          item: `https://postakodrehberi.com/${data.ilSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.ilce,
          item: `https://postakodrehberi.com/${data.ilSlug}/${data.ilceSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: data.mahalle,
          item: `https://postakodrehberi.com/${data.ilSlug}/${data.ilceSlug}/${data.mahalleSlug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: generateMahalleFAQ(data.mahalle, data.ilce, data.il, data.postalCodes[0]).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  ] : undefined;

  return (
    <>
      {data && (
        <SEOHead
          title={`${data.mahalle} Posta Kodu - ${data.ilce}, ${data.il}`}
          description={generateMetaDescription('mahalle', { 
            mahalle: data.mahalle, 
            ilce: data.ilce, 
            il: data.il, 
            pk: data.postalCodes[0] 
          })}
          canonical={getCanonicalUrl(`/${ilSlug}/${ilceSlug}/${mahalleSlug}`)}
          keywords={`${data.mahalle} posta kodu, ${data.postalCodes.join(', ')}, ${data.ilce} ${data.mahalle}, ${data.il} posta kodları`}
          jsonLd={jsonLd}
        />
      )}

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Skip to content - Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          aria-label="İçeriğe geç"
        >
          İçeriğe Geç
        </a>

        {data && (
          <Breadcrumb
            items={[
              { label: data.il, href: `/${data.ilSlug}` },
              { label: data.ilce, href: `/${data.ilSlug}/${data.ilceSlug}` },
              { label: data.mahalle },
            ]}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-10 bg-muted animate-pulse rounded w-96" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        ) : data ? (
          <>
            {/* Reklam Alanı - Header */}
            <aside className="mb-6 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
              Reklam Alanı
            </aside>

            {/* Quick Navigation - Anchor Links */}
            <nav className="mb-6 p-4 bg-muted/50 border rounded-lg" aria-label="Sayfa içi navigasyon">
              <p className="text-sm font-semibold mb-2 text-muted-foreground">Hızlı Erişim:</p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="#posta-kodu-bilgisi" 
                  className="text-sm px-3 py-1 bg-background border rounded-md hover-elevate active-elevate-2 transition-colors"
                  aria-label="Posta kodu bilgilerine git"
                >
                  Posta Kodu
                </a>
                <a 
                  href="#adres-hiyerarsisi" 
                  className="text-sm px-3 py-1 bg-background border rounded-md hover-elevate active-elevate-2 transition-colors"
                  aria-label="Adres hiyerarşisine git"
                >
                  Adres Detayları
                </a>
                {data.relatedMahalleler.length > 0 && (
                  <a 
                    href="#diger-mahalleler" 
                    className="text-sm px-3 py-1 bg-background border rounded-md hover-elevate active-elevate-2 transition-colors"
                    aria-label="Diğer mahallelere git"
                  >
                    Diğer Mahalleler
                  </a>
                )}
              </div>
            </nav>

            <article id="main-content">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {data.mahalle} Mahallesi Posta Kodu
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {generateMahalleDescription(data.mahalle, data.ilce, data.il, data.postalCodes[0])}
                </p>
              </header>

              {/* Postal Code Card */}
              <section className="mb-8" id="posta-kodu-bilgisi">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Posta {data.postalCodes.length > 1 ? 'Kodları' : 'Kodu'}
                </h2>
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="sr-only">Posta Kodu Bilgileri</CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.postalCodes.map((pk, index) => (
                    <div key={pk} className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <p className="text-4xl font-mono font-bold text-primary" data-testid={`text-postal-code-${index}`}>
                          {formatPostalCode(pk)}
                        </p>
                        <p className="text-muted-foreground mt-2">
                          {data.mahalle}, {data.ilce} / {data.il}
                        </p>
                      </div>
                      <CopyButton text={pk} variant="default" size="lg" />
                    </div>
                  ))}
                </div>
                  </CardContent>
                </Card>
              </section>

              {/* Address Hierarchy */}
              <section className="mb-8" id="adres-hiyerarsisi">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Adres Hiyerarşisi
                </h3>
                <Card>
                  <CardHeader className="sr-only">
                    <CardTitle>Adres Detayları</CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">İl:</span>
                    <span>{data.il}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">İlçe:</span>
                    <span>{data.ilce}</span>
                  </div>
                  {data.semt && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Semt/Bucak/Belde:</span>
                      <span>{data.semt}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Mahalle/Köy:</span>
                    <span>{data.mahalle}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Posta {data.postalCodes.length > 1 ? 'Kodları' : 'Kodu'}:</span>
                    <span className="font-mono font-bold">{data.postalCodes.map(formatPostalCode).join(', ')}</span>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </section>

              {/* Related Mahalleler */}
              {data.relatedMahalleler.length > 0 && (
                <section id="diger-mahalleler">
                  <h2 className="text-2xl font-semibold mb-6">
                    {data.ilce} İlçesindeki Diğer Mahalleler
                  </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.relatedMahalleler.slice(0, 6).map((rel) => (
                    <PostalCodeCard
                      key={rel.mahalleSlug}
                      title={rel.mahalle}
                      subtitle={`${data.ilce} / ${data.il}`}
                      href={`/${data.ilSlug}/${data.ilceSlug}/${rel.mahalleSlug}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            <FAQSection faqs={generateMahalleFAQ(data.mahalle, data.ilce, data.il, data.postalCodes[0])} />

            {/* Similar Mahalleler - Benzer isimli mahalleler */}
            <SimilarMahallerWidget 
              mahalleName={data.mahalle}
              currentIl={data.il}
              currentIlce={data.ilce}
            />
            </article>
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Mahalle Bulunamadı"
            description="Aradığınız mahalle bulunamadı. Lütfen tekrar deneyin."
          />
        )}
      </div>
    </>
  );
}
