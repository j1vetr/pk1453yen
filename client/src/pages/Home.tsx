import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Map, Package } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { SearchBar } from '@/components/SearchBar';
import { StatsCard } from '@/components/StatsCard';
import { PostalCodeCard } from '@/components/PostalCodeCard';
import { LoadingGrid, LoadingStats } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { PopularMahallerWidget } from '@/components/PopularMahallerWidget';
import { RecentSearchesWidget } from '@/components/RecentSearchesWidget';
import { getCanonicalUrl } from '@shared/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Stats {
  totalCities: number;
  totalDistricts: number;
  totalCodes: number;
  lastUpdate: string;
}

interface City {
  il: string;
  ilSlug: string;
  count: number;
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ['/api/cities'],
  });

  const faqItems = [
    {
      question: "Posta kodu nedir ve ne işe yarar?",
      answer: "Posta kodu, posta hizmetlerinde kullanılan ve belirli bir coğrafi bölgeyi temsil eden sayısal bir koddur. Türkiye'de 5 haneli olan posta kodları, kargo ve posta gönderilerinin doğru adrese hızlı ve güvenli bir şekilde ulaşmasını sağlar. Her il, ilçe ve mahallenin kendine özgü bir posta kodu vardır."
    },
    {
      question: "Posta kodu nasıl öğrenilir?",
      answer: "Posta kodunu öğrenmenin en kolay yolu Posta Kodları platformumuzu kullanmaktır. Ana sayfadaki arama kutusuna il, ilçe veya mahalle adını yazarak anında posta kodunu bulabilirsiniz. Alternatif olarak, il > ilçe > mahalle şeklinde hiyerarşik olarak da gezinerek istediğiniz posta koduna ulaşabilirsiniz."
    },
    {
      question: "Türkiye'de kaç tane posta kodu var?",
      answer: "Türkiye'de toplam 2.771 benzersiz posta kodu bulunmaktadır. Ancak platformumuzda 73.000'den fazla kayıt mevcuttur çünkü aynı posta kodu birden fazla mahalle veya yerleşim yeri tarafından kullanılabilir. Tüm 81 il, 973 ilçe ve binlerce mahalle için detaylı posta kodu bilgilerine erişebilirsiniz."
    },
    {
      question: "Posta kodu kaç haneden oluşur?",
      answer: "Türkiye'de posta kodları 5 haneden oluşmaktadır. İlk iki rakam ili, sonraki rakamlar ise ilçe ve mahalle bilgilerini temsil eder. Örneğin, 34710 posta kodunda '34' İstanbul ilini gösterir. Bu standart format sayesinde posta ve kargo şirketleri gönderileri kolayca sınıflandırabilir."
    },
    {
      question: "Posta kodu olmadan kargo gönderilebilir mi?",
      answer: "Teknik olarak posta kodu olmadan kargo göndermek mümkün olsa da, posta kodunun kullanılması teslimat sürecini önemli ölçüde hızlandırır ve hata riskini azaltır. Kargo şirketleri posta kodlarını kullanarak gönderiyi otomatik olarak doğru şubeye yönlendirebilir. Bu nedenle, kargo gönderirken mutlaka doğru posta kodunu kullanmanız önerilir."
    },
    {
      question: "Mahalle posta kodu nasıl bulunur?",
      answer: "Mahalle posta kodunu bulmak için platformumuzda iki yöntem kullanabilirsiniz: 1) Arama kutusuna doğrudan mahalle adını yazarak arama yapabilirsiniz, sistem otomatik olarak ilgili mahallenin posta kodunu gösterecektir. 2) İl ve ilçe seçerek mahalleleri listeletebilir, aradığınız mahalleyi bulabilirsiniz. Her mahalle detay sayfasında posta kodu büyük ve net bir şekilde görüntülenir."
    },
    {
      question: "İstanbul posta kodları kaçtır?",
      answer: "İstanbul'un posta kodları 34000 ile 34990 arasında değişmektedir. İstanbul'da 39 ilçe bulunmaktadır ve her ilçenin birden fazla posta kodu vardır. Örneğin Kadıköy'ün posta kodları 34710-34762 arasındadır. Platformumuzda İstanbul'un tüm ilçeleri ve mahallelerinin posta kodlarını detaylı olarak bulabilirsiniz."
    },
    {
      question: "Posta kodu ile adres bulunur mu?",
      answer: "Evet, posta kodu ile adres bulunabilir. Platformumuzun 'Posta Kodu Ara' özelliğini kullanarak herhangi bir 5 haneli posta kodunu sorgulayabilirsiniz. Sistem size o posta koduna ait tüm mahalleleri, ilçeyi ve ili gösterecektir. Bu özellik özellikle ters adres araması yapmak isteyenler için çok kullanışlıdır."
    },
    {
      question: "Posta kodu değişir mi?",
      answer: "Posta kodları genellikle sabittir ancak nadir durumlarda değişebilir. Yeni yerleşim yerlerinin oluşması, idari sınır değişiklikleri veya PTT'nin sistem güncellemeleri posta kodu değişikliklerine neden olabilir. Platformumuz düzenli olarak güncellenmekte ve en güncel posta kodu bilgilerini sunmaktadır. Son güncellemeler için istatistikler bölümünü kontrol edebilirsiniz."
    },
    {
      question: "Online posta kodu sorgulama nasıl yapılır?",
      answer: "Online posta kodu sorgulaması yapmak için Posta Kodları platformumuzu kullanabilirsiniz. Ana sayfadaki arama kutusuna il, ilçe, mahalle adı veya posta kodu numarasını yazmanız yeterlidir. Türkçe karakter desteği sayesinde 'Kadıköy' veya 'Kadikoy' şeklinde arama yapabilirsiniz. Arama sonuçları anında görüntülenir ve detaylı bilgilere tek tıkla ulaşabilirsiniz."
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': getCanonicalUrl('/#website'),
        name: 'Posta Kodları',
        alternateName: 'Türkiye Posta Kodları',
        description: 'Türkiye geneli posta kodları, il, ilçe ve mahalle bazlı adres bilgileri',
        url: getCanonicalUrl('/'),
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${getCanonicalUrl('/ara')}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@id': getCanonicalUrl('/#organization'),
        },
      },
      {
        '@type': 'Organization',
        '@id': getCanonicalUrl('/#organization'),
        name: 'Posta Kodları',
        alternateName: 'postakodrehberi.com',
        url: getCanonicalUrl('/'),
        logo: {
          '@type': 'ImageObject',
          url: `${getCanonicalUrl('/favicon.png')}`,
        },
        description: 'Türkiye\'nin en kapsamlı posta kodu rehberi. 73.000+ posta kodu bilgisi ile il, ilçe ve mahalle bazlı adres sorgulama platformu.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+905308616785',
          contactType: 'Customer Service',
          email: 'info@postakodrehberi.com',
          availableLanguage: ['Turkish'],
          areaServed: 'TR',
        },
        sameAs: [
          getCanonicalUrl('/'),
          getCanonicalUrl('/hakkimizda'),
          getCanonicalUrl('/iletisim'),
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': getCanonicalUrl('/#faq'),
        mainEntity: faqItems.map((item, index) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Türkiye Posta Kodları - İl, İlçe ve Mahalle Bazlı Posta Kodu Sorgulama"
        description="Türkiye'nin tüm il, ilçe ve mahallelerinin posta kodlarını hızlıca sorgulayın. 73.000+ posta kodu bilgisi ile en güncel adres rehberi."
        canonical={getCanonicalUrl('/')}
        keywords="posta kodu, türkiye posta kodları, il posta kodu, ilçe posta kodu, mahalle posta kodu"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Reklam Alanı - Header */}
          <div className="mb-8 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
            Reklam Alanı
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Türkiye Posta Kodları
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              73.000+ posta kodu bilgisi ile Türkiye'nin en kapsamlı posta kodu rehberi
            </p>
          </div>

          <SearchBar large className="mb-6" />

          <p className="text-center text-sm text-muted-foreground">
            İl, ilçe, mahalle veya posta kodu ile arama yapabilirsiniz
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">İstatistikler</h2>
        {statsLoading ? (
          <LoadingStats />
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Toplam İl"
              value={stats.totalCities}
              icon={Map}
              description="Türkiye geneli"
            />
            <StatsCard
              title="Toplam İlçe"
              value={stats.totalDistricts}
              icon={Building2}
              description="Tüm ilçeler"
            />
            <StatsCard
              title="Toplam Posta Kodu"
              value={stats.totalCodes.toLocaleString('tr-TR')}
              icon={Package}
              description="73.000+ kayıt"
            />
            <StatsCard
              title="Son Güncelleme"
              value={new Date(stats.lastUpdate).toLocaleDateString('tr-TR')}
              icon={MapPin}
              description="Güncel veriler"
            />
          </div>
        ) : null}
      </section>

      {/* Reklam Alanı - İçerik İçi */}
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>
      </div>

      {/* Popüler İçerikler Widget'ları */}
      <section className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PopularMahallerWidget />
          <RecentSearchesWidget />
        </div>
      </section>

      {/* Cities Section */}
      <section className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">İller</h2>
        {citiesLoading ? (
          <LoadingGrid />
        ) : cities && cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <PostalCodeCard
                key={city.ilSlug}
                title={city.il}
                subtitle={`${city.count} posta kodu`}
                href={`/${city.ilSlug}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Veri Bulunamadı"
            description="Henüz hiç il kaydı bulunmuyor. Lütfen admin panelinden CSV import yapın."
          />
        )}
      </section>

      {/* Reklam Alanı - İçerik İçi */}
      <div className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Sık Sorulan Sorular</h2>
          <p className="text-muted-foreground text-lg">
            Posta kodları hakkında merak ettiğiniz her şey
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-base pr-4">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
