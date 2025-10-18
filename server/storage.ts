import { db } from './db';
import { postalCodes, adminUsers, siteSettings, searchLogs, pageViews } from '@shared/schema';
import { eq, sql, ilike, or, desc, and } from 'drizzle-orm';
import type { 
  PostalCode, 
  InsertPostalCode, 
  AdminUser,
  SiteSetting,
  InsertSiteSetting,
  SearchLog,
  InsertSearchLog,
  PageView,
  InsertPageView
} from '@shared/schema';
import { turkishToSlug } from '@shared/utils';

export class DatabaseStorage {
  // Postal Codes
  async getAllPostalCodes(page: number = 1, pageSize: number = 20, search?: string) {
    const offset = (page - 1) * pageSize;
    
    let query = db.select().from(postalCodes);
    
    if (search) {
      query = query.where(
        or(
          ilike(postalCodes.il, `%${search}%`),
          ilike(postalCodes.ilce, `%${search}%`),
          ilike(postalCodes.mahalle, `%${search}%`),
          ilike(postalCodes.pk, `%${search}%`)
        )
      );
    }
    
    const data = await query
      .limit(pageSize)
      .offset(offset)
      .orderBy(postalCodes.il, postalCodes.ilce, postalCodes.mahalle);
    
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(postalCodes)
      .where(
        search ? or(
          ilike(postalCodes.il, `%${search}%`),
          ilike(postalCodes.ilce, `%${search}%`),
          ilike(postalCodes.mahalle, `%${search}%`),
          ilike(postalCodes.pk, `%${search}%`)
        ) : undefined
      );
    
    return { data, total: Number(count) };
  }

  async insertPostalCode(data: InsertPostalCode): Promise<PostalCode> {
    const [result] = await db.insert(postalCodes).values(data).returning();
    return result;
  }

