import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { verifyAdminCredentials, createAdminUser } from "./auth";
import { turkishToSlug } from "@shared/utils";
import multer from "multer";
import { parse } from "csv-parse/sync";

const upload = multer({ storage: multer.memoryStorage() });

// Extend Express session
declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}

const PgSession = connectPg(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax',
      },
    })
  );
  // Serve robots.txt explicitly (before other routes)
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
    const robotsTxt = `User-agent: *
Allow: /
Allow: /ara
Allow: /hakkimizda
Allow: /iletisim
Allow: /gizlilik-politikasi
Allow: /kullanim-sartlari
Allow: /cerez-politikasi

# Disallow admin pages
Disallow: /admin
Disallow: /admin/*

# Disallow API endpoints
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Sitemap Index - Ana sitemap dosyası
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const lastmod = new Date().toISOString().split('T')[0];
      
      // Build sitemap index XML (Google standard format)
      let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Add sub-sitemaps
      const sitemaps = [
        'sitemap-static.xml',
        'sitemap-cities.xml',
        'sitemap-districts.xml',
      ];
      
      // Add 50 neighborhood sitemaps
      for (let i = 1; i <= 50; i++) {
        sitemaps.push(`sitemap-neighborhoods-${i}.xml`);
      }
      
      sitemaps.push('sitemap-postal-codes.xml');
      
      for (const sitemap of sitemaps) {
        sitemapIndex += '  <sitemap>\n';
        sitemapIndex += `    <loc>${baseUrl}/${sitemap}</loc>\n`;
        sitemapIndex += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemapIndex += '  </sitemap>\n';
      }
      
      sitemapIndex += '</sitemapindex>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemapIndex);
    } catch (error: any) {
      res.status(500).send('Error generating sitemap index');
    }
  });

  // Sitemap - Static pages
  app.get("/sitemap-static.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const lastmod = new Date().toISOString().split('T')[0];
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Homepage
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>1.0</priority>\n';
      sitemap += '  </url>\n';
      
      // Static pages
      const staticPages = ['ara', 'hakkimizda', 'iletisim', 'gizlilik-politikasi', 'kullanim-sartlari', 'cerez-politikasi'];
      for (const page of staticPages) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/${page}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.5</priority>\n';
        sitemap += '  </url>\n';
      }
      
      sitemap += '</urlset>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating static sitemap');
    }
  });

  // Sitemap - Cities (Il pages)
  app.get("/sitemap-cities.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const cities = await storage.getCities();
      const lastmod = new Date().toISOString().split('T')[0];
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const city of cities) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/${city.ilSlug}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.9</priority>\n';
        sitemap += '  </url>\n';
      }
      
      sitemap += '</urlset>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating cities sitemap');
    }
  });

  // Sitemap - Districts (Ilce pages)
  app.get("/sitemap-districts.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const districts = await storage.getAllDistricts();
      const lastmod = new Date().toISOString().split('T')[0];
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const district of districts) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/${district.ilSlug}/${district.ilceSlug}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
      }
      
      sitemap += '</urlset>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating districts sitemap');
    }
  });

  // Sitemap - Neighborhoods (50 parçaya bölünmüş)
  app.get("/sitemap-neighborhoods-:part.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const part = parseInt(req.params.part);
      
      // Part 1-50 arası olmalı
      if (part < 1 || part > 50) {
        return res.status(404).send('Sitemap not found');
      }
      
      const neighborhoods = await storage.getAllMahalleler();
      const lastmod = new Date().toISOString().split('T')[0];
      
      // Toplam kayıt sayısı
      const total = neighborhoods.length;
      // Her parçada olması gereken kayıt sayısı
      const perPart = Math.ceil(total / 50);
      
      // Bu parçanın başlangıç ve bitiş index'leri
      const startIndex = (part - 1) * perPart;
      const endIndex = Math.min(part * perPart, total);
      
      // Bu parçaya ait mahalleler
      const partData = neighborhoods.slice(startIndex, endIndex);
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const neighborhood of partData) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/${neighborhood.ilSlug}/${neighborhood.ilceSlug}/${neighborhood.mahalleSlug}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.7</priority>\n';
        sitemap += '  </url>\n';
      }
      
      sitemap += '</urlset>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating neighborhoods sitemap');
    }
  });

  // Sitemap - Postal Codes (Posta kodu pages)
  app.get("/sitemap-postal-codes.xml", async (req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://postakodrehberi.com";
      const postalCodes = await storage.getUniquePostalCodes();
      const lastmod = new Date().toISOString().split('T')[0];
      
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const code of postalCodes) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/kod/${code.pk}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.6</priority>\n';
        sitemap += '  </url>\n';
      }
      
      sitemap += '</urlset>';
      
      res.header('Content-Type', 'application/xml; charset=UTF-8');
      res.send(sitemap);
    } catch (error: any) {
      res.status(500).send('Error generating postal codes sitemap');
    }
  });

  // Public API Routes

  // Verify reCAPTCHA
  app.post("/api/verify-recaptcha", async (req, res) => {
    try {
      const { token } = req.body;
      const secretKey = "6LfZW-4rAAAAAPQ5F8nnQjpEdvhguS4Sr7eR1Ehv";
      
      if (!token) {
        return res.status(400).json({ success: false, error: "Token gerekli" });
      }

      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      });

      const data = await response.json();

      if (data.success && data.score >= 0.5) {
        res.json({ 
          success: true, 
          score: data.score,
          message: "reCAPTCHA doğrulandı" 
        });
      } else {
        res.json({ 
          success: false, 
          score: data.score || 0,
          message: "reCAPTCHA doğrulaması başarısız" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all cities
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get city details with districts
  app.get("/api/il/:ilSlug", async (req, res) => {
    try {
      const { ilSlug } = req.params;
      const districts = await storage.getDistrictsByCity(ilSlug);
      
      if (districts.length === 0) {
        return res.status(404).json({ error: "İl bulunamadı" });
      }
      
      res.json({
        il: districts[0].il,
        ilSlug: districts[0].ilSlug,
        districts: districts.map(d => ({
          ilce: d.ilce,
          ilceSlug: d.ilceSlug,
          count: d.count,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get district details with mahalleler
  app.get("/api/ilce/:ilSlug/:ilceSlug", async (req, res) => {
    try {
      const { ilSlug, ilceSlug } = req.params;
      const mahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);
      
      if (mahalleler.length === 0) {
        return res.status(404).json({ error: "İlçe bulunamadı" });
      }
      
      // Group mahalleler by unique mahalleSlug
      const uniqueMahalleler = mahalleler.reduce((acc, curr) => {
        if (!acc.find(item => item.mahalleSlug === curr.mahalleSlug)) {
          acc.push({
            mahalle: curr.mahalle,
            mahalleSlug: curr.mahalleSlug,
          });
        }
        return acc;
      }, [] as Array<{ mahalle: string; mahalleSlug: string }>);

      res.json({
        il: mahalleler[0].il,
        ilSlug: mahalleler[0].ilSlug,
        ilce: mahalleler[0].ilce,
        ilceSlug: mahalleler[0].ilceSlug,
        mahalleler: uniqueMahalleler,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get mahalle detail
  app.get("/api/mahalle/:ilSlug/:ilceSlug/:mahalleSlug", async (req, res) => {
    try {
      const { ilSlug, ilceSlug, mahalleSlug } = req.params;
      const mahalleRecords = await storage.getMahalleDetail(ilSlug, ilceSlug, mahalleSlug);
      
      if (!mahalleRecords || mahalleRecords.length === 0) {
        return res.status(404).json({ error: "Mahalle bulunamadı" });
      }
      
      // Get related mahalleler in same district
      const relatedMahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);
      
      // Use first record for general info
      const firstRecord = mahalleRecords[0];
      
      res.json({
        il: firstRecord.il,
        ilSlug: firstRecord.ilSlug,
        ilce: firstRecord.ilce,
        ilceSlug: firstRecord.ilceSlug,
        mahalle: firstRecord.mahalle,
        mahalleSlug: firstRecord.mahalleSlug,
        semt: firstRecord.semt,
        postalCodes: mahalleRecords.map(m => m.pk),
        relatedMahalleler: relatedMahalleler
          .filter(m => m.mahalleSlug !== mahalleSlug)
          .reduce((acc, curr) => {
            // Group by unique mahalle
            if (!acc.find(item => item.mahalleSlug === curr.mahalleSlug)) {
              acc.push({
                mahalle: curr.mahalle,
                mahalleSlug: curr.mahalleSlug,
              });
            }
            return acc;
          }, [] as Array<{ mahalle: string; mahalleSlug: string }>),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get postal code details
  app.get("/api/kod/:pk", async (req, res) => {
    try {
      const { pk } = req.params;
      const locations = await storage.getLocationsByPostalCode(pk);
      
      if (locations.length === 0) {
        return res.status(404).json({ error: "Posta kodu bulunamadı" });
      }
      
      res.json({
        pk,
        locations: locations.map(loc => ({
          il: loc.il,
          ilSlug: loc.ilSlug,
          ilce: loc.ilce,
          ilceSlug: loc.ilceSlug,
          mahalle: loc.mahalle,
          mahalleSlug: loc.mahalleSlug,
          semt: loc.semt,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Search postal codes
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      
      const results = await storage.searchPostalCodes(query.trim());
      
      // Log the search
      await storage.logSearch(query.trim(), results.length);
      
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public settings endpoint (for analytics codes only)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json({
        googleAnalyticsCode: settings.googleAnalyticsCode || '',
        googleSearchConsoleCode: settings.googleSearchConsoleCode || '',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Tüm alanlar zorunludur" });
      }
      
      await storage.createContactMessage({
        name,
        email,
        subject,
        message,
      });
      
      res.json({ success: true, message: "Mesajınız başarıyla gönderildi" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Authentication

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre gerekli" });
      }
      
      const admin = await verifyAdminCredentials(username, password);
      
      if (!admin) {
        return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
      }
      
      // Set session
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      
      res.json({ success: true, admin: { id: admin.id, username: admin.username, role: admin.role } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Çıkış yapılamadı" });
      }
      res.json({ success: true });
    });
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Yetkisiz erişim" });
    }
    next();
  };

  // Admin Routes (protected)

  // Dashboard stats
  app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      const totalSearches = await storage.getTotalSearches();
      const recentSearches = await storage.getRecentSearches(5);
      const popularPages = await storage.getPopularPages(5);
      
      res.json({
        ...stats,
        totalSearches,
        recentSearches,
        popularPages,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // CSV Import
  app.post("/api/admin/csv-import", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya bulunamadı" });
      }
      
      const csvContent = req.file.buffer.toString('utf-8');
      
      // Parse CSV (expecting: il, ilce, semt_bucak_belde, Mahalle, PK)
      const records = parse(csvContent, {
        columns: false,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true,
        bom: true,
      });
      
      const postalCodesToInsert: any[] = [];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;
      
      for (let i = 1; i < records.length; i++) { // Skip header
        const row = records[i];
        
        try {
          const [il, ilce, semt, mahalle, pk] = row;
          
          if (!il || !ilce || !mahalle || !pk) {
            errors.push(`Satır ${i + 1}: Eksik veri`);
            failedCount++;
            continue;
          }
          
          postalCodesToInsert.push({
            il: il.trim(),
            ilce: ilce.trim(),
            semt: semt?.trim() || null,
            mahalle: mahalle.trim(),
            pk: pk.trim(),
            ilSlug: turkishToSlug(il.trim()),
            ilceSlug: turkishToSlug(ilce.trim()),
            mahalleSlug: turkishToSlug(mahalle.trim()),
          });
          
          successCount++;
        } catch (error: any) {
          errors.push(`Satır ${i + 1}: ${error.message}`);
          failedCount++;
        }
      }
      
      // Bulk insert
      if (postalCodesToInsert.length > 0) {
        await storage.insertBulkPostalCodes(postalCodesToInsert);
      }
      
      res.json({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 100), // Limit error messages
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get postal codes (paginated)
  app.get("/api/admin/postal-codes", requireAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const search = req.query.search as string;
      
      const result = await storage.getAllPostalCodes(page, pageSize, search);
      
      res.json({
        data: result.data,
        total: result.total,
        page,
        pageSize,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Site settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json({
        siteName: settings.siteName || 'Türkiye Posta Kodları',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        metaKeywords: settings.metaKeywords || '',
        googleAnalyticsCode: settings.googleAnalyticsCode || '',
        googleSearchConsoleCode: settings.googleSearchConsoleCode || '',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const { siteName, siteDescription, contactEmail, metaKeywords, googleAnalyticsCode, googleSearchConsoleCode } = req.body;
      
      await storage.setMultipleSettings({
        siteName,
        siteDescription,
        contactEmail,
        metaKeywords,
        googleAnalyticsCode,
        googleSearchConsoleCode,
      });
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const totalSearches = await storage.getTotalSearches();
      const totalPageViews = await storage.getTotalPageViews();
      const topSearches = await storage.getRecentSearches(10);
      const topPages = await storage.getPopularPages(10);
      
      res.json({
        totalSearches,
        totalPageViews,
        topSearches,
        topPages,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Messages
  app.get("/api/admin/messages", requireAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      
      const result = await storage.getAllMessages(page, pageSize);
      
      res.json({
        data: result.data,
        total: result.total,
        page,
        pageSize,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/messages/unread-count", requireAdmin, async (req, res) => {
    try {
      const count = await storage.getUnreadMessagesCount();
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/messages/:id/read", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMessage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate sitemap
  app.post("/api/admin/generate-sitemap", requireAdmin, async (req, res) => {
    try {
      // This would generate sitemap.xml files
      // For now, return mock response
      res.json({ success: true, sitemapCount: 5 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate robots.txt
  app.post("/api/admin/generate-robots", requireAdmin, async (req, res) => {
    try {
      // This would generate robots.txt
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
