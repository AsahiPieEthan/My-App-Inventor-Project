/* =========================================
   shared.js — HQ White Coffee
   Shared JS: language toggle, hamburger, slider
   ========================================= */

// ── LANGUAGE TOGGLE ──
let currentLang = localStorage.getItem('hqLang') || 'en';

window.changeLang = function(lang) {
  currentLang = lang;
  localStorage.setItem('hqLang', lang);

  // Update all elements with data-en / data-cn
  document.querySelectorAll('[data-en], [data-cn]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;

    // If it contains HTML (e.g. <em>, <span>), use innerHTML
    if (text.includes('<')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Highlight active lang button
  const btnEn = document.getElementById('btn-en');
  const btnCn = document.getElementById('btn-cn');
  if (btnEn && btnCn) {
    btnEn.classList.toggle('lang-active', lang === 'en');
    btnCn.classList.toggle('lang-active', lang === 'cn');
  }

  // Update <html> lang attribute
  document.documentElement.lang = lang === 'cn' ? 'zh' : 'en';
};

// Apply saved language on page load
document.addEventListener('DOMContentLoaded', () => {
  if (currentLang === 'cn') {
    changeLang('cn');
  } else {
    // Still apply to sync button state
    changeLang('en');
  }
});

// ── HAMBURGER MENU ──
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });
});

// ── HERO SLIDER (index page only) ──
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides');
  if (!slides) return;

  const imgs = slides.querySelectorAll('.slide');
  let current = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + imgs.length) % imgs.length;
    slides.style.transform = `translateX(-${current * 100}%)`;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 4500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  document.querySelector('.next')?.addEventListener('click', () => { next(); resetAuto(); });
  document.querySelector('.prev')?.addEventListener('click', () => { prev(); resetAuto(); });

  startAuto();

  // Touch swipe support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  hero?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  });
});

// ── ANIMATIONS ON SCROLL (about & contact pages) ──
const items = document.querySelectorAll('.menu-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});

items.forEach(item => {
  observer.observe(item);
});