import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4" data-testid="breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" data-testid="breadcrumb-home">
            <a className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </a>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {item.href ? (
              <Link href={item.href} data-testid={`breadcrumb-${index}`}>
                <a className="hover:text-foreground transition-colors">
                  {item.label}
                </a>
              </Link>
            ) : (
              <span className="text-foreground font-medium" data-testid={`breadcrumb-current`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
