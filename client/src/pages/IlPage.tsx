import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { MapPin } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchBar } from '@/components/SearchBar';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl, generateMetaDescription, generateIlDescription } from '@shared/utils';
import NotFound from './not-found';

interface District {
  ilce: string;
  ilceSlug: string;
  count: number;
}

interface IlData {
  il: string;
  ilSlug: string;
  districts: District[];
}

export default function IlPage() {
  const [, params] = useRoute('/:ilSlug');
  const ilSlug = params?.ilSlug;

  const { data, isLoading, isError } = useQuery<IlData>({
    queryKey: ['/api/il', ilSlug],
    enabled: !!ilSlug,
  });

  if (!ilSlug) return null;
  
  if (isError && !isLoading) {
    return <NotFound />;
  }

  const jsonLd = data ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${data.il} Posta Kodları`,
    description: generateMetaDescription('il', { il: data.il }),
    itemListElement: data.districts.map((district, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: district.ilce,
      url: getCanonicalUrl(`/${data.ilSlug}/${district.ilceSlug}`),
    })),
  } : undefined;

  return (
    <>
      {data && (
        <SEOHead
          title={`${data.il} Posta Kodları - İlçeler ve Mahalleler`}
          description={generateMetaDescription('il', { il: data.il })}
          canonical={getCanonicalUrl(`/${ilSlug}`)}
          keywords={`${data.il} posta kodu, ${data.il} ilçeleri, ${data.il} mahalle posta kodları`}
          jsonLd={jsonLd}
        />
      )}

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {data && (
          <Breadcrumb
            items={[
              { label: data.il },
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
                {data.il} Posta Kodları
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {generateIlDescription(data.il)}
              </p>
            </div>

            <SearchBar className="mb-8" />

            <h2 className="text-2xl font-semibold mb-6">İlçeler</h2>
            {data.districts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.districts.map((district) => (
                  <PostalCodeCard
                    key={district.ilceSlug}
                    title={district.ilce}
                    subtitle={`${district.count} posta kodu`}
                    href={`/${data.ilSlug}/${district.ilceSlug}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="İlçe Bulunamadı"
                description={`${data.il} ili için henüz ilçe kaydı bulunmuyor.`}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={MapPin}
            title="İl Bulunamadı"
            description="Aradığınız il bulunamadı. Lütfen ana sayfadan tekrar deneyin."
          />
        )}
      </div>
    </>
  );
}
