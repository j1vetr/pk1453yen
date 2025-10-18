import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, index, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

// Postal Codes Table
export const postalCodes = pgTable("postal_codes", {
  id: serial("id").primaryKey(),
  il: varchar("il", { length: 100 }).notNull(),
  ilce: varchar("ilce", { length: 100 }).notNull(),
  semt: varchar("semt", { length: 100 }),
  mahalle: varchar("mahalle", { length: 200 }).notNull(),
  pk: varchar("pk", { length: 10 }).notNull(),
  ilSlug: varchar("il_slug", { length: 100 }).notNull(),
  ilceSlug: varchar("ilce_slug", { length: 100 }).notNull(),
  mahalleSlug: varchar("mahalle_slug", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  ilIndex: index("il_idx").on(table.il),
  ilceIndex: index("ilce_idx").on(table.ilce),
  pkIndex: index("pk_idx").on(table.pk),
  ilSlugIndex: index("il_slug_idx").on(table.ilSlug),
  ilceSlugIndex: index("ilce_slug_idx").on(table.ilceSlug),
  mahalleSlugIndex: index("mahalle_slug_idx").on(table.mahalleSlug),
}));

export const insertPostalCodeSchema = createInsertSchema(postalCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PostalCode = typeof postalCodes.$inferSelect;
export type InsertPostalCode = z.infer<typeof insertPostalCodeSchema>;

// Site Settings Table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

// Search Logs Table
export const searchLogs = pgTable("search_logs", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  resultsCount: integer("results_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  createdAtIndex: index("search_logs_created_at_idx").on(table.createdAt),
}));

export const insertSearchLogSchema = createInsertSchema(searchLogs).omit({
  id: true,
  createdAt: true,
});

export type SearchLog = typeof searchLogs.$inferSelect;
export type InsertSearchLog = z.infer<typeof insertSearchLogSchema>;

// Page Views Table for Analytics
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  viewCount: integer("view_count").notNull().default(1),
  lastViewed: timestamp("last_viewed").notNull().defaultNow(),
}, (table) => ({
  pathIndex: index("page_views_path_idx").on(table.path),
}));

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  lastViewed: true,
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;

// Contact Messages Table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read").notNull().default(0), // 0 = unread, 1 = read
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  createdAtIndex: index("contact_messages_created_at_idx").on(table.createdAt),
  isReadIndex: index("contact_messages_is_read_idx").on(table.isRead),
}));

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Legacy users table (keep for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
