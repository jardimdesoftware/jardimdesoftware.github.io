function initPage(){
  initYear();
  initMobileNav();
  initHeaderShadow();
  initScrollSpy();
  initRevealOnScroll();
  initToTop();
}

function initYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

function initHeaderShadow(){
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const scrolled = window.scrollY > 8;
    header?.classList.toggle('scrolled', scrolled);
  };
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });

  // Ensure sections account for sticky header offset
  document.querySelectorAll('section[id]').forEach(sec => {
    sec.style.scrollMarginTop = (header?.offsetHeight || 72) + 'px';
  });
}

function initScrollSpy(){
  const links = Array.from(document.querySelectorAll('.site-nav .nav-link'));
  const ids = links.map(l => l.getAttribute('href')).filter(Boolean).map(h => h.replace('#',''));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  const activate = (id) => {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        activate(entry.target.id);
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] });

  sections.forEach(sec => observer.observe(sec));

  // Smooth scroll for internal links (native behavior + focus)
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector(href);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute('tabindex'), 500);
      }
    });
  });
}

function initRevealOnScroll(){
  const els = document.querySelectorAll('.will-reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

function initToTop(){
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('show', window.scrollY > 400);
  toggle();
  document.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', initPage);