# Turkish Postal Code Platform - Posta Kodları

## Overview

"Posta Kodları" (postakodrehberi.com) is an SEO-optimized web application for Turkish postal codes, covering over 73,000 records across all cities, districts, and neighborhoods. It emphasizes fast performance (targeting Core Web Vitals) and offers a clean, accessible UI with light/dark themes. The platform supports hierarchical browsing, comprehensive search, and an admin panel for data and site management. Its business vision is to be the definitive guide for Turkish postal codes, leveraging strong SEO for market leadership and user acquisition.

## Recent Changes (October 18, 2025)

**Full Server-Side Rendering (SSR) Implementation:**
- Implemented complete SSR for all content pages (home, city, district, neighborhood, postal code)
- View Source now shows real HTML content (H1, H2, H3, links, data) instead of empty `<div id="root">`
- Client-side React hydration for seamless interactivity after SSR
- Google bots can now index all content without JavaScript execution
- Production-ready SSR with proper status codes and error handling

**SEO Enhancements:**
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