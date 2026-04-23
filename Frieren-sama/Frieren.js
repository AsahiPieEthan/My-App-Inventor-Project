/* ═══════════════════════════════════════════════
   FRIEREN — BEYOND JOURNEY'S END
   Main JS · v2 · White Mist Edition
   ═══════════════════════════════════════════════ */
'use strict';

/* ── LOADER ───────────────────────────────────── */
const Loader = {
  el: null,
  init() {
    this.el = document.getElementById('loader');
    window.addEventListener('load', () => this.dismiss());
    setTimeout(() => this.dismiss(), 3000);
  },
  dismiss() {
    if (!this.el || this.el.classList.contains('loader__out')) return;
    this.el.classList.add('loader__out');
    setTimeout(() => { this.el?.remove(); HeroAnimation.start(); }, 700);
  }
};

/* ── CURSOR ───────────────────────────────────── */
const Cursor = {
  dot: null, ring: null,
  mouse: { x: 0, y: 0 }, pos: { x: 0, y: 0 },
  init() {
    this.dot  = document.querySelector('.cursor__dot');
    this.ring = document.querySelector('.cursor__ring');
    if (!this.dot) return;
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      this.dot.style.left = e.clientX + 'px';
      this.dot.style.top  = e.clientY + 'px';
    });
    this.loop();
    document.querySelectorAll('a,button,.slide__card,.skill__card,.featured__img-side').forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('cursor--hover'));
    });
  },
  loop() {
    const lerp = (a, b, n) => a + (b - a) * n;
    this.pos.x = lerp(this.pos.x, this.mouse.x, 0.11);
    this.pos.y = lerp(this.pos.y, this.mouse.y, 0.11);
    this.ring.style.left = this.pos.x + 'px';
    this.ring.style.top  = this.pos.y + 'px';
    requestAnimationFrame(() => this.loop());
  }
};

/* ── HERO SLIDER ──────────────────────────────── */
const HeroSlider = {
  slides: [], dots: [],
  current: 0, total: 0,
  autoTimer: null, progressTimer: null,
  progress: 0, interval: 5000,

  init() {
    this.slides = [...document.querySelectorAll('.hero__slide')];
    this.total  = this.slides.length;
    if (!this.total) return;

    this.buildDots();
    document.getElementById('heroPrev')?.addEventListener('click', () => this.prev());
    document.getElementById('heroNext')?.addEventListener('click', () => this.next());

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch swipe
    let sx = 0;
    const hero = document.querySelector('.hero');
    hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (dx < -40) this.next();
      if (dx >  40) this.prev();
    }, { passive: true });

    this.update();
    this.startAuto();
  },

  buildDots() {
    const bar = document.getElementById('heroDotsBar');
    if (!bar) return;
    this.slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'hero__slide-dot' + (i === 0 ? ' active' : '');
      btn.addEventListener('click', () => this.goTo(i));
      bar.appendChild(btn);
      this.dots.push(btn);
    });
  },

  goTo(n) {
    this.slides[this.current].classList.remove('active');
    this.dots[this.current]?.classList.remove('active');
    this.current = (n + this.total) % this.total;
    this.slides[this.current].classList.add('active');
    this.dots[this.current]?.classList.add('active');
    this.updateCounter();
    this.resetAuto();
  },

  prev() { this.goTo(this.current - 1); },
  next() { this.goTo(this.current + 1); },

  update() { this.updateCounter(); },

  updateCounter() {
    const el = document.getElementById('heroCurrentNum');
    if (el) el.textContent = String(this.current + 1).padStart(2, '0');
  },

  startAuto() {
    this.progress = 0;
    const bar = document.getElementById('heroProgress');
    const step = 80;
    this.progressTimer = setInterval(() => {
      this.progress += (step / this.interval) * 100;
      if (bar) bar.style.width = Math.min(this.progress, 100) + '%';
      if (this.progress >= 100) {
        this.progress = 0;
        if (bar) bar.style.width = '0%';
        this.next();
      }
    }, step);
  },

  resetAuto() {
    clearInterval(this.progressTimer);
    this.progress = 0;
    const bar = document.getElementById('heroProgress');
    if (bar) bar.style.width = '0%';
    this.startAuto();
  }
};

/* ── HERO ANIMATION ───────────────────────────── */
const HeroAnimation = {
  start() {
    document.querySelectorAll('.hero__title-inner').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 300 + i * 200);
    });

    const eyebrow  = document.querySelector('.hero__eyebrow');
    const subtitle = document.querySelector('.hero__subtitle');
    const scrollHint = document.querySelector('.hero__scroll');

    if (eyebrow) setTimeout(() => {
      eyebrow.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1)';
      eyebrow.style.opacity = '1';
      eyebrow.style.transform = 'translateY(0)';
    }, 200);

    if (subtitle) setTimeout(() => {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, 1100);

    if (scrollHint) setTimeout(() => { scrollHint.style.opacity = '1'; }, 2200);
  }
};

