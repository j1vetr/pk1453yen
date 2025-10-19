import { storage } from "./storage";
import {
  generateIlDescription,
  generateIlceDescription,
  generateMahalleDescription,
  generateIlFAQ,
  generateIlceFAQ,
  generateMahalleFAQ,
  turkishTitleCase,
} from "../shared/utils";

interface RenderResult {
  html: string;
  statusCode: number;
  jsonLd?: string; // JSON-LD schemas to inject into <head>
}

// Helper: Generate FAQ HTML
function renderFAQ(faqs: Array<{ question: string; answer: string }>): string {
  if (!faqs || faqs.length === 0) return '';
  
  return `
    <section class="mt-12">
      <div class="mb-6">
        <h2 class="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-7 h-7 text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          Sık Sorulan Sorular
        </h2>
        <p class="text-muted-foreground">
          Posta kodları hakkında en çok merak edilen sorular ve cevapları
        </p>
      </div>
      <div class="border rounded-lg">
        <div class="divide-y">
          ${faqs.map((faq, index) => `
            <details class="group p-6">
              <summary class="cursor-pointer list-none flex items-center justify-between font-medium">
                <span>${faq.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform group-open:rotate-180">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </summary>
              <p class="mt-4 text-muted-foreground leading-relaxed">${faq.answer}</p>
            </details>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// Helper: Generate JSON-LD Schema
function generateJSONLD(schemas: any[]): string {
  return schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  ).join('\n');
}

// Helper: Render Footer
function renderFooter(): string {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="bg-muted/30 border-t mt-auto">
      <div class="container max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="space-y-4">
            <a href="/" class="inline-block">
              <img src="/logo.png" alt="Posta Kodları Logo" class="h-12 w-auto" />
            </a>
            <p class="text-sm text-muted-foreground">
              Türkiye'nin en kapsamlı posta kodu rehberi. 73.000+ posta kodu bilgisi ile tüm il, ilçe ve mahallelerin posta kodlarını hızlıca sorgulayın.
            </p>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Hızlı Linkler</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="/" class="text-muted-foreground hover:text-foreground transition-colors">Ana Sayfa</a></li>
              <li><a href="/ara" class="text-muted-foreground hover:text-foreground transition-colors">Posta Kodu Ara</a></li>
              <li><a href="/istatistikler" class="text-muted-foreground hover:text-foreground transition-colors">İlginç İstatistikler</a></li>
              <li><a href="/hakkimizda" class="text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</a></li>
              <li><a href="/iletisim" class="text-muted-foreground hover:text-foreground transition-colors">İletişim</a></li>
              <li><a href="/gizlilik-politikasi" class="text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</a></li>
              <li><a href="/kullanim-sartlari" class="text-muted-foreground hover:text-foreground transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">İletişim</h3>
            <ul class="space-y-3 text-sm">
              <li>
                <a href="mailto:info@postakodrehberi.com" class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"/></svg>
                  info@postakodrehberi.com
                </a>
              </li>
              <li>
                <a href="tel:+905308616785" class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  0530 861 67 85
                </a>
              </li>
              <li>
                <a href="https://wa.me/905308616785" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t mt-8 pt-8 text-center space-y-3">
          <p class="text-sm text-muted-foreground">© ${currentYear} Posta Kodları. Tüm hakları saklıdır.</p>
          <p class="text-sm text-muted-foreground">
            made with <span class="text-primary">❤</span> by 
            <a href="https://toov.com.tr" target="_blank" rel="noopener noreferrer" class="font-medium text-foreground hover:text-primary transition-colors">TOOV</a>
          </p>
          <p class="text-xs text-muted-foreground">
            Bu site, Google reklam iş ortakları tarafından sunulan reklamlar içerebilir. 
            Çerez kullanımı ve kişisel verilerin korunması hakkında daha fazla bilgi için
            <a href="/gizlilik-politikasi" class="text-primary hover:underline">Gizlilik Politikası</a>'nı inceleyebilirsiniz.
          </p>
        </div>
      </div>
    </footer>
  `;
}

// Mahalle page SSR
export async function renderMahallePage(
  ilSlug: string,
  ilceSlug: string,
  mahalleSlug: string
): Promise<RenderResult> {
  try {
    const postalCodes = await storage.getMahalleDetail(ilSlug, ilceSlug, mahalleSlug);

    if (!postalCodes || postalCodes.length === 0) {
      return {
        html: '<div class="container max-w-4xl mx-auto px-4 py-8"><div class="text-center py-16"><h1 class="text-2xl font-semibold mb-4">Mahalle Bulunamadı</h1><p class="text-muted-foreground">Aradığınız mahalle bulunamadı.</p></div></div>',
        statusCode: 404,
      };
    }

    const firstCode = postalCodes[0];
    const relatedMahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);
    const otherMahalleler = relatedMahalleler
      .filter((m) => m.mahalleSlug !== mahalleSlug)
      .slice(0, 6);

    const postalCodesList = postalCodes.map((pc: any) => pc.pk);

    const ilTitle = turkishTitleCase(firstCode.il);
    const ilceTitle = turkishTitleCase(firstCode.ilce);
    const mahalleTitle = turkishTitleCase(firstCode.mahalle);
    
    const html = `
      <div class="container max-w-4xl mx-auto px-4 py-8">
        <nav aria-label="breadcrumb" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-muted-foreground">
            <li><a href="/${ilSlug}" class="hover:text-foreground">${ilTitle}</a></li>
            <li>/</li>
            <li><a href="/${ilSlug}/${ilceSlug}" class="hover:text-foreground">${ilceTitle}</a></li>
            <li>/</li>
            <li class="text-foreground font-medium">${mahalleTitle}</li>
          </ol>
        </nav>

        <a 
          href="#main-content" 
          class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          İçeriğe Geç
        </a>

        <aside class="mb-6 p-4 bg-muted/30 border rounded-lg text-center text-sm text-muted-foreground">
          Reklam Alanı
        </aside>

        <nav class="mb-6 p-4 bg-muted/50 border rounded-lg">
          <p class="text-sm font-semibold mb-2 text-muted-foreground">Hızlı Erişim:</p>
          <div class="flex flex-wrap gap-2">
            <a href="#posta-kodu-bilgisi" class="text-sm px-3 py-1 bg-background border rounded-md">Posta Kodu</a>
            <a href="#adres-hiyerarsisi" class="text-sm px-3 py-1 bg-background border rounded-md">Adres Detayları</a>
            ${otherMahalleler.length > 0 ? '<a href="#diger-mahalleler" class="text-sm px-3 py-1 bg-background border rounded-md">Diğer Mahalleler</a>' : ''}
          </div>
        </nav>

        <article id="main-content">
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${mahalleTitle} Mahallesi Posta Kodu</h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              ${generateMahalleDescription(mahalleTitle, ilceTitle, ilTitle, postalCodesList[0])}
            </p>
          </header>

          <section class="mb-8" id="posta-kodu-bilgisi">
            <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
              Posta ${postalCodesList.length > 1 ? 'Kodları' : 'Kodu'}
            </h2>
            <div class="border border-primary/20 rounded-lg p-6">
              ${postalCodesList.map((pk: string, index: number) => `
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 ${index < postalCodesList.length - 1 ? 'pb-4 border-b mb-4' : ''}">
                  <div class="flex-1">
                    <p class="text-4xl font-mono font-bold text-primary">${pk.slice(0, 2)} ${pk.slice(2)}</p>
                    <p class="text-muted-foreground mt-2">${mahalleTitle}, ${ilceTitle} / ${ilTitle}</p>
                  </div>
                  <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md" data-copy="${pk}">Kopyala</button>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="mb-8" id="adres-hiyerarsisi">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Adres Hiyerarşisi
            </h3>
            <div class="border rounded-lg p-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b">
                  <span class="font-medium">İl:</span>
                  <span>${ilTitle}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="font-medium">İlçe:</span>
                  <span>${ilceTitle}</span>
                </div>
                ${firstCode.semt ? `
                  <div class="flex justify-between py-2 border-b">
                    <span class="font-medium">Semt/Bucak/Belde:</span>
                    <span>${turkishTitleCase(firstCode.semt)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between py-2 border-b">
                  <span class="font-medium">Mahalle/Köy:</span>
                  <span>${mahalleTitle}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="font-medium">Posta ${postalCodesList.length > 1 ? 'Kodları' : 'Kodu'}:</span>
                  <span class="font-mono font-bold">${postalCodesList.map((pk: string) => `${pk.slice(0, 2)} ${pk.slice(2)}`).join(', ')}</span>
                </div>
              </div>
            </div>
          </section>

          ${renderFAQ(generateMahalleFAQ(mahalleTitle, ilceTitle, ilTitle, postalCodesList[0]))}

          ${otherMahalleler.length > 0 ? `
            <section id="diger-mahalleler">
              <h2 class="text-2xl font-semibold mb-6">${ilceTitle} İlçesindeki Diğer Mahalleler</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${otherMahalleler.map((m: any) => `
                  <a href="/${ilSlug}/${ilceSlug}/${m.mahalleSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <h3 class="font-semibold mb-1">${turkishTitleCase(m.mahalle)}</h3>
                    <p class="text-sm text-muted-foreground">${ilceTitle} / ${ilTitle}</p>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </article>
      </div>
      ${renderFooter()}
    `;

    const jsonLdSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'PostalAddress',
        streetAddress: mahalleTitle.endsWith(' Mah') ? `${mahalleTitle}.` : `${mahalleTitle} Mah.`,
        addressLocality: ilceTitle,
        addressRegion: ilTitle,
        postalCode: postalCodesList.join(', '),
        addressCountry: 'TR',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Anasayfa', item: 'https://postakodrehberi.com/' },
          { '@type': 'ListItem', position: 2, name: ilTitle, item: `https://postakodrehberi.com/${ilSlug}` },
          { '@type': 'ListItem', position: 3, name: ilceTitle, item: `https://postakodrehberi.com/${ilSlug}/${ilceSlug}` },
          { '@type': 'ListItem', position: 4, name: mahalleTitle, item: `https://postakodrehberi.com/${ilSlug}/${ilceSlug}/${mahalleSlug}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: generateMahalleFAQ(mahalleTitle, ilceTitle, ilTitle, postalCodesList[0]).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    ];

    return { html, statusCode: 200, jsonLd: generateJSONLD(jsonLdSchemas) };
  } catch (error) {
    console.error("Mahalle SSR error:", error);
    return {
      html: '<div class="container"><p>Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

// City page SSR
export async function renderCityPage(ilSlug: string): Promise<RenderResult> {
  try {
    const districts = await storage.getDistrictsByCity(ilSlug);

    if (!districts || districts.length === 0) {
      return {
        html: '<div class="container max-w-4xl mx-auto px-4 py-8"><div class="text-center py-16"><h1 class="text-2xl font-semibold mb-4">İl Bulunamadı</h1><p class="text-muted-foreground">Aradığınız il bulunamadı.</p></div></div>',
        statusCode: 404,
      };
    }

    const cityData = districts[0];
    const ilTitle = turkishTitleCase(cityData.il);

    const html = `
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <article>
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${ilTitle} Posta Kodları</h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              ${generateIlDescription(ilTitle)}
            </p>
          </header>

          <section>
            <h2 class="text-2xl font-semibold mb-6">İlçeler</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${districts.map((d: any) => `
                <a href="/${ilSlug}/${d.ilceSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <h3 class="font-semibold mb-1">${turkishTitleCase(d.ilce)}</h3>
                  <p class="text-sm text-muted-foreground">${d.count} posta kodu</p>
                </a>
              `).join('')}
            </div>
          </section>

          ${renderFAQ(generateIlFAQ(ilTitle))}
        </article>
      </div>
      ${renderFooter()}
    `;

    const jsonLdSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${ilTitle} Posta Kodları`,
        itemListElement: districts.map((d: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: turkishTitleCase(d.ilce),
          url: `https://postakodrehberi.com/${ilSlug}/${d.ilceSlug}`,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: generateIlFAQ(ilTitle).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    ];

    return { html, statusCode: 200, jsonLd: generateJSONLD(jsonLdSchemas) };
  } catch (error) {
    console.error("City SSR error:", error);
    return {
      html: '<div class="container"><p>Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

// District page SSR
export async function renderDistrictPage(ilSlug: string, ilceSlug: string): Promise<RenderResult> {
  try {
    const mahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);

    if (!mahalleler || mahalleler.length === 0) {
      return {
        html: '<div class="container max-w-4xl mx-auto px-4 py-8"><div class="text-center py-16"><h1 class="text-2xl font-semibold mb-4">İlçe Bulunamadı</h1><p class="text-muted-foreground">Aradığınız ilçe bulunamadı.</p></div></div>',
        statusCode: 404,
      };
    }

    const districtData = mahalleler[0];
    const uniqueMahalleler = Array.from(new Set(mahalleler.map((m: any) => m.mahalleSlug)))
      .map(slug => mahalleler.find((m: any) => m.mahalleSlug === slug));

    const ilTitle = turkishTitleCase(districtData.il);
    const ilceTitle = turkishTitleCase(districtData.ilce);

    const html = `
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <nav aria-label="breadcrumb" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-muted-foreground">
            <li><a href="/${ilSlug}" class="hover:text-foreground">${ilTitle}</a></li>
            <li>/</li>
            <li class="text-foreground font-medium">${ilceTitle}</li>
          </ol>
        </nav>

        <article>
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${ilceTitle}, ${ilTitle} Posta Kodları</h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              ${generateIlceDescription(ilceTitle, ilTitle)}
            </p>
          </header>

          <section>
            <h2 class="text-2xl font-semibold mb-6">Mahalleler</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${uniqueMahalleler.map((m: any) => `
                <a href="/${ilSlug}/${ilceSlug}/${m.mahalleSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <h3 class="font-semibold mb-1">${turkishTitleCase(m.mahalle)}</h3>
                  <p class="text-sm text-muted-foreground">${ilceTitle} / ${ilTitle}</p>
                </a>
              `).join('')}
            </div>
          </section>

          ${renderFAQ(generateIlceFAQ(ilceTitle, ilTitle))}
        </article>
      </div>
      ${renderFooter()}
    `;

    const jsonLdSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${ilceTitle}, ${ilTitle} Posta Kodları`,
        itemListElement: uniqueMahalleler.map((m: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: turkishTitleCase(m.mahalle),
          url: `https://postakodrehberi.com/${ilSlug}/${ilceSlug}/${m.mahalleSlug}`,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: generateIlceFAQ(ilceTitle, ilTitle).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    ];

    return { html, statusCode: 200, jsonLd: generateJSONLD(jsonLdSchemas) };
  } catch (error) {
    console.error("District SSR error:", error);
    return {
      html: '<div class="container"><p>Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

// Postal code page SSR
export async function renderPostalCodePage(pk: string): Promise<RenderResult> {
  try {
    const locations = await storage.getLocationsByPostalCode(pk);

    if (!locations || locations.length === 0) {
      return {
        html: '<div class="container max-w-4xl mx-auto px-4 py-8"><div class="text-center py-16"><h1 class="text-2xl font-semibold mb-4">Posta Kodu Bulunamadı</h1><p class="text-muted-foreground">Aradığınız posta kodu bulunamadı.</p></div></div>',
        statusCode: 404,
      };
    }

    const html = `
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <article>
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${pk} Posta Kodu</h1>
            <p class="text-lg text-muted-foreground">
              ${pk} posta koduna bağlı ${locations.length} farklı yerleşim yeri bulunmaktadır.
            </p>
          </header>

          <section>
            <h2 class="text-2xl font-semibold mb-6">İlgili Yerleşimler</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${locations.map((loc: any) => `
                <a href="/${loc.ilSlug}/${loc.ilceSlug}/${loc.mahalleSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <h3 class="font-semibold mb-1">${loc.mahalle}</h3>
                  <p class="text-sm text-muted-foreground">${loc.ilce} / ${loc.il}</p>
                </a>
              `).join('')}
            </div>
          </section>
        </article>
      </div>
    `;

    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Postal code SSR error:", error);
    return {
      html: '<div class="container"><p>Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}

// Home page SSR
export async function renderHomePage(): Promise<RenderResult> {
  try {
    const cities = await storage.getCities();

    const html = `
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <article>
          <header class="mb-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Türkiye Posta Kodları</h1>
            <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
              Türkiye'nin 81 ilinin tüm ilçe ve mahalle posta kodlarını ücretsiz sorgulayın. 73.000+ posta kodu bilgisi.
            </p>
          </header>

          <section>
            <h2 class="text-3xl font-semibold mb-6 text-center">İllere Göre Posta Kodları</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              ${cities.map((city: any) => `
                <a href="/${city.ilSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors text-center">
                  <h3 class="font-semibold">${city.il}</h3>
                  <p class="text-sm text-muted-foreground mt-1">${city.count} mahalle</p>
                </a>
              `).join('')}
            </div>
          </section>
        </article>
      </div>
    `;

    return { html, statusCode: 200 };
  } catch (error) {
    console.error("Home SSR error:", error);
    return {
      html: '<div class="container"><p>Bir hata oluştu</p></div>',
      statusCode: 500,
    };
  }
}
