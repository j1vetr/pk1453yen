import { useQuery } from '@tanstack/react-query';
import { Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

interface RecentSearch {
  query: string;
  count: number;
}

export function RecentSearchesWidget() {
  const [, navigate] = useLocation();
  
  const { data: searches, isLoading } = useQuery<RecentSearch[]>({
    queryKey: ['/api/recent-searches'],
    staleTime: 2 * 60 * 1000, // 2 dakika cache
  });

  const handleSearch = (query: string) => {
    navigate(`/ara?q=${encodeURIComponent(query)}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Popüler Aramalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <Card data-testid="widget-recent-searches">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Popüler Aramalar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {searches.slice(0, 8).map((search, index) => (
            <li key={index}>
              <button
                onClick={() => handleSearch(search.query)}
                className="flex items-center gap-2 p-2 rounded-md hover-elevate active-elevate-2 transition-colors group w-full text-left"
                data-testid={`button-search-${index}`}
              >
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate group-hover:text-primary transition-colors">
                    {search.query}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                  {search.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
