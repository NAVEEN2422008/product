# CustomPrints - Custom-Product E-Commerce Store

Server-rendered Express + EJS storefront for personalized printed products (t-shirts, hoodies, mugs, keychains, photo prints, and more), with cart, session-based checkout, order tracking, and an admin order view. Deployable to Netlify as a serverless function.

## Features
- Home page with hero, categories, trending showcase, and featured products.
- Product listing with category filtering and name/description search.
- Product detail pages with custom text/color/size selection and related products.
- Session-based cart (add/update/remove) with quantity and customization-aware line items.
- Checkout flow -> order confirmation page; stored in session under "orders".
- Admin page listing placed orders.
- SVG placeholder-image API (`/api/placeholder/:w/:h`).
- Client JS: 3D hero scene (three.js), product-card animations.

## Tech Stack
- Node.js, Express 5, EJS, body-parser (JSON/urlencoded)
- cookie-session, uuid, method-override
- serverless-http + @netlify/functions (Netlify deployment)
- Frontend JS (Three.js scene, animations)

## Project Structure
```
product/
├── server.js                  # Express app + routes
├── data/products.json         # product catalog (12 items)
├── views/                     # EJS templates
│   └── partials/              # header, footer
├── public/
│   ├── css/style.css
│   └── js/                    # three-scene, app, animations
├── netlify/
│   └── functions/server.js    # serverless entry
├── netlify.toml
└── package.json
```

## Installation
```
npm install
```

## Usage
Local:
```
npm start
```
Visit `http://localhost:3000`. Browse products, customize, add to cart, and check out.

Netlify: build command `npm run build`, function `netlify/functions`, publish root (see `netlify.toml`).