import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NeighboringDistrict {
  ilce: string;
  ilceSlug: string;
  mahalleCount: number;
}

interface Props {
  ilSlug: string;
  ilceSlug: string;
  ilName: string;
}

export function NeighboringDistrictsWidget({ ilSlug, ilceSlug, ilName }: Props) {
  const { data: districts, isLoading } = useQuery<NeighboringDistrict[]>({
    queryKey: ['/api/neighboring-districts', ilSlug, ilceSlug],
    enabled: !!ilSlug && !!ilceSlug,
  });

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">
          {ilName} İlinin Diğer İlçeleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (!districts || districts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8" data-testid="section-neighboring-districts">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {ilName} İlinin Diğer İlçeleri
        </h2>
        <p className="text-muted-foreground">
          {ilName} ilindeki diğer {districts.length} ilçeyi keşfedin
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districts.map((district) => (
          <Link
            key={district.ilceSlug}
            href={`/${ilSlug}/${district.ilceSlug}`}
            data-testid={`link-district-${district.ilceSlug}`}
          >
            <Card className="hover-elevate active-elevate-2 transition-all h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {district.ilce}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {district.mahalleCount} mahalle
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
