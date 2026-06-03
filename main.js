/* ═══════════════════════════════════════════
   STACKLY — Enhanced JS with GSAP Animations
   ═══════════════════════════════════════════ */

// ── Load GSAP + Plugins dynamically ──
(function loadGSAP() {
  const scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js'
  ];
  let loaded = 0;
  scripts.forEach((src, i) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { loaded++; if (loaded === scripts.length) initAll(); };
    // SplitText is Club GSAP only — we'll handle that gracefully
    s.onerror = () => { loaded++; if (loaded === scripts.length) initAll(); };
    document.head.appendChild(s);
  });
})();

function initAll() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);
  }
  initNav();
  initMobileMenu();
  initHeroAnimations();
  initTextAnimations();
  initImageAnimations();
  initScrollReveal();
  initCounters();
  initStagger();
  initParallax();
  initTiltCards();
  initMagneticButtons();
  initActiveNavLink();
  initMarquee();
  initFleetCardHover();
}

// ── Navigation Scroll ──
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile Menu ──
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  const close  = document.querySelector('.mobile-close');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.add('open');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(menu.querySelectorAll('a'), 
        { opacity: 0, y: 40, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
    }
  });
  if (close) close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// ── Hero Entrance Animations ──
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;
  const badge   = document.querySelector('.hero-badge');
  const title   = document.querySelector('.hero-title');
  const sub     = document.querySelector('.hero-sub');
  const actions = document.querySelector('.hero-actions');
  const scroll  = document.querySelector('.hero-scroll');
  const overlay = document.querySelector('.hero-overlay');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
  if (badge)   tl.fromTo(badge,   { opacity: 0, y: -30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.3);
  if (title) {
    // Split title into words for staggered animation
    const words = title.querySelectorAll('*');
    tl.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5);
    animateTitleWords(title, tl, 0.5);
  }
  if (sub)     tl.fromTo(sub,     { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 0.9);
  if (actions) tl.fromTo(actions, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 1.1);
  if (scroll)  tl.fromTo(scroll,  { opacity: 0 }, { opacity: 1, duration: 1 }, 1.4);
}

// ── Word-by-word text animation (no SplitText plugin needed) ──
function animateTitleWords(el, tl, startTime) {
  if (!el || typeof gsap === 'undefined') return;
  // Wrap each word in a span manually for non-SplitText
  el.querySelectorAll('em, span').forEach(child => {
    gsap.fromTo(child,
      { opacity: 0, y: 60, skewY: 5 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out', delay: startTime + 0.15 }
    );
  });
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', delay: startTime }
  );
}

// ── Rich Text Animations (section titles, labels) ──
function initTextAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Section titles — slide up with clip
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
        duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Section labels — slide in from left with line
  document.querySelectorAll('.section-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // Gold lines — width expand
  document.querySelectorAll('.gold-line').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // Section descriptions — fade + drift
  document.querySelectorAll('.section-desc, .hero-sub').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });

  // Stat numbers — zoom in
  document.querySelectorAll('.stat-num').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Badge elements — pop in
  document.querySelectorAll('.badge, .hero-badge').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.7, y: -10 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });

  // Price tags — slide up with bounce
  document.querySelectorAll('.price-tag, .car-price').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });

  // Footer columns — stagger from bottom
  const footerCols = document.querySelectorAll('.footer-col, .footer-brand');
  if (footerCols.length) {
    gsap.fromTo(footerCols,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: 'footer', start: 'top 85%', once: true }
      }
    );
  }

  // Nav links subtle entrance
  const navLinks = document.querySelectorAll('.nav-links li');
  if (navLinks.length) {
    gsap.fromTo(navLinks,
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.3 }
    );
  }

  // CTA content
  const ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    gsap.fromTo(ctaContent,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: ctaContent, start: 'top 80%', once: true }
      }
    );
  }
}

