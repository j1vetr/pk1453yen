# Turkish Postal Code Platform - Posta Kodları

## Overview

"Posta Kodları" (postakodrehberi.com) is an SEO-optimized web application for Turkish postal codes, covering over 73,000 records across all cities, districts, and neighborhoods. It emphasizes fast performance (targeting Core Web Vitals) and offers a clean, accessible UI with light/dark themes. The platform supports hierarchical browsing, comprehensive search, and an admin panel for data and site management. Its business vision is to be the definitive guide for Turkish postal codes, leveraging strong SEO for market leadership and user acquisition.

## Recent Changes

**Postal Code Pages Enhancement with Contextual Intelligence (October 19, 2025):**
- **Smart Province Detection**: Automatically detects province from postal code prefix (e.g., 34xxx = İstanbul)
- **Rich Contextual Information**: Each postal code page now includes:
  - Province name and geographic region (e.g., "İstanbul - Marmara Bölgesi")
  - 200-400 word unique description explaining PTT postal code structure
  - Breadcrumb navigation linking back to province page
  - Province information badge with location count
  - Quick link to all province postal codes
- **Enhanced FAQ Section**: 4 comprehensive FAQs for postal code pages:
  - Which province does this postal code belong to?
  - How many locations does this code cover?
  - How does the postal code system work?
  - How to use this code for cargo shipments?
- **Complete JSON-LD Schemas**: PostalAddress (top 5 locations) + BreadcrumbList + FAQPage
- **Province Mapping System**: Complete mapping of all 81 Turkish provinces with:
  - 2-digit prefix codes (01-81)
  - Province names (Turkish proper case)
  - Geographic regions (7 regions: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu)
  - URL-safe slugs for linking
- **SEO-Optimized Meta Tags**: Enhanced title and description tags with province and region information
- **All Content Server-Rendered**: Complete SSR ensures Google can index all contextual information

**Major SEO Content Enhancement - COMPLETE SSR Integration (October 19, 2025):**
- **Rich Content Generators**: Enhanced all description generators to produce 200-400 word unique content per page
  - `generateIlDescription()`: Comprehensive province-level descriptions with PTT standards, usage guidance
  - `generateIlceDescription()`: Detailed district-level content covering neighborhoods, usage scenarios
  - `generateMahalleDescription()`: In-depth neighborhood descriptions with practical postal code usage info
- **FAQ Sections with SSR**: Added comprehensive FAQ components to all main page types, fully server-rendered
  - Il (Province) pages: 4 FAQs about postal codes, coverage, usage, importance
  - Ilce (District) pages: 3 FAQs about neighborhoods, querying, popular codes
  - Mahalle (Neighborhood) pages: 4 FAQs about specific postal codes, location, usage, nearby areas
  - Interactive Accordion UI server-rendered with proper HTML structure
  - All FAQ content visible in View Source for optimal SEO
- **Complete JSON-LD Schema Injection in SSR**: All structured data now injected server-side into <head>
  - Il pages: ItemList (all districts) + FAQPage schemas
  - Ilce pages: ItemList (all neighborhoods) + FAQPage schemas
  - Mahalle pages: PostalAddress + BreadcrumbList + FAQPage schemas
  - All JSON-LD schemas visible in View Source before any JavaScript execution
  - Enhances Google rich snippet potential and search engine indexing
- **Mobile Navigation**: Implemented responsive hamburger menu using Sheet component
  - Full menu access on mobile devices (Ana Sayfa, İstatistikler, Hakkımızda, İletişim)
  - Clean sliding panel from right side with icons and smooth interactions

**Full Server-Side Rendering (October 18-19, 2025):**
- Implemented complete SSR for all content pages (home, city, district, neighborhood, postal code)
- View Source now shows real HTML content (H1, H2, H3, FAQ sections, links, data) instead of empty `<div id="root">`
- All content including 200-400 word descriptions and FAQ sections fully server-rendered
- All JSON-LD schemas injected into <head> server-side
- Client-side React hydration for seamless interactivity after SSR
- Google bots can now index all content without JavaScript execution
- SSR works in both development and production modes
- Production-ready SSR with proper status codes and error handling

