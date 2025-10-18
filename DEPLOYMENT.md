# Ubuntu 22.04 Deployment Kılavuzu - Posta Kodları

## Ön Gereksinimler
✅ Ubuntu 22.04 Server  
✅ Node.js yüklü (zaten var)  
✅ Nginx yüklü (zaten var)  
✅ Certbot yüklü (zaten var)  
✅ PostgreSQL yüklü olmalı  
✅ Domain DNS ayarları yapılmış (A kaydı sunucu IP'sine işaret etmeli)

---

## Adım 1: Sunucuya Bağlan

```bash
ssh root@your-server-ip
# veya
ssh your-user@your-server-ip
```

---

## Adım 2: PostgreSQL Kurulumu ve Yapılandırma

```bash
# PostgreSQL kur (eğer kurulu değilse)
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# PostgreSQL servisini başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL kullanıcısına geç
sudo -u postgres psql

# Veritabanı ve kullanıcı oluştur
CREATE DATABASE posta_kodlari;
CREATE USER posta_user WITH PASSWORD 'GüçlüŞifreniz123!';
GRANT ALL PRIVILEGES ON DATABASE posta_kodlari TO posta_user;
\q

# PostgreSQL dışarıdan bağlantı kabul etmiyorsa (localhost yeterli)
```

---

## Adım 3: PM2 Global Kurulum

```bash
# PM2'yi global olarak kur
sudo npm install -g pm2

# PM2'yi sistem başlangıcına ekle
pm2 startup systemd
# Çıkan komutu çalıştır (sudo env PATH=... ile başlayan)
```

---

## Adım 4: Proje Klasörü Oluştur

```bash
# Proje için klasör oluştur
sudo mkdir -p /var/www/posta-kodlari
sudo chown -R $USER:$USER /var/www/posta-kodlari
cd /var/www/posta-kodlari
```

---

## Adım 5: Projeyi Klonla veya Yükle

**Seçenek A: Git ile (önerilir)**
```bash
# Git repo'dan klonla
git clone https://github.com/your-username/posta-kodlari.git .

# veya ZIP olarak yüklediyseniz
scp -r /local/path/to/project/* your-user@server-ip:/var/www/posta-kodlari/
```

**Seçenek B: Replit'ten indirme**
```bash
# Replit'te projeyi ZIP olarak indir
# SCP ile sunucuya yükle
scp posta-kodlari.zip your-user@server-ip:/var/www/
ssh your-user@server-ip
cd /var/www
unzip posta-kodlari.zip -d posta-kodlari
cd posta-kodlari
```

---

## Adım 6: Node Modülleri Kur

```bash
cd /var/www/posta-kodlari

# Production dependencies kur
npm install --production=false

# TypeScript ve diğer gerekli paketler için
npm install
```

---

## Adım 7: Environment Variables Ayarla

```bash
# .env dosyası oluştur
nano .env
```

Aşağıdaki değerleri gir:
```env
NODE_ENV=production
PORT=5000

# PostgreSQL bağlantısı
DATABASE_URL=postgresql://posta_user:GüçlüŞifreniz123!@localhost:5432/posta_kodlari
PGHOST=localhost
PGPORT=5432
PGDATABASE=posta_kodlari
PGUSER=posta_user
PGPASSWORD=GüçlüŞifreniz123!

# Session secret (openssl rand -base64 32 ile oluştur)
SESSION_SECRET=$(openssl rand -base64 32)
```

Kaydet ve çık (Ctrl+O, Enter, Ctrl+X)

---

## Adım 8: Veritabanını Hazırla

```bash
# Drizzle migrations çalıştır (eğer migration dosyaları varsa)
npm run db:push

# CSV import (admin panelden yapılacak)
# İlk admin kullanıcısı zaten var: toov / Toov1453@@
```

---

## Adım 9: Logs Klasörü Oluştur

```bash
mkdir -p /var/www/posta-kodlari/logs
```

---

## Adım 10: PM2 ile Uygulamayı Başlat

```bash
cd /var/www/posta-kodlari

# Uygulamayı başlat
pm2 start ecosystem.config.js --env production

# PM2 durumunu kontrol et
pm2 list

# Logları kontrol et
pm2 logs posta-kodlari

# PM2 kayıt listesini kaydet (reboot sonrası otomatik başlasın)
pm2 save
```

---

## Adım 11: Nginx Yapılandırması

```bash
# Nginx config dosyası oluştur
sudo nano /etc/nginx/sites-available/postakodrehberi.com
```

nginx.conf.example dosyasındaki içeriği yapıştır, sonra:

```bash
# Siteyi aktif et
sudo ln -s /etc/nginx/sites-available/postakodrehberi.com /etc/nginx/sites-enabled/

# Default site varsa kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx config test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

---

## Adım 12: Firewall Ayarları

```bash
# UFW durumunu kontrol et
sudo ufw status

# HTTP ve HTTPS portlarını aç
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# Firewall'u aktif et (eğer değilse)
sudo ufw enable
```

---

## Adım 13: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot ile SSL sertifikası al
sudo certbot --nginx -d postakodrehberi.com -d www.postakodrehberi.com

# E-posta adresi gir
# Şartları kabul et (Y)
# HTTP -> HTTPS yönlendirmesini aktif et (2 seç)

# Sertifika yenilemeyi test et
sudo certbot renew --dry-run
```

---

## Adım 14: Test ve Doğrulama

```bash
# Uygulama çalışıyor mu?
pm2 list

# Logları kontrol et
pm2 logs posta-kodlari --lines 50

# Nginx durumu
sudo systemctl status nginx

# Tarayıcıdan test et
https://postakodrehberi.com
```

---

## Adım 15: İzleme ve Yönetim

### PM2 Komutları
```bash
pm2 list                    # Tüm uygulamaları listele
pm2 restart posta-kodlari   # Uygulamayı yeniden başlat
pm2 reload posta-kodlari    # Zero-downtime reload
pm2 stop posta-kodlari      # Durdur
pm2 logs posta-kodlari      # Logları göster
pm2 monit                   # Gerçek zamanlı izleme
pm2 delete posta-kodlari    # Uygulamayı kaldır
```

### Uygulama Güncelleme
```bash
cd /var/www/posta-kodlari

# Git'ten güncelle
git pull origin main

# Bağımlılıkları güncelle
npm install

# PM2 ile reload (zero-downtime)
pm2 reload posta-kodlari

# Veya restart
pm2 restart posta-kodlari
```

### Veritabanı Yedekleme
```bash
# Otomatik yedekleme scripti
pg_dump -U posta_user posta_kodlari > backup-$(date +%Y%m%d).sql

# Cron job ile günlük yedekleme
crontab -e
# Ekle: 0 2 * * * pg_dump -U posta_user posta_kodlari > /var/backups/posta-db-$(date +\%Y\%m\%d).sql
```

---

## Sorun Giderme

### Uygulama başlamıyor
```bash
# PM2 loglarını kontrol et
pm2 logs posta-kodlari --err

# Environment variables kontrolü
cat .env

# Port kullanımda mı?
sudo netstat -tulpn | grep :5000
```

### 502 Bad Gateway
```bash
# PM2 çalışıyor mu?
pm2 list

# Nginx error log
sudo tail -f /var/log/nginx/postakodrehberi.error.log

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Veritabanı bağlantı hatası
```bash
# PostgreSQL çalışıyor mu?
sudo systemctl status postgresql

# Veritabanı bağlantısını test et
psql -U posta_user -d posta_kodlari -h localhost

# .env dosyasındaki DATABASE_URL'yi kontrol et
```

---

## Performans İyileştirmeleri

### 1. PostgreSQL Tuning
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf

# Ayarlar (RAM'e göre):
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

### 2. PM2 Cluster Mode
ecosystem.config.js'de zaten `instances: 'max'` ayarlı.

### 3. Nginx Caching
Nginx config'de gzip ve static file caching zaten aktif.

---

## Güvenlik Kontrol Listesi

✅ Firewall aktif (UFW)  
✅ SSL sertifikası yüklü  
✅ PostgreSQL sadece localhost'tan erişilebilir  
✅ .env dosyası git'e eklenmiş (.gitignore)  
✅ Strong passwords kullanılıyor  
✅ SSH key-based authentication (önerilir)  
✅ Fail2ban kurulumu (opsiyonel ama önerilir)  
✅ Düzenli yedekleme  

---

## Yararlı Linkler

- PM2 Docs: https://pm2.keymetrics.io/docs/
- Nginx Docs: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- PostgreSQL Tuning: https://pgtune.leopard.in.ua/

---

## Destek

Sorun yaşarsanız logları kontrol edin:
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

🎉 **Deployment tamamlandı! Siteniz artık https://postakodrehberi.com adresinde yayında!**
