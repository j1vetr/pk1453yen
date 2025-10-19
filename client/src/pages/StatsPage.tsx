import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Award, MapPin, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { getCanonicalUrl } from '@shared/utils';
import { Link } from 'wouter';

interface InterestingStats {
  longestMahalle: {
    mahalle: string;
    il: string;
    ilce: string;
    length: number;
  } | null;
  shortestMahalle: {
    mahalle: string;
    il: string;
    ilce: string;
    length: number;
  } | null;
  mostCodesDistrict: {
    il: string;
    ilce: string;
    count: number;
  } | null;
  mostMahalleDistrict: {
    il: string;
    ilce: string;
    count: number;
  } | null;
  commonMahalleNames: Array<{
    mahalle: string;
    count: number;
  }>;
}

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery<InterestingStats>({
    queryKey: ['/api/interesting-stats'],
  });

  return (
    <>
      <SEOHead
        title="İlginç İstatistikler - Türkiye Posta Kodları"
        description="Türkiye posta kodları hakkında ilginç istatistikler: En uzun mahalle ismi, en fazla mahallesi olan ilçe, en yaygın mahalle isimleri ve daha fazlası."
        canonical={getCanonicalUrl('/istatistikler')}
        keywords="posta kodu istatistikleri, türkiye mahalle istatistikleri, ilginç veriler"
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            İlginç İstatistikler
          </h1>
          <p className="text-lg text-muted-foreground">
            Türkiye posta kodları hakkında ilginç bilgiler ve rekorlar
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* En Uzun Mahalle İsmi */}
            {stats.longestMahalle && (
              <Card data-testid="card-longest-mahalle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    En Uzun Mahalle İsmi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {stats.longestMahalle.mahalle}
                    </p>
                    <p className="text-muted-foreground">
                      {stats.longestMahalle.ilce}, {stats.longestMahalle.il}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Hash className="w-4 h-4 inline mr-1" />
                      {stats.longestMahalle.length} karakter
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* En Kısa Mahalle İsmi */}
            {stats.shortestMahalle && (
              <Card data-testid="card-shortest-mahalle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    En Kısa Mahalle İsmi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {stats.shortestMahalle.mahalle}
                    </p>
                    <p className="text-muted-foreground">
                      {stats.shortestMahalle.ilce}, {stats.shortestMahalle.il}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Hash className="w-4 h-4 inline mr-1" />
                      {stats.shortestMahalle.length} karakter
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* En Fazla Posta Koduna Sahip İlçe */}
            {stats.mostCodesDistrict && (
              <Card data-testid="card-most-codes-district">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    En Fazla Posta Koduna Sahip İlçe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {stats.mostCodesDistrict.ilce}
                    </p>
                    <p className="text-muted-foreground">
                      {stats.mostCodesDistrict.il}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {stats.mostCodesDistrict.count.toLocaleString('tr-TR')} posta kodu kaydı
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* En Fazla Mahallesi Olan İlçe */}
            {stats.mostMahalleDistrict && (
              <Card data-testid="card-most-mahalle-district">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    En Fazla Mahallesi Olan İlçe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      {stats.mostMahalleDistrict.ilce}
                    </p>
                    <p className="text-muted-foreground">
                      {stats.mostMahalleDistrict.il}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {stats.mostMahalleDistrict.count.toLocaleString('tr-TR')} benzersiz mahalle
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* En Yaygın Mahalle İsimleri */}
            {stats.commonMahalleNames && stats.commonMahalleNames.length > 0 && (
              <Card data-testid="card-common-mahalle-names">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    En Yaygın Mahalle İsimleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground mb-4">
                      Türkiye'nin farklı şehirlerinde en çok kullanılan mahalle isimleri
                    </p>
                    {stats.commonMahalleNames.map((item, index) => (
                      <div
                        key={item.mahalle}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        data-testid={`common-mahalle-${index}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.mahalle}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.count} farklı ilçede
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">
                    Daha fazla posta kodu bilgisine mi ihtiyacınız var?
                  </p>
                  <Link
                    href="/ara"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 transition-all"
                    data-testid="link-search-cta"
                  >
                    Posta Kodu Ara
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </>
  );
}
