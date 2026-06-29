/* ═══════════════════════════════════════════
   ZAFIR ABDULLAH · Portfolio JS
   Neural canvas · Typewriter · Nav · Theme
═══════════════════════════════════════════ */

'use strict';

// ── DOM refs ──────────────────────────────────────────
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = themeToggle?.querySelector('.theme-icon');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const typeEl       = document.getElementById('typewriter');
const navLinks     = document.querySelectorAll('.nav-link');
const sections     = document.querySelectorAll('.section');
const canvas       = document.getElementById('neuralCanvas');
const yearEl       = document.getElementById('year');
const contactForm  = document.getElementById('contactForm');

// ── Year ──────────────────────────────────────────────
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Theme toggle ──────────────────────────────────────
const stored = localStorage.getItem('zafir-theme') || 'dark';
setTheme(stored);

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('zafir-theme', theme);
}

themeToggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// ── Mobile menu ───────────────────────────────────────
hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu?.classList.toggle('open', open);
  mobileMenu?.setAttribute('aria-hidden', !open);
  // Toggle tabindex for accessibility
  mobileMenu?.querySelectorAll('[tabindex]').forEach(el => {
    el.setAttribute('tabindex', open ? '0' : '-1');
  });
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ── Scroll-to-top ─────────────────────────────────────
window.addEventListener('scroll', () => {
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Active nav highlighting ───────────────────────────
const sectionEls = [...document.querySelectorAll('section[id]')];
const navMap = {};
navLinks.forEach(l => {
  const href = l.getAttribute('href')?.replace('#', '');
  if (href) navMap[href] = l;
});

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = navMap[entry.target.id];
      link?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sectionEls.forEach(el => navObserver.observe(el));

// ── Smooth scroll for all anchor links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Section reveal on scroll ──────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

sections.forEach(s => revealObserver.observe(s));

// ── Typewriter ────────────────────────────────────────
const phrases = [
  'AI Developer',
  'Deep Learning Engineer',
  'NLP Practitioner',
  'Computer Vision Builder',
  'GenAI Explorer',
  'MLOps Enthusiast',
];

let pIdx = 0, cIdx = 0, deleting = false;

function tick() {
  if (!typeEl) return;
  const phrase = phrases[pIdx];

  if (deleting) {
    typeEl.textContent = phrase.slice(0, cIdx--);
  } else {
    typeEl.textContent = phrase.slice(0, cIdx++);
  }

  let delay = deleting ? 50 : 80;

  if (!deleting && cIdx > phrase.length) {
    delay = 2000;
    deleting = true;
  } else if (deleting && cIdx < 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    cIdx = 0;
    delay = 400;
  }

  setTimeout(tick, delay);
}
tick();

// ── Neural Network Canvas ────────────────────────────
(function initCanvas() {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, animId;

  const NODE_COUNT  = 55;
  const LINK_DIST   = 130;
  const SPEED       = 0.4;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function makeNode() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 2 + 1.2,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, makeNode);
  }

  function getColors() {
    const isDark = html.getAttribute('data-theme') !== 'light';
    return {
      node: isDark ? 'rgba(0,229,255,0.65)' : 'rgba(0,112,212,0.5)',
      link: isDark ? 'rgba(0,229,255,'       : 'rgba(0,112,212,',
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const { node, link } = getColors();

    // Links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = link + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = node;
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Pause when tab hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });

  // Reduce motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  init();
  loop();

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });
})();

// ── Contact form ──────────────────────────────────────
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const subject = contactForm.subject.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !subject || !message) return;

  const btn = contactForm.querySelector('.btn');
  btn?.classList.add('loading');

  // Compose mailto
  const body = `Hi Zafir,\n\n${message}\n\nFrom: ${name} <${email}>`;
  const href = `mailto:zafirabdullah1534@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  setTimeout(() => {
    window.location.href = href;
    btn?.classList.remove('loading');
  }, 600);
});

// ── Card tilt (subtle, desktop only) ─────────────────
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
