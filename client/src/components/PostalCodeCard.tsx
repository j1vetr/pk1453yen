import { Link } from 'wouter';
import { MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostalCodeCardProps {
  title: string;
  subtitle?: string;
  href: string;
  count?: number;
}

export function PostalCodeCard({ title, subtitle, href, count }: PostalCodeCardProps) {
  return (
    <Link href={href} data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <Card className="hover-elevate active-elevate-2 h-full transition-all duration-150">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-1" data-testid={`text-title`}>
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {subtitle}
                  </p>
                )}
                {count !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {count} {count === 1 ? 'sonuç' : 'sonuç'}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
