# NICE ICE CREAMS — Floating Flavour Universe

> **A World of Flavours. One Scoop of Happiness.**  
> Continuous 3D Curved Cylindrical Flavour Carousel & Interactive Showroom.  
> Pure Vanilla HTML5, CSS3 & JavaScript • Zero Dependencies • Web Animations API

---

## 🍨 Deliverables Included

1. **`index.html`**: Semantic HTML5 single-screen hero and flavour explorer.
2. **`styles.css`**: Pure CSS3 styling based on the 1440 × 1080 reference frame and official warm vanilla palette (`#FFF9EF`, `#291A14`, `#C84B68`, `#B9CC8B`, `#F5C4D0`, `#FFF0D6`, `#D9A15B`).
3. **`script.js`**: Modular vanilla JavaScript with Web Animations API entrance choreography, 60fps momentum drag and continuous auto-scrolling, local cart drawer, and WhatsApp order drafting.
4. **`images/`**: 105 optimized WebP photographic assets for all 49 products.
5. **`brand/`**: Official NICE ICE CREAMS branding assets.

---

## 🚀 Setup Instructions

### Option 1: Direct File Access (No Web Server Needed)
Simply double-click `index.html` in your file explorer, or open it in any modern browser:
```
file:///c:/Nice%20Ice%20Cream/flavour-universe/index.html
```

### Option 2: Via Local Web Server
If running the project server:
```
http://localhost:3005/flavour-universe/index.html
```

---

## 📜 The 49 Verified Products Catalogue

All 49 flavours have been verified against the official parlour menu:

### 1. Classic Flavours (5)
- **Vanilla** (₹40) — Pure farm milk, fresh cream, natural vanilla extract.
- **Strawberry** (₹50) — Sweet berry crush, fresh cream.
- **Butterscotch** (₹50) — Golden brown-butter, crunchy praline pearls.
- **Pista Nuts** (₹60) — Roasted pistachio slivers, green cardamom.
- **Black Currant** (₹55) — Tangy-sweet plump black currants.

### 2. Premium Flavours (7)
- **Caramel Nuts** (₹60) — Rich caramel ribbons, roasted almonds & cashews.
- **Malai Kulfi** (₹60) — Traditional slow-simmered rabri, saffron, pistachios.
- **Cookies & Cream** (₹55) — Dark chocolate cookie crumbs, vanilla cream swirl.
- **Arabian Delight** (₹60) — Roasted dates, figs, honey, exotic nuts.
- **American Nuts** (₹60) — Medley of roasted almonds, cashews & fruit jellies.
- **Fruit Ninja** (₹55) — Tropical fruits, pineapple, candied papaya bits.
- **Mixed Berries** (₹60) — Raspberries, blueberries, tart red currant swirl.

### 3. Chocolate Collection (4)
- **Chocolate** (₹55) — Dutch-processed cocoa, velvety dairy base.
- **Choco Chips** (₹60) — Semi-sweet chocolate chips, cocoa cream.
- **Choco Crunch** (₹60) — Crispy chocolate wafer bits, fudge ripple.
- **Belgium Chocolate** (₹65) — Dark Belgian cocoa, premium bittersweet curls.

### 4. Fruit and Seasonal Collection (4)
- **Fresh Sitaphal** (₹80) — Ripe custard apple pulp, 100% pure dairy cream.
- **Natural Mango** (₹80) — Real Alphonso mango pulp, sun-ripened orchard sweetness.
- **Pink Guava** (₹80) — Sweet pink guava pulp, hint of mild chilli salt.
- **Chikoo** (₹80) — Fresh sapota fruit, caramelized natural sweetness.

### 5. Dessert-Inspired Collection (4)
- **Gulab Jamoon** (₹80) — Warm cardamom gulab jamun pieces in cold vanilla cream.
- **Strawberry Cheese Cake** (₹80) — Real cream cheese, graham crumble, berry swirl.
- **Coffee Brownie Ice Cream** (₹60) — Espresso extract, dark fudge brownie cubes.
- **Red Velvet** (₹55) — Cocoa-vanilla cake crumbs, cream cheese frosting swirls.

### 6. Special Desserts (4)
- **Fruit Salad with Ice Cream** (₹90) — Diced fresh fruits topped with artisanal scoop.
- **Badam Milk with Ice Cream** (₹90) — Chilled saffron almond milk, rich ice cream scoop.
- **Cassata** (₹120) — Multi-layered Neapolitan cake slice with nuts & fruits.
- **Cold Cocoa with Ice Cream** (₹120) — Surat-style thick cocoa with chocolate scoop.

### 7. Premium Shakes (15)
- **Caramel Carnival** (₹159)
- **Cold Coffee Shake** (₹149)
- **Candy Fantasy** (₹149)
- **KitKat** (₹159)
- **Nutella Brownie** (₹169)
- **Snickers** (₹179)
- **Ferrero** (₹189)
- **Oreo Shake** (₹169)
- **Honey Ball** (₹169)
- **Caramel Banana** (₹159)
- **Mango** (₹169)
- **Belgium Chocolate** (₹189)
- **Peanut Butter** (₹189)
- **Choco Brownie** (₹179)
- **Chocolate Blast** (₹169)

### 8. Sundaes (6)
- **American Beauty Sundae** (₹99)
- **Brownie with Ice Cream Sizzler** (₹120)
- **Forest Fruit Sundae** (₹129)
- **Nuts Heaven Sundae** (₹139)
- **Death by Chocolate** (₹149)
- **Nutty Death by Chocolate** (₹159)

---

## 🛠️ How to Update the Product List & Images

1. **Adding/Modifying a Flavour**:
   - Open `script.js` and locate the `PRODUCTS` array at the top.
   - Add or edit the product object with `id`, `name`, `category`, `price`, `description`, etc.
2. **Updating Images**:
   - Save high-resolution photography as a WebP image in `images/[slug].webp`.
   - Update `script.js` to reference the new slug.
3. **Updating WhatsApp Number**:
   - In `script.js` and `index.html`, search for `wa.me/919985422222` and update to your verified business phone number.

---

## ✅ Final Acceptance Checklist

- [x] Design is recognizably inspired by the Reelmark curved carousel concept.
- [x] Official NICE ICE CREAMS logo and branding preserved.
- [x] All 49 verified menu products included exactly once without duplication.
- [x] Carousel displays individual flavour cards with correct realistic food photography.
- [x] Carousel continuously moves right-to-left (~48–50u/sec) without visible jumps.
- [x] Dragging follows pointer or touch with 1:1 displacement.
- [x] Release momentum works smoothly and blends back into auto-scrolling.
- [x] Cards curve along cylindrical trajectory, with outer edges taller than inner edges.
- [x] Card selection opens interactive product detail modal.
- [x] Flavour explorer search, category filters, and sorting work accurately.
- [x] Local cart tracks item quantities, subtotal, and badge counter.
- [x] WhatsApp order generator drafts verified products, prices, and quantities.
- [x] Desktop (1440x1080) and mobile (<=820px) responsive layouts verified.
- [x] Reduced-motion preferences respected.
- [x] Zero frameworks or build steps required to run `index.html`.
- [x] Hero section (`CinematicHero12Shots.tsx`) remains untouched and undisturbed.
