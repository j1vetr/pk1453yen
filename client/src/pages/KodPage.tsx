import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MapPin, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CopyButton } from '@/components/CopyButton';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl, generateMetaDescription, formatPostalCode } from '@shared/utils';

interface Location {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
  semt?: string;
}

interface KodData {
  pk: string;
  locations: Location[];
}

export default function KodPage() {
  const [, params] = useRoute('/kod/:pk');
  const pk = params?.pk;

  const { data, isLoading } = useQuery<KodData>({
    queryKey: ['/api/kod', pk],
    enabled: !!pk,
  });

  if (!pk) return null;

  const jsonLd = data ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${data.pk} Posta Kodu`,
    description: generateMetaDescription('kod', { pk: data.pk }),
    numberOfItems: data.locations.length,
    itemListElement: data.locations.map((loc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'PostalAddress',
        addressLocality: loc.mahalle,
        addressRegion: loc.ilce,
        addressCountry: 'TR',
        postalCode: data.pk,
      },
    })),
  } : undefined;

  return (
    <>
      {data && (
        <SEOHead
          title={`${data.pk} Posta Kodu - İlgili Mahalle ve Yerleşimler`}
          description={generateMetaDescription('kod', { pk: data.pk })}
          canonical={getCanonicalUrl(`/kod/${pk}`)}
          keywords={`${data.pk} posta kodu, ${data.pk} hangi il, ${data.pk} hangi ilçe, posta kodu sorgulama`}
          jsonLd={jsonLd}
        />
      )}

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: `Posta Kodu: ${pk}` },
          ]}
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-10 bg-muted animate-pulse rounded w-96" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        ) : data ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Posta Kodu: {formatPostalCode(data.pk)}
              </h1>
              <p className="text-lg text-muted-foreground">
                {data.locations.length} yerleşim yeri bu posta kodunu kullanıyor
              </p>
            </div>

            {/* Postal Code Card */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  Posta Kodu Bilgisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-5xl font-mono font-bold text-primary" data-testid="text-postal-code">
                      {formatPostalCode(data.pk)}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {data.locations.length} farklı yerleşim yerinde kullanılıyor
                    </p>
                  </div>
                  <CopyButton text={data.pk} variant="default" size="lg" />
                </div>
              </CardContent>
            </Card>

            {/* Locations List */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                İlgili Yerleşimler
              </h2>
              {data.locations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.locations.map((loc, idx) => (
                    <PostalCodeCard
                      key={idx}
                      title={loc.mahalle}
                      subtitle={`${loc.ilce}, ${loc.il}${loc.semt ? ` - ${loc.semt}` : ''}`}
                      href={`/${loc.ilSlug}/${loc.ilceSlug}/${loc.mahalleSlug}/${data.pk}`}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={MapPin}
                  title="Yerleşim Bulunamadı"
                  description="Bu posta koduna ait yerleşim yeri bulunamadı."
                />
              )}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Package}
            title="Posta Kodu Bulunamadı"
            description="Aradığınız posta kodu bulunamadı. Lütfen tekrar deneyin."
          />
        )}
      </div>
    </>
  );
}
