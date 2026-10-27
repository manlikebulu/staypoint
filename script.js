/* StayPoint — interactions: mobile nav, smooth anchors, FAQ accordion, scroll reveal */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const MOBILE_MQ = window.matchMedia('(max-width: 1024px)');

  /* ---------- mobile navigation ---------- */
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  if (toggle) {
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
    });
    MOBILE_MQ.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });
  }

  /* ---------- smooth anchor scrolling (+ close menu on navigate) ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length < 2) { if (id === '#') e.preventDefault(); return; }
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });

  /* ---------- nav: shadow/offset on scroll + current section ---------- */
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- FAQ accordion ---------- */
  const list = document.querySelector('[data-accordion]');
  if (list) {
    const items = [...list.querySelectorAll('.faq-item')];
    const flip = (item) => {
      const btn = item.querySelector('.faq-item__toggle');
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
      // the red "active" treatment follows the item the visitor last opened
      items.forEach((i) => { if (i !== item) i.classList.remove('is-active'); });
      item.classList.toggle('is-active', willOpen);
    };
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.faq-item__panel')) return;           // clicks inside the answer don't toggle
        if (e.target.closest('.faq-item__toggle')) { flip(item); return; }
        flip(item);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }
})();
