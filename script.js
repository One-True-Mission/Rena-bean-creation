// ACTIVE NAV (driven by body[data-page])
(function () {
  const page = document.body.getAttribute('data-page');
  if (!page) return;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('data-nav') === page) link.classList.add('is-active');
  });
})();

// MOBILE MENU
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger');
  if (!menu || !overlay || !hamburger) return;
  const isOpen = menu.classList.contains('active');
  menu.classList.toggle('active', !isOpen);
  overlay.classList.toggle('active', !isOpen);
  hamburger.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// Close menu on escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('active')) toggleMenu();
  }
});

// COOKIE BANNER
function dismissCookie() {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('show');
  try { localStorage.setItem('cookie-dismissed', '1'); } catch (e) {}
}
try {
  if (!localStorage.getItem('cookie-dismissed')) {
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.add('show');
    }, 2200);
  }
} catch (e) {}

// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (cursor && ring) {
  ring.style.transition = 'left 0.12s ease-out, top 0.12s ease-out, transform 0.2s, width 0.25s, height 0.25s';
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// SCROLL EVENTS — progress bar, back to top, float cta, nav shrink
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const bar = document.getElementById('progress-bar');
  if (bar && total > 0) bar.style.width = (scrolled / total * 100) + '%';
  const backTop = document.getElementById('back-top');
  if (backTop) backTop.classList.toggle('visible', scrolled > 400);
  const floatC = document.getElementById('float-call');
  if (floatC) floatC.classList.toggle('visible', scrolled > 400);
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.style.padding = window.innerWidth > 900
      ? (scrolled > 60 ? '0.6rem 4rem' : '0.9rem 4rem')
      : '0.75rem 1.5rem';
  }
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObserver.observe(r));

// FAQ ACCORDION
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(b => b.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// REVIEWS CAROUSEL
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const dots = document.querySelectorAll('.carousel-dot');
  const totalSlides = track.children.length;
  let current = 0;
  let autoTimer = setInterval(carouselNext, 5500);

  window.goTo = function (n) {
    current = (n + totalSlides) % totalSlides;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    clearInterval(autoTimer);
    autoTimer = setInterval(carouselNext, 5500);
  };
  window.carouselNext = function () { window.goTo(current + 1); };
  window.carouselPrev = function () { window.goTo(current - 1); };
  function carouselNext() { window.goTo(current + 1); }

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? window.carouselNext() : window.carouselPrev();
  });
})();

// WAITLIST FORM (front-end confirmation only)
function submitWaitlist(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'You are on the list!';
  btn.disabled = true;
  btn.style.background = '#4a7c59';
  e.target.querySelector('input').value = '';
}

// NEWSLETTER FORM (front-end confirmation only)
function submitNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed!';
  btn.disabled = true;
  btn.style.background = '#4a7c59';
  e.target.querySelector('input').value = '';
}

// FEATURED WORK CAROUSEL -- center + peek pattern (home)
(function () {
  const track = document.getElementById('featureTrack');
  if (!track) return;
  const slides = Array.prototype.slice.call(track.children);
  const total = slides.length;
  if (!total) return;
  const dotsWrap = document.getElementById('featureDots');
  let cur = 0;
  let timer;

  if (dotsWrap) {
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.className = 'feature-dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', () => window.featureGo(i));
      dotsWrap.appendChild(b);
    }
  }
  const dots = dotsWrap ? dotsWrap.children : [];
  const STATE = ['is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next'];

  function render() {
    slides.forEach((sl, i) => {
      const rel = (i - cur + total) % total;
      STATE.forEach(c => sl.classList.remove(c));
      if (rel === 0) sl.classList.add('is-active');
      else if (rel === 1) sl.classList.add('is-next');
      else if (rel === total - 1) sl.classList.add('is-prev');
      else if (rel <= total / 2) sl.classList.add('is-far-next');
      else sl.classList.add('is-far-prev');
    });
    for (let i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === cur);
  }

  function start() { timer = setInterval(() => window.featureGo(cur + 1), 3000); }
  function stop() { clearInterval(timer); }

  window.featureGo = function (n) { cur = (n + total) % total; render(); stop(); start(); };
  window.featureNext = function () { window.featureGo(cur + 1); };
  window.featurePrev = function () { window.featureGo(cur - 1); };

  slides.forEach(sl => sl.addEventListener('click', () => {
    if (sl.classList.contains('is-next')) window.featureNext();
    else if (sl.classList.contains('is-prev')) window.featurePrev();
  }));

  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) dx < 0 ? window.featureNext() : window.featurePrev();
  });

  const wrap = track.parentElement;
  if (wrap) {
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
  }

  render();
  start();
})();