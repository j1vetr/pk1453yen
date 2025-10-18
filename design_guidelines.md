# Design Guidelines: Turkish Postal Code Platform

## Design Approach

**Selected Framework:** Design System Approach (Material Design foundation)

**Justification:** This is a utility-focused, information-dense application where efficiency, learnability, and data presentation are paramount. Users come to find postal codes quickly, making functional excellence more important than visual flair.

**Reference Inspirations:**
- **Data Presentation:** Linear (clean tables, strong typography)
- **Search UX:** Google (instant feedback, clear results)
- **Admin Dashboard:** Notion (modern cards, sidebar navigation)

**Core Principles:**
- Information clarity over decoration
- Fast scanning and findability
- Trust through professional presentation
- Consistent patterns for predictability

---

## Color Palette

**Light Mode:**
- Primary: 210 100% 45% (Turkish flag-inspired blue)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 0 0% 15%
- Text Secondary: 0 0% 45%
- Border: 0 0% 88%
- Accent (CTAs): 210 100% 50%
- Success: 142 76% 36%
- Warning: 38 92% 50%

**Dark Mode:**
- Primary: 210 100% 55%
- Background: 0 0% 10%
- Surface: 0 0% 14%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Border: 0 0% 25%
- Accent: 210 100% 60%

---

## Typography

**Fonts:**
- Primary: Inter (Google Fonts) - body, UI elements
- Headings: Inter (semibold/bold weights)
- Monospace: JetBrains Mono - postal codes display

**Scale:**
- Hero/H1: text-4xl md:text-5xl font-bold
- H2: text-3xl font-semibold
- H3: text-2xl font-semibold
- H4: text-xl font-medium
- Body: text-base
- Small/Meta: text-sm
- Postal Codes: text-lg font-mono font-bold

**Line Heights:**
- Headings: leading-tight
- Body: leading-relaxed
- Lists: leading-loose

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20, 24
- Tight spacing: p-2, gap-2 (compact data tables)
- Standard spacing: p-4, gap-4 (cards, forms)
- Section spacing: py-8 md:py-12, px-4 md:px-8
- Large spacing: py-16 md:py-24 (hero sections)

**Container Widths:**
- Full-width: w-full
- Content container: max-w-7xl mx-auto
- Narrow content: max-w-4xl mx-auto
- Admin sidebar: w-64

**Grid Systems:**
- Lists: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats cards: grid-cols-2 lg:grid-cols-4
- Search results: Single column with dividers

---

## Component Library

### Navigation
- **Top Header:** Fixed, backdrop-blur, contains logo, search, theme toggle
- **Breadcrumbs:** Arrow separators, clickable hierarchy, always visible
- **Sidebar (Admin):** Fixed left, collapsible on mobile, icon + text labels

### Data Display
- **Postal Code Cards:** White/dark surface, rounded-lg, shadow-sm, hover:shadow-md
- **Tables:** Striped rows, sticky header, border-collapse, mobile-stacks to cards
- **Lists:** Clean dividers, hover states, right-arrow navigation indicators
- **Stats Cards:** Icon left, number large, label small, colored borders

### Forms & Inputs
- **Search Bar:** Large, prominent, autocomplete dropdown, search icon left, clear button right
- **Text Inputs:** Rounded-md, border-2, focus ring, dark mode inverted
- **Select Dropdowns:** Native styled, chevron indicator
- **Buttons Primary:** bg-primary, text-white, rounded-md, px-6 py-3, shadow-sm
- **Buttons Secondary:** border-2, bg-transparent, hover:bg-surface

### Interactive Elements
- **Copy Button:** Small, icon + "Kopyala" text, success toast feedback
- **Pagination:** Numbers centered, prev/next arrows, current highlighted
- **Tabs (Admin):** Underline active, subtle hover, full-width mobile

### Feedback
- **Toast Notifications:** Top-right, slide-in, auto-dismiss, icon + message
- **Loading States:** Skeleton screens for tables, spinner for actions
- **Empty States:** Icon + message + action button, centered

### SEO Elements
- **Structured Data:** Not visually rendered (JSON-LD in head)
- **Meta Previews:** Optional in admin for testing

---

## Page-Specific Layouts

### Homepage
- **Hero Section:** 60vh height, large search bar centered, "Türkiye Posta Kodları" heading, subtle gradient background
- **Quick Stats:** 4-column grid showing total cities, districts, codes, last update
- **City Grid:** 3-4 column responsive grid of city cards with postal code count

### City/District Pages
- **Page Header:** City name, breadcrumb, search widget
- **List Section:** Grid of clickable cards for sub-locations
- **Related Links:** Sidebar or footer with neighboring cities/districts

### Postal Code Detail
- **Info Card:** Centered, highlighted postal code in monospace large font
- **Copy Button:** Prominent, right below code
- **Address Hierarchy:** Table showing il → ilçe → mahalle
- **Related Codes:** Compact list of nearby codes

### Search Results
- **Search Summary:** "{X} sonuç bulundu" with query highlight
- **Results List:** Single column, each result shows full hierarchy
- **Filters:** Left sidebar (desktop), collapsible top (mobile)

### Admin Dashboard
- **Sidebar Navigation:** Icons + labels, active state highlight
- **Dashboard Grid:** 2x2 stat cards at top, charts below
- **Data Tables:** Sortable columns, inline edit, pagination
- **Forms:** Two-column layout, clear labels, validation messages

---

## Images

This platform is data-focused and does not require hero images. Use icons and illustrations sparingly:

**Icons:**
- Heroicons (via CDN) for UI elements
- Map pin icons for location markers
- Document icons for data sections

**Illustrations:**
- Optional: Simple Turkey map outline on homepage (SVG)
- Admin: Chart.js for analytics visualizations

---

## Animations

**Minimal Use:**
- Hover transitions: transition-all duration-150
- Page transitions: None (SEO priority)
- Loading: Subtle pulse for skeletons
- Toast: Slide-in from top-right

---

## Accessibility

- WCAG 2.2 AA compliant contrast ratios
- All buttons and links keyboard navigable (focus:ring-2)
- Screen reader labels for all interactive elements
- Skip to main content link
- Consistent dark mode across all inputs and surfaces
- Large touch targets (min 44px) for mobile
- Form error messages announced to screen readers

---

## Dark Mode Implementation

- Toggle in header (sun/moon icon)
- localStorage persistence
- System preference detection on first visit
- All components support both modes
- Inverted shadows and borders for depth
- Slightly desaturated colors in dark mode

---

## Performance Considerations

- Critical CSS inlined
- Lazy load lists beyond viewport
- Debounced search input (300ms)
- Virtual scrolling for long tables
- Cached API responses for static data
- Minimal JavaScript bundle (no unnecessary libraries)