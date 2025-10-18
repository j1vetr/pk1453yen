# ⚡ Hızlı Başlangıç - Ubuntu Sunucuya Deploy

## 🎯 Özet (5 Dakika)

```bash
# 1. Sunucuya bağlan
ssh your-user@your-server-ip

# 2. PostgreSQL kur
sudo apt update && sudo apt install postgresql postgresql-contrib -y
sudo -u postgres psql -c "CREATE DATABASE posta_kodlari;"
sudo -u postgres psql -c "CREATE USER posta_user WITH PASSWORD 'GüçlüŞifre123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE posta_kodlari TO posta_user;"

# 3. PM2 kur (global)
sudo npm install -g pm2
pm2 startup systemd  # Çıkan komutu çalıştır

# 4. Proje klasörü oluştur
sudo mkdir -p /var/www/posta-kodlari
sudo chown -R $USER:$USER /var/www/posta-kodlari
cd /var/www/posta-kodlari

# 5. Projeyi yükle (ZIP'ten veya Git'ten)
# Seçenek A: ZIP yükle ve aç
unzip posta-kodlari.zip -d /var/www/posta-kodlari/

# Seçenek B: Git clone
git clone your-repo-url .

# 6. Node modülleri kur
npm install

# 7. .env dosyası oluştur
cp .env.production.example .env
nano .env
# DATABASE_URL ve diğer değerleri doldur, kaydet (Ctrl+O, Enter, Ctrl+X)

# 8. PM2 ile başlat
pm2 start ecosystem.config.js --env production
pm2 save

# 9. Nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/postakodrehberi.com
sudo ln -s /etc/nginx/sites-available/postakodrehberi.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 10. Firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# 11. SSL sertifikası
sudo certbot --nginx -d postakodrehberi.com -d www.postakodrehberi.com

# ✅ Tamamlandı!
```

## 📋 .env Dosyası İçeriği

```env
NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://posta_user:GüçlüŞifre123!@localhost:5432/posta_kodlari
PGHOST=localhost
PGPORT=5432
PGDATABASE=posta_kodlari
PGUSER=posta_user
PGPASSWORD=GüçlüŞifre123!

SESSION_SECRET=$(openssl rand -base64 32)
```

## 🔄 Güncelleme (Update)

```bash
cd /var/www/posta-kodlari
./deploy.sh
# veya
chmod +x deploy.sh && ./deploy.sh
```

## 🆘 Sorun Giderme

```bash
# PM2 durumu
pm2 list
pm2 logs posta-kodlari

# Nginx durumu
sudo systemctl status nginx
sudo nginx -t

# Database bağlantısı test
psql -U posta_user -d posta_kodlari -h localhost

# Port kullanımı
sudo netstat -tulpn | grep :5000
```

## 📚 Detaylı Kılavuz

Tüm detaylar için `DEPLOYMENT.md` dosyasına bakın.
