import { useState } from 'react';
import { Link } from 'wouter';
import { Moon, Sun, Home, Menu, TrendingUp, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import logoUrl from '@/assets/logo.png';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/istatistikler', label: 'İstatistikler', icon: TrendingUp },
    { href: '/hakkimizda', label: 'Hakkımızda', icon: Info },
    { href: '/iletisim', label: 'İletişim', icon: Mail },
  ];

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Ana sayfaya git">
          <img src={logoUrl} alt="Posta Kodları - Türkiye'nin En Kapsamlı Posta Kodu Rehberi" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav role="navigation" aria-label="Ana menü" className="hidden md:flex items-center gap-2">
          <Link href="/" data-testid="link-home" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <Link href="/istatistikler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2" data-testid="link-stats">
            İstatistikler
          </Link>
          <Link href="/hakkimizda" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            İletişim
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Tema değiştir"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Tema değiştir"
            data-testid="button-theme-toggle-mobile"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menüyü aç"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menü</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-3 rounded-md hover-elevate active-elevate-2"
                      data-testid={`mobile-link-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
