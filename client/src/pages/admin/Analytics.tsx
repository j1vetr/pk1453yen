import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Eye, Search } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { LoadingStats } from '@/components/LoadingState';

interface AnalyticsData {
  totalSearches: number;
  totalPageViews: number;
  topSearches: Array<{ query: string; count: number }>;
  topPages: Array<{ path: string; views: number }>;
}

export default function Analytics() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics'],
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analitik</h1>
          <p className="text-muted-foreground">
            Site kullanım istatistiklerini ve trendleri görüntüleyin
          </p>
        </div>

        {/* Stats Overview */}
        {isLoading ? (
          <LoadingStats />
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              title="Toplam Arama"
              value={data.totalSearches.toLocaleString('tr-TR')}
              icon={Search}
              description="Kullanıcı aramaları"
            />
            <StatsCard
              title="Toplam Görüntüleme"
              value={data.totalPageViews.toLocaleString('tr-TR')}
              icon={Eye}
              description="Sayfa görüntülenmeleri"
            />
          </div>
        ) : null}

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                En Popüler Aramalar
              </CardTitle>
              <CardDescription>
                En çok aranan terimler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.topSearches && data.topSearches.length > 0 ? (
                <div className="space-y-4">
                  {data.topSearches.map((search, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{search.query}</span>
                        <span className="text-sm text-muted-foreground">{search.count} kez</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{
                            width: `${(search.count / (data.topSearches[0]?.count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Henüz arama verisi bulunmuyor
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                En Çok Görüntülenen Sayfalar
              </CardTitle>
              <CardDescription>
                Popüler sayfa yolları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.topPages && data.topPages.length > 0 ? (
                <div className="space-y-4">
                  {data.topPages.map((page, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate flex-1 mr-2">
                          {page.path}
                        </span>
                        <span className="text-sm text-muted-foreground flex-shrink-0">
                          {page.views}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1 transition-all duration-300"
                          style={{
                            width: `${(page.views / (data.topPages[0]?.views || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Henüz sayfa görüntüleme verisi bulunmuyor
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
