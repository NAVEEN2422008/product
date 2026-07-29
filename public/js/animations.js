document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  // Header scroll effect
  gsap.to('.header', {
    scrollTrigger: {
      trigger: 'body',
      start: '80px top',
      toggleClass: { className: 'scrolled', targets: '.header' }
    }
  });

  // Hero fade in
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from('.hero-content > *', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.from('.hero-stats > *', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.8
    });
  }

  // Section reveal animations
  const revealSections = document.querySelectorAll('.section');
  revealSections.forEach(section => {
    const items = section.querySelectorAll('.category-card, .product-card, .feature-card, .showcase-item');
    if (items.length === 0) return;

    gsap.from(items, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out'
    });

    const titles = section.querySelectorAll('.section-title, .section-subtitle, .section-label');
    if (titles.length > 0) {
      gsap.from(titles, {
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }
  });

  // 3D Tilt effect on product cards
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationY: x * 8,
        rotationX: -y * 8,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // Counter animation for stats
  const counters = document.querySelectorAll('.hero-stat h3');
  counters.forEach(counter => {
    const text = counter.textContent;
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(target)) return;
    const prefix = text.replace(/[0-9]/g, '');

    gsap.from(counter, {
      scrollTrigger: {
        trigger: counter.closest('.hero-stats'),
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      textContent: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        counter.textContent = prefix + Math.round(this.targets()[0].textContent);
      }
    });
  });

  // Page transition
  document.querySelectorAll('a').forEach(link => {
    if (link.hostname === window.location.hostname && !link.hasAttribute('target')) {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href')?.startsWith('#')) return;
        e.preventDefault();
        const dest = link.href;
        gsap.to('.main', {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => { window.location.href = dest; }
        });
      });
    }
  });

  window.addEventListener('pageshow', () => {
    gsap.fromTo('.main', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  });
});
