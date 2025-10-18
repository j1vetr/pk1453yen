import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Search, MapPin } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { SearchBar } from '@/components/SearchBar';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl, generateMetaDescription } from '@shared/utils';

interface SearchResult {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
  pk: string;
  semt?: string;
}

export default function SearchPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';

  const { data: results, isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', query],
    enabled: !!query,
  });

  const jsonLd = results ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `"${query}" Arama Sonuçları`,
    description: generateMetaDescription('search', { query }),
    numberOfItems: results.length,
  } : undefined;

  return (
    <>
      <SEOHead
        title={query ? `"${query}" Arama Sonuçları - Türkiye Posta Kodları` : 'Posta Kodu Ara - Türkiye Posta Kodları'}
        description={query ? generateMetaDescription('search', { query }) : 'Türkiye geneli posta kodu arama. İl, ilçe, mahalle veya posta kodu ile hızlı arama yapın.'}
        canonical={getCanonicalUrl(`/ara${query ? `?q=${encodeURIComponent(query)}` : ''}`)}
        keywords={`posta kodu ara, ${query}, posta kodu sorgulama, adres sorgulama`}
        jsonLd={jsonLd}
      />

      <div className="container max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-2">
            <Search className="w-8 h-8" />
            Posta Kodu Ara
          </h1>
          <p className="text-lg text-muted-foreground">
            İl, ilçe, mahalle veya posta kodu ile arama yapın
          </p>
        </div>

        <SearchBar large className="mb-8" />

        {query && (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Arama: <span className="font-semibold text-foreground">"{query}"</span>
              </p>
              {results && (
                <p className="text-sm text-muted-foreground mt-1" data-testid="text-result-count">
                  {results.length} sonuç bulundu
                </p>
              )}
            </div>

            {isLoading ? (
              <LoadingGrid />
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {results.map((result, idx) => (
                  <PostalCodeCard
                    key={idx}
                    title={result.mahalle}
                    subtitle={`${result.ilce}, ${result.il} - Posta Kodu: ${result.pk}${result.semt ? ` - ${result.semt}` : ''}`}
                    href={`/${result.ilSlug}/${result.ilceSlug}/${result.mahalleSlug}/${result.pk}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="Sonuç Bulunamadı"
                description={`"${query}" için hiçbir sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.`}
              />
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-16 text-muted-foreground">
            <p>Aramaya başlamak için yukarıdaki arama kutusunu kullanın</p>
          </div>
        )}
      </div>
    </>
  );
}
