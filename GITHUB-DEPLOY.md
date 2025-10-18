# 🚀 GitHub ile Ubuntu Deployment - Posta Kodları

## ✅ Ön Hazırlık (Yapıldı)
- ✅ Proje GitHub'a yüklendi
- ✅ Ubuntu 22.04 server hazır
- ✅ Nginx yüklü
- ✅ Certbot yüklü
- ✅ Node.js yüklü

---

## 📦 Tek Komutla Deployment

Sunucunuzda bu komutu çalıştırın:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/install.sh | bash
```

**VEYA** manuel olarak adım adım:

---

## 🎯 Manuel Deployment (15 Dakika)

### 1. Sunucuya Bağlan
```bash
ssh your-user@your-server-ip
```

### 2. PostgreSQL Kur ve Yapılandır
```bash
# PostgreSQL kur
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# PostgreSQL'i başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Veritabanı oluştur
sudo -u postgres psql << EOF
CREATE DATABASE posta_kodlari;
CREATE USER posta_user WITH PASSWORD 'SifreNiz123!';
GRANT ALL PRIVILEGES ON DATABASE posta_kodlari TO posta_user;
\q
EOF
```

### 3. PM2 Kur (Global)
```bash
sudo npm install -g pm2

# Sistem başlangıcına ekle
pm2 startup systemd
# Çıkan komutu çalıştırın (sudo env PATH=... ile başlayan)
```

### 4. Proje Klasörü ve Git Clone
```bash
# Proje klasörü oluştur
sudo mkdir -p /var/www/posta-kodlari
sudo chown -R $USER:$USER /var/www/posta-kodlari

# GitHub'tan klonla
cd /var/www/posta-kodlari
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git .

# VEYA SSH ile
git clone git@github.com:YOUR-USERNAME/YOUR-REPO.git .
```

### 5. Node Modülleri Kur
```bash
cd /var/www/posta-kodlari
npm install
```

### 6. Environment Variables (.env)
```bash
# .env dosyası oluştur
nano .env
```

Aşağıdaki içeriği yapıştırın ve değerleri doldurun:

```env
NODE_ENV=production
PORT=5000

# PostgreSQL
DATABASE_URL=postgresql://posta_user:SifreNiz123!@localhost:5432/posta_kodlari
PGHOST=localhost
PGPORT=5432
PGDATABASE=posta_kodlari
PGUSER=posta_user
PGPASSWORD=SifreNiz123!

# Session Secret (yeni bir secret oluştur)
SESSION_SECRET=BURAYA_YENI_SECRET_KOYUN
```

**Session secret oluşturmak için:**
```bash
openssl rand -base64 32
# Çıktıyı SESSION_SECRET'a yapıştır
```

Kaydet: `Ctrl + O`, `Enter`, `Ctrl + X`

### 7. Database Migration
```bash
npm run db:push
```

### 8. Logs Klasörü
```bash
mkdir -p /var/www/posta-kodlari/logs
```

### 9. PM2 ile Başlat
```bash
cd /var/www/posta-kodlari

# Uygulamayı başlat
pm2 start ecosystem.config.js --env production

# Durumu kontrol et
pm2 list

# Otomatik başlatma için kaydet
pm2 save
```

### 10. Nginx Yapılandırması
```bash
# Nginx config dosyası oluştur
sudo nano /etc/nginx/sites-available/postakodrehberi.com
```

Aşağıdaki içeriği yapıştırın:

```nginx
server {
    server_name postakodrehberi.com www.postakodrehberi.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    access_log /var/log/nginx/postakodrehberi.access.log;
    error_log /var/log/nginx/postakodrehberi.error.log;

    listen 80;
}
```

Kaydet: `Ctrl + O`, `Enter`, `Ctrl + X`

```bash
# Siteyi aktif et
sudo ln -s /etc/nginx/sites-available/postakodrehberi.com /etc/nginx/sites-enabled/

# Config test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