/* ── NAV ──────────────────────────────────────── */
const Nav = {
  el: null,
  init() {
    this.el = document.querySelector('nav');
    window.addEventListener('scroll', () => this.update(), { passive: true });
    this.update();
  },
  update() {
    const scrolled = window.scrollY > 60;
    this.el.classList.toggle('scrolled', scrolled);
    // Remove hero-mode once scrolled so nav turns white
    if (scrolled) this.el.classList.remove('hero-mode');
    else this.el.classList.add('hero-mode');
  }
};

/* ── SCROLL REVEAL ────────────────────────────── */
const ScrollReveal = {
  init() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal,.reveal--left,.reveal--right,.portrait__clip,.split-title,.quote__text,.line-draw').forEach(el => obs.observe(el));
  }
};

/* ── SPLIT TEXT ───────────────────────────────── */
const SplitText = {
  init() {
    document.querySelectorAll('.split-title').forEach(el => {
      const html = el.innerHTML;
      const lines = html.split('<br>');
      el.innerHTML = lines.map(line =>
        line.trim().split(' ').filter(Boolean).map(w =>
          `<span class="word"><span class="word-inner">${w}</span></span>`
        ).join(' ')
      ).join('<br>');
    });
  }
};

/* ── PARALLAX ─────────────────────────────────── */
const Parallax = {
  init() {
    window.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      document.querySelectorAll('.hero__slide.active svg[style*="floral"], svg[style*="floral"]').forEach((el, i) => {
        const d = 0.4 + i * 0.25;
        el.style.transform = `translate(${mx*d*8}px,${my*d*5}px)`;
      });
      const shape = document.querySelector('.portrait__bg-shape');
      if (shape) shape.style.transform = `translate(${mx*6}px,${my*4}px)`;
    }, { passive: true });
  }
};

/* ── WORKS SLIDER ─────────────────────────────── */
const WorksSlider = {
  track: null, cards: [], dots: [],
  current: 0, cardWidth: 0, gap: 32,
  isDragging: false, startX: 0, dragOffset: 0,

  init() {
    this.track = document.getElementById('sliderTrack');
    if (!this.track) return;
    this.cards = [...this.track.querySelectorAll('.slide__card')];
    this.buildDots();
    this.measure();
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prev());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.next());
    window.addEventListener('resize', () => this.measure());
    this.track.addEventListener('pointerdown',  e => this.dragStart(e));
    this.track.addEventListener('pointermove',  e => this.dragMove(e));
    this.track.addEventListener('pointerup',    e => this.dragEnd(e));
    this.track.addEventListener('pointercancel',() => this.dragCancel());
  },

  measure() {
    if (this.cards[0]) this.cardWidth = this.cards[0].offsetWidth + this.gap;
  },

  buildDots() {
    const c = document.getElementById('sliderDots');
    if (!c) return;
    this.cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => this.goTo(i));
      c.appendChild(d);
      this.dots.push(d);
    });
  },

  goTo(n) {
    this.current = Math.max(0, Math.min(n, this.cards.length - 1));
    this.track.style.transform = `translateX(-${this.current * this.cardWidth}px)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
  },

  prev() { this.goTo(this.current - 1); },
  next() { this.goTo(this.current + 1); },

  dragStart(e) { this.isDragging = true; this.startX = e.clientX; this.track.style.transition = 'none'; this.track.setPointerCapture(e.pointerId); },
  dragMove(e)  { if (!this.isDragging) return; this.dragOffset = e.clientX - this.startX; this.track.style.transform = `translateX(${-this.current * this.cardWidth + this.dragOffset}px)`; },
  dragEnd()    { if (!this.isDragging) return; this.isDragging = false; this.track.style.transition = ''; if (this.dragOffset < -60) this.next(); else if (this.dragOffset > 60) this.prev(); else this.goTo(this.current); this.dragOffset = 0; },
  dragCancel() { this.isDragging = false; this.track.style.transition = ''; this.goTo(this.current); }
};

/* ── SCROLL PROGRESS BAR ──────────────────────── */
const ProgressBar = {
  init() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent-deep));z-index:600;width:0%;transition:width .1s linear;pointer-events:none;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const t = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / t * 100) + '%';
    }, { passive: true });
  }
};

/* ── PETALS ───────────────────────────────────── */
const Petals = {
  init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const dur = 10 + Math.random() * 8;
      p.style.cssText = `left:${8 + i*11}%;animation-duration:${dur}s;animation-delay:${(i/8)*14}s;opacity:${.25+Math.random()*.4};width:${5+Math.random()*4}px;height:${8+Math.random()*6}px;transform:rotate(${Math.random()*180}deg)`;
      hero.appendChild(p);
    }
  }
};

/* ── SMOOTH SCROLL ────────────────────────────── */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
      });
    });
    document.getElementById('heroScrollHint')?.addEventListener('click', () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
};

/* ── INIT ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Loader.init();
  Cursor.init();
  Nav.init();
  SplitText.init();
  HeroSlider.init();
  ScrollReveal.init();
  Parallax.init();
  WorksSlider.init();
  ProgressBar.init();
  Petals.init();
  SmoothScroll.init();
});
