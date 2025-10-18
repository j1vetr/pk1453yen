import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export function CopyButton({ 
  text, 
  label = 'Kopyala',
  variant = 'outline',
  size = 'default'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Kopyalandı!',
        description: `${text} panoya kopyalandı.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kopyalama başarısız oldu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className="gap-2"
      aria-label={`${text} kopyala`}
      data-testid="button-copy"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Kopyalandı!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
