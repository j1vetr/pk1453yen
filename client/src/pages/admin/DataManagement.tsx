import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingTable } from '@/components/LoadingState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PostalCodeData {
  id: number;
  il: string;
  ilce: string;
  mahalle: string;
  pk: string;
  semt?: string;
}

interface PaginatedData {
  data: PostalCodeData[];
  total: number;
  page: number;
  pageSize: number;
}

export default function DataManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery<PaginatedData>({
    queryKey: ['/api/admin/postal-codes', page, pageSize, search],
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Veri Yönetimi</h1>
          <p className="text-muted-foreground">
            Posta kodu verilerini görüntüleyin ve yönetin
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Posta Kodları
            </CardTitle>
            <CardDescription>
              {data ? `Toplam ${data.total.toLocaleString('tr-TR')} kayıt` : 'Yükleniyor...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="İl, ilçe, mahalle veya posta kodu ile ara..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <LoadingTable />
            ) : data && data.data.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>İl</TableHead>
                        <TableHead>İlçe</TableHead>
                        <TableHead>Mahalle</TableHead>
                        <TableHead>Semt/Bucak</TableHead>
                        <TableHead>Posta Kodu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.il}</TableCell>
                          <TableCell>{item.ilce}</TableCell>
                          <TableCell>{item.mahalle}</TableCell>
                          <TableCell>{item.semt || '-'}</TableCell>
                          <TableCell className="font-mono">{item.pk}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Sayfa {page} / {totalPages} ({data.total} kayıt)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      data-testid="button-prev"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Önceki
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      data-testid="button-next"
                    >
                      Sonraki
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sonuç bulunamadı</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
