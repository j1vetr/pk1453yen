import { SEOHead } from '@/components/SEOHead';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TableOfContents } from '@/components/TableOfContents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, FileText, TruckIcon, Building2, CheckCircle } from 'lucide-react';
import { getCanonicalUrl } from '@shared/utils';

export default function PostalCodeGuidePage() {
  const tocItems = [
    { id: 'howto-steps', title: 'Posta Kodu Bulma Adımları' },
    { id: 'use-cases', title: 'Posta Kodu Kullanım Senaryoları' },
    { id: 'important-tips', title: 'Önemli İpuçları' },
    { id: 'faq-section', title: 'Sık Sorulan Sorular' },
  ];

  const howToSteps = [
    {
      step: 1,
      title: 'İl Seçimi Yapın',
      description: 'Ana sayfadan veya arama çubuğundan gönderi yapacağınız ili seçin. 81 ilin tamamı sistemimizde mevcuttur.',
      icon: Building2,
    },
    {
      step: 2,
      title: 'İlçeyi Bulun',
      description: 'Seçtiğiniz il içindeki ilçeler listeden görünecektir. Gönderi yapacağınız ilçeye tıklayın.',
      icon: MapPin,
    },
    {
      step: 3,
      title: 'Mahalle/Köy Seçin',
      description: 'İlçeye ait tüm mahalle ve köylerin listesi alfabetik olarak sıralanmıştır. İlgili mahalleyi bulun.',
      icon: MapPin,
    },
    {
      step: 4,
      title: 'Posta Kodunu Kopyalayın',
      description: 'Mahalle sayfasında posta kodu büyük puntolarla gösterilir. Yanındaki "Kopyala" butonuna tıklayarak panoya kopyalayın.',
      icon: FileText,
    },
    {
      step: 5,
      title: 'Kargo Formuna Yapıştırın',
      description: 'Kopyaladığınız 5 haneli posta kodunu kargo/posta gönderim formundaki ilgili alana yapıştırın.',
      icon: TruckIcon,
    },
    {
      step: 6,
      title: 'Gönderiminizi Tamamlayın',
      description: 'Adres bilgilerinizi kontrol edin ve posta kodunun doğru olduğundan emin olun. Artık gönderiniz hızla teslim edilecektir!',
      icon: CheckCircle,
    },
  ];

  const useCases = [
    {
      title: 'E-Ticaret ve Online Alışveriş',
      description: 'Online alışveriş yaparken teslimat adresinizi girerken posta kodu alanını mutlaka doldurun. Bu, siparişinizin doğru depoya yönlendirilmesini ve hızlı kargolama sürecini sağlar.',
    },
    {
      title: 'Kargo Gönderimi',
      description: 'Kargo şirketleri (MNG, Yurtiçi, Aras, PTT Kargo vb.) gönderileri posta kodlarına göre sınıflandırır. Doğru posta kodu kullanımı teslimat süresini kısaltır.',
    },
    {
      title: 'Resmi Belgeler ve Yazışmalar',
      description: 'Vergi dairesi, SGK, nüfus müdürlüğü gibi kurumlarla yapılan yazışmalarda posta kodu kullanımı zorunludur. Eksik posta kodu belge iadesine neden olabilir.',
    },
    {
      title: 'Fatura ve Adres Kayıtları',
      description: 'Şirketlerin fatura adresleri, e-fatura sistemleri ve vergi kayıtlarında posta kodu bilgisi bulunması yasal bir gerekliliktir.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Posta Kodu Nasıl Kullanılır?',
    description: 'Türkiye\'de posta kodu bulma ve kullanma rehberi. Adım adım kargo gönderimi için posta kodu sorgulama.',
    step: howToSteps.map((step) => ({
      '@type': 'HowToStep',
      position: step.step,
      name: step.title,
      text: step.description,
    })),
    totalTime: 'PT5M',
  };

  return (
    <>
      <SEOHead
        title="Posta Kodu Nasıl Kullanılır? - Adım Adım Rehber"
        description="Türkiye'de posta kodunu nasıl bulacağınızı ve kargo gönderiminde nasıl kullanacağınızı öğrenin. E-ticaret, resmi belgeler ve posta hizmetleri için detaylı kullanım rehberi."
        canonical={getCanonicalUrl('/posta-kodu-rehberi')}
        keywords="posta kodu nasıl kullanılır, posta kodu bulma, kargo posta kodu, posta kodu sorgulama rehberi"
        jsonLd={jsonLd}
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Posta Kodu Rehberi' },
          ]}
        />

        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Posta Kodu Nasıl Kullanılır?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Posta kodu, Türkiye genelinde posta ve kargo hizmetlerinin hızlı ve doğru şekilde gerçekleştirilmesi için kullanılan 5 haneli bir numaralandırma sistemidir. Bu rehberde posta kodunun nasıl bulunacağını ve farklı senaryolarda nasıl kullanılacağını adım adım öğreneceksiniz.
            </p>
          </header>

          <TableOfContents items={tocItems} />

          <section className="mb-12" aria-labelledby="howto-steps">
            <h2 id="howto-steps" className="text-2xl font-semibold mb-6">
              Posta Kodu Bulma Adımları
            </h2>
            <div className="space-y-4">
              {howToSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                          {step.step}
                        </div>
                        <Icon className="w-6 h-6 text-primary" />
                        <span>{step.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mb-12" aria-labelledby="use-cases">
            <h2 id="use-cases" className="text-2xl font-semibold mb-6">
              Posta Kodu Kullanım Senaryoları
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12" aria-labelledby="important-tips">
            <h2 id="important-tips" className="text-2xl font-semibold mb-6">
              Önemli İpuçları
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Her Zaman 5 Hane:</strong> Türkiye'deki tüm posta kodları 5 haneden oluşur. 34000, 06100 gibi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>İlk 2 Hane İl Kodu:</strong> Posta kodunun ilk iki hanesi ili gösterir (34 = İstanbul, 06 = Ankara).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Mahalle Bazlı:</strong> Her mahallenin kendine özgü bir posta kodu vardır. Doğru mahalleyi seçtiğinizden emin olun.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Güncel Bilgi:</strong> Platformumuz PTT resmi kayıtlarına göre düzenli olarak güncellenmektedir.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Hızlı Arama:</strong> Arama çubuğuna doğrudan mahalle adı yazarak hızlıca posta kodunu bulabilirsiniz.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-semibold mb-6">
              Sık Sorulan Sorular
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Posta kodu zorunlu mudur?</h3>
                  <p className="text-sm text-muted-foreground">
                    Kargo ve posta gönderimlerinde posta kodu zorunlu değildir ancak kullanılması şiddetle tavsiye edilir. Doğru posta kodu teslimat süresini kısaltır ve hata riskini minimize eder.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Yanlış posta kodu kullanırsam ne olur?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yanlış posta kodu kullanımı teslimat gecikmelerine, gönderinin yanlış şubeye gitmesine veya iade edilmesine neden olabilir. Her zaman doğru posta kodunu kullandığınızdan emin olun.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Posta kodu değişir mi?</h3>
                  <p className="text-sm text-muted-foreground">
                    Posta kodları genellikle sabittir ancak yeni yerleşim yerlerinin oluşması veya idari değişiklikler nedeniyle nadir durumlarda değişebilir. En güncel bilgilere platformumuzdan ulaşabilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </article>
      </div>
    </>
  );
}