// ── Image Animations ──
function initImageAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Fleet / car images — reveal with clip from bottom
  document.querySelectorAll('.fleet-img, .car-img, .blog-card-img, .featured-img').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)', scale: 1.1 },
      {
        clipPath: 'inset(0% 0 0 0)', scale: 1,
        duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
    // Inner image parallax on scroll
    const img = el.querySelector('img');
    if (img) {
      gsap.fromTo(img,
        { scale: 1.15 },
        {
          scale: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    }
  });

  // Team images — fade + scale
  document.querySelectorAll('.team-img').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
      }
    );
  });

  // Page hero images — zoom out entrance
  const pageHeroImgs = document.querySelectorAll('.page-hero-bg img');
  pageHeroImgs.forEach(img => {
    gsap.fromTo(img,
      { scale: 1.2, opacity: 0.4 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'power3.out' }
    );
  });

  // Story image — slide in from left
  const storyImg = document.querySelector('.story-img');
  if (storyImg) {
    gsap.fromTo(storyImg,
      { opacity: 0, x: -80, clipPath: 'inset(0 100% 0 0)' },
      {
        opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)',
        duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: storyImg, start: 'top 80%', once: true }
      }
    );
  }

  // Services hero image
  const servicesImg = document.querySelector('.services-img');
  if (servicesImg) {
    gsap.fromTo(servicesImg,
      { opacity: 0, x: 80, clipPath: 'inset(0 0 0 100%)' },
      {
        opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)',
        duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: servicesImg, start: 'top 80%', once: true }
      }
    );
  }

  // Testimonial avatars — pop in
  document.querySelectorAll('.testi-avatar').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0, rotation: -15 },
      {
        opacity: 1, scale: 1, rotation: 0,
        duration: 0.5, ease: 'back.out(2)', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // Hero background parallax
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    gsap.to(heroBg, {
      y: '30%',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // CTA background parallax
  const ctaBg = document.querySelector('.cta-bg img');
  if (ctaBg) {
    gsap.to(ctaBg, {
      y: '20%',
      ease: 'none',
      scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  // Recent post images — side peek
  document.querySelectorAll('.recent-post-img').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }
    );
  });
}

// ── Scroll Reveal (fallback + enhanced) ──
function initScrollReveal() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => {
      const delay = +(el.dataset.delay || 0) / 1000;
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay,
          scrollTrigger: { trigger: el, start: 'top 87%', once: true }
        }
      );
    });
    document.querySelectorAll('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 83%', once: true }
        }
      );
    });
    document.querySelectorAll('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 83%', once: true }
        }
      );
    });
  } else {
    // Pure IntersectionObserver fallback
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('visible'), +delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }
}

// ── Stagger Children ──
function initStagger() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = Array.from(parent.children);
      gsap.fromTo(children,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, stagger: 0.13, ease: 'power3.out',
          scrollTrigger: { trigger: parent, start: 'top 83%', once: true }
        }
      );
    });
  } else {
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = parent.children;
      Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = (i * 120) + 'ms';
        child.classList.add('reveal');
      });
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            Array.from(children).forEach(c => c.classList.add('visible'));
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      io.observe(parent);
    });
  }
}

// ── Counter Animation ──
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  if (typeof gsap !== 'undefined') {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.5, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString() + suffix; }
    });
  } else {
    const duration = 2000, step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// ── Parallax Hero ──
function initParallax() {
  // GSAP handles this in initImageAnimations if available
  if (typeof gsap !== 'undefined') return;
  const hero = document.querySelector('.hero-parallax');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    hero.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

// ── Tilt Cards ──
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateY: x * 14, rotateX: -y * 10,
          translateY: -8, scale: 1.02,
          transformPerspective: 800, duration: 0.4, ease: 'power2.out'
        });
      } else {
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, { rotateY: 0, rotateX: 0, translateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      } else {
        card.style.transform = '';
      }
    });
  });
}

// ── Magnetic Buttons ──
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.btn, .nav-cta, .filter-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.25;
      const y = (e.clientY - r.top  - r.height / 2) * 0.25;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// ── Fleet Card hover shimmer ──
function initFleetCardHover() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.fleet-card, .car-card').forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mouseenter', () => {
      if (img) gsap.to(img, { scale: 1.08, duration: 0.7, ease: 'power2.out' });
      gsap.to(card, { borderColor: 'var(--gold)', duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      if (img) gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
    });
  });
}

// ── Active Nav Link ──
function initActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
  });
}

// ── Marquee pause on hover (CSS handles animation, JS handles pause) ──
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  // Already handled by CSS, but add smooth deceleration
  if (typeof gsap !== 'undefined') {
    track.addEventListener('mouseenter', () => gsap.to(track, { timeScale: 0.1, duration: 0.5 }));
    track.addEventListener('mouseleave', () => gsap.to(track, { timeScale: 1, duration: 0.5 }));
  }
}

// ── Smooth number ticker on price elements ──
document.querySelectorAll('.price-ticker').forEach(el => {
  const from = +el.dataset.from || 0;
  const to   = +el.dataset.to;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (typeof gsap !== 'undefined') {
          const obj = { v: from };
          gsap.to(obj, { v: to, duration: 1.5, ease: 'power2.out',
            onUpdate: () => { el.textContent = '$' + Math.floor(obj.v); }
          });
        } else {
          let v = from;
          const interval = setInterval(() => {
            v = Math.min(v + Math.ceil((to - from) / 40), to);
            el.textContent = '$' + v;
            if (v >= to) clearInterval(interval);
          }, 30);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  io.observe(el);
});

// ── Page Transition (smooth page load) ──
(function() {
  document.body.style.opacity = '0';
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(document.body, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    } else {
      document.body.style.transition = 'opacity 0.6s ease';
      requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    }
  });
  // Handle outgoing page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', e => {
      if (typeof gsap !== 'undefined') {
        e.preventDefault();
        gsap.to(document.body, {
          opacity: 0, duration: 0.35, ease: 'power2.in',
          onComplete: () => { window.location.href = href; }
        });
      }
    });
  });
})();

