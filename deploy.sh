#!/bin/bash

# Posta Kodları - Production Deployment Script
# Ubuntu 22.04 için otomatik deployment scripti

set -e  # Hata durumunda çık

echo "🚀 Posta Kodları Deployment Başlatılıyor..."

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Proje dizini
PROJECT_DIR="/var/www/posta-kodlari"

# 1. Git pull (eğer git repo kullanılıyorsa)
if [ -d "$PROJECT_DIR/.git" ]; then
    echo -e "${YELLOW}📦 Git'ten güncel kod çekiliyor...${NC}"
    cd $PROJECT_DIR
    git pull origin main || git pull origin master
else
    echo -e "${YELLOW}ℹ️  Git repo bulunamadı, manuel yükleme yapılmış.${NC}"
fi

# 2. Node modules güncelle
echo -e "${YELLOW}📚 Node modülleri kuruluyor...${NC}"
cd $PROJECT_DIR
npm install --production=false

# 3. .env kontrolü
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${RED}❌ .env dosyası bulunamadı!${NC}"
    echo -e "${YELLOW}Lütfen .env.production.example'ı .env olarak kopyalayıp doldurun.${NC}"
    exit 1
fi

# 4. TypeScript kontrolü (opsiyonel)
echo -e "${YELLOW}🔍 TypeScript kontrol ediliyor...${NC}"
npm run check || echo -e "${YELLOW}⚠️  TypeScript hatası var ama devam ediliyor...${NC}"

# 5. Database migration
echo -e "${YELLOW}🗄️  Database migration çalıştırılıyor...${NC}"
npm run db:push || echo -e "${YELLOW}⚠️  Migration hatası, devam ediliyor...${NC}"

# 6. Logs klasörü oluştur
mkdir -p $PROJECT_DIR/logs

# 7. PM2 ile uygulamayı yeniden başlat veya başlat
echo -e "${YELLOW}⚙️  PM2 ile uygulama başlatılıyor...${NC}"

if pm2 list | grep -q "posta-kodlari"; then
    echo -e "${GREEN}♻️  Mevcut uygulama yeniden başlatılıyor (zero-downtime)...${NC}"
    pm2 reload posta-kodlari --update-env
else
    echo -e "${GREEN}🆕 Yeni uygulama başlatılıyor...${NC}"
    pm2 start ecosystem.config.js --env production
fi

# 8. PM2 kaydet (auto-start için)
pm2 save

# 9. Nginx config kontrolü
echo -e "${YELLOW}🌐 Nginx config kontrol ediliyor...${NC}"
if [ -f "/etc/nginx/sites-available/postakodrehberi.com" ]; then
    sudo nginx -t
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx config doğru${NC}"
        sudo systemctl reload nginx
    else
        echo -e "${RED}❌ Nginx config hatası!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Nginx config bulunamadı. nginx.conf.example'ı kullanarak oluşturun.${NC}"
fi

# 10. Durum kontrolü
echo -e "\n${GREEN}✅ Deployment tamamlandı!${NC}\n"
echo -e "${YELLOW}📊 Uygulama durumu:${NC}"
pm2 list

echo -e "\n${YELLOW}📝 Son loglar:${NC}"
pm2 logs posta-kodlari --lines 20 --nostream

echo -e "\n${GREEN}🎉 Deployment başarılı!${NC}"
echo -e "${YELLOW}🌐 Site: https://postakodrehberi.com${NC}"
echo -e "${YELLOW}📊 Monitoring: pm2 monit${NC}"
echo -e "${YELLOW}📝 Logs: pm2 logs posta-kodlari${NC}\n"
