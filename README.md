# NICE ICE CREAMS (Est. 1986) — Production Web & Ordering Application

Official cinematic storytelling website, 3D Exploded-Scoop interactive menu, persistent multi-item cart, WhatsApp order submission, party booking system, and protected admin portal for **NICE ICE CREAMS** (*"Since 1986 — Eat.. Party.. Ice Creams"*).

---

## 1. Asset Manifest & Audit

### Brand Assets (`public/brand/` & `public/favicon.ico`)
- `/brand/nice_ice_cream_logo.png` — Official NICE ICE CREAMS logo extracted from `@nice_ice_creams`
- `/brand/nice-logo-transparent.png` — Alpha-feathered transparent logo mark
- `/brand/nice-mark-hd.png` & `/brand/nice-lockup-hd.png` — High-resolution header lockups from `Nice Ice Cream Menu.jpeg`
- `/favicon.ico` — Browser favicon generated from the official logo

### 12 Sequential Hero Video Shots (`public/videos/` & `public/videos/posters/`)
Mapped directly from `Nice Ice Cream Video Part 1.mp4` .. `Part 12.mp4` (1920×1080 @ 24fps):
1. `SHOT 01` (`/videos/shot-01.mp4` + `/videos/posters/shot-01.webp`) — **The First Scoop**
2. `SHOT 02` (`/videos/shot-02.mp4` + `/videos/posters/shot-02.webp`) — **The Brand Reveal**
3. `SHOT 03` (`/videos/shot-03.mp4` + `/videos/posters/shot-03.webp`) — **A Sweet Beginning (1986)**
4. `SHOT 04` (`/videos/shot-04.mp4` + `/videos/posters/shot-04.webp`) — **Cream in Motion**
5. `SHOT 05` (`/videos/shot-05.mp4` + `/videos/posters/shot-05.webp`) — **The Ingredient Boutique**
6. `SHOT 06` (`/videos/shot-06.mp4` + `/videos/posters/shot-06.webp`) — **The First Flavour**
7. `SHOT 07` (`/videos/shot-07.mp4` + `/videos/posters/shot-07.webp`) — **The Chocolate World**
8. `SHOT 08` (`/videos/shot-08.mp4` + `/videos/posters/shot-08.webp`) — **The Fruit World**
9. `SHOT 09` (`/videos/shot-09.mp4` + `/videos/posters/shot-09.webp`) — **The Flavour Universe**
10. `SHOT 10` (`/videos/shot-10.mp4` + `/videos/posters/shot-10.webp`) — **The Exploded Scoop**
11. `SHOT 11` (`/videos/shot-11.mp4` + `/videos/posters/shot-11.webp`) — **The Perfect Reassembly**
12. `SHOT 12` (`/videos/shot-12.mp4` + `/videos/posters/shot-12.webp`) — **The Signature Finale ("Explore the Flavours")**

### Menu Product Assets (`public/menu/`)
- 13 isolated base dessert photographs (`base-*.png`) cleanly extracted from `Nice Ice Cream Menu.jpeg` without neighbouring text or bar clipping.
- 49 studio product cards (`public/menu/<slug>.webp`) and 49 transparent cutouts (`public/menu/<slug>-cutout.webp`) covering all 8 menu categories.

---

## 2. Environment Variables (`.env.local`)

Copy `.env.example` to `.env.local`:

```env
# Official WhatsApp numbers from Nice Ice Cream Menu.jpeg
WHATSAPP_BUSINESS_NUMBER=919985422222
WHATSAPP_SECONDARY_NUMBER=917306142993

NEXT_PUBLIC_BUSINESS_PHONE_PRIMARY=+91 99854 22222
NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY=+91 73061 42993
NEXT_PUBLIC_BUSINESS_EMAIL=niceicecreams.warangal@gmail.com
NEXT_PUBLIC_BUSINESS_WEBSITE=https://www.niceicecreams.com

# Server-Only Admin Credentials (Change before production deployment!)
ADMIN_PASSCODE=nice1986-admin
ADMIN_SESSION_SECRET=replace-with-strong-32-byte-secret-in-production

# Optional Delivery / Tax Configuration (0 unless confirmed by business)
ORDER_DELIVERY_FEE_INR=0
ORDER_TAX_PERCENT=0

# Optional Supabase PostgreSQL Credentials
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 3. Database Setup (PostgreSQL / Supabase & Local Persistence)

1. **Out-of-the-Box Local Persistence:** When `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are unset, the server automatically seeds and persists products, orders, party bookings, and audit logs in `data/nice-db.json`.
2. **Supabase Production Setup:**
   - Open the Supabase SQL Editor and execute [`lib/db/supabase-schema.sql`](./lib/db/supabase-schema.sql).
   - Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in your deployment environment variables.

---

## 4. Running, Testing & Building

```bash
# Install dependencies
npm install

# Run automated acceptance & security tests (Vitest)
npm test

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 5. Deployment (Vercel & Portable AWS Architecture)

- **Vercel Deployment:** Import the repository into Vercel, configure the environment variables listed in `.env.example`, and deploy using the standard Next.js preset.
- **AWS Deployment (ECS / App Runner / Amplify):** The application uses standard Next.js App Router server handlers and stateless HMAC cookies + PostgreSQL/Supabase, making it directly portable to AWS App Runner, ECS Fargate, or AWS Amplify Hosting.

