import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { TrendingUp, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PopularMahalle {
  il: string;
  ilSlug: string;
  ilce: string;
  ilceSlug: string;
  mahalle: string;
  mahalleSlug: string;
  views: number;
}

export function PopularMahallerWidget() {
  const { data: mahalleler, isLoading } = useQuery<PopularMahalle[]>({
    queryKey: ['/api/popular-mahalleler'],
    staleTime: 5 * 60 * 1000, // 5 dakika cache
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            En Çok Ziyaret Edilen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mahalleler || mahalleler.length === 0) {
    return null;
  }

  return (
    <Card data-testid="widget-popular-mahalleler">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          En Çok Ziyaret Edilen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mahalleler.map((mahalle) => (
            <li key={`${mahalle.ilSlug}-${mahalle.ilceSlug}-${mahalle.mahalleSlug}`}>
              <Link
                href={`/${mahalle.ilSlug}/${mahalle.ilceSlug}/${mahalle.mahalleSlug}`}
                className="flex items-start gap-2 p-2 rounded-md hover-elevate active-elevate-2 transition-colors group"
                data-testid={`link-popular-mahalle-${mahalle.mahalleSlug}`}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {mahalle.mahalle}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {mahalle.ilce}, {mahalle.il}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
