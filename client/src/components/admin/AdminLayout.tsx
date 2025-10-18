import { useLocation, Link } from 'wouter';
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  Settings, 
  Search as SearchIcon, 
  BarChart3, 
  MessageSquare,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: MessageSquare, label: 'Mesajlar', href: '/admin/messages' },
  { icon: Upload, label: 'CSV Import', href: '/admin/csv-import' },
  { icon: Database, label: 'Veri Yönetimi', href: '/admin/data' },
  { icon: Settings, label: 'Site Ayarları', href: '/admin/settings' },
  { icon: SearchIcon, label: 'SEO Yönetimi', href: '/admin/seo' },
  { icon: BarChart3, label: 'Analitik', href: '/admin/analytics' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/logout', {});
    },
    onSuccess: () => {
      toast({
        title: 'Çıkış Yapıldı',
        description: 'Başarıyla çıkış yaptınız.',
      });
      setLocation('/admin');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Türkiye Posta Kodları</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <a
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover-elevate'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start gap-3"
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Koyu Tema</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Açık Tema</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="container max-w-7xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
