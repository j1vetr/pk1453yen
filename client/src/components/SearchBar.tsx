import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  large?: boolean;
}

export function SearchBar({ 
  placeholder = 'İl, ilçe, mahalle veya posta kodu ara...',
  className = '',
  large = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/ara?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Search className={`absolute left-3 text-muted-foreground ${large ? 'top-4 w-6 h-6' : 'top-3 w-5 h-5'}`} />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`${large ? 'h-14 pl-12 pr-12 text-lg' : 'pl-10 pr-10'} w-full`}
          data-testid="input-search"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-3 text-muted-foreground hover:text-foreground transition-colors ${large ? 'top-4' : 'top-3'}`}
            aria-label="Temizle"
            data-testid="button-clear-search"
          >
            <X className={large ? 'w-6 h-6' : 'w-5 h-5'} />
          </button>
        )}
      </div>
      <Button
        type="submit"
        className="hidden"
        data-testid="button-search-submit"
      >
        Ara
      </Button>
    </form>
  );
}
