import { Link } from 'wouter';
import { Moon, Sun, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl mx-auto items-center justify-between px-4">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors">
          <MapPin className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">Türkiye Posta Kodları</span>
          <span className="sm:hidden">Posta Kodları</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" data-testid="nav-home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Ana Sayfa
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
      </div>
    </header>
  );
}
