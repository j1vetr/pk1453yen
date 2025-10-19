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
