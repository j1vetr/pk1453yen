# Turkish Postal Code Platform - Posta Kodları

## Overview

This is a modern, SEO-optimized web application for querying Turkish postal codes under the brand "Posta Kodları" (postakodrehberi.com). The platform provides comprehensive coverage of all cities (il), districts (ilçe), neighborhoods/villages (mahalle/köy), and postal codes across Turkey, serving 73,000+ postal code records. The application is built with a focus on search engine optimization, fast performance (targeting Core Web Vitals: LCP <1.8s, CLS <0.1, INP <200ms), and a clean, accessible user interface with both light and dark themes.

The system supports hierarchical browsing from city level down to individual postal codes, comprehensive search functionality, and includes an admin panel for data management, site configuration, and analytics.

## Recent Changes

**October 18, 2025 (Latest):**
- **Domain Migration to postakodrehberi.com**
  - Changed primary domain from postakodlari.com.tr to postakodrehberi.com
  - Updated all canonical URLs across all pages
  - Updated email from info@postakodlari.com.tr to info@postakodrehberi.com
  - Updated Organization schema alternateName to postakodrehberi.com
  - Updated sitemap URLs in robots.txt and server/routes.ts
  - Updated email addresses in all policy pages (Privacy, Terms, Cookie)
  - Updated email addresses in Footer and ContactPage components
- **Advanced SEO Optimization for Google Ranking**
  - Fixed critical canonical URL domain from turkiye-posta-kodlari.com to postakodrehberi.com across all pages
  - Migrated AboutPage and ContactPage from manual meta tags to SEOHead component for consistent SEO
  - Enhanced JSON-LD structured data with @graph structure for multiple entities
  - Added comprehensive Organization schema to Home.tsx with contact details and branding
  - Added FAQPage schema to ContactPage for rich snippets in Google search
  - All static pages now use centralized SEO management through SEOHead component
  - Organization schema includes logo, contact points, area served, and social links
  - WebSite schema includes SearchAction for Google Search integration
- **Admin Panel: Google Analytics and Search Console Integration**
  - Added Google Analytics code input field in admin settings
  - Added Google Search Console verification meta tag input field
  - Created AnalyticsLoader component to dynamically inject codes into all pages
  - Public API endpoint: GET /api/settings returns analytics codes
  - Analytics codes automatically load on all pages via React component
  - Admin can manage codes through Site Ayarları page (/admin/settings)
- **Domain and Branding Update**
  - Changed site name from "Posta Kodum" to "Posta Kodları"
  - Updated domain references to postakodrehberi.com throughout application
  - Email changed to info@postakodrehberi.com (updated across all policy pages)
  - All sitemap URLs now use postakodrehberi.com domain
  - robots.txt updated with correct sitemap reference
  - Explicit /robots.txt route added to prevent route collision
- **Added Google reCAPTCHA v3 Integration**
  - Integrated reCAPTCHA v3 to contact form for spam protection
  - Site key: 6LfZW-4rAAAAAGDdo-bEElPM0PJ6PYGnsFYCo5Ly (Turkish language)
  - Backend verification endpoint: POST /api/verify-recaptcha
  - Graceful error handling for development environment (domain mismatch tolerance)
  - Form submission works with improved UX and success notifications
- **Custom Favicon Implementation**
  - Added custom favicon using provided Turkish flag map logo
  - Set as /favicon.png with proper HTML head references
  - Includes apple-touch-icon for iOS devices
- Implemented comprehensive sitemap system with index and sub-sitemaps
  - Created sitemap index at `/sitemap.xml` referencing 5 sub-sitemaps
  - `/sitemap-static.xml`: Homepage + 6 static pages (7 URLs)
  - `/sitemap-cities.xml`: All city pages (81 URLs)
  - `/sitemap-districts.xml`: All district pages (973 URLs)
  - `/sitemap-neighborhoods.xml`: All neighborhood pages (73,299 URLs)
  - `/sitemap-postal-codes.xml`: All postal code pages (2,771 unique codes)
  - Total: ~77,000 URLs indexed for search engines
  - All sitemaps use proper XML format with priority values and change frequencies
  - Storage functions added: `getAllDistricts()`, `getAllMahalleler()`, `getAllPostalCodes()`
- Restructured mahalle/village page URLs to remove postal code suffix
  - Changed from `/:ilSlug/:ilceSlug/:mahalleSlug/:pk` to `/:ilSlug/:ilceSlug/:mahalleSlug`
  - Backend API updated to return all postal codes for a neighborhood
  - Multiple postal codes per neighborhood are now displayed together
  - Related mahalleler list now shows unique neighborhoods without duplicate entries
- Updated navigation header
  - Changed "Ara" to "Ana Sayfa" with Home icon
  - Links to homepage instead of search page
- Redesigned 404 error page
  - Modern card-based layout with red theme
  - Clear error messaging and "Ana Sayfaya Dön" button
  - Pages with invalid data (Il, Ilce, Mahalle) now properly show 404 page
- Added footer credit
  - "made with ❤ by TOOV" linking to https://toov.com.tr
- Fixed nested anchor tag warning in PostalCodeCard component
- All end-to-end tests passing: navigation, URL structure, 404 handling, footer links, sitemap validation, contact form submission

**October 18, 2025 (Earlier):**
- Changed color scheme from blue to red theme throughout application
  - Primary color: 355 85% 50% (light) / 355 85% 55% (dark)
  - All accent colors updated to red tones (355 hue)
  - Consistent red theme across all UI components, buttons, icons
- Set dark mode as default theme
  - Application loads in dark mode by default
  - Users can still toggle to light mode via theme button
  - Theme preference saved in localStorage
