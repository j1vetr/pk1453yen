import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
}

export function TableOfContents({ items, title = 'İçindekiler' }: TableOfContentsProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <List className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav aria-label="İçindekiler">
          <ol className="space-y-2">
            {items.map((item, index) => (
              <li 
                key={item.id}
                className={item.level === 3 ? 'ml-4' : ''}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                  data-testid={`toc-link-${item.id}`}
                >
                  {index + 1}. {item.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </CardContent>
    </Card>
  );
}
