# 🔧 Slug Düzeltme Rehberi

## Sorun

Canlı sunucunuzda bazı mahalle slug'larında yanlış tire kullanımı var:
- ❌ Yanlış: `15-temmuz-sehi-tler-mah`
- ✅ Doğru: `15-temmuz-sehitler-mah`

Bu yüzden:
- Sitemap'lerdeki URL'ler yanlış
- Google bu sayfaları index alamıyor (404 dönüyor)
- SEO'dan faydalanamıyorsunuz

## Çözüm: Slug Fix Script

### 🚀 Sunucuda Yapılacaklar

```bash
# 1. Sunucuya bağlan
ssh root@your-server-ip
cd /root/postakodrehberi

# 2. En son kodu çek
git pull origin main

# 3. Gerekirse node modules güncelle
npm install

# 4. Slug fix script'ini çalıştır
npx tsx server/fix-slugs.ts
```

### 📊 Script Ne Yapar?

1. Database'deki tüm 73,000+ kaydı kontrol eder
2. Yanlış slug'ları bulur ve düzeltir:
   - `sehi-tler` → `sehitler`
   - `ahmed-i-hani` → `ahmed-i-hani` (izafet eki, doğru kalır)
3. İlerlemeyi gösterir
4. Sonuç raporunu verir

### ⏱️ Süre

- Toplam süre: ~2-5 dakika
- Her 100 kombinasyonda ilerleme gösterir

### 5. Servisi Yeniden Başlat

```bash
# PM2 kullanıyorsanız
pm2 restart postakodrehberi

# veya systemd
sudo systemctl restart postakodrehberi
```

### ✅ Kontrol

```bash
# Sitemap'leri kontrol et
curl https://postakodrehberi.com/sitemap-neighborhoods-1.xml | grep "sehit" | head -5

# Örnek sayfa kontrol et
curl -I https://postakodrehberi.com/adiyaman/besni/15-temmuz-sehitler-mah
# 200 OK dönmeli
```

## 🗺️ Sitemap Güncellemesi

Slug'lar düzeldikten sonra sitemap'ler **otomatik** güncellenir çünkü:
- Sitemap'ler database'den dinamik oluşturuluyor
- Slug'lar düzelince sitemap'ler de düzeliyor

## 📈 Google Search Console

1. [Google Search Console](https://search.google.com/search-console)'a git
2. Sitemap'leri yeniden gönder:
   ```
   https://postakodrehberi.com/sitemap.xml
   ```
3. 1-2 hafta içinde Google yeni URL'leri index alacak

## ⚠️ NOT: İzafet Ekleri

Osmanlıca isimler doğrudur, bunlar DEĞİŞMEZ:
- ✅ `kuva-i-milliye-mah` (Kuva-i Milliye - izafet eki)
- ✅ `ahmed-i-hani-mahallesi-mah` (Ahmed-i Hani - izafet eki)

Sadece yanlış tire kullanımları düzeltilir:
- ❌ `sehi-tler` → ✅ `sehitler`

## 🎯 Beklenen Sonuç

**Önce:**
- 404 hatası veren URL'ler
- Google index alamıyor
- Sitemap'lerde yanlış linkler

**Sonra:**
- Tüm URL'ler çalışıyor
- Google index alabilir
- Sitemap'ler doğru
