# Turkish Postal Code Platform

## Overview

This is a modern, SEO-optimized web application for querying Turkish postal codes. The platform provides comprehensive coverage of all cities (il), districts (ilçe), neighborhoods/villages (mahalle/köy), and postal codes across Turkey, serving 73,000+ postal code records. The application is built with a focus on search engine optimization, fast performance (targeting Core Web Vitals: LCP <1.8s, CLS <0.1, INP <200ms), and a clean, accessible user interface with both light and dark themes.

The system supports hierarchical browsing from city level down to individual postal codes, comprehensive search functionality, and includes an admin panel for data management, site configuration, and analytics.

## Recent Changes

**October 18, 2025:**
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
- All end-to-end tests passing: search, navigation, detail pages, copy functionality, theme system

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
- Home page: Search bar, statistics cards, city listing
- City page (/:ilSlug): District listing for a specific city
- District page (/:ilSlug/:ilceSlug): Neighborhood/village listing
- Neighborhood detail page (/:ilSlug/:ilceSlug/:mahalleSlug/:pk): Individual postal code information
- Postal code page (/kod/:pk): All locations sharing a postal code
- Search results page (/ara?q=...): Dynamic search results
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
- GET /api/ilce/:ilSlug/:ilceSlug - District details with neighborhoods
- GET /api/mahalle/:ilSlug/:ilceSlug/:mahalleSlug/:pk - Neighborhood details
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