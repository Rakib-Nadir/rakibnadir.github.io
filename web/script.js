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

  /** Reduce particle count on mobile for better perf */
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const PARTICLE_COUNT = isMobile ? 35 : 70;
  const MAX_DIST = 140;
  const SPEED = 0.3;

  /** Track rAF id so the loop can be paused / resumed */
  let animationId = null;

  /** Resize canvas to fill viewport */
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  /** Seed particle array */
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

  /** Main render loop — draws connecting lines + dots */
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

    animationId = requestAnimationFrame(draw);
  }

  /** Start (or restart) the animation loop */
  function startLoop() {
    if (animationId === null) {
      animationId = requestAnimationFrame(draw);
    }
  }

  /** Pause the animation loop */
  function stopLoop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // --- Initial boot ---
  resize();
  createParticles();
  startLoop();

  // --- Pause / resume when tab visibility changes ---
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  // --- Debounced resize (300 ms) ---
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 300);
  });
})();

// ========== EVERYTHING BELOW WAITS FOR DOM ==========
document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');

  // ========== MOBILE NAV TOGGLE ==========
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  /**
   * Create (once) an overlay element for the mobile menu.
   * It sits behind the open nav and closes it on tap.
   */
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  /** Open or close the mobile navigation drawer */
  function toggleMobileNav(forceClose) {
    const shouldOpen = forceClose === true ? false : !navLinks.classList.contains('open');

    hamburger.classList.toggle('active', shouldOpen);
    navLinks.classList.toggle('open', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMobileNav());

  // Close nav when clicking the overlay
  overlay.addEventListener('click', () => toggleMobileNav(true));

  // Close nav on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMobileNav(true);
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(true));
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

  /** Determine which section is in view and highlight its nav link */
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

  // ========== UNIFIED SCROLL HANDLER (rAF-throttled) ==========
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        // Navbar background toggle
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // Active section highlight
        highlightNav();
        ticking = false;
      });
    }
  });

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px -50px 0px' });

  /**
   * Observe all .reveal elements.
   * For items inside grid containers, assign a staggered --reveal-delay
   * custom property so CSS can pick it up for transition-delay.
   */
  revealElements.forEach(el => {
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
      if (siblings.length > 1) {
        const idx = siblings.indexOf(el);
        el.style.setProperty('--reveal-delay', `${idx * 0.1}s`);
      }
    }
    revealObserver.observe(el);
  });

  // ========== ANIMATED COUNTERS ==========
  let countersDone = false;
  const heroCard = document.querySelector('.hero-card');

  /** Animate stat-number elements from 0 → data-target */
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
      image: 'certifications/CRTP.jpg',
      proof: 'Credential ID: 0d6a3790',
      link: 'https://www.credential.net/0d6a3790-31ad-479f-8d39-bb2b137c362f#acc.IwxeF4Um',
      status: 'completed'
    },
    {
      title: 'CRTO – Certified Red Team Operator',
      issuer: 'Zero-Point Security',
      date: '2026',
      image: '',
      proof: 'IN PROGRESS',
      link: '',
      status: 'in-progress'
    },
    {
      title: 'CRTA – Certified Red Team Analyst',
      issuer: 'CyberWarFare Labs',
      date: 'September 2025',
      image: 'certifications/CRTA.jpg',
      proof: 'Credential ID: 68c8dd1a40a4bd67bdcba0c7',
      link: 'https://labs.cyberwarfare.live/credential/achievement/68c8dd1a40a4bd67bdcba0c7',
      status: 'completed'
    },
    {
      title: 'eJPTv2 – Junior Penetration Tester',
      issuer: 'INE',
      date: 'August 2025',
      image: 'certifications/eJPT.jpg',
      proof: 'Credential ID: fe373fe2',
      link: 'https://certs.ine.com/fe373fe2-8c13-4e7a-a823-a235ae2f9700#acc.gOsExWMA',
      status: 'completed'
    },
    {
      title: 'CNSP – Certified Network Security Practitioner',
      issuer: 'The SecOps Group',
      date: 'December 2025',
      image: 'certifications/CNSP.jpg',
      proof: 'Credential verified',
      link: 'https://candidate.speedexam.net/certificate.aspx?SSTATE=am4131EniU8ntjp4bO5mXWylSHxVEdPoseGvIue1kLosShxNyKFht9j+6povCfxxB/NerA5o6lpUfw3Via/ofwUtfItkU5c+P5IX8h8vM6E=',
      status: 'completed'
    },
    {
      title: 'CSEDP – Certified Social Engineering Defense Practitioner',
      issuer: 'The SecOps Group',
      date: 'April 2026',
      image: 'certifications/CSEDP.jpg',
      proof: 'Credential ID: 11260182',
      link: 'https://candidate.speedexam.net/certificate.aspx?SSTATE=am4131EniU8ntjp4bO5mXVKc/cK44yoRnfbr17DuPzuJQUmW+P5M7vDOM8OBNnLlXsDoF9eZV0Mhi27G3t2jtWVSeEoq7OrFngttX3fEE0E=',
      status: 'completed'
    },
    {
      title: 'CJWPT – Certified Junior Web Penetration Tester',
      issuer: 'Hack & Fix',
      date: 'August 2025',
      image: 'certifications/CJWPT.jpg',
      proof: '',
      credentialId: '2091-5349-7151-6117',
      link: '',
      status: 'completed'
    },
    {
      title: 'AI 100: Fundamentals',
      issuer: 'TCM Security',
      date: 'March 2026',
      image: 'certifications/AI Fundamentals.jpg',
      proof: '',
      credentialId: 'cert_277wdj5j',
      link: '',
      status: 'completed'
    },
    {
      title: 'Practical Help Desk',
      issuer: 'TCM Security',
      date: '2026',
      image: 'certifications/Practical Help Desk.jpg',
      proof: '',
      credentialId: 'cert_bcqgb21v',
      link: '',
      status: 'completed'
    },
    {
      title: 'Pen Testing Short Course',
      issuer: 'IT Masters x Charles Sturt University',
      date: 'April 2025',
      image: 'certifications/pen testing.jpg',
      proof: '',
      link: '',
      status: 'completed'
    },
    {
      title: 'Networking Certification Essentials',
      issuer: 'IT Masters',
      date: '2025',
      image: 'certifications/networking certification essentials.jpg',
      proof: '',
      link: '',
      status: 'completed'
    }
  ];

  // ========== ACHIEVEMENTS DATA ==========
  const achievements = [
    {
      title: 'Hall of Fame — Federal Courts of the United States',
      issuer: 'Federal Courts of the United States (Synack)',
      date: 'June 2026',
      image: 'Achievement & Awards/US_Courts_merged.png',
      proof: 'Responsible disclosure via Synack — confirmed, patched & verified',
      link: 'https://uscourts.responsibledisclosure.com/hc/en-us/articles/1500013079781-Acknowledgments',
      status: 'completed'
    },
    {
      title: 'Hall of Fame — U.S. Department of Education',
      issuer: 'U.S. Department of Education (Synack)',
      date: 'June 2026',
      image: 'Achievement & Awards/US department of education.png',
      proof: 'Responsible disclosure via Synack — confirmed, patched & verified',
      link: 'https://www.synack.us/vdp/ed/acknowledgements/',
      status: 'completed'
    },
    {
      title: 'Acknowledged Security Contributor — Slapfive',
      issuer: 'Slapfive',
      date: 'May 2026',
      image: 'Achievement & Awards/slap five.jpg',
      proof: 'Vulnerability on auth.slapfive.com — tracked as SL-10462',
      link: '',
      status: 'completed'
    },
    {
      title: 'Hall of Fame — U.S. Department of Health and Human Services (HHS)',
      issuer: 'HHS Responsible Disclosure Program (Synack)',
      date: 'May 2026',
      image: 'Achievement & Awards/HHS_merged.png',
      proof: 'Responsible disclosure via Synack — confirmed, patched & verified',
      link: 'https://hhs.responsibledisclosure.com/hc/en-us/articles/1500000280921-Acknowledgments',
      status: 'completed'
    },
    {
      title: 'Acknowledged Security Contributor – World Bank Group',
      issuer: 'World Bank Group',
      date: 'April 2026',
      image: 'Achievement & Awards/World Bank VDP.png',
      proof: 'Broken link hijacking — VDP-2026-1027',
      link: '',
      status: 'completed'
    },
    {
      title: 'Hack Secure CTF WAR HOMELAB – 1st Place',
      issuer: 'Hack Secure',
      date: 'April 2025',
      image: 'image/cert.png',
      proof: 'First place in CTF competition',
      link: 'https://certificate.givemycertificate.com/c/9ed756ff-9ce6-4cf3-b3bf-f2e38574b8c3',
      status: 'completed'
    },
    {
      title: 'TryHackMe Top 1%',
      issuer: 'TryHackMe',
      date: '2025',
      image: 'image/THM.png',
      proof: 'Top 1% of all global users',
      link: 'https://tryhackme.com/p/rakibnadir',
      status: 'completed'
    },
    {
      title: 'HTB Script Kiddie',
      issuer: 'Hack The Box',
      date: '2025',
      image: 'image/HTB.png',
      proof: 'Active Hack The Box member',
      link: 'https://app.hackthebox.com/users/2253987',
      status: 'completed'
    }
  ];

  // ========== RENDER CREDENTIALS ==========
  /**
   * Render a credential/achievement data array into the target container.
   * @param {Array} data — array of credential objects
   * @param {string} containerId — DOM id of the target grid container
   */
  function renderCredentials(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(item => {
      const isInProgress = item.status === 'in-progress';
      const cardClass = isInProgress ? 'credential-card credential-in-progress' : 'credential-card';
      const imageHTML = item.image
        ? `<img src="${item.image}" alt="${item.title}" loading="lazy">`
        : `<div class="placeholder-frame"><span>${isInProgress ? 'In Progress' : 'Image coming soon'}</span></div>`;
      const statusBadge = isInProgress
        ? `<span class="credential-status-badge">IN PROGRESS</span>`
        : '';

      // Determine verify element: URL → clickable link, ID only → plain text, neither → nothing
      let verifyHTML = '';
      if (item.link) {
        verifyHTML = `<a href="${item.link}" class="credential-link" target="_blank" rel="noopener">Verify →</a>`;
      } else if (item.credentialId) {
        verifyHTML = `<span class="credential-link" style="cursor: default; text-decoration: none;">ID: ${item.credentialId}</span>`;
      }

      return `
        <div class="${cardClass}">
            <div class="credential-image">
                ${imageHTML}
            </div>
            <div class="credential-body">
                <h4>${item.title}</h4>
                ${statusBadge}
                <p class="credential-issuer">${item.issuer}</p>
                <p class="credential-date">${item.date}</p>
                ${item.proof ? `<p class="credential-proof">${item.proof}</p>` : ''}
                ${verifyHTML}
            </div>
        </div>
    `;
    }).join('');
  }

  // ========== CERTIFICATIONS PAGINATION & INITIALIZATION ==========
  const certsPerPage = 6;
  let showAllCerts = false;

  /** Render certifications based on pagination state */
  function initCertifications() {
    const toggleBtn = document.getElementById('toggle-certs-btn');
    const dataToRender = showAllCerts ? certifications : certifications.slice(0, certsPerPage);
    renderCredentials(dataToRender, 'certifications-grid');

    if (toggleBtn) {
      if (certifications.length <= certsPerPage) {
        toggleBtn.style.display = 'none';
      } else {
        toggleBtn.style.display = 'inline-flex';
        toggleBtn.textContent = showAllCerts ? 'Show Less' : 'Show More Certifications';
      }
    }
  }

  // Bind toggle click listener
  const toggleCertsBtn = document.getElementById('toggle-certs-btn');
  if (toggleCertsBtn) {
    toggleCertsBtn.addEventListener('click', () => {
      showAllCerts = !showAllCerts;
      initCertifications();
      
      // If closing, scroll smoothly to the certifications section header
      if (!showAllCerts) {
        const certsHeader = document.getElementById('credentials');
        if (certsHeader) {
          certsHeader.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Initial rendering calls
  initCertifications();
  renderCredentials(achievements, 'achievements-grid');

  // ========== MEDIUM RSS FETCH ==========
  const MEDIUM_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rakib_nadir&count=4';

  const fallbackPosts = [
    {
      title: 'Adversarial LLM Security: Prompt Injection & Model Fingerprinting',
      description: 'How I tested five Ollama-hosted LLMs with Garak v0.14, fingerprinted a live chatbot backend using LLMap, and mapped findings to OWASP LLM Top 10.',
      thumbnail: 'image/powershell.webp',
      link: 'https://medium.com/@rakib_nadir'
    },
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

  /**
   * Render blog post cards into the #blog-grid container.
   * @param {Array} posts — array of {title, description, thumbnail, link}
   */
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

  /** Fetch latest posts from Medium RSS; fall back to static data on error */
  async function fetchMediumPosts() {
    try {
      const res = await fetch(MEDIUM_RSS_URL);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const posts = data.items.slice(0, 4).map(item => {
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

  // fetchMediumPosts();

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

}); // end DOMContentLoaded