- Improved icon sizing across components
  - StatsCard: Icons increased to w-8 h-8
  - PostalCodeCard: Icons increased to w-6 h-6
  - EmptyState: Icons increased to w-10 h-10
  - Footer contact icons: w-5 h-5
- Fixed Turkish character search functionality with proper normalization
  - Implemented character-by-character pattern matching (e.g., "kadikoy" matches "KADIKÖY")
  - Handles all Turkish characters: ı/i, ö/o, ü/u, ş/s, ç/c, ğ/g
  - Uses PostgreSQL regex (~*) with character class patterns
- Improved postal code search with prefix matching
  - Numeric queries (e.g., "34") now use start-of-string matching (^34 pattern)
  - Prevents false matches like "01340" when searching for "34"
- Fixed SearchPage query parameter reading using window.location.search

**October 17, 2025:**
- Successfully imported 73,305 postal code records from CSV into PostgreSQL
- Created default admin user (username: toov) with secure password hashing
- Verified database integrity and search functionality
- Completed full backend implementation with PostgreSQL storage

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Material Design with influences from Linear (data presentation), Google (search UX), and Notion (admin dashboard)
- Comprehensive theme system supporting light/dark modes via React Context
- Color scheme: Red theme (355 hue) throughout application
- Default theme: Dark mode (user-switchable to light mode)

**Page Structure:**
- Home page (/): Search bar, statistics cards, city listing
- City page (/:ilSlug): District listing for a specific city
- District page (/:ilSlug/:ilceSlug): Neighborhood/village listing
- Neighborhood detail page (/:ilSlug/:ilceSlug/:mahalleSlug): All postal codes for a neighborhood
- Postal code page (/kod/:pk): All locations sharing a postal code
- Search results page (/ara?q=...): Dynamic search results
- 404 error page: Modern design with "Ana Sayfaya Dön" button
- Admin panel (/admin/*): Complete data and site management system

**SEO Implementation:**
- SEOHead component dynamically manages meta tags, Open Graph, Twitter Cards, and canonical URLs
- JSON-LD structured data on all pages (Organization, WebSite, BreadcrumbList, PostalAddress, ItemList, FAQPage)
- Breadcrumb navigation on all content pages
- Internal linking strategy with hierarchical navigation
- Mobile-first responsive design

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js REST API
- TypeScript for type safety across server and shared code
- ESM module system throughout

**API Design Pattern:**
- RESTful endpoints under /api namespace
- Public endpoints: statistics, city listings, search
- Protected admin endpoints: authentication, data management, site settings
- Session-based authentication with secure cookie handling

**Key API Routes:**
- GET /api/stats - Platform statistics
- GET /api/cities - All cities with counts
- GET /api/il/:ilSlug - City details with districts
- GET /api/ilce/:ilSlug/:ilceSlug - District details with neighborhoods (unique by mahalleSlug)
- GET /api/mahalle/:ilSlug/:ilceSlug/:mahalleSlug - All postal codes for a neighborhood
- GET /api/kod/:pk - All locations for a postal code
- GET /api/search?q=... - Search functionality
- POST /api/admin/* - Admin operations (authentication required)

**Authentication & Security:**
- Bcrypt for password hashing (10 salt rounds)
- Session-based authentication with express-session
- Brute-force protection and secure cookie configuration planned
- Role-based access control (admin/editor roles)

### Data Storage

**Database:**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database queries and migrations
- WebSocket connection pooling for serverless environment

**Schema Design:**

*postal_codes table:*
- Core fields: il, ilce, semt, mahalle, pk
- Slug fields for URL routing: ilSlug, ilceSlug, mahalleSlug
- Indexes on: il, ilce, pk, and all slug fields for fast lookups
- Timestamps: createdAt, updatedAt

*admin_users table:*
- Authentication: username (unique), passwordHash
- Role-based access: role field (admin/editor)
- Activity tracking: lastLogin timestamp

*site_settings table:*
- Key-value configuration store
- Supports: site name, description, logo, favicon, meta templates, robots.txt rules

*Analytics tables:*
- search_logs: Query tracking with result counts and timestamps
- page_views: Page visit analytics with URL and visitor tracking

**Data Import:**
- CSV parsing using csv-parse library
- Multer for file upload handling
- Turkish character normalization during import (İ/ı/Ş/Ğ/Ü/Ö/Ç to ASCII equivalents)
- Automatic slug generation from Turkish text
- Source data: data/posta_kodlari.csv (UTF-8 encoded)

### External Dependencies

**Database & Hosting:**
- Neon Serverless PostgreSQL - Serverless Postgres database with WebSocket support
- Requires DATABASE_URL environment variable

**UI Libraries:**
- Radix UI (@radix-ui/*) - Accessible component primitives (accordion, dialog, dropdown, etc.)
- Tailwind CSS - Utility-first CSS framework
- Lucide React - Icon library
- class-variance-authority - Component variant management
- cmdk - Command palette component

**Data Management:**
- csv-parse - CSV file parsing for data imports
- multer - Multipart form data handling for file uploads
- drizzle-orm & drizzle-kit - TypeScript ORM and migration tooling

**Security:**
- bcryptjs - Password hashing
- express-session - Session management
- connect-pg-simple - PostgreSQL session store

**Development Tools:**
- Vite - Build tool and dev server
- TypeScript - Type safety
- tsx - TypeScript execution for development
- esbuild - Production build bundling

**Font Resources:**
- Google Fonts: Inter (primary font family for UI and body text)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Optional Replit Integration:**
- @replit/vite-plugin-runtime-error-modal - Development error overlay
- @replit/vite-plugin-cartographer - Development navigation
- @replit/vite-plugin-dev-banner - Development environment banner