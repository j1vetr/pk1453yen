import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Package, TrendingUp, Search, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/StatsCard';
import { LoadingStats } from '@/components/LoadingState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalCities: number;
  totalDistricts: number;
  totalCodes: number;
  totalSearches: number;
  recentSearches: Array<{ query: string; count: number }>;
  popularPages: Array<{ path: string; views: number }>;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard'],
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Posta kodları platformunuzun genel bakışı
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <LoadingStats />
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Toplam İl"
              value={stats.totalCities}
              icon={MapPin}
            />
            <StatsCard
              title="Toplam İlçe"
              value={stats.totalDistricts}
              icon={Building2}
            />
            <StatsCard
              title="Toplam Posta Kodu"
              value={stats.totalCodes.toLocaleString('tr-TR')}
              icon={Package}
            />
            <StatsCard
              title="Toplam Arama"
              value={stats.totalSearches.toLocaleString('tr-TR')}
              icon={TrendingUp}
            />
          </div>
        ) : null}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Son Aramalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentSearches && stats.recentSearches.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentSearches.map((search, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm font-medium">{search.query}</span>
                      <span className="text-sm text-muted-foreground">
                        {search.count} kez
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz arama yapılmadı
                </p>
              )}
            </CardContent>
          </Card>

          {/* Popular Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Popüler Sayfalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.popularPages && stats.popularPages.length > 0 ? (
                <div className="space-y-3">
                  {stats.popularPages.map((page, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm font-medium truncate flex-1">
                        {page.path}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {page.views} görüntüleme
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henüz sayfa görüntüleme verisi yok
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
