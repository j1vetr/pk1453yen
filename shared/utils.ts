/**
 * Turkish character normalization for URL-safe slugs
 * Converts: İ→i, ı→i, Ş→s, ş→s, Ğ→g, ğ→g, Ü→u, ü→u, Ö→o, ö→o, Ç→c, ç→c
 */
export function turkishToSlug(text: string): string {
  if (!text) return '';
  
  const turkishMap: Record<string, string> = {
    'İ': 'i', 'I': 'i', 'ı': 'i',
    'Ş': 's', 'ş': 's',
    'Ğ': 'g', 'ğ': 'g',
    'Ü': 'u', 'ü': 'u',
    'Ö': 'o', 'ö': 'o',
    'Ç': 'c', 'ç': 'c',
  };

  let slug = text.trim();
  
  // Replace Turkish characters
  Object.keys(turkishMap).forEach(key => {
    slug = slug.replace(new RegExp(key, 'g'), turkishMap[key]);
  });
  
  // Convert to lowercase and replace non-alphanumeric chars with hyphens
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Capitalize first letter of each word (for display purposes)
 */
export function titleCase(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format postal code display
 */
export function formatPostalCode(pk: string): string {
  return pk.padStart(5, '0');
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://postakodrehberi.com';
  return `${baseUrl}${path}`;
}

/**
 * Generate meta description
 */
export function generateMetaDescription(type: 'il' | 'ilce' | 'mahalle' | 'kod' | 'search', data: any): string {
  switch (type) {
    case 'il':
      return `${data.il} ili tüm ilçeleri ve posta kodları. ${data.il} posta kodu sorgulama, mahalle bazlı adres bilgileri ve detaylı posta kodu listesi.`;
    case 'ilce':
      return `${data.ilce}, ${data.il} ilçesi posta kodları ve mahalle listesi. ${data.ilce} posta kodu sorgulama ve adres detayları.`;
    case 'mahalle':
      return `${data.mahalle} mahallesi posta kodu: ${data.pk}. ${data.mahalle}, ${data.ilce}/${data.il} adres bilgileri ve detaylı posta kodu rehberi.`;
    case 'kod':
      return `${data.pk} posta koduna ait tüm mahalle ve yerleşim yerleri. ${data.pk} posta kodu adres sorgulama ve detaylı bilgiler.`;
    case 'search':
      return `"${data.query}" için posta kodu arama sonuçları. Türkiye geneli posta kodu sorgulama ve adres bilgileri.`;
    default:
      return 'Türkiye geneli posta kodları, il, ilçe ve mahalle bazlı adres bilgileri. Hızlı posta kodu sorgulama ve detaylı rehber.';
  }
}

/**
 * Fuzzy search helper - calculate Levenshtein distance
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Generate dynamic SEO-friendly description for province pages
 */
export function generateIlDescription(il: string): string {
  return `${il} ili, Türkiye'nin önemli yerleşim merkezlerinden biri olup, posta kodu sistemi ile ilçelere, mahallelere ve köylere kadar detaylı şekilde yapılandırılmıştır. ${il} iline bağlı tüm ilçelerin, mahallelerin ve semtlerin posta kodlarını bu sayfada bulabilirsiniz. Posta kodu sorgulaması yaparak ${il} içindeki adres bilgilerine kolayca ulaşabilir, kargo ve posta gönderimleriniz için doğru posta kodunu öğrenebilirsiniz. ${il} ili posta kodları PTT resmi kayıtlarına göre düzenli olarak güncellenmektedir.`;
}

/**
 * Generate dynamic SEO-friendly description for district pages
 */
export function generateIlceDescription(ilce: string, il: string): string {
  return `${ilce} ilçesi, ${il} iline bağlı olup birçok mahalle, köy ve semtten oluşmaktadır. Bu sayfada ${ilce} ilçesine ait tüm mahalle ve yerleşim yerlerinin güncel posta kodlarını bulabilirsiniz. ${ilce} posta kodu araması yaparak adres doğrulama, kargo gönderimi ve resmi işlemleriniz için gerekli posta kodu bilgisine hızlıca erişebilirsiniz. Posta kodları PTT tarafından belirlenen standartlara uygun olarak listelenmiştir. ${ilce}, ${il} ilinin önemli ilçelerinden biri olup detaylı mahalle bazlı posta kodu bilgilerine aşağıdaki listeden ulaşabilirsiniz.`;
}

/**
 * Generate dynamic SEO-friendly description for neighborhood pages
 */
export function generateMahalleDescription(mahalle: string, ilce: string, il: string, pk: string): string {
  return `${mahalle}, ${ilce} ilçesine bağlı bir mahalle olup ${il} ili sınırları içerisinde yer almaktadır. Bu mahallenin resmi posta kodu ${pk} olarak kayıtlıdır. Kargo gönderimi, adres doğrulama veya resmi yazışmalarınız için ${mahalle} posta kodunu kullanabilirsiniz. Sayfamızda ${mahalle} ile aynı ilçede bulunan diğer mahallelerin posta kodlarını da bulabilir, komşu mahalleler arasında posta kodu karşılaştırması yapabilirsiniz. Posta kodu bilgileri PTT resmi kayıtlarından alınmakta ve düzenli olarak güncellenmektedir.`;
}

/**
 * Generate FAQ content for IL pages
 */
export function generateIlFAQ(il: string) {
  return [
    {
      question: `${il} ili posta kodları nasıl öğrenilir?`,
      answer: `${il} ili posta kodlarını öğrenmek için ilgili ilçeyi seçip, ardından mahalle veya semt bazında posta kodu sorgulama yapabilirsiniz. Her mahalle ve yerleşim yerinin kendine özgü bir posta kodu bulunmaktadır.`
    },
    {
      question: `${il} ilinde kaç farklı posta kodu var?`,
      answer: `${il} ilinde ilçe, mahalle ve köy sayısına bağlı olarak yüzlerce farklı posta kodu bulunmaktadır. Her yerleşim yerinin kendine ait benzersiz bir posta kodu numarası vardır.`
    },
    {
      question: `Posta kodu değişir mi?`,
      answer: `Posta kodları genellikle sabittir ancak yeni yerleşim alanlarının oluşması, idari sınır değişiklikleri veya PTT sistem güncellemeleri nedeniyle nadir durumlarda değişebilir. En güncel posta kodlarını sitemizden takip edebilirsiniz.`
    },
    {
      question: `${il} posta kodu kargo gönderiminde neden önemlidir?`,
      answer: `Doğru posta kodu kullanımı, kargo ve posta gönderimlerinin hızlı ve sorunsuz şekilde teslim edilmesini sağlar. Yanlış posta kodu kullanımı teslimat gecikmelerine veya adres hatalarına yol açabilir.`
    }
  ];
}

/**
 * Generate FAQ content for ILCE pages
 */
export function generateIlceFAQ(ilce: string, il: string) {
  return [
    {
      question: `${ilce} ilçesi hangi mahalleleri kapsar?`,
      answer: `${ilce} ilçesi, ${il} iline bağlı olup birçok mahalle ve köyü içermektedir. Her mahallenin kendine özgü posta kodu bulunmaktadır. Detaylı mahalle listesini yukarıda bulabilirsiniz.`
    },
    {
      question: `${ilce} posta kodu nasıl sorgulanır?`,
      answer: `${ilce} ilçesinde posta kodu sorgulamak için önce ilgili mahalleyi seçmeniz gerekmektedir. Her mahallenin kendine ait bir posta kodu numarası vardır. Arama çubuğunu kullanarak da hızlıca sorgulama yapabilirsiniz.`
    },
    {
      question: `${ilce} ilçesinde en çok kullanılan posta kodları hangileridir?`,
      answer: `${ilce} ilçesinde merkez mahallelerin ve yoğun yerleşim alanlarının posta kodları daha sık kullanılmaktadır. Her mahallenin kullanım sıklığı nüfus yoğunluğuna göre değişiklik gösterir.`
    }
  ];
}

/**
 * Generate FAQ content for MAHALLE pages
 */
export function generateMahalleFAQ(mahalle: string, ilce: string, il: string, pk: string) {
  return [
    {
      question: `${mahalle} posta kodu nedir?`,
      answer: `${mahalle} mahallesinin posta kodu ${pk}'dır. Bu kod, kargo gönderimi, adres doğrulama ve resmi yazışmalarda kullanılmaktadır.`
    },
    {
      question: `${mahalle} hangi ilçeye bağlıdır?`,
      answer: `${mahalle}, ${il} ili ${ilce} ilçesine bağlı bir mahalledir. İdari olarak ${ilce} ilçesi sınırları içerisinde yer almaktadır.`
    },
    {
      question: `Kargo gönderirken ${pk} posta kodunu nasıl kullanmalıyım?`,
      answer: `Kargo veya posta gönderirken alıcı adres bilgilerinde ${pk} posta kodunu belirtmeniz gerekmektedir. Doğru posta kodu kullanımı, gönderinizin hızlı ve doğru şekilde teslim edilmesini sağlar.`
    },
    {
      question: `${mahalle} yakınındaki diğer mahalleler hangileridir?`,
      answer: `${mahalle} civarındaki diğer mahallelerin listesini aşağıda bulabilirsiniz. Her mahallenin kendi posta kodu numarası bulunmaktadır.`
    }
  ];
}

/**
 * Geographic coordinates for Turkish provinces (approximate city centers)
 */
export const ilGeoCoordinates: Record<string, { lat: number; lng: number }> = {
  'ADANA': { lat: 37.0000, lng: 35.3213 },
  'ADIYAMAN': { lat: 37.7648, lng: 38.2786 },
  'AFYONKARAHISAR': { lat: 38.7507, lng: 30.5567 },
  'AĞRI': { lat: 39.7191, lng: 43.0503 },
  'AKSARAY': { lat: 38.3687, lng: 34.0370 },
  'AMASYA': { lat: 40.6499, lng: 35.8353 },
  'ANKARA': { lat: 39.9334, lng: 32.8597 },
  'ANTALYA': { lat: 36.8969, lng: 30.7133 },
  'ARDAHAN': { lat: 41.1105, lng: 42.7022 },
  'ARTVIN': { lat: 41.1828, lng: 41.8183 },
  'AYDIN': { lat: 37.8444, lng: 27.8458 },
  'BALIKESIR': { lat: 39.6484, lng: 27.8826 },
  'BARTIN': { lat: 41.6344, lng: 32.3375 },
  'BATMAN': { lat: 37.8812, lng: 41.1351 },
  'BAYBURT': { lat: 40.2552, lng: 40.2249 },
  'BILECIK': { lat: 40.1567, lng: 29.9831 },
  'BINGÖL': { lat: 38.8854, lng: 40.4983 },
  'BITLIS': { lat: 38.4001, lng: 42.1089 },
  'BOLU': { lat: 40.7394, lng: 31.6061 },
  'BURDUR': { lat: 37.7161, lng: 30.2900 },
  'BURSA': { lat: 40.1826, lng: 29.0665 },
  'ÇANAKKALE': { lat: 40.1553, lng: 26.4142 },
  'ÇANKIRI': { lat: 40.6013, lng: 33.6134 },
  'ÇORUM': { lat: 40.5506, lng: 34.9556 },
  'DENIZLI': { lat: 37.7765, lng: 29.0864 },
  'DIYARBAKIR': { lat: 37.9144, lng: 40.2306 },
  'DÜZCE': { lat: 40.8438, lng: 31.1565 },
  'EDIRNE': { lat: 41.6771, lng: 26.5557 },
  'ELAZIĞ': { lat: 38.6810, lng: 39.2264 },
  'ERZINCAN': { lat: 39.7500, lng: 39.4917 },
  'ERZURUM': { lat: 39.9000, lng: 41.2700 },
  'ESKIŞEHIR': { lat: 39.7767, lng: 30.5206 },
  'GAZIANTEP': { lat: 37.0662, lng: 37.3833 },
  'GIRESUN': { lat: 40.9128, lng: 38.3895 },
  'GÜMÜŞHANE': { lat: 40.4386, lng: 39.4814 },
  'HAKKARI': { lat: 37.5744, lng: 43.7408 },
  'HATAY': { lat: 36.4018, lng: 36.3498 },
  'IĞDIR': { lat: 39.8880, lng: 44.0048 },
  'ISPARTA': { lat: 37.7648, lng: 30.5566 },
  'İSTANBUL': { lat: 41.0082, lng: 28.9784 },
  'İZMİR': { lat: 38.4192, lng: 27.1287 },
  'KAHRAMANMARAŞ': { lat: 37.5858, lng: 36.9371 },
  'KARABÜK': { lat: 41.2061, lng: 32.6204 },
  'KARAMAN': { lat: 37.1759, lng: 33.2287 },
  'KARS': { lat: 40.6167, lng: 43.1000 },
  'KASTAMONU': { lat: 41.3887, lng: 33.7827 },
  'KAYSERI': { lat: 38.7205, lng: 35.4826 },
  'KIRIKKALE': { lat: 39.8468, lng: 33.5153 },
  'KIRKLARELI': { lat: 41.7333, lng: 27.2167 },
  'KIRŞEHİR': { lat: 39.1425, lng: 34.1709 },
  'KILIS': { lat: 36.7184, lng: 37.1212 },
  'KOCAELI': { lat: 40.8533, lng: 29.8815 },
  'KONYA': { lat: 37.8667, lng: 32.4833 },
  'KÜTAHYA': { lat: 39.4242, lng: 29.9833 },
  'MALATYA': { lat: 38.3552, lng: 38.3095 },
  'MANİSA': { lat: 38.6191, lng: 27.4289 },
  'MARDİN': { lat: 37.3212, lng: 40.7245 },
  'MERSİN': { lat: 36.8121, lng: 34.6415 },
  'MUĞLA': { lat: 37.2153, lng: 28.3636 },
  'MUŞ': { lat: 38.7432, lng: 41.5064 },
  'NEVŞEHİR': { lat: 38.6939, lng: 34.6857 },
  'NİĞDE': { lat: 37.9667, lng: 34.6833 },
  'ORDU': { lat: 40.9839, lng: 37.8764 },
  'OSMANİYE': { lat: 37.2130, lng: 36.1763 },
  'RİZE': { lat: 41.0201, lng: 40.5234 },
  'SAKARYA': { lat: 40.7569, lng: 30.3783 },
  'SAMSUN': { lat: 41.2928, lng: 36.3313 },
  'SİİRT': { lat: 37.9333, lng: 41.9500 },
  'SİNOP': { lat: 42.0231, lng: 35.1531 },
  'SİVAS': { lat: 39.7477, lng: 37.0179 },
  'ŞANLIURFA': { lat: 37.1591, lng: 38.7969 },
  'ŞIRNAK': { lat: 37.4187, lng: 42.4918 },
  'TEKİRDAĞ': { lat: 40.9833, lng: 27.5167 },
  'TOKAT': { lat: 40.3167, lng: 36.5500 },
  'TRABZON': { lat: 41.0015, lng: 39.7178 },
  'TUNCELİ': { lat: 39.3074, lng: 39.4388 },
  'UŞAK': { lat: 38.6823, lng: 29.4082 },
  'VAN': { lat: 38.4891, lng: 43.4089 },
  'YALOVA': { lat: 40.6500, lng: 29.2667 },
  'YOZGAT': { lat: 39.8181, lng: 34.8147 },
  'ZONGULDAK': { lat: 41.4564, lng: 31.7987 },
};

/**
 * Get GeoCoordinates for a city (normalized)
 */
export function getIlGeoCoordinates(il: string): { lat: number; lng: number } | null {
  const normalized = il.toUpperCase().replace(/İ/g, 'I').replace(/i/g, 'I');
  return ilGeoCoordinates[normalized] || null;
}