  async insertBulkPostalCodes(data: InsertPostalCode[]): Promise<void> {
    if (data.length === 0) return;
    
    // Insert in batches of 1000
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await db.insert(postalCodes).values(batch);
    }
  }

  async getCities() {
    const results = await db.select({
      il: postalCodes.il,
      ilSlug: postalCodes.ilSlug,
      count: sql<number>`count(*)`,
    })
      .from(postalCodes)
      .groupBy(postalCodes.il, postalCodes.ilSlug)
      .orderBy(postalCodes.il);
    
    return results.map(r => ({ ...r, count: Number(r.count) }));
  }

  async getDistrictsByCity(ilSlug: string) {
    const results = await db.select({
      il: postalCodes.il,
      ilSlug: postalCodes.ilSlug,
      ilce: postalCodes.ilce,
      ilceSlug: postalCodes.ilceSlug,
      count: sql<number>`count(*)`,
    })
      .from(postalCodes)
      .where(eq(postalCodes.ilSlug, ilSlug))
      .groupBy(postalCodes.il, postalCodes.ilSlug, postalCodes.ilce, postalCodes.ilceSlug)
      .orderBy(postalCodes.ilce);
    
    return results.map(r => ({ ...r, count: Number(r.count) }));
  }

  async getMahallerByDistrict(ilSlug: string, ilceSlug: string) {
    const results = await db.select()
      .from(postalCodes)
      .where(
        and(
          eq(postalCodes.ilSlug, ilSlug),
          eq(postalCodes.ilceSlug, ilceSlug)
        )
      )
      .orderBy(postalCodes.mahalle);
    
    return results;
  }

  async getMahalleDetail(ilSlug: string, ilceSlug: string, mahalleSlug: string) {
    const results = await db.select()
      .from(postalCodes)
      .where(
        and(
          eq(postalCodes.ilSlug, ilSlug),
          eq(postalCodes.ilceSlug, ilceSlug),
          eq(postalCodes.mahalleSlug, mahalleSlug)
        )
      );
    
    return results;
  }

  async getLocationsByPostalCode(pk: string) {
    const results = await db.select()
      .from(postalCodes)
      .where(eq(postalCodes.pk, pk))
      .orderBy(postalCodes.il, postalCodes.ilce, postalCodes.mahalle);
    
    return results;
  }

  async searchPostalCodes(query: string) {
    // Normalize query for Turkish character matching
    // Map each character to its Turkish equivalent pattern
    const normalizedQuery = query.split('').map(char => {
      // Handle Turkish i/ı variations
      if (/[iıİI]/.test(char)) return '[iıİI]';
      // Handle o/ö variations
      if (/[oöOÖ]/.test(char)) return '[oöOÖ]';
      // Handle u/ü variations
      if (/[uüUÜ]/.test(char)) return '[uüUÜ]';
      // Handle s/ş variations
      if (/[sşSŞ]/.test(char)) return '[sşSŞ]';
      // Handle c/ç variations
      if (/[cçCÇ]/.test(char)) return '[cçCÇ]';
      // Handle g/ğ variations
      if (/[gğGĞ]/.test(char)) return '[gğGĞ]';
      // Handle a/A for case insensitivity
      if (/[aA]/.test(char)) return '[aA]';
      // Handle e/E for case insensitivity
      if (/[eE]/.test(char)) return '[eE]';
      // Handle other letters for case insensitivity
      if (/[b-zB-Z]/.test(char)) return `[${char.toLowerCase()}${char.toUpperCase()}]`;
      // Keep other characters as-is
      return char;
    }).join('');
    
    // For postal codes, use starts-with matching if query is numeric
    const isNumeric = /^\d+$/.test(query);
    const pkPattern = isNumeric ? `^${query}` : query;
    
    // Use raw SQL for regex matching to avoid escaping issues
    const results = await db.select()
      .from(postalCodes)
      .where(
        or(
          sql.raw(`postal_codes.il ~* '${normalizedQuery}'`),
          sql.raw(`postal_codes.ilce ~* '${normalizedQuery}'`),
          sql.raw(`postal_codes.mahalle ~* '${normalizedQuery}'`),
          sql.raw(`postal_codes.pk ~* '${pkPattern}'`),
          sql.raw(`postal_codes.semt ~* '${normalizedQuery}'`)
        )
      )
      .limit(100)
      .orderBy(postalCodes.il, postalCodes.ilce, postalCodes.mahalle);
    
    return results;
  }

  async getStats() {
    const [stats] = await db.select({
      totalCities: sql<number>`count(distinct ${postalCodes.il})`,
      totalDistricts: sql<number>`count(distinct ${postalCodes.ilSlug} || '-' || ${postalCodes.ilceSlug})`,
      totalCodes: sql<number>`count(*)`,
    }).from(postalCodes);
    
    const [lastUpdate] = await db.select({
      lastUpdate: postalCodes.createdAt,
    })
      .from(postalCodes)
      .orderBy(desc(postalCodes.createdAt))
      .limit(1);
    
    return {
      totalCities: Number(stats.totalCities),
      totalDistricts: Number(stats.totalDistricts),
      totalCodes: Number(stats.totalCodes),
      lastUpdate: lastUpdate?.lastUpdate || new Date(),
    };
  }

  // Site Settings
  async getSetting(key: string): Promise<string | null> {
    const [result] = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    
    return result?.value || null;
  }

  async getAllSettings() {
    const results = await db.select().from(siteSettings);
    const settings: Record<string, string> = {};
    results.forEach(r => {
      settings[r.key] = r.value;
    });
    return settings;
  }

  async setSetting(key: string, value: string) {
    await db.insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  async setMultipleSettings(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
      await this.setSetting(key, value);
    }
  }

  // Search Logs
  async logSearch(query: string, resultsCount: number) {
    await db.insert(searchLogs).values({ query, resultsCount });
  }

  async getRecentSearches(limit: number = 10) {
    const results = await db.select({
      query: searchLogs.query,
      count: sql<number>`count(*)`,
    })
      .from(searchLogs)
      .groupBy(searchLogs.query)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
    
    return results.map(r => ({ query: r.query, count: Number(r.count) }));
  }

  async getTotalSearches(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(searchLogs);
    return Number(result.count);
  }

  // Page Views
  async logPageView(path: string) {
    const [existing] = await db.select()
      .from(pageViews)
      .where(eq(pageViews.path, path))
      .limit(1);
    
    if (existing) {
      await db.update(pageViews)
        .set({
          viewCount: existing.viewCount + 1,
          lastViewed: new Date(),
        })
        .where(eq(pageViews.path, path));
    } else {
      await db.insert(pageViews).values({ path, viewCount: 1 });
    }
  }

  async getPopularPages(limit: number = 10) {
    const results = await db.select()
      .from(pageViews)
      .orderBy(desc(pageViews.viewCount))
      .limit(limit);
    
    return results.map(r => ({ path: r.path, views: r.viewCount }));
  }

  async getTotalPageViews(): Promise<number> {
    const [result] = await db.select({
      total: sql<number>`sum(${pageViews.viewCount})`,
    }).from(pageViews);
    
    return Number(result.total || 0);
  }

  // Clean all data (for testing/reset)
  async clearAllPostalCodes() {
    await db.delete(postalCodes);
  }
}

export const storage = new DatabaseStorage();
