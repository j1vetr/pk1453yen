import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MapPin, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CopyButton } from '@/components/CopyButton';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl, generateMetaDescription, formatPostalCode } from '@shared/utils';

interface MahalleData {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
  pk: string;
  semt?: string;
  relatedMahalleler: Array<{
    mahalle: string;
    mahalleSlug: string;
    pk: string;
  }>;
}

export default function MahallePage() {
  const [, params] = useRoute('/:ilSlug/:ilceSlug/:mahalleSlug/:pk');
  const { ilSlug, ilceSlug, mahalleSlug, pk } = params || {};

  const { data, isLoading } = useQuery<MahalleData>({
    queryKey: ['/api/mahalle', ilSlug, ilceSlug, mahalleSlug, pk],
    enabled: !!ilSlug && !!ilceSlug && !!mahalleSlug && !!pk,
  });

  if (!ilSlug || !ilceSlug || !mahalleSlug || !pk) return null;

  const jsonLd = data ? {
    '@context': 'https://schema.org',
    '@type': 'PostalAddress',
    addressLocality: data.mahalle,
    addressRegion: data.ilce,
    addressCountry: 'TR',
    postalCode: data.pk,
  } : undefined;

  return (
    <>
      {data && (
        <SEOHead
          title={`${data.mahalle} Posta Kodu: ${data.pk} - ${data.ilce}, ${data.il}`}
          description={generateMetaDescription('mahalle', { 
            mahalle: data.mahalle, 
            ilce: data.ilce, 
            il: data.il, 
            pk: data.pk 
          })}
          canonical={getCanonicalUrl(`/${ilSlug}/${ilceSlug}/${mahalleSlug}/${pk}`)}
          keywords={`${data.mahalle} posta kodu, ${data.pk}, ${data.ilce} ${data.mahalle}, ${data.il} posta kodları`}
          jsonLd={jsonLd}
        />
      )}

      <div className="container max-w-4xl px-4 py-8">
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
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {data.mahalle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {data.ilce}, {data.il}
              </p>
            </div>

            {/* Postal Code Card */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Posta Kodu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-5xl font-mono font-bold text-primary" data-testid="text-postal-code">
                      {formatPostalCode(data.pk)}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {data.mahalle}, {data.ilce} / {data.il}
                    </p>
                  </div>
                  <CopyButton text={data.pk} variant="default" size="lg" />
                </div>
              </CardContent>
            </Card>

            {/* Address Hierarchy */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Adres Hiyerarşisi
                </CardTitle>
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
                    <span className="font-medium">Posta Kodu:</span>
                    <span className="font-mono font-bold">{formatPostalCode(data.pk)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Mahalleler */}
            {data.relatedMahalleler.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {data.ilce} İlçesindeki Diğer Mahalleler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.relatedMahalleler.slice(0, 6).map((rel) => (
                    <PostalCodeCard
                      key={`${rel.mahalleSlug}-${rel.pk}`}
                      title={rel.mahalle}
                      subtitle={`Posta Kodu: ${rel.pk}`}
                      href={`/${data.ilSlug}/${data.ilceSlug}/${rel.mahalleSlug}/${rel.pk}`}
                    />
                  ))}
                </div>
              </div>
            )}
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