**Slug Fix Tool (October 18, 2025):**
- Created automated slug correction tool (`server/fix-slugs.ts`)
- Fixes incorrect hyphenation in slugs (e.g., `sehi-tler` → `sehitler`)
- Preserves correct Turkish izafet constructs (e.g., `ahmed-i-hani` remains unchanged)
- See `SLUG_FIX_GUIDE.md` for deployment instructions

**SEO Foundation (October 18, 2025):**
- Implemented 301 redirects from old URL structure (/{il}/{ilce}/{mahalle}/{pk}/) to new structure (/{il}/{ilce}/{mahalle}/)
- Enhanced semantic HTML structure with proper article, section, header, and aside elements
- Implemented proper heading hierarchy (H1, H2, H3) across all content pages
- Added accessibility features: skip links and in-page anchor navigation
- Enriched JSON-LD structured data with PostalAddress, BreadcrumbList, ItemList, and FAQPage schemas
- Improved meta tag formats for better search engine visibility
- All changes verified with production build testing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Vite for building, Wouter for routing, and TanStack Query for state management. UI is built with Shadcn/ui (New York style) on Radix UI primitives and Tailwind CSS, featuring a red theme, dark mode default, and a mobile-first responsive design. Core pages include Home, City, District, Neighborhood detail, Postal code, Search results, and a 404 page. SEO is managed dynamically via an `SEOHead` component, JSON-LD structured data (Organization, WebSite, BreadcrumbList, PostalAddress, ItemList, FAQPage), and internal linking.

### Backend Architecture

The backend is built with Node.js and Express.js, using TypeScript for type safety. It provides RESTful APIs under `/api`, with public endpoints for statistics, listings, and search, and protected admin endpoints for data and site settings. Authentication uses session-based cookies with `express-session` and `bcrypt` for password hashing. PostgreSQL is the primary database, accessed via Drizzle ORM. The schema includes tables for `postal_codes`, `admin_users`, `site_settings`, `search_logs`, and `page_views`. Data import from CSV handles Turkish character normalization and slug generation. Server-Side Rendering (SSR) is implemented for all pages to enhance SEO, generate dynamic meta tags, and ensure proper HTTP status codes.

### System Design Choices

- **SEO-First Design:** Implemented SSR for all pages, dynamic meta tag generation, comprehensive JSON-LD schemas (Organization, WebSite, BreadcrumbList, PostalAddress, ItemList, FAQPage), canonical URLs, sitemaps (index, static, cities, districts, 50 neighborhood parts), 301 redirects for URL structure migration, semantic HTML with proper heading hierarchy (H1-H3), and optimized internal linking.
- **Accessibility:** Skip links for keyboard navigation, in-page anchor navigation for content sections, proper ARIA labels, and semantic HTML structure.
- **Performance:** Vite for fast builds, TanStack Query for efficient data fetching, and focus on Core Web Vitals.
- **User Experience:** Responsive design, light/dark themes, clear navigation, and a modern UI with consistent branding.
- **Scalability:** PostgreSQL with Neon serverless for the database, designed to handle large datasets and traffic.
- **Admin Panel:** Comprehensive interface for managing data, site settings (including Google Analytics and Search Console integration), and content.
- **Internationalization:** Turkish character handling in search and data import.
- **Security:** Bcrypt for password hashing, session-based authentication, and reCAPTCHA v3 for spam protection on contact forms.

## External Dependencies

**Database & Hosting:**
- Neon Serverless PostgreSQL

**Frontend Libraries:**
- React
- Wouter
- TanStack Query (React Query)
- Shadcn/ui (built on Radix UI)
- Tailwind CSS
- Lucide React
- `class-variance-authority`
- `cmdk`
- Google Fonts: Inter

**Backend Libraries:**
- Express.js
- Drizzle ORM & Drizzle Kit
- `bcryptjs`
- `express-session`
- `connect-pg-simple`
- `csv-parse`
- `multer`
- `tsx`
- `esbuild`

**Security:**
- Google reCAPTCHA v3

**Development Tools (Optional Replit Specific):**
- `@replit/vite-plugin-runtime-error-modal`
- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-dev-banner`