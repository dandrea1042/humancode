/* ===== HumanCode — index.js ===== */

// ── Navbar scroll ─────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ─────────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.step-card, .pattern-card, .testimonial-card, .faq-item, .section-header, .pg-teaser-preview'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(o => {
    o.classList.remove('open');
    o.querySelector('.faq-answer').classList.remove('open');
  });
  if (!isOpen) { item.classList.add('open'); answer.classList.add('open'); }
}

// ── Pattern cards → playground con patrón preseleccionado ────────────────────
// Hace clickeable tanto el botón como toda la card
document.querySelectorAll('.pattern-card:not(.pattern-locked)').forEach(card => {
  const pattern = card.dataset.pattern;
  if (!pattern) return;

  // Cursor pointer en toda la card
  card.style.cursor = 'pointer';

  // Click en la card completa
  card.addEventListener('click', (e) => {
    // Evitar doble disparo si el click fue en el botón (el botón también tiene listener)
    if (e.target.closest('.pattern-btn')) return;
    window.location.href = `playground.html?pattern=${pattern}`;
  });

  // Click en el botón "Aprender"
  const btn = card.querySelector('.pattern-btn[data-pattern-target]');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `playground.html?pattern=${pattern}`;
    });
  }
});

// ── Pattern card hover glow ───────────────────────────────────────────────────
const colorMap = {
  loop:      '59,130,246',
  condition: '245,158,11',
  function:  '139,92,246',
  variable:  '16,185,129',
  error:     '239,68,68'
};
document.querySelectorAll('.pattern-card:not(.pattern-locked)').forEach(card => {
  const c = colorMap[card.dataset.pattern];
  if (!c) return;
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 8px 32px rgba(${c},0.25)`;
    card.style.borderColor = `rgba(${c},0.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
    card.style.borderColor = '';
  });
});

// ── Teaser del playground → link completo ────────────────────────────────────
const teaser = document.querySelector('.pg-teaser-preview');
if (teaser) {
  teaser.style.cursor = 'pointer';
  teaser.addEventListener('click', () => {
    window.location.href = 'playground.html';
  });
}

// ── Smooth scroll para links internos ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
