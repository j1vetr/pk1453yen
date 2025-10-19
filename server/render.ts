import { storage } from "./storage";
import { getIlGeoCoordinates, getCanonicalUrl } from "../shared/utils";

interface RenderResult {
  html: string;
  statusCode: number;
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
    const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";

    // Generate JSON-LD schemas
    const jsonLdScripts: string[] = [];

    // PostalAddress
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PostalAddress",
      "addressLocality": firstCode.mahalle,
      "addressRegion": firstCode.il,
      "addressCountry": "TR",
      "postalCode": postalCodesList[0]
    })}</script>`);

    // BreadcrumbList
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": firstCode.il,
          "item": `${baseUrl}/${ilSlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": firstCode.ilce,
          "item": `${baseUrl}/${ilSlug}/${ilceSlug}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": firstCode.mahalle,
          "item": `${baseUrl}/${ilSlug}/${ilceSlug}/${mahalleSlug}`
        }
      ]
    })}</script>`);

    const jsonLdScript = jsonLdScripts.join('\n');

    const html = `
      ${jsonLdScript}
      <div class="container max-w-4xl mx-auto px-4 py-8">
        <nav aria-label="breadcrumb" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-muted-foreground">
            <li><a href="/${ilSlug}" class="hover:text-foreground">${firstCode.il}</a></li>
            <li>/</li>
            <li><a href="/${ilSlug}/${ilceSlug}" class="hover:text-foreground">${firstCode.ilce}</a></li>
            <li>/</li>
            <li class="text-foreground font-medium">${firstCode.mahalle}</li>
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
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${firstCode.mahalle} Mahallesi Posta Kodu</h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              ${firstCode.il} ${firstCode.ilce} ${firstCode.mahalle} Mahallesi'nin posta kodu ${postalCodesList[0]}. 
              ${firstCode.il} ili ${firstCode.ilce} ilçesine bağlı bu mahalle için güncel posta kodu bilgilerini aşağıda bulabilirsiniz.
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
                    <p class="text-muted-foreground mt-2">${firstCode.mahalle}, ${firstCode.ilce} / ${firstCode.il}</p>
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
                  <span>${firstCode.il}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="font-medium">İlçe:</span>
                  <span>${firstCode.ilce}</span>
                </div>
                ${firstCode.semt ? `
                  <div class="flex justify-between py-2 border-b">
                    <span class="font-medium">Semt/Bucak/Belde:</span>
                    <span>${firstCode.semt}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between py-2 border-b">
                  <span class="font-medium">Mahalle/Köy:</span>
                  <span>${firstCode.mahalle}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="font-medium">Posta ${postalCodesList.length > 1 ? 'Kodları' : 'Kodu'}:</span>
                  <span class="font-mono font-bold">${postalCodesList.map((pk: string) => `${pk.slice(0, 2)} ${pk.slice(2)}`).join(', ')}</span>
                </div>
              </div>
            </div>
          </section>

          ${otherMahalleler.length > 0 ? `
            <section id="diger-mahalleler">
              <h2 class="text-2xl font-semibold mb-6">${firstCode.ilce} İlçesindeki Diğer Mahalleler</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${otherMahalleler.map((m: any) => `
                  <a href="/${ilSlug}/${ilceSlug}/${m.mahalleSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <h3 class="font-semibold mb-1">${m.mahalle}</h3>
                    <p class="text-sm text-muted-foreground">${firstCode.ilce} / ${firstCode.il}</p>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </article>
      </div>
    `;

    return { html, statusCode: 200 };
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
    const geoCoords = getIlGeoCoordinates(cityData.il);
    const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";

    // Generate JSON-LD schemas for SEO (separate script tags for each)
    const jsonLdScripts: string[] = [];

    // Place with GeoCoordinates
    if (geoCoords) {
      jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Place",
        "name": `${cityData.il}, Türkiye`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": geoCoords.lat,
          "longitude": geoCoords.lng
        },
        "address": {
          "@type": "PostalAddress",
          "addressRegion": cityData.il,
          "addressCountry": "TR"
        }
      })}</script>`);
    }

    // BreadcrumbList
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cityData.il,
          "item": `${baseUrl}/${ilSlug}`
        }
      ]
    })}</script>`);

    // ItemList for districts
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${cityData.il} Posta Kodları`,
      "description": `${cityData.il} ili posta kodları. ${districts.length} ilçe ve mahallelerinin posta kodlarını görüntüleyin.`,
      "itemListElement": districts.map((d: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": d.ilce,
        "url": `${baseUrl}/${ilSlug}/${d.ilceSlug}`
      }))
    })}</script>`);

    const jsonLdScript = jsonLdScripts.join('\n');

    const html = `
      ${jsonLdScript}
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <article>
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${cityData.il} Posta Kodları</h1>
            <p class="text-lg text-muted-foreground">
              ${cityData.il} ili posta kodları. ${districts.length} ilçe ve mahallelerinin posta kodlarını görüntüleyin.
            </p>
          </header>

          <section>
            <h2 class="text-2xl font-semibold mb-6">${cityData.il} İlçeleri</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${districts.map((d: any) => `
                <a href="/${ilSlug}/${d.ilceSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <h3 class="font-semibold mb-1">${d.ilce}</h3>
                  <p class="text-sm text-muted-foreground">${d.count} mahalle</p>
                </a>
              `).join('')}
            </div>
          </section>
        </article>
      </div>
    `;

    return { html, statusCode: 200 };
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

    const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";

    // Generate JSON-LD schemas
    const jsonLdScripts: string[] = [];

    // BreadcrumbList
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": districtData.il,
          "item": `${baseUrl}/${ilSlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": districtData.ilce,
          "item": `${baseUrl}/${ilSlug}/${ilceSlug}`
        }
      ]
    })}</script>`);

    // ItemList for neighborhoods
    jsonLdScripts.push(`<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${districtData.ilce} Mahalleleri`,
      "description": `${districtData.il}, ${districtData.ilce} ilçesi posta kodları. ${uniqueMahalleler.length} mahalle ve köyün posta kodlarını görüntüleyin.`,
      "itemListElement": uniqueMahalleler.map((m: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": m.mahalle,
        "url": `${baseUrl}/${ilSlug}/${ilceSlug}/${m.mahalleSlug}`
      }))
    })}</script>`);

    const jsonLdScript = jsonLdScripts.join('\n');

    const html = `
      ${jsonLdScript}
      <div class="container max-w-6xl mx-auto px-4 py-8">
        <nav aria-label="breadcrumb" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-muted-foreground">
            <li><a href="/${ilSlug}" class="hover:text-foreground">${districtData.il}</a></li>
            <li>/</li>
            <li class="text-foreground font-medium">${districtData.ilce}</li>
          </ol>
        </nav>

        <article>
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">${districtData.ilce} Posta Kodu</h1>
            <p class="text-lg text-muted-foreground">
              ${districtData.il}, ${districtData.ilce} ilçesi posta kodları. ${uniqueMahalleler.length} mahalle ve köyün posta kodlarına ulaşın.
            </p>
          </header>

          <section>
            <h2 class="text-2xl font-semibold mb-6">${districtData.ilce} Mahalleleri</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${uniqueMahalleler.map((m: any) => `
                <a href="/${ilSlug}/${ilceSlug}/${m.mahalleSlug}" class="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <h3 class="font-semibold mb-1">${m.mahalle}</h3>
                  <p class="text-sm text-muted-foreground">${districtData.ilce} / ${districtData.il}</p>
                </a>
              `).join('')}
            </div>
          </section>
        </article>
      </div>
    `;

    return { html, statusCode: 200 };
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
