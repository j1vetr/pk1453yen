import type { Express } from "express";
import { createServer, type Server } from "http";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Public API Routes

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
      
      res.json({
        il: mahalleler[0].il,
        ilSlug: mahalleler[0].ilSlug,
        ilce: mahalleler[0].ilce,
        ilceSlug: mahalleler[0].ilceSlug,
        mahalleler: mahalleler.map(m => ({
          mahalle: m.mahalle,
          mahalleSlug: m.mahalleSlug,
          pk: m.pk,
        })),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get mahalle detail
  app.get("/api/mahalle/:ilSlug/:ilceSlug/:mahalleSlug/:pk", async (req, res) => {
    try {
      const { ilSlug, ilceSlug, mahalleSlug, pk } = req.params;
      const mahalle = await storage.getMahalleDetail(ilSlug, ilceSlug, mahalleSlug, pk);
      
      if (!mahalle) {
        return res.status(404).json({ error: "Mahalle bulunamadı" });
      }
      
      // Get related mahalleler in same district
      const relatedMahalleler = await storage.getMahallerByDistrict(ilSlug, ilceSlug);
      
      res.json({
        il: mahalle.il,
        ilSlug: mahalle.ilSlug,
        ilce: mahalle.ilce,
        ilceSlug: mahalle.ilceSlug,
        mahalle: mahalle.mahalle,
        mahalleSlug: mahalle.mahalleSlug,
        pk: mahalle.pk,
        semt: mahalle.semt,
        relatedMahalleler: relatedMahalleler
          .filter(m => m.id !== mahalle.id)
          .map(m => ({
            mahalle: m.mahalle,
            mahalleSlug: m.mahalleSlug,
            pk: m.pk,
          })),
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
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const { siteName, siteDescription, contactEmail, metaKeywords } = req.body;
      
      await storage.setMultipleSettings({
        siteName,
        siteDescription,
        contactEmail,
        metaKeywords,
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
