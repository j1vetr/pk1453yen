import { type Request, type Response } from "express";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

interface PageMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  statusCode: number;
}

export async function generatePageMeta(url: string): Promise<PageMeta> {
  const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
  const canonicalUrl = `${baseUrl}${url}`;

  // Default meta for homepage
  if (url === "/") {
    return {
      title: "Türkiye Posta Kodları - İl, İlçe ve Mahalle Bazlı Posta Kodu Sorgulama",
      description: "Türkiye'nin tüm il, ilçe ve mahallelerinin posta kodlarını hızlıca sorgulayın. 73.000+ posta kodu bilgisi ile en güncel adres rehberi.",
      canonicalUrl,
      ogTitle: "Türkiye Posta Kodları",
      ogDescription: "Türkiye'nin en kapsamlı posta kodu rehberi. 73.000+ posta kodu bilgisi.",
      statusCode: 200,
    };
  }

  // Static pages
  const staticPages: Record<string, PageMeta> = {
    "/ara": {
      title: "Posta Kodu Ara - Türkiye Posta Kodları",
      description: "İl, ilçe, mahalle veya posta kodu ile arama yapın. Türkiye'nin tüm posta kodlarına hızlıca ulaşın.",
      canonicalUrl: `${baseUrl}/ara`,
      ogTitle: "Posta Kodu Ara",
      ogDescription: "İl, ilçe, mahalle veya posta kodu ile arama yapın.",
      statusCode: 200,
    },
    "/hakkimizda": {
      title: "Hakkımızda - Posta Kodları",
      description: "Türkiye'nin en kapsamlı posta kodu rehberi hakkında bilgi alın. 73.000+ posta kodu bilgisi ile hizmetinizdeyiz.",
      canonicalUrl: `${baseUrl}/hakkimizda`,
      ogTitle: "Hakkımızda - Posta Kodları",
      ogDescription: "Türkiye'nin en kapsamlı posta kodu rehberi hakkında bilgi.",
      statusCode: 200,
    },
    "/iletisim": {
      title: "İletişim - Posta Kodları",
      description: "Bize ulaşın. Sorularınız, önerileriniz veya geri bildirimleriniz için iletişim formumuzu kullanabilirsiniz.",
      canonicalUrl: `${baseUrl}/iletisim`,
      ogTitle: "İletişim - Posta Kodları",
      ogDescription: "Bize ulaşın. Sorularınız için iletişim formumuzu kullanın.",
      statusCode: 200,
    },
    "/gizlilik-politikasi": {
      title: "Gizlilik Politikası - Posta Kodları",
      description: "Gizlilik politikamız hakkında detaylı bilgi edinin. Verilerinizin güvenliği bizim için önemlidir.",
      canonicalUrl: `${baseUrl}/gizlilik-politikasi`,
      ogTitle: "Gizlilik Politikası",
      ogDescription: "Gizlilik politikamız hakkında detaylı bilgi.",
      statusCode: 200,
    },
    "/kullanim-sartlari": {
      title: "Kullanım Şartları - Posta Kodları",
      description: "Web sitemizi kullanırken geçerli olan şartlar ve koşullar hakkında bilgi edinin.",
      canonicalUrl: `${baseUrl}/kullanim-sartlari`,
      ogTitle: "Kullanım Şartları",
      ogDescription: "Web sitemizin kullanım şartları ve koşulları.",
      statusCode: 200,
    },
    "/cerez-politikasi": {
      title: "Çerez Politikası - Posta Kodları",
      description: "Web sitemizde kullanılan çerezler hakkında detaylı bilgi edinin.",
      canonicalUrl: `${baseUrl}/cerez-politikasi`,
      ogTitle: "Çerez Politikası",
      ogDescription: "Web sitemizde kullanılan çerezler hakkında bilgi.",
      statusCode: 200,
    },
  };

  if (staticPages[url]) {
    return staticPages[url];
  }

  // Admin pages - return basic meta
  if (url.startsWith("/admin")) {
    return {
      title: "Admin Panel - Posta Kodları",
      description: "Yönetim paneli",
      canonicalUrl,
      ogTitle: "Admin Panel",
      ogDescription: "Yönetim paneli",
      statusCode: 200,
    };
  }

  // Parse dynamic routes
  const parts = url.split("/").filter(Boolean);

  try {
    // Postal code page: /kod/:pk
    if (parts[0] === "kod" && parts[1]) {
      const pk = parts[1];
      const locations = await storage.getLocationsByPostalCode(pk);

      if (!locations || locations.length === 0) {
        return {
          title: "Sayfa Bulunamadı - Posta Kodları",
          description: "Aradığınız sayfa bulunamadı.",
          canonicalUrl,
          ogTitle: "Sayfa Bulunamadı",
          ogDescription: "Aradığınız sayfa bulunamadı.",
          statusCode: 404,
        };
      }

      const firstLocation = locations[0];
      return {
        title: `${pk} Posta Kodu - ${firstLocation.il} İli Posta Kodu`,
        description: `${pk} posta koduna sahip ${locations.length} adet mahalle/köy bulunmaktadır. ${firstLocation.il}, ${firstLocation.ilce} posta kodu bilgileri.`,
        canonicalUrl,
        ogTitle: `${pk} Posta Kodu`,
        ogDescription: `${pk} posta koduna sahip mahalle ve köyler.`,
        statusCode: 200,
      };
    }

    // City page: /:ilSlug
    if (parts.length === 1) {
      const ilSlug = parts[0];
      const districts = await storage.getDistrictsByCity(ilSlug);

      if (!districts || districts.length === 0) {
        return {
          title: "Sayfa Bulunamadı - Posta Kodları",
          description: "Aradığınız sayfa bulunamadı.",
          canonicalUrl,
          ogTitle: "Sayfa Bulunamadı",
          ogDescription: "Aradığınız sayfa bulunamadı.",
          statusCode: 404,
        };
      }

      const cityData = districts[0];
      return {
        title: `${cityData.il} Posta Kodu - ${cityData.il} İlçeleri ve Posta Kodları`,
        description: `${cityData.il} ili posta kodları. ${districts.length} ilçe ve mahallelerinin posta kodlarını sorgulayın.`,
        canonicalUrl,
        ogTitle: `${cityData.il} Posta Kodu`,
        ogDescription: `${cityData.il} ili ${districts.length} ilçe posta kodları.`,
        statusCode: 200,
      };
    }

    // District page: /:ilSlug/:ilceSlug
    if (parts.length === 2) {
      const [ilSlug, ilceSlug] = parts;
      const mahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);

      if (!mahalleler || mahalleler.length === 0) {
        return {
          title: "Sayfa Bulunamadı - Posta Kodları",
          description: "Aradığınız sayfa bulunamadı.",
          canonicalUrl,
          ogTitle: "Sayfa Bulunamadı",
          ogDescription: "Aradığınız sayfa bulunamadı.",
          statusCode: 404,
        };
      }

      const districtData = mahalleler[0];
      // Count unique mahalle slugs
      const uniqueMahalleler = new Set(mahalleler.map((m) => m.mahalleSlug));
      
      return {
        title: `${districtData.ilce} Posta Kodu - ${districtData.il}, ${districtData.ilce} Mahalle Posta Kodları`,
        description: `${districtData.il}, ${districtData.ilce} ilçesi posta kodları. ${uniqueMahalleler.size} mahalle ve köyün posta kodlarına ulaşın.`,
        canonicalUrl,
        ogTitle: `${districtData.ilce} Posta Kodu`,
        ogDescription: `${districtData.il}, ${districtData.ilce} ${uniqueMahalleler.size} mahalle posta kodları.`,
        statusCode: 200,
      };
    }

    // Neighborhood page: /:ilSlug/:ilceSlug/:mahalleSlug
    if (parts.length === 3) {
      const [ilSlug, ilceSlug, mahalleSlug] = parts;
      const postalCodes = await storage.getMahalleDetail(ilSlug, ilceSlug, mahalleSlug);

      if (!postalCodes || postalCodes.length === 0) {
        return {
          title: "Sayfa Bulunamadı - Posta Kodları",
          description: "Aradığınız sayfa bulunamadı.",
          canonicalUrl,
          ogTitle: "Sayfa Bulunamadı",
          ogDescription: "Aradığınız sayfa bulunamadı.",
          statusCode: 404,
        };
      }

      const firstCode = postalCodes[0];
      const postalCodesList = postalCodes.map((pc: { pk: string }) => pc.pk).join(", ");

      return {
        title: `${firstCode.mahalle} Posta Kodu - ${firstCode.il}, ${firstCode.ilce}, ${firstCode.mahalle}`,
        description: `${firstCode.il}, ${firstCode.ilce}, ${firstCode.mahalle} posta kodu: ${postalCodesList}. Mahalle posta kodu bilgileri.`,
        canonicalUrl,
        ogTitle: `${firstCode.mahalle} Posta Kodu`,
        ogDescription: `${firstCode.il}, ${firstCode.ilce}, ${firstCode.mahalle} posta kodu bilgileri.`,
        statusCode: 200,
      };
    }
  } catch (error) {
    console.error("SSR Meta Generation Error:", error);
  }

  // 404 for unknown routes
  return {
    title: "Sayfa Bulunamadı - Posta Kodları",
    description: "Aradığınız sayfa bulunamadı.",
    canonicalUrl,
    ogTitle: "Sayfa Bulunamadı",
    ogDescription: "Aradığınız sayfa bulunamadı.",
    statusCode: 404,
  };
}

export async function renderHTMLWithMeta(req: Request, res: Response, templatePath: string) {
  try {
    const url = req.originalUrl.split("?")[0]; // Remove query params
    const meta = await generatePageMeta(url);

    // Read HTML template
    let html = await fs.promises.readFile(templatePath, "utf-8");

    // Replace placeholders
    html = html
      .replace(/\{\{TITLE\}\}/g, meta.title)
      .replace(/\{\{DESCRIPTION\}\}/g, meta.description)
      .replace(/\{\{CANONICAL_URL\}\}/g, meta.canonicalUrl)
      .replace(/\{\{OG_TITLE\}\}/g, meta.ogTitle)
      .replace(/\{\{OG_DESCRIPTION\}\}/g, meta.ogDescription);

    res.status(meta.statusCode).set({ "Content-Type": "text/html" }).send(html);
  } catch (error) {
    console.error("SSR Render Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