// ── Search box fields: focus glow ──
document.querySelectorAll('.search-field input, .search-field select').forEach(el => {
  el.addEventListener('focus', () => {
    if (typeof gsap !== 'undefined') gsap.to(el, { boxShadow: '0 0 0 3px rgba(201,168,76,0.25)', duration: 0.3 });
  });
  el.addEventListener('blur', () => {
    if (typeof gsap !== 'undefined') gsap.to(el, { boxShadow: 'none', duration: 0.3 });
  });
});

// ── Info cards (contact page) hover ──
document.querySelectorAll('.info-card').forEach(card => {
  if (typeof gsap === 'undefined') return;
  card.addEventListener('mouseenter', () => gsap.to(card, { x: 8, borderColor: 'var(--gold)', duration: 0.3, ease: 'power2.out' }));
  card.addEventListener('mouseleave', () => gsap.to(card, { x: 0, duration: 0.4, ease: 'power2.out' }));
});

// ── Timeline items ──
function initTimelineAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 87%', once: true }
      }
    );
  });
}

// ── Value cards ──
function initValueCards() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.value-card').forEach((card, i) => {
    const icon = card.querySelector('.value-icon');
    card.addEventListener('mouseenter', () => {
      if (icon) gsap.to(icon, { y: -8, scale: 1.2, rotation: 10, duration: 0.4, ease: 'back.out(2)' });
    });
    card.addEventListener('mouseleave', () => {
      if (icon) gsap.to(icon, { y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
}

// ── Feature card icon animations ──
function initFeatureIcons() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.feature-card').forEach(card => {
    const icon = card.querySelector('.feature-icon');
    card.addEventListener('mouseenter', () => {
      if (icon) gsap.to(icon, { scale: 1.15, rotation: -8, duration: 0.4, ease: 'back.out(2)' });
    });
    card.addEventListener('mouseleave', () => {
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
}

// ── Step numbers pulse ──
function initProcessSteps() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.step-num').forEach(num => {
    gsap.to(num, {
      boxShadow: '0 8px 32px rgba(201,168,76,0.6)',
      duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  });
}

// ── Addon card flip effect ──
function initAddonCards() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.addon-card').forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('selected');
      const icon = this.querySelector('.addon-icon');
      if (icon) gsap.fromTo(icon, { scale: 1.4, rotation: 10 }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' });
    });
  });
}

// ── FAQ accordion ──
window.toggleFaq = function(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    if (typeof gsap !== 'undefined') {
      const answer = item.querySelector('.faq-a');
      gsap.fromTo(answer, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  }
};

// ── Contact form submit ──
window.handleSubmit = function() {
  const btn    = document.getElementById('submit-btn');
  const text   = document.getElementById('btn-text');
  const arrow  = document.getElementById('btn-arrow');
  const loader = document.getElementById('btn-loader');
  if (!btn) return;
  if (!document.getElementById('f-agree')?.checked) { alert('Please agree to our Privacy Policy to continue.'); return; }
  if (!document.getElementById('f-email')?.value.trim()) { alert('Please enter your email address.'); return; }

  btn.disabled = true;
  if (text)  text.textContent = 'Sending...';
  if (arrow) arrow.style.display = 'none';
  if (loader) loader.style.display = 'block';

  setTimeout(() => {
    btn.style.display = 'none';
    const msg = document.getElementById('success-msg');
    if (msg) {
      msg.style.display = 'block';
      if (typeof gsap !== 'undefined') gsap.fromTo(msg, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }
  }, 2000);
};

// ── Cars filter ──
window.filterCars = function(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('.car-card');
  let count = 0;
  cards.forEach(card => {
    const match = cat === 'all' || card.dataset.cat === cat;
    if (match) {
      count++;
      card.style.display = '';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: count * 0.06 });
      } else {
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.transition = 'all 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
      }
    } else {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in', onComplete: () => { card.style.display = 'none'; } });
      } else {
        card.style.display = 'none';
      }
    }
  });
  const countEl = document.getElementById('car-count');
  if (countEl) countEl.textContent = `Showing ${count} vehicle${count !== 1 ? 's' : ''}`;
};

// ── Favourite toggle ──
document.querySelectorAll('.car-fav').forEach(b => {
  b.addEventListener('click', function() {
    this.textContent = this.textContent === '♡' ? '♥' : '♡';
    this.style.color = this.textContent === '♥' ? '#e74c3c' : '';
    if (typeof gsap !== 'undefined') gsap.fromTo(this, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' });
  });
});

// ── Scroll progress indicator ──
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#c9a84c,#e8c96d);z-index:9999;width:0%;transition:none;pointer-events:none;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
  }, { passive: true });
})();

// ── Init extra animations after GSAP loads ──
function initExtras() {
  initTimelineAnimations();
  initValueCards();
  initFeatureIcons();
  initProcessSteps();
  initAddonCards();
}

// Call extras (safe — functions check for gsap internally)
window.addEventListener('DOMContentLoaded', () => {
  initExtras();
  // Delayed to ensure GSAP is loaded
  setTimeout(initExtras, 800);
});