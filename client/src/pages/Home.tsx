import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Map, Package } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { SearchBar } from '@/components/SearchBar';
import { StatsCard } from '@/components/StatsCard';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid, LoadingStats } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { getCanonicalUrl } from '@shared/utils';

interface Stats {
  totalCities: number;
  totalDistricts: number;
  totalCodes: number;
  lastUpdate: string;
}

interface City {
  il: string;
  ilSlug: string;
  count: number;
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ['/api/cities'],
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': getCanonicalUrl('/#website'),
        name: 'Posta Kodları',
        alternateName: 'Türkiye Posta Kodları',
        description: 'Türkiye geneli posta kodları, il, ilçe ve mahalle bazlı adres bilgileri',
        url: getCanonicalUrl('/'),
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${getCanonicalUrl('/ara')}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@id': getCanonicalUrl('/#organization'),
        },
      },
      {
        '@type': 'Organization',
        '@id': getCanonicalUrl('/#organization'),
        name: 'Posta Kodları',
        alternateName: 'postakodrehberi.com',
        url: getCanonicalUrl('/'),
        logo: {
          '@type': 'ImageObject',
          url: `${getCanonicalUrl('/favicon.png')}`,
        },
        description: 'Türkiye\'nin en kapsamlı posta kodu rehberi. 73.000+ posta kodu bilgisi ile il, ilçe ve mahalle bazlı adres sorgulama platformu.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+905308616785',
          contactType: 'Customer Service',
          email: 'info@postakodrehberi.com',
          availableLanguage: ['Turkish'],
          areaServed: 'TR',
        },
        sameAs: [
          getCanonicalUrl('/'),
          getCanonicalUrl('/hakkimizda'),
          getCanonicalUrl('/iletisim'),
        ],
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Türkiye Posta Kodları - İl, İlçe ve Mahalle Bazlı Posta Kodu Sorgulama"
        description="Türkiye'nin tüm il, ilçe ve mahallelerinin posta kodlarını hızlıca sorgulayın. 73.000+ posta kodu bilgisi ile en güncel adres rehberi."
        canonical={getCanonicalUrl('/')}
        keywords="posta kodu, türkiye posta kodları, il posta kodu, ilçe posta kodu, mahalle posta kodu"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Reklam Alanı - Header */}
          <div className="mb-8 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
            Reklam Alanı
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Türkiye Posta Kodları
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              73.000+ posta kodu bilgisi ile Türkiye'nin en kapsamlı posta kodu rehberi
            </p>
          </div>

          <SearchBar large className="mb-6" />

          <p className="text-center text-sm text-muted-foreground">
            İl, ilçe, mahalle veya posta kodu ile arama yapabilirsiniz
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">İstatistikler</h2>
        {statsLoading ? (
          <LoadingStats />
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Toplam İl"
              value={stats.totalCities}
              icon={Map}
              description="Türkiye geneli"
            />
            <StatsCard
              title="Toplam İlçe"
              value={stats.totalDistricts}
              icon={Building2}
              description="Tüm ilçeler"
            />
            <StatsCard
              title="Toplam Posta Kodu"
              value={stats.totalCodes.toLocaleString('tr-TR')}
              icon={Package}
              description="73.000+ kayıt"
            />
            <StatsCard
              title="Son Güncelleme"
              value={new Date(stats.lastUpdate).toLocaleDateString('tr-TR')}
              icon={MapPin}
              description="Güncel veriler"
            />
          </div>
        ) : null}
      </section>

      {/* Reklam Alanı - İçerik İçi */}
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>
      </div>

      {/* Cities Section */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">İller</h2>
        {citiesLoading ? (
          <LoadingGrid />
        ) : cities && cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <PostalCodeCard
                key={city.ilSlug}
                title={city.il}
                subtitle={`${city.count} posta kodu`}
                href={`/${city.ilSlug}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Veri Bulunamadı"
            description="Henüz hiç il kaydı bulunmuyor. Lütfen admin panelinden CSV import yapın."
          />
        )}
      </section>
    </>
  );
}
