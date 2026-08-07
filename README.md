# 💻 ZNIYERBUY Shop Web

The shop-owner web dashboard for the ZNIYERBUY marketplace. Built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, styled with **Tailwind CSS v4**. Shop owners use it to manage their inventory, deals, orders, reviews, and analytics.

This README is written directly from this repo's source (`app/`, `lib/`, `components/`).

---

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Authentication](#authentication)
- [Backend Connectivity](#backend-connectivity)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Known Gaps](#known-gaps)

---

## Overview

This app is one of the three ZNIYERBUY frontends and talks exclusively to `zniyerbuy-backend` over REST (with Firebase ID tokens for auth). It runs on **port 3001** so it can run alongside `zniyerbuy-admin-panel` (port 3000) locally.

## Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.6 | Framework (App Router) |
| react / react-dom | 19.2.4 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |
| axios | ^1.16.1 | HTTP client |
| firebase | ^12.13.0 | Client-side Auth SDK |
| react-hook-form | ^7.76.1 | Forms |
| react-hot-toast | ^2.6.0 | Toast notifications |
| recharts | ^3.8.1 | Analytics charts |
| @vis.gl/react-google-maps | ^1.9.0 | Shop location map |
| @fortawesome/react-fontawesome + free-solid-svg-icons | ^3.3.1 / ^7.2.0 | Icons |

## Project Structure

```
zniyerbuy-shop-web/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                          ← sidebar layout
│   │   ├── page.tsx                             ← overview / stats
│   │   ├── profile/page.tsx
│   │   ├── inventory/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── discounts/
│   │   │   ├── page.tsx
│   │   │   ├── deals/new/page.tsx, deals/[id]/edit/page.tsx
│   │   │   └── promotions/new/page.tsx, promotions/[id]/edit/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── map/page.tsx
│   ├── layout.tsx
│   └── page.tsx                                  ← redirects into the dashboard
├── components/
│   ├── ui/          Button.tsx, Card.tsx, Input.tsx, StatCard.tsx
│   ├── layout/       Sidebar.tsx
│   └── MapView.tsx
├── lib/
│   ├── api.ts        ← Axios instance + endpoint groups (shopAPI, productAPI, dealAPI, analyticsAPI, ...)
│   └── firebase.ts    ← Firebase app + Auth initialization
└── package.json       (dev/start scripts run on port 3001)
```

## Pages

| Route | Description |
|-------|-------------|
| `/auth/login`, `/auth/register` | Firebase email/password auth |
| `/dashboard` | Stats overview |
| `/dashboard/profile` | Edit shop profile |
| `/dashboard/inventory` (+ `/new`, `/[id]/edit`) | Product CRUD |
| `/dashboard/discounts` (+ `deals`/`promotions` sub-flows) | Deal & promotion management |
| `/dashboard/orders` (+ `/[id]`) | Order list + detail, status updates |
| `/dashboard/reviews` | View and reply to customer reviews |
| `/dashboard/analytics` | Seller analytics + AI-powered next-month predictions |
| `/dashboard/map` | Shop location picker/viewer (Google Maps) |

## Authentication

- `lib/firebase.ts` initializes the Firebase client SDK (`apiKey`, `authDomain`, `projectId`).
- Login/register pages use Firebase Auth directly; the resulting ID token is attached to every backend request.
- `lib/api.ts`'s Axios request interceptor fetches a fresh ID token via `auth.currentUser.getIdToken()` on every call and sets `Authorization: Bearer <token>`, falling back to a `localStorage` token if no live Firebase user is available.
- A response interceptor auto-redirects to `/auth/login` on any `401`, clearing the stored token first.

## Backend Connectivity

```ts
// lib/api.ts
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1}` // or http://localhost:5000/api/v1 if unset
});
```

Endpoint groups exported from `lib/api.ts` include `shopAPI`, `productAPI`, `dealAPI`, and `analyticsAPI` (and others), each a thin wrapper around the corresponding backend route.

## Installation & Setup

```bash
git clone https://github.com/ShehanRanasinghe/zniyerbuy-shop-web.git
cd zniyerbuy-shop-web
npm install

cp .env.example .env   # or create .env manually, see below

npm run dev
# http://localhost:3001
```

## Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Firebase Configuration (for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Maps API Key (shop location picker)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Scripts

```bash
npm run dev     # next dev -p 3001
npm run build   # next build
npm start       # next start -p 3001
npm run lint    # eslint
```

## Known Gaps

- Image uploads go straight through to Supabase Storage via the backend — there's no client-side image compression/optimization step yet.
- No Dockerfile or CI/CD workflow is present in this repo yet (planned for a later deployment sprint).

For the full project context (all six ZNIYERBUY repos, database schema, sprint history), see `zniyerbuy-project-hub`.