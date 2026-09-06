# GauBharath — Premium Gau Seva Ecommerce

A cinematic, GSAP-animated ecommerce site for **GauBharath**, built on Next.js 14 + Firebase + Razorpay. Includes a full admin panel and a dramatic full-screen Thoughts player.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Firebase** (client SDK for live data, Admin SDK for server actions)
- **Razorpay** (live key from Breathe project — switchable via env)
- **GSAP** for cinematic scroll animations + the Thoughts timeline
- **Lenis** for buttery smooth scroll
- **Zustand** for the persistent cart
- **Nodemailer** (SMTP) for order notifications

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in any missing values. The example already wires up the Breathe Firebase project and Razorpay live key for demo use.

3. **Activate the conda env** (per project convention)
   ```bash
   conda activate macenv
   ```

4. **Seed the database** (optional — the app falls back to seed data if Firestore is empty)
   ```bash
   npm run seed
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## Routes

- `/` — Home (hero + mission + featured products + thoughts teaser + visit)
- `/shop` — Product grid with category filters
- `/shop/[slug]` — Product detail
- `/about` — Story, founder, values
- `/thoughts` — List view + entry to the cinematic Thoughts player
- `/checkout` — Customer info + Razorpay payment
- `/checkout/success` — Post-payment confirmation
- `/admin/login` — Admin sign-in (whitelist-gated)
- `/admin` — Dashboard (stats, recent orders)
- `/admin/products` — Product CRUD
- `/admin/products/new` — Add product
- `/admin/products/[id]` — Edit product
- `/admin/thoughts` — Thought CRUD
- `/admin/orders` — Order management

## Firebase Namespace

All GauBharath collections are namespaced with the `gaubharath_` prefix (`gaubharath_products`, `gaubharath_thoughts`, `gaubharath_orders`, `gaubharath_settings`, `gaubharath_admins`). When ready to migrate to a dedicated Firebase project, simply export these collections and import them into the new project — no name collisions.

## Admin Access

Admin emails are whitelisted in `NEXT_PUBLIC_ADMIN_EMAILS` (comma-separated). To add yourself, edit `.env.local` and add your Firebase Auth email.

## Key Directories

```
src/
  app/             Next.js App Router routes
    api/           Server-side endpoints (Razorpay + orders)
    admin/         Admin panel
    shop/          Shop + product detail
    thoughts/      Thoughts landing + player trigger
  components/
    motion/        GSAP-powered RevealText, FadeIn, ParallaxImage, etc.
    layout/        Navbar, Footer, CartDrawer
    home/          Hero, MissionSection, FeaturedProducts, ThoughtsTeaser
    shop/          ProductCard
    thoughts/      ThoughtPlayer (full-screen cinematic)
    admin/         ProductForm, etc.
  hooks/           useProducts, useThoughts, useAdminAuth
  lib/
    firebase/      Client + Admin SDK initialisation
    razorpay.ts    Server-side Razorpay helpers
    email/         SMTP helper + templates
    utils.ts       cn(), formatINR(), slugify(), etc.
  data/seed.ts     17 products + 4 thoughts + site settings
  store/cartStore.ts  Zustand cart with persist
  types/           Domain types
public/assets/
  hero/            hero.jpeg + decorative SVGs
  products/        Per-product SVG placeholders
  thoughts/        Background art for the Thoughts player
  patterns/        Mandala and decorative patterns
  audio/           Tatvam Niramaya.mp3 (loops as BGM in the Thoughts player)
  logo.svg         Brand mark
```

## Customising

- **Add your own product images**: drop them in `public/assets/products/images/` and update the `imageUrl` field on each product record (via the admin panel or seed data).
- **Add your own thought backgrounds**: drop images into `public/assets/thoughts/` and update the `backgroundUrl` field.
- **Change brand colours**: edit `tailwind.config.ts` (the `saffron`, `cream`, `forest`, `earth` scales).
- **Change fonts**: edit `src/app/layout.tsx` (we ship Cormorant Garamond + Inter + Noto Sans Kannada by default).

## Going Live

1. Replace Razorpay live keys with your own (or stay on the demo key).
2. Add a real Firebase Admin private key from the Firebase console.
3. Set your admin email(s) in `NEXT_PUBLIC_ADMIN_EMAILS`.
4. Deploy to Vercel / Netlify / your preferred host.
