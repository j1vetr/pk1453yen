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
 * Turkish Title Case - properly handles Turkish characters (İ, ı, etc.)
 * Converts: "ANADOLU KAVAĞI MAH" → "Anadolu Kavağı Mah"
 */
export function turkishTitleCase(text: string): string {
  if (!text) return '';
  
  // Turkish lowercase map
  const lowerMap: Record<string, string> = {
    'İ': 'i', 'I': 'ı',
    'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç'
  };
  
  // Turkish uppercase map
  const upperMap: Record<string, string> = {
    'i': 'İ', 'ı': 'I',
    'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç'
  };
  
  // First, convert to lowercase (Turkish-aware)
  let result = text;
  Object.keys(lowerMap).forEach(key => {
    result = result.replace(new RegExp(key, 'g'), lowerMap[key]);
  });
  result = result.toLowerCase();
  
  // Then capitalize first letter of each word
  return result.split(' ').map(word => {
    if (word.length === 0) return word;
    const firstChar = word.charAt(0);
    const upperChar = upperMap[firstChar] || firstChar.toUpperCase();
    return upperChar + word.slice(1);
  }).join(' ');
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
      answer: `${mahalle} mahallesinin posta kodu ${pk}'dir. Bu kod, kargo gönderimi, adres doğrulama ve resmi yazışmalarda kullanılmaktadır.`
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
 * Turkish province data by postal code prefix
 * Maps postal code prefixes to province information
 */
interface ProvinceData {
  name: string;
  region: string;
  slug: string;
}

const PROVINCE_PREFIX_MAP: Record<string, ProvinceData> = {
  '01': { name: 'Adana', region: 'Akdeniz', slug: 'adana' },
  '02': { name: 'Adıyaman', region: 'Güneydoğu Anadolu', slug: 'adiyaman' },
  '03': { name: 'Afyonkarahisar', region: 'Ege', slug: 'afyonkarahisar' },
  '04': { name: 'Ağrı', region: 'Doğu Anadolu', slug: 'agri' },
  '05': { name: 'Amasya', region: 'Karadeniz', slug: 'amasya' },
  '06': { name: 'Ankara', region: 'İç Anadolu', slug: 'ankara' },
  '07': { name: 'Antalya', region: 'Akdeniz', slug: 'antalya' },
  '08': { name: 'Artvin', region: 'Karadeniz', slug: 'artvin' },
  '09': { name: 'Aydın', region: 'Ege', slug: 'aydin' },
  '10': { name: 'Balıkesir', region: 'Marmara', slug: 'balikesir' },
  '11': { name: 'Bilecik', region: 'Marmara', slug: 'bilecik' },
  '12': { name: 'Bingöl', region: 'Doğu Anadolu', slug: 'bingol' },
  '13': { name: 'Bitlis', region: 'Doğu Anadolu', slug: 'bitlis' },
  '14': { name: 'Bolu', region: 'Karadeniz', slug: 'bolu' },
  '15': { name: 'Burdur', region: 'Akdeniz', slug: 'burdur' },
  '16': { name: 'Bursa', region: 'Marmara', slug: 'bursa' },
  '17': { name: 'Çanakkale', region: 'Marmara', slug: 'canakkale' },
  '18': { name: 'Çankırı', region: 'İç Anadolu', slug: 'cankiri' },
  '19': { name: 'Çorum', region: 'Karadeniz', slug: 'corum' },
  '20': { name: 'Denizli', region: 'Ege', slug: 'denizli' },
  '21': { name: 'Diyarbakır', region: 'Güneydoğu Anadolu', slug: 'diyarbakir' },
  '22': { name: 'Edirne', region: 'Marmara', slug: 'edirne' },
  '23': { name: 'Elazığ', region: 'Doğu Anadolu', slug: 'elazig' },
  '24': { name: 'Erzincan', region: 'Doğu Anadolu', slug: 'erzincan' },
  '25': { name: 'Erzurum', region: 'Doğu Anadolu', slug: 'erzurum' },
  '26': { name: 'Eskişehir', region: 'İç Anadolu', slug: 'eskisehir' },
  '27': { name: 'Gaziantep', region: 'Güneydoğu Anadolu', slug: 'gaziantep' },
  '28': { name: 'Giresun', region: 'Karadeniz', slug: 'giresun' },
  '29': { name: 'Gümüşhane', region: 'Karadeniz', slug: 'gumushane' },
  '30': { name: 'Hakkari', region: 'Doğu Anadolu', slug: 'hakkari' },
  '31': { name: 'Hatay', region: 'Akdeniz', slug: 'hatay' },
  '32': { name: 'Isparta', region: 'Akdeniz', slug: 'isparta' },
  '33': { name: 'Mersin', region: 'Akdeniz', slug: 'mersin' },
  '34': { name: 'İstanbul', region: 'Marmara', slug: 'istanbul' },
  '35': { name: 'İzmir', region: 'Ege', slug: 'izmir' },
  '36': { name: 'Kars', region: 'Doğu Anadolu', slug: 'kars' },
  '37': { name: 'Kastamonu', region: 'Karadeniz', slug: 'kastamonu' },
  '38': { name: 'Kayseri', region: 'İç Anadolu', slug: 'kayseri' },
  '39': { name: 'Kırklareli', region: 'Marmara', slug: 'kirklareli' },
  '40': { name: 'Kırşehir', region: 'İç Anadolu', slug: 'kirsehir' },
  '41': { name: 'Kocaeli', region: 'Marmara', slug: 'kocaeli' },
  '42': { name: 'Konya', region: 'İç Anadolu', slug: 'konya' },
  '43': { name: 'Kütahya', region: 'Ege', slug: 'kutahya' },
  '44': { name: 'Malatya', region: 'Doğu Anadolu', slug: 'malatya' },
  '45': { name: 'Manisa', region: 'Ege', slug: 'manisa' },
  '46': { name: 'Kahramanmaraş', region: 'Akdeniz', slug: 'kahramanmaras' },
  '47': { name: 'Mardin', region: 'Güneydoğu Anadolu', slug: 'mardin' },
  '48': { name: 'Muğla', region: 'Ege', slug: 'mugla' },
  '49': { name: 'Muş', region: 'Doğu Anadolu', slug: 'mus' },
  '50': { name: 'Nevşehir', region: 'İç Anadolu', slug: 'nevsehir' },
  '51': { name: 'Niğde', region: 'İç Anadolu', slug: 'nigde' },
  '52': { name: 'Ordu', region: 'Karadeniz', slug: 'ordu' },
  '53': { name: 'Rize', region: 'Karadeniz', slug: 'rize' },
  '54': { name: 'Sakarya', region: 'Marmara', slug: 'sakarya' },
  '55': { name: 'Samsun', region: 'Karadeniz', slug: 'samsun' },
  '56': { name: 'Siirt', region: 'Güneydoğu Anadolu', slug: 'siirt' },
  '57': { name: 'Sinop', region: 'Karadeniz', slug: 'sinop' },
  '58': { name: 'Sivas', region: 'İç Anadolu', slug: 'sivas' },
  '59': { name: 'Tekirdağ', region: 'Marmara', slug: 'tekirdag' },
  '60': { name: 'Tokat', region: 'Karadeniz', slug: 'tokat' },
  '61': { name: 'Trabzon', region: 'Karadeniz', slug: 'trabzon' },
  '62': { name: 'Tunceli', region: 'Doğu Anadolu', slug: 'tunceli' },
  '63': { name: 'Şanlıurfa', region: 'Güneydoğu Anadolu', slug: 'sanliurfa' },
  '64': { name: 'Uşak', region: 'Ege', slug: 'usak' },
  '65': { name: 'Van', region: 'Doğu Anadolu', slug: 'van' },
  '66': { name: 'Yozgat', region: 'İç Anadolu', slug: 'yozgat' },
  '67': { name: 'Zonguldak', region: 'Karadeniz', slug: 'zonguldak' },
  '68': { name: 'Aksaray', region: 'İç Anadolu', slug: 'aksaray' },
  '69': { name: 'Bayburt', region: 'Karadeniz', slug: 'bayburt' },
  '70': { name: 'Karaman', region: 'İç Anadolu', slug: 'karaman' },
  '71': { name: 'Kırıkkale', region: 'İç Anadolu', slug: 'kirikkale' },
  '72': { name: 'Batman', region: 'Güneydoğu Anadolu', slug: 'batman' },
  '73': { name: 'Şırnak', region: 'Güneydoğu Anadolu', slug: 'sirnak' },
  '74': { name: 'Bartın', region: 'Karadeniz', slug: 'bartin' },
  '75': { name: 'Ardahan', region: 'Doğu Anadolu', slug: 'ardahan' },
  '76': { name: 'Iğdır', region: 'Doğu Anadolu', slug: 'igdir' },
  '77': { name: 'Yalova', region: 'Marmara', slug: 'yalova' },
  '78': { name: 'Karabük', region: 'Karadeniz', slug: 'karabuk' },
  '79': { name: 'Kilis', region: 'Güneydoğu Anadolu', slug: 'kilis' },
  '80': { name: 'Osmaniye', region: 'Akdeniz', slug: 'osmaniye' },
  '81': { name: 'Düzce', region: 'Karadeniz', slug: 'duzce' },
};

/**
 * Get province information by postal code prefix
 */
export function getProvinceByPrefix(pk: string): ProvinceData | null {
  if (!pk || pk.length < 2) return null;
  const prefix = pk.substring(0, 2);
  return PROVINCE_PREFIX_MAP[prefix] || null;
}

/**
 * Generate dynamic SEO-friendly description for postal code pages
 */
export function generatePostalCodeDescription(
  pk: string,
  provinceData: ProvinceData | null,
  locationCount: number
): string {
  if (!provinceData) {
    return `${pk} posta kodu bilgileri. Bu posta koduna bağlı ${locationCount} farklı yerleşim yeri bulunmaktadır. Posta kodu sorgulama, adres doğrulama ve kargo gönderimleriniz için detaylı bilgilere ulaşabilirsiniz.`;
  }

  const { name: ilName, region } = provinceData;
  
  return `${pk} posta kodu, ${ilName} iline ait olup ${region} Bölgesi sınırları içerisinde yer almaktadır. Bu posta koduna bağlı toplam ${locationCount} farklı yerleşim yeri (mahalle, köy veya semt) bulunmaktadır. Türkiye'de posta kodları PTT (Posta ve Telgraf Teşkilatı) tarafından belirlenmekte olup her posta kodunun ilk iki hanesi ili temsil etmektedir. ${pk} posta kodunun ilk iki hanesi (${pk.substring(0, 2)}) ${ilName} ilini göstermektedir. Kargo gönderimi, adres doğrulama, resmi yazışmalar ve e-ticaret işlemlerinde doğru posta kodu kullanımı kritik öneme sahiptir. ${pk} posta kodunu kullanarak ${ilName} içinde bulunan ilgili yerleşim yerlerine hızlı ve güvenli teslimat sağlanabilir. Aşağıda ${pk} posta koduna bağlı tüm mahalle ve yerleşim yerlerinin detaylı listesini bulabilirsiniz.`;
}

/**
 * Generate FAQ content for POSTAL CODE pages
 */
export function generatePostalCodeFAQ(
  pk: string,
  provinceData: ProvinceData | null,
  locationCount: number
) {
  const ilName = provinceData?.name || 'ilgili il';
  const region = provinceData?.region || 'ilgili bölge';
  
  return [
    {
      question: `${pk} posta kodu hangi ile aittir?`,
      answer: `${pk} posta kodu ${ilName} iline aittir. Posta kodlarının ilk iki hanesi ili gösterir ve ${pk} kodunun ilk iki hanesi (${pk.substring(0, 2)}) ${ilName} ilini temsil etmektedir. ${ilName}, ${region} Bölgesi'nde yer almaktadır.`
    },
    {
      question: `${pk} posta kodu kaç farklı yerleşim yerini kapsar?`,
      answer: `${pk} posta kodu toplam ${locationCount} farklı yerleşim yerini (mahalle, köy veya semt) kapsamaktadır. Her bir yerleşim yerinin detaylı bilgilerini yukarıdaki listede bulabilirsiniz.`
    },
    {
      question: `Posta kodu sistemi nasıl çalışır?`,
      answer: `Türkiye'de posta kodları 5 haneli sayılardan oluşur. İlk iki hane ili, sonraki haneler ise ilçe ve mahalle bilgilerini temsil eder. PTT tarafından belirlenen bu sistem, posta ve kargo gönderimlerinin doğru adrese ulaşmasını sağlar.`
    },
    {
      question: `${pk} posta kodunu kargo gönderiminde nasıl kullanmalıyım?`,
      answer: `Kargo veya posta gönderirken alıcı adres bilgilerinde ${pk} posta kodunu mutlaka belirtmelisiniz. Doğru posta kodu kullanımı, gönderinizin hızlı ve sorunsuz şekilde teslim edilmesini garanti eder. Yanlış veya eksik posta kodu teslimat gecikmelerine neden olabilir.`
    }
  ];
}
