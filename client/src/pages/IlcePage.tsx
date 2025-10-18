import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MapPin } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchBar } from '@/components/SearchBar';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl, generateMetaDescription, generateIlceDescription } from '@shared/utils';

interface Mahalle {
  mahalle: string;
  mahalleSlug: string;
}

interface IlceData {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalleler: Mahalle[];
}

export default function IlcePage() {
  const [, params] = useRoute('/:ilSlug/:ilceSlug');
  const { ilSlug, ilceSlug } = params || {};

  const { data, isLoading } = useQuery<IlceData>({
    queryKey: ['/api/ilce', ilSlug, ilceSlug],
    enabled: !!ilSlug && !!ilceSlug,
  });

  if (!ilSlug || !ilceSlug) return null;

  const jsonLd = data ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${data.ilce}, ${data.il} Posta Kodları`,
    description: generateMetaDescription('ilce', { ilce: data.ilce, il: data.il }),
    itemListElement: data.mahalleler.map((mahalle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: mahalle.mahalle,
      url: getCanonicalUrl(`/${data.ilSlug}/${data.ilceSlug}/${mahalle.mahalleSlug}`),
    })),
  } : undefined;

  return (
    <>
      {data && (
        <SEOHead
          title={`${data.ilce}, ${data.il} Posta Kodları - Mahalleler`}
          description={generateMetaDescription('ilce', { ilce: data.ilce, il: data.il })}
          canonical={getCanonicalUrl(`/${ilSlug}/${ilceSlug}`)}
          keywords={`${data.ilce} posta kodu, ${data.ilce} mahalleler, ${data.il} ${data.ilce} posta kodları`}
          jsonLd={jsonLd}
        />
      )}

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {data && (
          <Breadcrumb
            items={[
              { label: data.il, href: `/${data.ilSlug}` },
              { label: data.ilce },
            ]}
          />
        )}

        {isLoading ? (
          <div className="mb-6">
            <div className="h-10 bg-muted animate-pulse rounded w-64 mb-4" />
            <div className="h-5 bg-muted animate-pulse rounded w-96" />
          </div>
        ) : data ? (
          <>
            {/* Reklam Alanı - Header */}
            <div className="mb-6 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
              Reklam Alanı
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {data.ilce}, {data.il} Posta Kodları
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {generateIlceDescription(data.ilce, data.il)}
              </p>
            </div>

            <SearchBar className="mb-8" />

            <h2 className="text-2xl font-semibold mb-6">Mahalleler</h2>
            {data.mahalleler.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.mahalleler.map((mahalle) => (
                  <PostalCodeCard
                    key={mahalle.mahalleSlug}
                    title={mahalle.mahalle}
                    subtitle={`${data.ilce} / ${data.il}`}
                    href={`/${data.ilSlug}/${data.ilceSlug}/${mahalle.mahalleSlug}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="Mahalle Bulunamadı"
                description={`${data.ilce} ilçesi için henüz mahalle kaydı bulunmuyor.`}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="İlçe Bulunamadı"
            description="Aradığınız ilçe bulunamadı. Lütfen tekrar deneyin."
          />
        )}
      </div>
    </>
  );
}