### 11. Firewall Ayarları
```bash
# HTTP ve HTTPS portlarını aç
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# Firewall'u aktif et
sudo ufw enable
```

### 12. SSL Sertifikası (Let's Encrypt)
```bash
sudo certbot --nginx -d postakodrehberi.com -d www.postakodrehberi.com
```

Sorular:
- Email: Gerçek email adresiniz
- Şartları kabul: Y
- HTTP -> HTTPS redirect: 2 (Yes)

### 13. Test Et! 🎉
```bash
# PM2 durumu
pm2 list

# Loglar
pm2 logs posta-kodlari --lines 50

# Tarayıcıdan aç
https://postakodrehberi.com
```

---

## 🔄 Güncelleme (Update) - Her Kod Değişikliğinde

```bash
cd /var/www/posta-kodlari

# Son kodu çek
git pull origin main

# Dependencies güncelle (eğer değiştiyse)
npm install

# Zero-downtime reload
pm2 reload posta-kodlari

# Logları kontrol et
pm2 logs posta-kodlari --lines 20
```

**VEYA** otomatik deploy scripti ile:

```bash
cd /var/www/posta-kodlari
chmod +x deploy.sh
./deploy.sh
```

---

## 🛠️ Faydalı Komutlar

### PM2 Yönetimi
```bash
pm2 list                    # Tüm uygulamalar
pm2 logs posta-kodlari      # Logları izle
pm2 restart posta-kodlari   # Yeniden başlat
pm2 reload posta-kodlari    # Zero-downtime reload
pm2 stop posta-kodlari      # Durdur
pm2 monit                   # Gerçek zamanlı monitoring
```

### Nginx Yönetimi
```bash
sudo systemctl status nginx
sudo nginx -t                           # Config test
sudo systemctl reload nginx             # Reload
sudo tail -f /var/log/nginx/error.log  # Error log
```

### Database Yönetimi
```bash
# Database'e bağlan
psql -U posta_user -d posta_kodlari -h localhost

# Backup al
pg_dump -U posta_user posta_kodlari > backup-$(date +%Y%m%d).sql

# Backup'tan restore
psql -U posta_user -d posta_kodlari < backup-20250118.sql
```

---

## 🆘 Sorun Giderme

### 502 Bad Gateway
```bash
# PM2 çalışıyor mu?
pm2 list

# Logları kontrol et
pm2 logs posta-kodlari --err

# Port kullanımda mı?
sudo netstat -tulpn | grep :5000

# PM2'yi yeniden başlat
pm2 restart posta-kodlari
```

### Database Bağlantı Hatası
```bash
# PostgreSQL çalışıyor mu?
sudo systemctl status postgresql

# .env dosyasını kontrol et
cat /var/www/posta-kodlari/.env

# Database bağlantısını test et
psql -U posta_user -d posta_kodlari -h localhost
```

### Nginx Hatası
```bash
# Config testi
sudo nginx -t

# Error log
sudo tail -f /var/log/nginx/error.log

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

---

## 📊 Monitoring & Logs

```bash
# PM2 dashboard
pm2 monit

# Canlı loglar
pm2 logs posta-kodlari

# Nginx access log
sudo tail -f /var/log/nginx/postakodrehberi.access.log

# Sistem kaynakları
htop
```

---

## 🔐 Güvenlik Kontrol Listesi

- ✅ Firewall aktif (UFW)
- ✅ SSL sertifikası kurulu
- ✅ PostgreSQL localhost'a kısıtlı
- ✅ Güçlü database şifresi
- ✅ .env dosyası git'e eklenmiş (.gitignore)
- ✅ Session secret güçlü ve benzersiz
- ✅ PM2 auto-restart aktif

---

## 🎉 Tamamlandı!

Site artık canlı: **https://postakodrehberi.com**

Admin paneli: **https://postakodrehberi.com/admin**  
Kullanıcı: `toov`  
Şifre: `Toov1453@@`

Herhangi bir sorun olursa logları kontrol edin:
```bash
pm2 logs posta-kodlari
```
