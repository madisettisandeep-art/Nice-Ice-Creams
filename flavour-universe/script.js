/**
 * NICE ICE CREAMS — FLOATING FLAVOUR UNIVERSE
 * Reelmark-style 3D Curved Cylinder Carousel & Flavour Showroom
 * 100% Pure Vanilla JavaScript • Zero Dependencies • Web Animations API
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. VERIFIED 49-PRODUCT CATALOGUE DATA ARRAY
     ========================================================================== */
  const PRODUCTS = [
  {
    "id": "prod-vanilla",
    "slug": "vanilla",
    "name": "Vanilla",
    "category": "Classic Flavours",
    "categorySlug": "classic-flavours",
    "image": "/menu/vanilla.webp?v=4",
    "alt": "Artisanal Vanilla scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Our signature velvety Vanilla ice cream churned from pure farm milk and fresh dairy cream with delicate aromatic vanilla notes.",
    "price": 40,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Dairy Cream",
      "Cane Sugar",
      "Natural Vanilla Extract"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-strawberry",
    "slug": "strawberry",
    "name": "Strawberry",
    "category": "Classic Flavours",
    "categorySlug": "classic-flavours",
    "image": "/menu/strawberry.webp?v=4",
    "alt": "Artisanal Strawberry scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Bright, refreshing strawberry ice cream blended with sweet berry crush and pure dairy cream for a timeless pink scoop.",
    "price": 50,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Strawberry Crush",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-butterscotch",
    "slug": "butterscotch",
    "name": "Butterscotch",
    "category": "Classic Flavours",
    "categorySlug": "classic-flavours",
    "image": "/menu/butterscotch.webp?v=4",
    "alt": "Artisanal Butterscotch scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Golden caramelised brown-butter ice cream studded with crunchy golden butterscotch praline pearls and cashew bits.",
    "price": 50,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Butterscotch Praline",
      "Cashew Bits",
      "Caramel"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Cashew)"
    ]
  },
  {
    "id": "prod-pista-nuts",
    "slug": "pista-nuts",
    "name": "Pista Nuts",
    "category": "Classic Flavours",
    "categorySlug": "classic-flavours",
    "image": "/menu/pista-nuts.webp?v=4",
    "alt": "Artisanal Pista Nuts scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Rich pistachio-infused cream folded with roasted green pistachio slivers and a whisper of green cardamom.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Roasted Pistachios",
      "Cardamom"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Pistachio)"
    ]
  },
  {
    "id": "prod-black-currant",
    "slug": "black-currant",
    "name": "Black Currant",
    "category": "Classic Flavours",
    "categorySlug": "classic-flavours",
    "image": "/menu/black-currant.webp?v=4",
    "alt": "Artisanal Black Currant scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Vibrant royal-purple black currant ice cream bursting with plump, tangy-sweet black currants and velvety dairy cream.",
    "price": 55,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Black Currant Berries",
      "Black Currant Compote"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-caramel-nuts",
    "slug": "caramel-nuts",
    "name": "Caramel Nuts",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/caramel-nuts.webp?v=4",
    "alt": "Artisanal Caramel Nuts scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Silky caramel ice cream loaded with roasted almonds and cashews, finished with ribbons of golden toffee sauce.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Roasted Almonds",
      "Roasted Cashews",
      "Caramel Sauce"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Cashew)"
    ]
  },
  {
    "id": "prod-malai-kulfi",
    "slug": "malai-kulfi",
    "name": "Malai Kulfi",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/malai-kulfi.webp?v=4",
    "alt": "Artisanal Malai Kulfi scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Traditional slow-reduced rabri malai kulfi churned into a dense, creamy scoop with saffron strands, pistachio, and almond flakes.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Slow-Reduced Milk Malai",
      "Fresh Cream",
      "Saffron",
      "Almonds",
      "Pistachios",
      "Cardamom"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Pistachio)"
    ]
  },
  {
    "id": "prod-cookies-and-cream",
    "slug": "cookies-and-cream",
    "name": "Cookies & Cream",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/cookies-and-cream.webp?v=4",
    "alt": "Artisanal Cookies & Cream scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Sweet cream ice cream generously folded with crushed dark chocolate sandwich cookies for the ultimate cream-and-crunch contrast.",
    "price": 55,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Chocolate Sandwich Cookies",
      "Vanilla Extract"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-arabian-delight",
    "slug": "arabian-delight",
    "name": "Arabian Delight",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/arabian-delight.webp?v=4",
    "alt": "Artisanal Arabian Delight scoop with rich creamy dairy texture and authentic ingredients",
    "description": "An opulent Middle-Eastern-inspired scoop blending honeyed dates, figs, roasted cashews, and toasted almonds in rich cream.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Dates",
      "Figs",
      "Roasted Cashews",
      "Almonds",
      "Honey"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Cashew)"
    ]
  },
  {
    "id": "prod-american-nuts",
    "slug": "american-nuts",
    "name": "American Nuts",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/american-nuts.webp?v=4",
    "alt": "Artisanal American Nuts scoop with rich creamy dairy texture and authentic ingredients",
    "description": "A festive fiesta of sweet fruit jellies, golden raisins, roasted cashews, and almonds folded into pineapple-kissed cream.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Roasted Cashews",
      "Almonds",
      "Tutty Fruity Jellies",
      "Pineapple Swirl"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Cashew)"
    ]
  },
  {
    "id": "prod-fruit-ninja",
    "slug": "fruit-ninja",
    "name": "Fruit Ninja",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/fruit-ninja.webp?v=4",
    "alt": "Artisanal Fruit Ninja scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Lively multi-fruit ice cream packed with diced orchard fruits, berry ribbons, and refreshing tropical sweetness.",
    "price": 55,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Mixed Fruit Compote",
      "Strawberry & Mango Pieces"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-mixed-berries",
    "slug": "mixed-berries",
    "name": "Mixed Berries",
    "category": "Premium Flavours",
    "categorySlug": "premium-flavours",
    "image": "/menu/mixed-berries.webp?v=4",
    "alt": "Artisanal Mixed Berries scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Luscious berry-magenta ice cream crafted with blueberries, blackberries, raspberries, and sweet strawberry compote.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Blueberries",
      "Cranberries",
      "Strawberry & Raspberry Compote"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-chocolate",
    "slug": "chocolate",
    "name": "Chocolate",
    "category": "Chocolate Collection",
    "categorySlug": "chocolate-flavours",
    "image": "/menu/chocolate.webp?v=4",
    "alt": "Artisanal Chocolate scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Classic rich Dutch-process chocolate ice cream churned with pure milk and fresh cream for an unmistakably smooth cocoa finish.",
    "price": 55,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Rich Cocoa Solids",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-choco-chips",
    "slug": "choco-chips",
    "name": "Choco Chips",
    "category": "Chocolate Collection",
    "categorySlug": "chocolate-flavours",
    "image": "/menu/choco-chips.webp?v=4",
    "alt": "Artisanal Choco Chips scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Creamy chocolate ice cream speckled throughout with crisp dark chocolate chips that snap with every spoonful.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Cocoa",
      "Semi-Sweet Chocolate Chips"
    ],
    "allergens": [
      "Milk / Dairy",
      "Soy"
    ]
  },
  {
    "id": "prod-choco-crunch",
    "slug": "choco-crunch",
    "name": "Choco Crunch",
    "category": "Chocolate Collection",
    "categorySlug": "chocolate-flavours",
    "image": "/menu/choco-crunch.webp?v=4",
    "alt": "Artisanal Choco Crunch scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Decadent chocolate ice cream layered with crispy chocolate-coated honeycomb & wafer pearls for irresistible texture.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Cocoa",
      "Crispy Chocolate Wafer Pearls",
      "Chocolate Flakes"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-belgium-chocolate",
    "slug": "belgium-chocolate",
    "name": "Belgium Chocolate",
    "category": "Chocolate Collection",
    "categorySlug": "chocolate-flavours",
    "image": "/menu/belgium-chocolate.webp?v=4",
    "alt": "Artisanal Belgium Chocolate scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Our darkest, most luxurious chocolate scoop crafted with rich Belgian couverture cocoa and shaved dark chocolate curls.",
    "price": 65,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Belgian Dark Couverture Chocolate",
      "Dark Chocolate Shavings"
    ],
    "allergens": [
      "Milk / Dairy",
      "Soy"
    ]
  },
  {
    "id": "prod-fresh-sitaphal",
    "slug": "fresh-sitaphal",
    "name": "Fresh Sitaphal",
    "category": "Fruit and Seasonal Collection",
    "categorySlug": "fruit-seasonal",
    "image": "/menu/fresh-sitaphal.webp?v=4",
    "alt": "Artisanal Fresh Sitaphal scoop with rich creamy dairy texture and authentic ingredients",
    "description": "A beloved regional masterpiece made with real, hand-deseeded custard apple (Sitaphal) pulp folded into pure cream.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Fresh Sitaphal (Custard Apple) Pulp",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-natural-mango",
    "slug": "natural-mango",
    "name": "Natural Mango",
    "category": "Fruit and Seasonal Collection",
    "categorySlug": "fruit-seasonal",
    "image": "/menu/natural-mango.webp?v=4",
    "alt": "Artisanal Natural Mango scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Sun-ripened Alphonso & Banganapalli mango pulp churned with pure dairy cream for the taste of Indian summer in every scoop.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Natural Ripe Mango Pulp",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-pink-guava",
    "slug": "pink-guava",
    "name": "Pink Guava",
    "category": "Fruit and Seasonal Collection",
    "categorySlug": "fruit-seasonal",
    "image": "/menu/pink-guava.webp?v=4",
    "alt": "Artisanal Pink Guava scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Fragrant, coral-pink guava ice cream made from ripe orchard guavas with a nostalgic optional hint of tangy spice.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Ripe Pink Guava Pulp",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-chikoo",
    "slug": "chikoo",
    "name": "Chikoo",
    "category": "Fruit and Seasonal Collection",
    "categorySlug": "fruit-seasonal",
    "image": "/menu/chikoo.webp?v=4",
    "alt": "Artisanal Chikoo scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Naturally malty, caramel-sweet sapota (Chikoo) fruit blended into rich cream for a comforting, authentic fruit scoop.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Ripe Chikoo (Sapota) Pulp",
      "Cane Sugar"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-gulab-jamoon",
    "slug": "gulab-jamoon",
    "name": "Gulab Jamoon",
    "category": "Dessert-Inspired Collection",
    "categorySlug": "dessert-inspired",
    "image": "/menu/gulab-jamoon.webp?v=4",
    "alt": "Artisanal Gulab Jamoon scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Warm cardamom-rose khoya gulab jamoons nestled over creamy vanilla-malai ice cream with golden syrup and pistachio slivers.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Khoya Gulab Jamoon",
      "Cardamom-Rose Syrup",
      "Pistachios"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Tree Nuts (Pistachio)"
    ]
  },
  {
    "id": "prod-strawberry-cheese-cake",
    "slug": "strawberry-cheese-cake",
    "name": "Strawberry Cheese Cake",
    "category": "Dessert-Inspired Collection",
    "categorySlug": "dessert-inspired",
    "image": "/menu/strawberry-cheese-cake.webp?v=4",
    "alt": "Artisanal Strawberry Cheese Cake scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Velvety cream-cheese ice cream layered with sweet strawberry compote and buttery graham biscuit crumble.",
    "price": 80,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Cream Cheese",
      "Fresh Cream",
      "Strawberry Compote",
      "Butter Biscuit Crumble"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten"
    ]
  },
  {
    "id": "prod-coffee-brownie-ice-cream",
    "slug": "coffee-brownie-ice-cream",
    "name": "Coffee Brownie Ice Cream",
    "category": "Dessert-Inspired Collection",
    "categorySlug": "dessert-inspired",
    "image": "/menu/coffee-brownie-ice-cream.webp?v=4",
    "alt": "Artisanal Coffee Brownie Ice Cream scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Roasted Arabica espresso ice cream folded with fudgy dark chocolate brownie chunks and mocha fudge swirls.",
    "price": 60,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Roasted Coffee Extract",
      "Chocolate Brownie Chunks",
      "Mocha Fudge"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-red-velvet",
    "slug": "red-velvet",
    "name": "Red Velvet",
    "category": "Dessert-Inspired Collection",
    "categorySlug": "dessert-inspired",
    "image": "/menu/red-velvet.webp?v=4",
    "alt": "Artisanal Red Velvet scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Crimson cocoa red-velvet ice cream swirled with silky cream-cheese frosting ribbons and tender red velvet sponge crumbs.",
    "price": 55,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Red Velvet Sponge Cake",
      "Cream Cheese Swirl",
      "Cocoa"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten"
    ]
  },
  {
    "id": "prod-fruit-salad-with-ice-cream",
    "slug": "fruit-salad-with-ice-cream",
    "name": "Fruit Salad with Ice Cream",
    "category": "Special Desserts",
    "categorySlug": "specials-signature",
    "image": "/menu/fruit-salad-with-ice-cream.webp?v=4",
    "alt": "Artisanal Fruit Salad with Ice Cream scoop with rich creamy dairy texture and authentic ingredients",
    "description": "A NICE ICE CREAMS signature since 1986\u2014freshly cut seasonal fruits, berries, and citrus segments crowned with creamy vanilla ice cream and pistachio slivers.",
    "price": 90,
    "available": true,
    "ingredients": [
      "Fresh Seasonal Fruits",
      "Pure Milk Vanilla Ice Cream",
      "Pomegranate",
      "Papaya",
      "Apple",
      "Banana",
      "Pistachio Slivers"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Pistachio)"
    ]
  },
  {
    "id": "prod-badam-milk-with-ice-cream",
    "slug": "badam-milk-with-ice-cream",
    "name": "Badam Milk with Ice Cream",
    "category": "Special Desserts",
    "categorySlug": "specials-signature",
    "image": "/menu/badam-milk-with-ice-cream.webp?v=4",
    "alt": "Artisanal Badam Milk with Ice Cream scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Chilled saffron-cardamom almond milk slow-simmered with stone-ground badam paste and topped with a generous scoop of creamy ice cream.",
    "price": 90,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Stone-Ground Almonds (Badam)",
      "Saffron Strands",
      "Cardamom",
      "Vanilla / Malai Ice Cream"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Pistachio)"
    ]
  },
  {
    "id": "prod-cassata",
    "slug": "cassata",
    "name": "Cassata",
    "category": "Special Desserts",
    "categorySlug": "specials-signature",
    "image": "/menu/cassata.webp?v=4",
    "alt": "Artisanal Cassata scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Classic tri-layered Neapolitan-style cassata slice combining strawberry, pistachio, and vanilla ice cream over sponge cake with roasted nuts.",
    "price": 120,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Fresh Cream",
      "Vanilla, Strawberry & Pista Layers",
      "Sponge Base",
      "Roasted Cashews & Tutty Fruity"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Tree Nuts (Cashew, Pistachio)"
    ]
  },
  {
    "id": "prod-cold-cocoa-with-ice-cream",
    "slug": "cold-cocoa-with-ice-cream",
    "name": "Cold Cocoa with Ice Cream",
    "category": "Special Desserts",
    "categorySlug": "specials-signature",
    "image": "/menu/cold-cocoa-with-ice-cream.webp?v=4",
    "alt": "Artisanal Cold Cocoa with Ice Cream scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Silky, dense chilled Dutch cocoa drink poured over ice and crowned with a rich scoop of vanilla or chocolate ice cream and choco chips.",
    "price": 120,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Dark Dutch Cocoa",
      "Fresh Cream",
      "Vanilla / Chocolate Ice Cream",
      "Choco Chips"
    ],
    "allergens": [
      "Milk / Dairy",
      "Soy"
    ]
  },
  {
    "id": "prod-caramel-carnival",
    "slug": "caramel-carnival",
    "name": "Caramel Carnival",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/caramel-carnival.webp?v=4",
    "alt": "Artisanal Caramel Carnival scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Thick, carnival-worthy caramel & butterscotch ice cream shake drizzled with golden toffee ribbons and crunchy praline.",
    "price": 159,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Caramel & Butterscotch Ice Cream",
      "Golden Caramel Sauce",
      "Butterscotch Crunch"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Cashew)"
    ]
  },
  {
    "id": "prod-cold-coffee-shake",
    "slug": "cold-coffee-shake",
    "name": "Cold Coffee Shake",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/cold-coffee-shake.webp?v=4",
    "alt": "Artisanal Cold Coffee Shake scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Bold roasted espresso blended with creamy vanilla ice cream, frothy chilled milk, and dark chocolate drizzle.",
    "price": 149,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Vanilla Ice Cream",
      "Roasted Arabica Coffee",
      "Chocolate Fudge Drizzle"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-candy-fantasy",
    "slug": "candy-fantasy",
    "name": "Candy Fantasy",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/candy-fantasy.webp?v=4",
    "alt": "Artisanal Candy Fantasy scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Playful strawberry & bubblegum-vanilla shake swirled with berry syrup and rainbow confectionery sprinkles.",
    "price": 149,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Strawberry & Vanilla Ice Cream",
      "Berry Syrup",
      "Confectionery Sprinkles"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-kitkat-shake",
    "slug": "kitkat-shake",
    "name": "KitKat",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/kitkat-shake.webp?v=4",
    "alt": "Artisanal KitKat scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Crunchy chocolate-coated KitKat wafer fingers blended with chocolate & vanilla ice cream and topped with wafer crunch.",
    "price": 159,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Chocolate & Vanilla Ice Cream",
      "KitKat Chocolate Wafers",
      "Chocolate Sauce"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-nutella-brownie-shake",
    "slug": "nutella-brownie-shake",
    "name": "Nutella Brownie",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/nutella-brownie-shake.webp?v=4",
    "alt": "Artisanal Nutella Brownie scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Roasted hazelnut-cocoa Nutella and fudgy chocolate brownie chunks spun with premium ice cream into pure indulgence.",
    "price": 169,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Chocolate & Vanilla Ice Cream",
      "Nutella Hazelnut Cocoa Spread",
      "Fudge Brownie"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Hazelnut)",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-snickers-shake",
    "slug": "snickers-shake",
    "name": "Snickers",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/snickers-shake.webp?v=4",
    "alt": "Artisanal Snickers scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Loaded with roasted peanuts, chewy nougat, golden caramel, and milk chocolate blended with thick ice cream.",
    "price": 179,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Chocolate & Caramel Ice Cream",
      "Snickers Bar",
      "Roasted Peanuts",
      "Caramel Sauce"
    ],
    "allergens": [
      "Milk / Dairy",
      "Peanuts",
      "Soy"
    ]
  },
  {
    "id": "prod-ferrero-shake",
    "slug": "ferrero-shake",
    "name": "Ferrero",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/ferrero-shake.webp?v=4",
    "alt": "Artisanal Ferrero scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Our crown-jewel shake crafted with roasted hazelnut praline, crisp wafer shells, and Belgian chocolate ice cream.",
    "price": 189,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Belgium Chocolate Ice Cream",
      "Ferrero Rocher Pralines",
      "Roasted Hazelnuts",
      "Chocolate Ganache"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Hazelnut)",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-oreo-shake",
    "slug": "oreo-shake",
    "name": "Oreo Shake",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/oreo-shake.webp?v=4",
    "alt": "Artisanal Oreo Shake scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Crushed Oreo cookies spun with double scoops of vanilla and cookies-and-cream ice cream, finished with dark chocolate drizzle.",
    "price": 169,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Cookies & Cream Ice Cream",
      "Oreo Chocolate Sandwich Cookies",
      "Chocolate Sauce"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-honey-ball-shake",
    "slug": "honey-ball-shake",
    "name": "Honey Ball",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/honey-ball-shake.webp?v=4",
    "alt": "Artisanal Honey Ball scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Golden wildflower honey, sweet cake pearls, and creamy vanilla-butterscotch ice cream blended into a luscious shake.",
    "price": 169,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Vanilla & Butterscotch Ice Cream",
      "Pure Honey",
      "Sweet Honey Cake Pearls"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten"
    ]
  },
  {
    "id": "prod-caramel-banana-shake",
    "slug": "caramel-banana-shake",
    "name": "Caramel Banana",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/caramel-banana-shake.webp?v=4",
    "alt": "Artisanal Caramel Banana scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Ripe sweet bananas and vanilla ice cream blended with warm butter-caramel ribbons and roasted nut crunch.",
    "price": 159,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Vanilla Ice Cream",
      "Fresh Ripe Banana",
      "Caramel Sauce",
      "Roasted Cashews"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Cashew)"
    ]
  },
  {
    "id": "prod-mango-shake",
    "slug": "mango-shake",
    "name": "Mango",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/mango-shake.webp?v=4",
    "alt": "Artisanal Mango scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Thick Alphonso mango pulp spun with our Natural Mango ice cream and pure chilled milk for a sunshine-gold shake.",
    "price": 169,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Natural Mango Ice Cream",
      "Alphonso Mango Pulp",
      "Pistachio Slivers"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Pistachio)"
    ]
  },
  {
    "id": "prod-belgium-chocolate-shake",
    "slug": "belgium-chocolate-shake",
    "name": "Belgium Chocolate",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/belgium-chocolate-shake.webp?v=4",
    "alt": "Artisanal Belgium Chocolate scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Intense Belgian dark chocolate ice cream blended into a velvety, ganache-rich shake for true chocolate connoisseurs.",
    "price": 189,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Belgium Chocolate Ice Cream",
      "Belgian Dark Ganache",
      "Dark Chocolate Curls"
    ],
    "allergens": [
      "Milk / Dairy",
      "Soy"
    ]
  },
  {
    "id": "prod-peanut-butter-shake",
    "slug": "peanut-butter-shake",
    "name": "Peanut Butter",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/peanut-butter-shake.webp?v=4",
    "alt": "Artisanal Peanut Butter scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Creamy roasted peanut butter spun with vanilla and chocolate ice cream, drizzled with salted caramel and chocolate fudge.",
    "price": 189,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Vanilla & Chocolate Ice Cream",
      "Roasted Peanut Butter",
      "Chocolate Fudge",
      "Crushed Peanuts"
    ],
    "allergens": [
      "Milk / Dairy",
      "Peanuts",
      "Soy"
    ]
  },
  {
    "id": "prod-choco-brownie-shake",
    "slug": "choco-brownie-shake",
    "name": "Choco Brownie",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/choco-brownie-shake.webp?v=4",
    "alt": "Artisanal Choco Brownie scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Warm-baked chocolate walnut brownie chunks blended with rich chocolate ice cream and hot fudge sauce.",
    "price": 179,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Chocolate Ice Cream",
      "Chocolate Fudge Brownie",
      "Hot Fudge Sauce",
      "Choco Chips"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-chocolate-blast-shake",
    "slug": "chocolate-blast-shake",
    "name": "Chocolate Blast",
    "category": "Premium Shakes",
    "categorySlug": "premium-shakes",
    "image": "/menu/chocolate-blast-shake.webp?v=4",
    "alt": "Artisanal Chocolate Blast scoop with rich creamy dairy texture and authentic ingredients",
    "description": "An explosive triple-chocolate shake combining chocolate ice cream, choco chips, cocoa crunch, and double fudge drizzle.",
    "price": 169,
    "available": true,
    "ingredients": [
      "Pure Milk",
      "Chocolate & Choco Chips Ice Cream",
      "Chocolate Fudge",
      "Choco Crunch",
      "Chocolate Flakes"
    ],
    "allergens": [
      "Milk / Dairy",
      "Soy"
    ]
  },
  {
    "id": "prod-american-beauty-sundae",
    "slug": "american-beauty-sundae",
    "name": "American Beauty Sundae",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/american-beauty-sundae.webp?v=4",
    "alt": "Artisanal American Beauty Sundae scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Creamy scoop of Vanilla & a rich scoop of Chocolate smothered in a warm chocolate fudge sauce, sprinkled with chocolate flakes & toasted roasted almonds.",
    "price": 99,
    "available": true,
    "ingredients": [
      "Vanilla Ice Cream",
      "Chocolate Ice Cream",
      "Warm Chocolate Fudge Sauce",
      "Chocolate Flakes",
      "Toasted Roasted Almonds",
      "Maraschino Cherry"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond)",
      "Soy"
    ]
  },
  {
    "id": "prod-brownie-with-ice-cream-sizzler",
    "slug": "brownie-with-ice-cream-sizzler",
    "name": "Brownie with Ice Cream Sizzler",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/brownie-with-ice-cream-sizzler.webp?v=4",
    "alt": "Artisanal Brownie with Ice Cream Sizzler scoop with rich creamy dairy texture and authentic ingredients",
    "description": "A scoop of creamy Vanilla ice cream placed on a warm brownie topped with choco chips, choco flakes & hot fudge sauce all served in a hot sizzling pan.",
    "price": 120,
    "available": true,
    "ingredients": [
      "Warm Chocolate Brownie",
      "Creamy Vanilla Ice Cream",
      "Choco Chips",
      "Choco Flakes",
      "Hot Fudge Sauce"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-forest-fruit-sundae",
    "slug": "forest-fruit-sundae",
    "name": "Forest Fruit Sundae",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/forest-fruit-sundae.webp?v=4",
    "alt": "Artisanal Forest Fruit Sundae scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Fruit Ninja, Mixed Berries & Natural Mango topped with a colorful medley of mixed fruit, sweet strawberries crush & hint of citrusy orange crush.",
    "price": 129,
    "available": true,
    "ingredients": [
      "Fruit Ninja Ice Cream",
      "Mixed Berries Ice Cream",
      "Natural Mango Ice Cream",
      "Mixed Fruit Medley",
      "Strawberry Crush",
      "Citrusy Orange Crush",
      "Cherries"
    ],
    "allergens": [
      "Milk / Dairy"
    ]
  },
  {
    "id": "prod-nuts-heaven-sundae",
    "slug": "nuts-heaven-sundae",
    "name": "Nuts Heaven Sundae",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/nuts-heaven-sundae.webp?v=4",
    "alt": "Artisanal Nuts Heaven Sundae scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Indulge in a trio of Roasted Almond, Butterscotch & American Nuts topped with a drizzle of rich caramel sauce, crunchy chocolate flakes, roasted almonds & cashew nuts.",
    "price": 139,
    "available": true,
    "ingredients": [
      "Roasted Almond Ice Cream",
      "Butterscotch Ice Cream",
      "American Nuts Ice Cream",
      "Rich Caramel Sauce",
      "Chocolate Flakes",
      "Roasted Almonds",
      "Cashew Nuts",
      "Wafer Roll"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Cashew)",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-death-by-chocolate",
    "slug": "death-by-chocolate",
    "name": "Death by Chocolate",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/death-by-chocolate.webp?v=4",
    "alt": "Artisanal Death by Chocolate scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Indulge in a rich duo of creamy ice creams, chocolate chips & Belgium Chocolate topped with brownie pieces, chocolate chunks and a double dose of chocolatey goodness with our signature chocolate fudge & choco dip sauce.",
    "price": 149,
    "available": true,
    "ingredients": [
      "Creamy Vanilla & Chocolate Ice Creams",
      "Belgium Chocolate Scoop",
      "Warm Brownie Pieces",
      "Chocolate Chips",
      "Chocolate Chunks",
      "Signature Chocolate Fudge",
      "Choco Dip Sauce",
      "Cherries"
    ],
    "allergens": [
      "Milk / Dairy",
      "Wheat / Gluten",
      "Soy"
    ]
  },
  {
    "id": "prod-nutty-death-by-chocolate",
    "slug": "nutty-death-by-chocolate",
    "name": "Nutty Death by Chocolate",
    "category": "Sundaes",
    "categorySlug": "ice-cream-sundaes",
    "image": "/menu/nutty-death-by-chocolate.webp?v=4",
    "alt": "Artisanal Nutty Death by Chocolate scoop with rich creamy dairy texture and authentic ingredients",
    "description": "Our iconic Death by Chocolate\u2014creamy scoops, Belgium Chocolate, brownie chunks, and double chocolate fudge\u2014generously crowned with roasted cashews & almond nuts.",
    "price": 159,
    "available": true,
    "ingredients": [
      "Creamy Ice Creams",
      "Belgium Chocolate",
      "Brownie Pieces",
      "Signature Chocolate Fudge",
      "Choco Dip Sauce",
      "Roasted Cashews",
      "Roasted Almond Nuts"
    ],
    "allergens": [
      "Milk / Dairy",
      "Tree Nuts (Almond, Cashew)",
      "Wheat / Gluten",
      "Soy"
    ]
  }
];

  console.log("NICE ICE CREAMS: Loaded " + PRODUCTS.length + " verified products.");

  /* State Management */
  const state = {
    cart: [],
    selectedProduct: null,
    modalQty: 1,
    activeCategory: "all",
    searchQuery: "",
    sortBy: "featured",
    isReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    carousel: {
      scrollOffset: 0,
      velocity: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartOffset: 0,
      lastDragX: 0,
      lastDragTime: 0,
      autoSpeed: 48, // reference units per second (~50u/sec)
      lastFrameTime: performance.now()
    }
  };

  /* Resolve Image URL for file:// and http(s):// protocols */
  function getImageUrl(prod) {
    if (window.location.protocol === "file:") {
      return "images/" + prod.slug + ".webp?v=4";
    }
    return "images/" + prod.slug + ".webp?v=4";
  }

  /* Fallback Image Generator if file is missing */
  function onImgError(img, name) {
    img.onerror = null;
    img.src = "../public/menu/" + img.dataset.slug + ".webp?v=4";
  }

  /* ==========================================================================
     2. ENTRANCE ANIMATIONS (Web Animations API)
     ========================================================================== */
  function initEntranceAnimations() {
    if (state.isReducedMotion) return;

    // 1. Header fade & drop
    const header = document.getElementById("siteHeader");
    if (header) {
      header.animate([
        { opacity: 0, transform: "translateY(-20px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], {
        duration: 700,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    }

    // 2. Badge spring
    const badge = document.getElementById("heroBadge");
    if (badge) {
      badge.animate([
        { opacity: 0, transform: "scale(0.85)" },
        { opacity: 1, transform: "scale(1)" }
      ], {
        duration: 800,
        delay: 200,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "forwards"
      });
    }

    // 3. Headline lines rise from subtle blur
    const lines = document.querySelectorAll(".headline-line");
    lines.forEach((line, idx) => {
      line.animate([
        { opacity: 0, transform: "translateY(28px)", filter: "blur(6px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
      ], {
        duration: 900,
        delay: 350 + idx * 140,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    });

    // 4. Supporting text
    const supporting = document.getElementById("heroSupporting");
    if (supporting) {
      supporting.animate([
        { opacity: 0, transform: "translateY(20px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], {
        duration: 800,
        delay: 650,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    }

    // 5. Curved carousel rises into view
    const carouselViewport = document.getElementById("carouselViewport");
    if (carouselViewport) {
      carouselViewport.animate([
        { opacity: 0, transform: "translateY(40px) scale(0.95)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ], {
        duration: 1000,
        delay: 600,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    }

    // 6. Hand-drawn SVG arrows animate along stroke path
    animateSvgArrows();

    // 7. CTAs scale in
    const heroActions = document.getElementById("heroActions");
    if (heroActions) {
      heroActions.animate([
        { opacity: 0, transform: "translateX(-50%) translateY(24px) scale(0.92)" },
        { opacity: 1, transform: "translateX(-50%) translateY(0) scale(1)" }
      ], {
        duration: 750,
        delay: 950,
        easing: "cubic-bezier(0.34, 1.4, 0.64, 1)",
        fill: "forwards"
      });
    }
  }

  function animateSvgArrows() {
    const paths = [document.getElementById("arrowPathLeft"), document.getElementById("arrowPathRight")];
    paths.forEach((p, idx) => {
      if (!p) return;
      const len = p.getTotalLength ? p.getTotalLength() : 120;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.animate([
        { strokeDashoffset: len },
        { strokeDashoffset: 0 }
      ], {
        duration: 900,
        delay: 1100 + idx * 200,
        easing: "cubic-bezier(0.2, 0.8, 0.4, 1)",
        fill: "forwards"
      });
    });
  }

  /* ==========================================================================
     3. 3D CURVED CYLINDER FLAVOUR CAROUSEL ENGINE (60 FPS)
     ========================================================================== */
  const cylinderStage = document.getElementById("cylinderStage");
  const cardElements = [];

  function createCarouselDOM() {
    if (!cylinderStage) return;
    cylinderStage.innerHTML = "";

    PRODUCTS.forEach((prod, idx) => {
      const card = document.createElement("div");
      card.className = "flavour-card";
      card.dataset.index = idx;
      card.dataset.slug = prod.slug;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", prod.name + ", " + prod.category + ", ₹" + prod.price);

      card.innerHTML = `
        <div class="flavour-card-inner">
          <img 
            src="${getImageUrl(prod)}" 
            alt="${prod.alt}" 
            class="flavour-card-img" 
            data-slug="${prod.slug}"
            loading="${idx < 10 ? 'eager' : 'lazy'}"
            decoding="async"
            onerror="this.onerror=null; this.src='../public/menu/${prod.slug}.webp?v=4'"
          >
          <div class="flavour-card-gradient"></div>
          <div class="flavour-card-top">
            <span class="flavour-category-badge">${prod.category.split(' ')[0]}</span>
            <span class="flavour-price-badge">₹${prod.price}</span>
          </div>
          <div class="flavour-card-bottom">
            <div class="flavour-name">${prod.name}</div>
            <div class="flavour-hint-row">
              <span class="flavour-tap-hint">Discover</span>
              <div class="flavour-discover-icon" aria-hidden="true">&rarr;</div>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (state.carousel.wasDragged) return;
        openProductModal(prod);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProductModal(prod);
        }
      });

      cylinderStage.appendChild(card);
      cardElements.push(card);
    });
  }

  /* Core Reelmark Curved Cylindrical Geometry Calculations */
  function updateCarouselPositions() {
    if (!cylinderStage || cardElements.length === 0) return;

    const stageRect = cylinderStage.getBoundingClientRect();
    const stageWidth = stageRect.width || 1440;
    const stageHeight = stageRect.height || 420;
    const isMobile = window.innerWidth <= 820;

    // Reference base scaling calculation
    let u = Math.min(window.innerWidth / 1440, window.innerHeight / 1080);
    if (isMobile) {
      u = Math.min(window.innerWidth / 640, 1);
    }
    if (u < 0.45) u = 0.45;

    const centerPoint = stageWidth / 2;
    const basePitch = (isMobile ? 130 : 196) * u;
    const totalCount = cardElements.length;
    const trackLength = totalCount * basePitch;

    const offset = state.carousel.scrollOffset % trackLength;

    cardElements.forEach((card, idx) => {
      // Unpushed position relative to center
      let t = (idx * basePitch - offset) % trackLength;
      if (t < -trackLength / 2) t += trackLength;
      if (t > trackLength / 2) t -= trackLength;

      // Cull cards far outside visible viewport for 60fps performance
      const maxRange = (stageWidth / 2) + (180 * u);
      if (Math.abs(t) > maxRange) {
        card.style.display = "none";
        return;
      }
      card.style.display = "block";

      // Mathematical Model:
      // Horizontal curve: x = 720 + t * (1 + 0.083 * (t / 706)^2)
      const normFactor = 706 * u;
      const tNorm = t / (normFactor || 1);
      const x = centerPoint + t * (1 + 0.083 * (tNorm * tNorm));

      // Normalised distance d = abs(x - center) / 706u
      const d = Math.abs(x - centerPoint) / normFactor;

      // Card width: (170 + 48 * d^2)u
      const cardW = (170 + 48 * (d * d)) * u;

      // Vertical center: (687 - 12 * d^2)u - mapped to stage coordinates
      // In stage local coordinates, vertical center is centered at stageHeight * 0.52
      const stageCenterY = stageHeight * 0.50;
      const yCenter = stageCenterY - (12 * (d * d) * u);

      // Left & right edge distances from center for perspective trapezoid
      const xLeft = x - cardW / 2;
      const xRight = x + cardW / 2;
      const qLeft = Math.abs(xLeft - centerPoint) / normFactor;
      const qRight = Math.abs(xRight - centerPoint) / normFactor;

      // Edge height: (280 + 92 * q^2.6)u
      const hLeft = (280 + 92 * Math.pow(qLeft, 2.6)) * u;
      const hRight = (280 + 92 * Math.pow(qRight, 2.6)) * u;
      const maxH = Math.max(hLeft, hRight);

      // Card tilt yaw angle facing inside the cylinder
      const rotY = -(tNorm * 22);

      // Dynamic z-index: center cards appear in front
      const zIndex = Math.round(100 - d * 30);

      // Apply 3D transform & sizing
      card.style.width = cardW.toFixed(1) + "px";
      card.style.height = maxH.toFixed(1) + "px";
      card.style.zIndex = zIndex;

      // Calculate clip-path quadrilateral polygon:
      // Top-left, Top-right, Bottom-right, Bottom-left
      const yTopLeft = ((maxH - hLeft) / 2 / maxH * 100).toFixed(2);
      const yTopRight = ((maxH - hRight) / 2 / maxH * 100).toFixed(2);
      const yBottomRight = (100 - (maxH - hRight) / 2 / maxH * 100).toFixed(2);
      const yBottomLeft = (100 - (maxH - hLeft) / 2 / maxH * 100).toFixed(2);

      const posX = (x - cardW / 2).toFixed(1);
      const posY = (yCenter - maxH / 2).toFixed(1);

      card.style.transform = `translate3d(${posX}px, ${posY}px, 0px) rotateY(${rotY.toFixed(1)}deg)`;
      card.style.clipPath = `polygon(0% ${yTopLeft}%, 100% ${yTopRight}%, 100% ${yBottomRight}%, 0% ${yBottomLeft}%)`;
    });
  }

  /* Animation Clock & Drag Loop */
  function carouselAnimationLoop(currentTime) {
    const dt = Math.min(0.1, (currentTime - state.carousel.lastFrameTime) / 1000);
    state.carousel.lastFrameTime = currentTime;

    if (!state.carousel.isDragging && !state.isReducedMotion) {
      // Smooth momentum decay
      if (Math.abs(state.carousel.velocity) > 0.5) {
        state.carousel.scrollOffset += state.carousel.velocity * dt;
        state.carousel.velocity *= Math.pow(0.88, dt * 60); // decay factor
      } else {
        // Continuous auto-scroll right to left (~50u/sec)
        let u = Math.min(window.innerWidth / 1440, window.innerHeight / 1080);
        if (window.innerWidth <= 820) u = Math.min(window.innerWidth / 640, 1);
        const speed = state.carousel.autoSpeed * (u > 0.5 ? u : 0.5);
        state.carousel.scrollOffset += speed * dt;
      }
    }

    updateCarouselPositions();
    requestAnimationFrame(carouselAnimationLoop);
  }

  /* Drag & Touch Gesture Handlers */
  function initCarouselDragEvents() {
    if (!cylinderStage) return;

    let dragDistance = 0;

    const onPointerDown = (e) => {
      state.carousel.isDragging = true;
      state.carousel.wasDragged = false;
      state.carousel.dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      state.carousel.dragStartOffset = state.carousel.scrollOffset;
      state.carousel.lastDragX = state.carousel.dragStartX;
      state.carousel.lastDragTime = performance.now();
      state.carousel.velocity = 0;
      dragDistance = 0;

      cylinderStage.classList.add("is-dragging");
    };

    const onPointerMove = (e) => {
      if (!state.carousel.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const dx = clientX - state.carousel.dragStartX;
      dragDistance += Math.abs(clientX - state.carousel.lastDragX);

      if (dragDistance > 6) {
        state.carousel.wasDragged = true;
      }

      // Invert dx so dragging left scrolls right (natural track follow)
      state.carousel.scrollOffset = state.carousel.dragStartOffset - dx;

      // Track instantaneous velocity
      const now = performance.now();
      const dt = (now - state.carousel.lastDragTime) / 1000;
      if (dt > 0.008) {
        const instVel = -(clientX - state.carousel.lastDragX) / dt;
        state.carousel.velocity = instVel * 0.4 + state.carousel.velocity * 0.6;
        state.carousel.lastDragX = clientX;
        state.carousel.lastDragTime = now;
      }
    };

    const onPointerUp = () => {
      if (!state.carousel.isDragging) return;
      state.carousel.isDragging = false;
      cylinderStage.classList.remove("is-dragging");
    };

    cylinderStage.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    cylinderStage.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchcancel", onPointerUp);
  }

  /* ==========================================================================
     4. FLAVOUR EXPLORER CATALOGUE RENDERER & FILTERS
     ========================================================================== */
  const catalogueGrid = document.getElementById("catalogueGrid");
  const catalogueSearch = document.getElementById("catalogueSearch");
  const catalogueSort = document.getElementById("catalogueSort");
  const categoryPills = document.querySelectorAll(".category-pill");

  function renderCatalogue() {
    if (!catalogueGrid) return;

    let filtered = PRODUCTS.filter((p) => {
      const matchCat = state.activeCategory === "all" || p.category === state.activeCategory;
      const q = state.searchQuery.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    // Sorting
    if (state.sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (state.sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
      catalogueGrid.innerHTML = `
        <div class="catalogue-empty">
          <p>No flavours found matching "<strong>${escapeHtml(state.searchQuery)}</strong>".</p>
          <button type="button" class="btn-card-detail" style="margin-top: 14px;" onclick="window.clearCatalogueFilters()">View All 49 Flavours</button>
        </div>
      `;
      return;
    }

    catalogueGrid.innerHTML = "";
    filtered.forEach((prod) => {
      const card = document.createElement("article");
      card.className = "grid-card";
      card.innerHTML = `
        <div class="grid-card-media">
          <img 
            src="${getImageUrl(prod)}" 
            alt="${prod.alt}" 
            class="grid-card-img" 
            loading="lazy" 
            data-slug="${prod.slug}"
            onerror="this.onerror=null; this.src='../public/menu/${prod.slug}.webp?v=4'"
          >
          <span class="grid-card-cat-badge">${prod.category}</span>
        </div>
        <div class="grid-card-body">
          <div>
            <h3 class="grid-card-name">${prod.name}</h3>
            <p class="grid-card-desc">${prod.description}</p>
          </div>
          <div class="grid-card-footer">
            <span class="grid-card-price">₹${prod.price}</span>
            <div class="grid-card-actions">
              <button type="button" class="btn-card-detail" data-id="${prod.id}">Details</button>
              <button type="button" class="btn-card-add" data-id="${prod.id}">+ Add</button>
            </div>
          </div>
        </div>
      `;

      card.querySelector(".btn-card-detail").addEventListener("click", () => openProductModal(prod));
      card.querySelector(".btn-card-add").addEventListener("click", () => {
        addToCart(prod, 1);
        openCartDrawer();
      });

      catalogueGrid.appendChild(card);
    });
  }

  function initCatalogueFilters() {
    if (catalogueSearch) {
      catalogueSearch.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderCatalogue();
      });
    }

    if (catalogueSort) {
      catalogueSort.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderCatalogue();
      });
    }

    categoryPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        categoryPills.forEach((p) => {
          p.classList.remove("active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");
        state.activeCategory = pill.dataset.category;
        renderCatalogue();
      });
    });
  }

  window.clearCatalogueFilters = function () {
    state.searchQuery = "";
    state.activeCategory = "all";
    if (catalogueSearch) catalogueSearch.value = "";
    categoryPills.forEach((p) => p.classList.toggle("active", p.dataset.category === "all"));
    renderCatalogue();
  };

  /* ==========================================================================
     5. PRODUCT DETAIL MODAL
     ========================================================================== */
  const productModalBackdrop = document.getElementById("productModalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalPrice = document.getElementById("modalPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalAllergens = document.getElementById("modalAllergens");
  const modalQtyVal = document.getElementById("modalQtyVal");
  const modalQtyMinus = document.getElementById("modalQtyMinus");
  const modalQtyPlus = document.getElementById("modalQtyPlus");
  const modalAddCartBtn = document.getElementById("modalAddCartBtn");
  const modalWhatsAppBtn = document.getElementById("modalWhatsAppBtn");

  function openProductModal(prod) {
    state.selectedProduct = prod;
    state.modalQty = 1;

    if (modalImg) {
      modalImg.src = getImageUrl(prod);
      modalImg.alt = prod.alt;
      modalImg.onerror = () => {
        modalImg.src = "../public/menu/" + prod.slug + ".webp?v=4";
      };
    }
    if (modalTitle) modalTitle.textContent = prod.name;
    if (modalCategory) modalCategory.textContent = prod.category;
    if (modalPrice) modalPrice.textContent = "₹" + prod.price;
    if (modalDesc) modalDesc.textContent = prod.description;
    if (modalIngredients) {
      modalIngredients.textContent = prod.ingredients && prod.ingredients.length > 0
        ? prod.ingredients.join(", ")
        : "Pure Milk, Fresh Dairy Cream, Cane Sugar";
    }
    if (modalAllergens) {
      modalAllergens.textContent = prod.allergens && prod.allergens.length > 0
        ? prod.allergens.join(", ")
        : "Milk / Dairy";
    }
    if (modalQtyVal) modalQtyVal.textContent = "1";

    if (productModalBackdrop) {
      productModalBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeProductModal() {
    if (productModalBackdrop) {
      productModalBackdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  function initModalEvents() {
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProductModal);
    if (productModalBackdrop) {
      productModalBackdrop.addEventListener("click", (e) => {
        if (e.target === productModalBackdrop) closeProductModal();
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && productModalBackdrop && productModalBackdrop.classList.contains("is-open")) {
        closeProductModal();
      }
    });

    if (modalQtyMinus) {
      modalQtyMinus.addEventListener("click", () => {
        if (state.modalQty > 1) {
          state.modalQty--;
          if (modalQtyVal) modalQtyVal.textContent = state.modalQty;
        }
      });
    }

    if (modalQtyPlus) {
      modalQtyPlus.addEventListener("click", () => {
        if (state.modalQty < 20) {
          state.modalQty++;
          if (modalQtyVal) modalQtyVal.textContent = state.modalQty;
        }
      });
    }

    if (modalAddCartBtn) {
      modalAddCartBtn.addEventListener("click", () => {
        if (!state.selectedProduct) return;
        addToCart(state.selectedProduct, state.modalQty);
        closeProductModal();
        openCartDrawer();
      });
    }

    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.addEventListener("click", () => {
        if (!state.selectedProduct) return;
        const msg = encodeURIComponent(
          `Hello NICE ICE CREAMS! I would like to order: \n- ${state.modalQty}x ${state.selectedProduct.name} (₹${state.selectedProduct.price} each) = ₹${state.modalQty * state.selectedProduct.price}\nTotal: ₹${state.modalQty * state.selectedProduct.price}`
        );
        window.open(`https://wa.me/919985422222?text=${msg}`, "_blank", "noopener,noreferrer");
      });
    }
  }

  /* ==========================================================================
     6. LOCAL SHOPPING CART & WHATSAPP DRAFT GENERATOR
     ========================================================================== */
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartDrawer = document.getElementById("cartDrawer");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const navCartCount = document.getElementById("navCartCount");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalAmount = document.getElementById("cartSubtotalAmount");
  const cartCheckoutWhatsAppBtn = document.getElementById("cartCheckoutWhatsAppBtn");

  function loadCart() {
    try {
      const saved = localStorage.getItem("nice_flavour_cart");
      if (saved) state.cart = JSON.parse(saved);
    } catch (e) {
      state.cart = [];
    }
    updateCartUI();
  }

  function saveCart() {
    try {
      localStorage.setItem("nice_flavour_cart", JSON.stringify(state.cart));
    } catch (e) {}
    updateCartUI();
  }

  function addToCart(prod, qty = 1) {
    const existing = state.cart.find((i) => i.id === prod.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      state.cart.push({
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        price: prod.price,
        image: getImageUrl(prod),
        quantity: qty
      });
    }
    saveCart();
  }

  function updateItemQty(id, change) {
    const idx = state.cart.findIndex((i) => i.id === id);
    if (idx !== -1) {
      state.cart[idx].quantity += change;
      if (state.cart[idx].quantity <= 0) {
        state.cart.splice(idx, 1);
      }
      saveCart();
    }
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    if (navCartCount) navCartCount.textContent = totalCount;
    if (cartSubtotalAmount) cartSubtotalAmount.textContent = "₹" + subtotal;

    if (!cartItemsList) return;
    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: rgba(41,26,20,0.5);">
          <p style="font-size: 15px; font-weight: 700; margin-bottom: 6px;">Your cart is empty</p>
          <p style="font-size: 13px;">Explore all 49 flavours and add your favourites!</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = "";
    state.cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.onerror=null; this.src='../public/menu/${item.slug}.webp?v=4'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} ? ${item.quantity} = ₹${item.price * item.quantity}</div>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="btn-qty-sub" data-id="${item.id}">&minus;</button>
          <span style="font-size: 13px; font-weight: 800;">${item.quantity}</span>
          <button type="button" class="btn-qty-add" data-id="${item.id}">+</button>
        </div>
      `;

      row.querySelector(".btn-qty-sub").addEventListener("click", () => updateItemQty(item.id, -1));
      row.querySelector(".btn-qty-add").addEventListener("click", () => updateItemQty(item.id, 1));
      cartItemsList.appendChild(row);
    });
  }

  function openCartDrawer() {
    if (cartBackdrop) {
      cartBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCartDrawer() {
    if (cartBackdrop) {
      cartBackdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  function initCartEvents() {
    if (openCartBtn) openCartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
    if (cartBackdrop) {
      cartBackdrop.addEventListener("click", (e) => {
        if (e.target === cartBackdrop) closeCartDrawer();
      });
    }

    if (cartCheckoutWhatsAppBtn) {
      cartCheckoutWhatsAppBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
          alert("Your cart is empty. Please add some delicious flavours first!");
          return;
        }

        let orderText = "Hello NICE ICE CREAMS! I would like to place an order from your flavour universe:\n\n";
        let total = 0;
        state.cart.forEach((item, idx) => {
          const lineTotal = item.price * item.quantity;
          total += lineTotal;
          orderText += `${idx + 1}. ${item.name} ? ${item.quantity} = ₹${lineTotal}\n`;
        });
        orderText += `\nTotal Order Value: ₹${total}\nPlease confirm availability and delivery!`;

        const waUrl = `https://wa.me/919985422222?text=${encodeURIComponent(orderText)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      });
    }
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    createCarouselDOM();
    initCarouselDragEvents();
    renderCatalogue();
    initCatalogueFilters();
    initModalEvents();
    initCartEvents();
    loadCart();

    // Start 60fps Carousel Animation
    requestAnimationFrame(carouselAnimationLoop);

    // Run Web Animations API Entrance
    setTimeout(initEntranceAnimations, 60);

    // Window resize handler for smooth responsive scale
    window.addEventListener("resize", () => {
      updateCarouselPositions();
    });
  });

})();
