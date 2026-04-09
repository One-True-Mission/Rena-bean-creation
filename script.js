// COOKIE BANNER
function dismissCookie() {
  document.getElementById('cookie-banner').classList.remove('show');
  localStorage.setItem('cookie-dismissed', '1');
}
if (!localStorage.getItem('cookie-dismissed')) {
  setTimeout(() => document.getElementById('cookie-banner').classList.add('show'), 2200);
}

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
  document.getElementById('progress-bar').style.width = (scrolled / total * 100) + '%';
  document.getElementById('back-top').classList.toggle('visible', scrolled > 400);
  document.getElementById('float-contact').classList.toggle('visible', scrolled > 400);
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.style.padding = scrolled > 60 ? '0.6rem 4rem' : '0.9rem 4rem';
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

// CAROUSEL
let current = 0;
const totalSlides = 3;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
let autoTimer = setInterval(carouselNext, 5500);

function goTo(n) {
  current = (n + totalSlides) % totalSlides;
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  clearInterval(autoTimer);
  autoTimer = setInterval(carouselNext, 5500);
}
function carouselNext() { goTo(current + 1); }
function carouselPrev() { goTo(current - 1); }

// Carousel touch swipe
if (track) {
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? carouselNext() : carouselPrev();
  });
}

// CONTACT FORM — Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      } else {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    }).catch(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again.');
    });
  });
}

// WAITLIST FORM
function submitWaitlist(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'You are on the list!';
  btn.disabled = true;
  btn.style.background = '#4a7c59';
  e.target.querySelector('input').value = '';
}

// NEWSLETTER FORM
function submitNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed!';
  btn.disabled = true;
  btn.style.background = '#4a7c59';
  e.target.querySelector('input').value = '';
}
