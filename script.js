/* ===================================================
   PORTFOLIO JS — Rakib Mahmud Nadir
   Particle canvas, counters, nav, scroll reveal,
   credentials render, Medium RSS, contact form
   =================================================== */

// ========== PARTICLE CANVAS ==========
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const PARTICLE_COUNT = 70;
  const MAX_DIST = 140;
  const SPEED = 0.3;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 2 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = 1 - dist / MAX_DIST;
          ctx.strokeStyle = `rgba(59,130,246,${alpha * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    for (const p of particles) {
      ctx.fillStyle = 'rgba(59,130,246,0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== MOBILE NAV TOGGLE ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== ACTIVE NAV HIGHLIGHT ==========
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav);

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ========== ANIMATED COUNTERS ==========
let countersDone = false;
const heroCard = document.querySelector('.hero-card');

function animateCounters() {
  if (countersDone) return;
  countersDone = true;

  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = current + suffix;
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = target + suffix;
      }
    }, duration / steps);
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
    }
  });
}, { threshold: 0.3 });

if (heroCard) counterObserver.observe(heroCard);

// ========== CERTIFICATIONS DATA ==========
const certifications = [
  {
    title: 'CRTP – Certified Red Team Professional',
    issuer: 'Altered Security',
    date: 'January 2026',
    image: 'image/CRTP.jpg',
    proof: 'Credential ID: 0d6a3790',
    link: 'https://www.credential.net/0d6a3790-31ad-479f-8d39-bb2b137c362f#acc.IwxeF4Um'
  },
  {
    title: 'eJPT – Junior Penetration Tester',
    issuer: 'INE',
    date: 'August 2025',
    image: 'image/eJPT.jpg',
    proof: 'Credential ID: fe373fe2',
    link: 'https://certs.ine.com/fe373fe2-8c13-4e7a-a823-a235ae2f9700#acc.gOsExWMA'
  },
  {
    title: 'CRTA – Certified Red Team Analyst',
    issuer: 'CyberWarFare Labs',
    date: 'September 2025',
    image: 'image/CRTA.jpg',
    proof: 'Credential verified',
    link: 'https://labs.cyberwarfare.live/credential/achievement/68c8dd1a40a4bd67bdcba0c7'
  },
  {
    title: 'CNSP – Certified Network Security Practitioner',
    issuer: 'Pentesting Exams',
    date: 'December 2025',
    image: 'image/CNSP.jpg',
    proof: 'Credential verified',
    link: 'https://candidate.speedexam.net/certificate.aspx?SSTATE=am4131EniU8ntjp4bO5mXWylSHxVEdPoseGvIue1kLosShxNyKFht9j+6povCfxxB/NerA5o6lpUfw3Via/ofwUtfItkU5c+P5IX8h8vM6E='
  }
];

// ========== ACHIEVEMENTS DATA ==========
const achievements = [
  {
    title: 'Hack Secure CTF WAR HOMELAB – 1st Place',
    issuer: 'Hack Secure',
    date: 'April 2025',
    image: 'image/cert.png',
    proof: 'First place in CTF competition',
    link: 'https://certificate.givemycertificate.com/c/9ed756ff-9ce6-4cf3-b3bf-f2e38574b8c3'
  },
  {
    title: 'Ranked Top 2% on TryHackMe',
    issuer: 'TryHackMe',
    date: '2025',
    image: 'image/THM.png',
    proof: 'Top 2% of all global users',
    link: 'https://tryhackme.com/p/rakibnadir'
  },
  {
    title: 'Script Kiddie Rank',
    issuer: 'Hack The Box',
    date: '2025',
    image: 'image/HTB.png',
    proof: 'Active Hack The Box member',
    link: 'https://app.hackthebox.com/users/2253987'
  }
];

// ========== RENDER CREDENTIALS ==========
function renderCredentials(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = data.map(item => `
        <div class="credential-card">
            <div class="credential-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="credential-body">
                <h4>${item.title}</h4>
                <p class="credential-issuer">${item.issuer}</p>
                <p class="credential-date">${item.date}</p>
                <p class="credential-proof">${item.proof}</p>
                ${item.link ? `<a href="${item.link}" class="credential-link" target="_blank" rel="noopener">Verify →</a>` : ''}
            </div>
        </div>
    `).join('');
}

renderCredentials(certifications, 'certifications-grid');
renderCredentials(achievements, 'achievements-grid');

// ========== MEDIUM RSS FETCH ==========
const MEDIUM_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rakib_nadir&count=3';

const fallbackPosts = [
  {
    title: 'Advanced PowerShell Security: Defense in Depth & Adversarial Bypasses',
    description: 'Deep dive into PowerShell security mechanisms, AMSI bypasses, constrained language mode, and script block logging from an offensive perspective.',
    thumbnail: 'image/powershell.webp',
    link: 'https://medium.com/@rakib_nadir'
  },
  {
    title: 'Hack The Box: Querier – Full Walkthrough',
    description: 'Complete walkthrough of HTB Querier — from MSSQL enumeration and xp_cmdshell exploitation to full domain compromise.',
    thumbnail: 'image/querier.webp',
    link: 'https://medium.com/@rakib_nadir'
  },
  {
    title: 'TryHackMe: Startup – CTF Write-Up',
    description: 'Detailed write-up for the TryHackMe Startup room covering FTP enumeration, reverse shells, and Linux privilege escalation.',
    thumbnail: 'image/startup.webp',
    link: 'https://medium.com/@rakib_nadir'
  }
];

function renderBlogPosts(posts) {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  blogGrid.innerHTML = posts.map(post => `
        <div class="blog-card">
            <div class="blog-card-image">
                <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
            </div>
            <div class="blog-card-body">
                <h4>${post.title}</h4>
                <p>${post.description}</p>
                <a href="${post.link}" class="blog-card-link" target="_blank" rel="noopener">Read Article →</a>
            </div>
        </div>
    `).join('');
}

async function fetchMediumPosts() {
  try {
    const res = await fetch(MEDIUM_RSS_URL);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const posts = data.items.slice(0, 3).map(item => {
        // Extract first image from content or use thumbnail
        let thumb = item.thumbnail || '';
        if (!thumb) {
          const match = item.description?.match(/<img[^>]+src=["']([^"']+)["']/);
          if (match) thumb = match[1];
        }
        // Strip HTML from description
        const div = document.createElement('div');
        div.innerHTML = item.description || '';
        const desc = div.textContent.substring(0, 180) + '...';

        return {
          title: item.title,
          description: desc,
          thumbnail: thumb || 'image/powershell.webp',
          link: item.link
        };
      });
      renderBlogPosts(posts);
    } else {
      throw new Error('Empty feed');
    }
  } catch (err) {
    console.log('Medium RSS fallback:', err.message);
    renderBlogPosts(fallbackPosts);
  }
}

fetchMediumPosts();

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Thanks ${name}! Your message has been received. I'll reply via sec.rakibnadir@gmail.com.`);
    contactForm.reset();
  });
}

// ========== FOOTER YEAR ==========
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
