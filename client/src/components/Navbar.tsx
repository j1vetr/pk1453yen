import { Link } from 'wouter';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import logoUrl from '@/assets/logo.png';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
        <Link href="/" data-testid="nav-logo" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logoUrl} alt="Posta Kodum Logo" className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/ara" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Ara
          </Link>
          <Link href="/hakkimizda" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hidden sm:inline-block">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hidden sm:inline-block">
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
      </div>
    </header>
  );
}
