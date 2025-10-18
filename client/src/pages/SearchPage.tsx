import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, X } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
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
  // Read initial query from URL
  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Update search term when query changes (for URL-based navigation)
  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get('q') || '';
    if (urlQuery && urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
      setQuery(urlQuery);
    }
  }, []);

  const { data: results, isLoading } = useQuery<SearchResult[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(searchTerm)}`],
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchTerm('');
  };

  const jsonLd = results ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `"${searchTerm}" Arama Sonuçları`,
    description: generateMetaDescription('search', { query: searchTerm }),
    numberOfItems: results.length,
  } : undefined;

  return (
    <>
      <SEOHead
        title={searchTerm ? `"${searchTerm}" Arama Sonuçları - Türkiye Posta Kodları` : 'Posta Kodu Ara - Türkiye Posta Kodları'}
        description={searchTerm ? generateMetaDescription('search', { query: searchTerm }) : 'Türkiye geneli posta kodu arama. İl, ilçe, mahalle veya posta kodu ile hızlı arama yapın.'}
        canonical={getCanonicalUrl(`/ara${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`)}
        keywords={`posta kodu ara, ${searchTerm}, posta kodu sorgulama, adres sorgulama`}
        jsonLd={jsonLd}
      />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            <Search className="w-8 h-8" />
            Posta Kodu Ara
          </h1>
          <p className="text-lg text-muted-foreground">
            İl, ilçe, mahalle veya posta kodu ile arama yapın
          </p>
        </div>

        {/* AJAX Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-4 w-6 h-6 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İl, ilçe, mahalle veya posta kodu ara..."
              className="h-14 pl-12 pr-12 text-lg w-full"
              data-testid="input-search"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Temizle"
                data-testid="button-clear-search"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </form>

        {searchTerm && (
          <>
            <div className="mb-6 text-center">
              <p className="text-sm text-muted-foreground">
                Arama: <span className="font-semibold text-foreground">"{searchTerm}"</span>
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
                description={`"${searchTerm}" için hiçbir sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.`}
              />
            )}
          </>
        )}

        {!searchTerm && (
          <div className="text-center py-16 text-muted-foreground">
            <p>Aramaya başlamak için yukarıdaki arama kutusunu kullanın</p>
          </div>
        )}
      </div>
    </>
  );
}
