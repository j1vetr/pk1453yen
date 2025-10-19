import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimilarMahalle {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
}

interface Props {
  mahalleName: string;
  currentIl: string;
  currentIlce: string;
}

export function SimilarMahallerWidget({ mahalleName, currentIl, currentIlce }: Props) {
  const { data: mahalleler, isLoading } = useQuery<SimilarMahalle[]>({
    queryKey: ['/api/similar-mahalleler', mahalleName],
    enabled: !!mahalleName,
  });

  // Exclude current mahalle ve aynı ilçedeki mahalleler
  const filteredMahalleler = mahalleler?.filter(
    (m) => !(m.il === currentIl && m.ilce === currentIlce)
  );

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">
          Benzer İsimli Mahalleler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (!filteredMahalleler || filteredMahalleler.length < 2) {
    return null;
  }

  return (
    <section className="mt-8" data-testid="section-similar-mahalleler">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Copy className="w-6 h-6" />
          Benzer İsimli Mahalleler
        </h2>
        <p className="text-muted-foreground">
          Türkiye'nin farklı şehirlerinde <strong>{mahalleName}</strong> adında {filteredMahalleler.length} mahalle daha bulunuyor
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMahalleler.slice(0, 6).map((mahalle) => (
          <Link
            key={`${mahalle.ilSlug}-${mahalle.ilceSlug}-${mahalle.mahalleSlug}`}
            href={`/${mahalle.ilSlug}/${mahalle.ilceSlug}/${mahalle.mahalleSlug}`}
            data-testid={`link-similar-mahalle-${mahalle.mahalleSlug}`}
          >
            <Card className="hover-elevate active-elevate-2 transition-all h-full">
              <CardHeader>
                <CardTitle className="text-base">{mahalle.mahalle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {mahalle.ilce}, {mahalle.il}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredMahalleler.length > 6 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          + {filteredMahalleler.length - 6} mahalle daha
        </p>
      )}
    </section>
  );
}
