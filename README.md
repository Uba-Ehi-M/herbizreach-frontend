# HerBizReach Frontend

> Visibility, voice, and growth tools for women-led SMEs across Africa.

HerBizReach is a modern Next.js platform that helps entrepreneurs create beautiful storefronts, manage products, and convert buyer interest through WhatsApp and in-app chat — all from a single dashboard.


## WHAT

HerBizReach is a modern web platform built with Next.js that enables small business owners to create digital storefronts, manage products, and convert customer interest into actual sales.

The platform provides:
- Public storefronts for showcasing products  
- A seller dashboard for managing business operations  
- Built-in communication tools (WhatsApp + in-app chat)  
- AI-assisted content generation for product marketing  

It is designed to serve as an **all-in-one growth tool** for small and informal businesses.

---

## WHY

Many SMEs across Africa face significant challenges in growing their businesses online:

- Limited digital visibility beyond WhatsApp contacts  
- Difficulty creating engaging product content  
- Lack of simple tools to manage products and customer interactions  
- Fragmented workflows across multiple platforms (WhatsApp, Instagram, marketplaces)  

Existing solutions often:
- Require advanced digital skills  
- Are time-consuming to manage  
- Are not tailored to informal or small-scale businesses  

HerBizReach addresses these gaps by providing a **simple, centralized, and user-friendly platform** that helps entrepreneurs move from just posting products to actually **driving engagement and sales**.

---

## HOW

HerBizReach solves this problem through a combination of modern frontend architecture, real-time communication, and user-focused design.

### 🛍️ Public Storefront (Buyer Experience)
- Dynamic storefronts at `store/[slug]`  
- Product detail pages at `store/[slug]/products/[productId]`  
- In-store chat widget for direct communication  
- WhatsApp integration for quick buyer action  
- SEO optimization with OpenGraph, Twitter Cards, and structured data  
- Progressive Web App (PWA) support for mobile accessibility

## ✨ Features

### 🛍️ Public Storefront (Visitors & Buyers)
- Branded store pages at `store/[slug]` with product detail pages at `store/[slug]/products/[productId]`
- In-storefront chat widget for direct buyer-to-seller conversations
- WhatsApp-ready sharing and communication workflows
- Rich link previews via OpenGraph, Twitter Cards, and JSON-LD structured data
- Per-store dynamic PWA manifest for add-to-home-screen support

### 📦 Owner Dashboard (SME Sellers)
- Engagement insights with trend indicators
- Full product management — create, edit, delete, publish/unpublish, and duplicate
- AI-assisted copywriting for product descriptions and captions
- Store customization (tagline, description, accent color, chat visibility)
- Shareable store link with one-click copy
- Leads tracking and analytics views
- Real-time inbox for customer conversations

### 🔧 Admin Panel (Platform Operations)
- Platform-wide metrics — users, products, engagement, and activity
- Modular management views for users, products, conversations, and audit logs
- Role-gated admin layout and navigation

### 🔐 Auth & Access
- Login, registration, and forgot-password flows
- Client-side auth state with persisted token/session sync
- Role-aware routing for owner and admin views

---

## 🏗️ Architecture

| Concern | Tool |
|---|---|
| Framework | Next.js App Router (React + TypeScript) |
| Data Fetching | TanStack React Query |
| State Management | Zustand (auth, theme, chat slices) |
| Forms & Validation | React Hook Form + Zod |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, Sonner toasts, Lucide icons |
| API Client | Axios (public + authenticated clients) |
| Real-time | Socket.IO client |

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/               # Login, register, forgot-password
│   ├── (owner)/              # Dashboard, products, chat, analytics, settings
│   ├── admin/                # Admin dashboard and management modules
│   ├── store/[slug]/         # Public store and product pages
│   ├── layout.tsx            # Root layout and providers
│   ├── robots.ts             # Robots policy
│   └── sitemap.ts            # Sitemap generation
├── components/
│   ├── admin/                # Admin charts, tables, sidebar
│   ├── analytics/            # Owner analytics components
│   ├── auth/                 # Auth presentation wrappers
│   ├── chat/                 # Chat widget and inbox
│   ├── layout/               # Topbar, sidebar, nav, theme toggle
│   ├── product/              # Product cards, uploaders, AI panel
│   ├── seo/                  # JSON-LD and metadata helpers
│   ├── shared/               # Reusable app-level UI states
│   ├── store/                # Storefront renderers, PWA helpers
│   └── ui/                   # Design system primitives
├── hooks/                    # Domain hooks (auth, products, chat, analytics…)
├── lib/                      # Axios, socket, SEO, utilities
├── stores/                   # Zustand stores
└── public/                   # Static assets + service worker
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or yarn / pnpm / bun)
- A running [HerBizReach backend](https://herbizreach-backend.onrender.com)

### Install

```bash
npm install
```

### Configure Environment

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=https://herbizreach-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://herbizreach.vercel.app
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL used by API and socket clients |
| `NEXT_PUBLIC_APP_URL` | Canonical frontend URL used for metadata and generated links |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production server from build output |
| `npm run lint` | Run ESLint checks |

---

## 🔌 Backend Contract

The frontend expects the following backend capabilities:

- Authentication with role-aware user payloads
- Owner product CRUD and publication toggles
- Analytics, leads, and admin metrics endpoints
- Public store/product retrieval by business slug
- Chat conversation/message APIs and Socket.IO namespace + events
- File hosting for product and store media (e.g. Cloudinary)

> If the backend host, port, or CORS policies change, update `NEXT_PUBLIC_API_URL` accordingly.

---

## 🌍 Deployment

1. Set production values for `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL`.
2. Ensure allowed image hosts in `next.config.ts` cover your media providers.
3. Build and serve:

```bash
npm run build
npm run start
```

Or deploy directly to [Vercel](https://vercel.com) — the recommended platform for Next.js.

> After deploying, verify metadata URLs, social preview images, sitemap, and robots behavior.

---

## 🤝 Contributing

- Keep components domain-focused and composable.
- Co-locate API logic in `hooks/` and `lib/` — not in presentational components.
- Validate all user input with Zod-backed forms.
- Preserve accessibility patterns: labels, focus states, and semantic controls.
- Run `npm run lint` before opening a PR.

---

For product context, start with the landing page at `app/page.tsx`, then explore owner flows in `app/(owner)/` and public storefront flows in `app/store/[slug]/`.
