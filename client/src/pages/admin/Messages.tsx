import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2, Calendar, User, AtSign } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: number;
  createdAt: string;
}

export default function Messages() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const pageSize = 10;

  const { data, isLoading } = useQuery<{ data: ContactMessage[]; total: number }>({
    queryKey: ['/api/admin/messages', page],
    queryFn: async () => {
      const response = await fetch(`/api/admin/messages?page=${page}&pageSize=${pageSize}`);
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('PATCH', `/api/admin/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages/unread-count'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/messages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages/unread-count'] });
      setSelectedMessage(null);
      toast({
        title: 'Başarılı',
        description: 'Mesaj silindi.',
      });
    },
  });

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.isRead === 0) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mesajlar</h1>
          <p className="text-muted-foreground">
            İletişim formundan gelen mesajları görüntüleyin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Gelen Mesajlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : data && data.data.length > 0 ? (
                <div className="space-y-2">
                  {data.data.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover-elevate ${
                        selectedMessage?.id === message.id
                          ? 'bg-accent border-accent-foreground/20'
                          : message.isRead === 0
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-card'
                      }`}
                      data-testid={`message-item-${message.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {message.isRead === 0 ? (
                            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <MailOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="font-medium text-sm truncate">{message.name}</span>
                        </div>
                        {message.isRead === 0 && (
                          <Badge variant="default" className="text-xs">Yeni</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate pl-6">
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        {format(new Date(message.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        data-testid="button-prev-page"
                      >
                        Önceki
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {page} / {totalPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        data-testid="button-next-page"
                      >
                        Sonraki
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Henüz mesaj bulunmuyor
                </p>
              )}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MailOpen className="w-5 h-5" />
                  Mesaj Detayı
                </span>
                {selectedMessage && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete-message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Gönderen:</span>
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AtSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">E-posta:</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Tarih:</span>
                      <span>
                        {format(new Date(selectedMessage.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">{selectedMessage.subject}</h3>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Mail className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Detayları görüntülemek için bir mesaj seçin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
