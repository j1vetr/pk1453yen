import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/csv-import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Import başarısız');
      }
      
      return await response.json();
    },
    onSuccess: (data: ImportResult) => {
      setResult(data);
      toast({
        title: 'Import Tamamlandı',
        description: `${data.success} kayıt başarıyla import edildi.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Import Başarısız',
        description: error.message || 'Bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast({
        title: 'Geçersiz Dosya',
        description: 'Lütfen .csv uzantılı bir dosya seçin.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = () => {
    if (file) {
      importMutation.mutate(file);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">CSV Import</h1>
          <p className="text-muted-foreground">
            Posta kodu verilerini CSV dosyasından içe aktarın
          </p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Dosya Yükle
            </CardTitle>
            <CardDescription>
              CSV dosyası formatı: il, ilçe, semt_bucak_belde, Mahalle, PK (UTF-8 kodlamalı, noktalı virgül ile ayrılmış)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
                data-testid="input-file"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileText className="w-12 h-12 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-semibold text-primary">Dosya seçin</span>
                  <span className="text-muted-foreground"> veya sürükleyin</span>
                </div>
                <p className="text-xs text-muted-foreground">Maksimum dosya boyutu: 50MB</p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm" data-testid="text-filename">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                  data-testid="button-import"
                >
                  {importMutation.isPending ? 'Import Ediliyor...' : 'Import Et'}
                </Button>
              </div>
            )}

            {importMutation.isPending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Import işlemi devam ediyor...</span>
                  <span>Lütfen bekleyin</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.failed === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                Import Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Başarılı</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-success-count">
                    {result.success}
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Başarısız</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-failed-count">
                    {result.failed}
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-sm">Hatalar:</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {result.errors.map((error, idx) => (
                      <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
