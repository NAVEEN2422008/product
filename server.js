const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'session',
  secret: 'custom-prints-secret-key-2026',
  maxAge: 7 * 24 * 60 * 60 * 1000
}));

const productsPath = path.join(__dirname, 'data', 'products.json');
const getProducts = () => JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  if (!req.session.orders) req.session.orders = [];
  res.locals.cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

// Home
app.get('/', (req, res) => {
  const products = getProducts();
  const featured = products.slice(0, 4);
  res.render('index', { products: featured, allProducts: products });
});

// Products listing
app.get('/products', (req, res) => {
  const products = getProducts();
  const category = req.query.category;
  const search = req.query.search?.toLowerCase();
  let filtered = products;

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  const categories = [...new Set(products.map(p => p.category))];
  res.render('products', { products: filtered, categories, currentCategory: category || 'all', search: req.query.search || '' });
});

// Product detail
app.get('/products/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.redirect('/products');
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  res.render('product-detail', { product, related });
});

// Cart
app.get('/cart', (req, res) => {
  const products = getProducts();
  const cartItems = req.session.cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  res.render('cart', { cartItems, subtotal });
});

// Add to cart
app.post('/cart/add', (req, res) => {
  const { productId, quantity, customText, color, size } = req.body;
  const id = parseInt(productId);
  const qty = parseInt(quantity) || 1;
  const existing = req.session.cart.find(item =>
    item.productId === id &&
    item.customText === (customText || '') &&
    item.color === (color || '') &&
    item.size === (size || '')
  );
  if (existing) {
    existing.quantity += qty;
  } else {
    req.session.cart.push({
      productId: id,
      quantity: qty,
      customText: customText || '',
      color: color || '',
      size: size || ''
    });
  }
  res.redirect('/cart');
});

// Update cart
app.post('/cart/update', (req, res) => {
  const { index, quantity } = req.body;
  if (req.session.cart[index]) {
    if (parseInt(quantity) <= 0) {
      req.session.cart.splice(index, 1);
    } else {
      req.session.cart[index].quantity = parseInt(quantity);
    }
  }
  res.redirect('/cart');
});

// Remove from cart
app.post('/cart/remove', (req, res) => {
  const { index } = req.body;
  if (req.session.cart[index]) req.session.cart.splice(index, 1);
  res.redirect('/cart');
});

// Checkout
app.get('/checkout', (req, res) => {
  if (req.session.cart.length === 0) return res.redirect('/cart');
  const products = getProducts();
  const cartItems = req.session.cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  res.render('checkout', { cartItems, subtotal });
});

// Place order
app.post('/checkout', (req, res) => {
  const { name, email, phone, address, city, pincode, paymentMethod } = req.body;
  const products = getProducts();
  const items = req.session.cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, productName: product?.name, productPrice: product?.price };
  });
  const total = items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  const order = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase(),
    items,
    customer: { name, email, phone, address, city, pincode },
    paymentMethod,
    total,
    status: 'Confirmed',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  req.session.orders.push(order);
  req.session.cart = [];
  req.session.lastOrder = order;
  res.redirect('/order-success');
});

// Order success
app.get('/order-success', (req, res) => {
  const order = req.session.lastOrder;
  if (!order) return res.redirect('/');
  res.render('order-success', { order });
});

// Admin - view orders
app.get('/admin', (req, res) => {
  const orders = req.session.orders;
  res.render('admin', { orders });
});

// API placeholder images
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const text = req.query.text || 'Image';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1"/>
        <stop offset="100%" style="stop-color:#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" rx="8"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".1em" fill="white" font-family="Arial,sans-serif" font-size="24" font-weight="bold">${text}</text>
  </svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 CustomPrints store running at http://localhost:${PORT}`);
  });
}
module.exports = app;
