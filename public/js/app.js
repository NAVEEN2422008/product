document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('active');
      menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    document.addEventListener('click', function(e) {
      if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Quantity controls
  window.incrementQty = function() {
    const input = document.getElementById('quantity');
    if (input) {
      const val = parseInt(input.value) || 1;
      if (val < 99) input.value = val + 1;
    }
  };

  window.decrementQty = function() {
    const input = document.getElementById('quantity');
    if (input) {
      const val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
    }
  };

  // Add to cart animation
  document.querySelectorAll('.customize-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Added to Cart!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
        }, 2000);
      }
    });
  });

  // Cart quantity buttons
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const form = this.closest('form');
      if (form?.classList.contains('cart-qty-form')) return;
      e.preventDefault();
    });
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      a.classList.add('active');
    }
  });
});
