import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { getCanonicalUrl } from "@shared/utils";

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Sayfa Bulunamadı - 404"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönün veya posta kodu araması yapın."
        canonical={getCanonicalUrl('/404')}
      />
      
      <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-primary/10 p-6">
                <AlertCircle className="w-16 h-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-primary mb-4" data-testid="text-404">404</h1>
            <h2 className="text-2xl font-semibold mb-3">Sayfa Bulunamadı</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              Ana sayfaya dönüp posta kodu araması yapabilirsiniz.
            </p>
            
            <Link href="/" data-testid="link-home-404">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
