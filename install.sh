#!/bin/bash

# Posta Kodları - Otomatik GitHub Deployment Script
# Ubuntu 22.04 için tek komutla kurulum

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        Posta Kodları - Otomatik Deployment              ║"
echo "║              GitHub -> Ubuntu 22.04                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# GitHub bilgileri
read -p "GitHub repo URL'nizi girin (örn: https://github.com/user/repo.git): " GITHUB_REPO
read -p "Domain adınız (örn: postakodrehberi.com): " DOMAIN
read -p "Database şifresi (güçlü bir şifre girin): " DB_PASSWORD

echo -e "\n${YELLOW}📋 Özet:${NC}"
echo "  - Repo: $GITHUB_REPO"
echo "  - Domain: $DOMAIN"
echo "  - Proje dizini: /var/www/posta-kodlari"
echo ""
read -p "Devam edilsin mi? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}İptal edildi.${NC}"
    exit 0
fi

# 1. PostgreSQL Kurulum
echo -e "\n${YELLOW}1/10 PostgreSQL kuruluyor...${NC}"
if ! command -v psql &> /dev/null; then
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo -e "${GREEN}✅ PostgreSQL kuruldu${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL zaten kurulu${NC}"
fi

# 2. Database Oluştur
echo -e "\n${YELLOW}2/10 Veritabanı oluşturuluyor...${NC}"
sudo -u postgres psql << EOF
CREATE DATABASE posta_kodlari;
CREATE USER posta_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE posta_kodlari TO posta_user;
EOF
echo -e "${GREEN}✅ Veritabanı hazır${NC}"

# 3. PM2 Kurulum
echo -e "\n${YELLOW}3/10 PM2 kuruluyor...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 kuruldu${NC}"
else
    echo -e "${GREEN}✅ PM2 zaten kurulu${NC}"
fi

# 4. PM2 Startup
echo -e "\n${YELLOW}4/10 PM2 auto-start yapılandırılıyor...${NC}"
pm2 startup systemd -u $USER --hp $HOME | grep "sudo" | bash
echo -e "${GREEN}✅ PM2 sistem başlangıcına eklendi${NC}"

# 5. Proje Klasörü
echo -e "\n${YELLOW}5/10 Proje klasörü oluşturuluyor...${NC}"
sudo mkdir -p /var/www/posta-kodlari
sudo chown -R $USER:$USER /var/www/posta-kodlari
echo -e "${GREEN}✅ Klasör hazır${NC}"

# 6. Git Clone
echo -e "\n${YELLOW}6/10 GitHub'tan kod çekiliyor...${NC}"
cd /var/www/posta-kodlari
git clone $GITHUB_REPO .
echo -e "${GREEN}✅ Kod indirildi${NC}"

# 7. Node Modules
echo -e "\n${YELLOW}7/10 Node modülleri kuruluyor (biraz zaman alabilir)...${NC}"
npm install
echo -e "${GREEN}✅ Modüller kuruldu${NC}"

# 8. Environment Variables
echo -e "\n${YELLOW}8/10 .env dosyası oluşturuluyor...${NC}"
SESSION_SECRET=$(openssl rand -base64 32)
cat > .env << EOF
NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://posta_user:$DB_PASSWORD@localhost:5432/posta_kodlari
PGHOST=localhost
PGPORT=5432
PGDATABASE=posta_kodlari
PGUSER=posta_user
PGPASSWORD=$DB_PASSWORD

SESSION_SECRET=$SESSION_SECRET
EOF
echo -e "${GREEN}✅ .env oluşturuldu${NC}"

# 9. Database Migration
echo -e "\n${YELLOW}9/10 Database migration çalıştırılıyor...${NC}"
npm run db:push
echo -e "${GREEN}✅ Migration tamamlandı${NC}"

# 10. Logs Klasörü
mkdir -p /var/www/posta-kodlari/logs

# 11. PM2 ile Başlat
echo -e "\n${YELLOW}10/10 Uygulama PM2 ile başlatılıyor...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
echo -e "${GREEN}✅ Uygulama çalışıyor${NC}"

# Nginx Config Oluştur
echo -e "\n${YELLOW}📝 Nginx config oluşturuluyor...${NC}"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << 'NGINXEOF'
server {
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

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
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 80;
}
NGINXEOF

sudo sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx yapılandırıldı${NC}"

# Firewall
echo -e "\n${YELLOW}🔥 Firewall ayarlanıyor...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
echo "y" | sudo ufw enable
echo -e "${GREEN}✅ Firewall yapılandırıldı${NC}"

# SSL Kurulum Talimatı
echo -e "\n${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              ✅ Kurulum Tamamlandı!                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🎉 Uygulama başarıyla kuruldu!${NC}\n"
echo -e "${YELLOW}📊 Durum:${NC}"
pm2 list

echo -e "\n${YELLOW}🔐 Son Adım - SSL Sertifikası:${NC}"
echo -e "Şu komutu çalıştırın:"
echo -e "${BLUE}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}\n"

echo -e "${YELLOW}🌐 Site Bilgileri:${NC}"
echo -e "  URL: ${GREEN}http://$DOMAIN${NC} (SSL sonrası: https://$DOMAIN)"
echo -e "  Admin: ${GREEN}https://$DOMAIN/admin${NC}"
echo -e "  Kullanıcı: ${GREEN}toov${NC}"
echo -e "  Şifre: ${GREEN}Toov1453@@${NC}"

echo -e "\n${YELLOW}🛠️  Faydalı Komutlar:${NC}"
echo -e "  pm2 logs posta-kodlari     # Logları izle"
echo -e "  pm2 restart posta-kodlari  # Yeniden başlat"
echo -e "  pm2 monit                  # Monitoring"

echo -e "\n${YELLOW}🔄 Güncelleme için:${NC}"
echo -e "  cd /var/www/posta-kodlari && ./deploy.sh"

echo -e "\n${GREEN}Deployment başarılı! 🚀${NC}\n"
