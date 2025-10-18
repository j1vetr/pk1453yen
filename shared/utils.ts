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
    : 'https://turkiye-posta-kodlari.com';
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
  return `${il} ili, Türkiye'nin önemli şehirlerinden biridir ve posta kodu sistemiyle ilçelere, mahallelere kadar ayrıntılı şekilde bölünmüştür. ${il} iline ait tüm posta kodlarını aşağıdaki listeden inceleyebilirsiniz.`;
}

/**
 * Generate dynamic SEO-friendly description for district pages
 */
export function generateIlceDescription(ilce: string, il: string): string {
  return `${ilce} ilçesi, ${il} iline bağlıdır ve farklı mahalle ve köylerden oluşur. ${ilce} ilçesindeki tüm posta kodlarını aşağıdaki listeden görebilirsiniz.`;
}

/**
 * Generate dynamic SEO-friendly description for neighborhood pages
 */
export function generateMahalleDescription(mahalle: string, ilce: string, il: string, pk: string): string {
  return `${mahalle} Mahallesi, ${ilce} ilçesine bağlı olup ${il} il sınırları içerisindedir. Bu mahallenin posta kodu ${pk}'dır. Yakın mahallelerin posta kodlarını da aşağıda bulabilirsiniz.`;
}
