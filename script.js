/* =====================================================
   PORTFOLIO - DARK MINIMALIST
   script.js
   ===================================================== */

/* =====================================================
   1. CANVAS ANIMATED BACKGROUND
   ===================================================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  let mouse = { x: -9999, y: -9999 };

  /* Resize canvas to full window */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Track mouse position */
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ----- Particles ----- */
  var PARTICLE_COUNT = 80;
  var particles = [];

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (init) {
    this.x       = Math.random() * W;
    this.y       = init ? Math.random() * H : H + 10;
    this.vx      = (Math.random() - 0.5) * 0.3;
    this.vy      = -(Math.random() * 0.5 + 0.1);
    this.size    = Math.random() * 1.5 + 0.3;
    this.life    = 0;
    this.maxLife = Math.random() * 300 + 200;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;

    var t = this.life / this.maxLife;
    this.alpha = (t < 0.1 ? t * 5 : t > 0.8 ? (1 - t) * 5 : 1) * 0.45;

    /* Mouse repulsion */
    var dx   = this.x - mouse.x;
    var dy   = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      var force = (120 - dist) / 120 * 0.4;
      this.vx  += (dx / dist) * force;
      this.vy  += (dy / dist) * force;
    }

    this.vx *= 0.99;
    this.vy *= 0.99;

    if (this.life >= this.maxLife || this.y < -10) {
      this.reset(false);
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = '#00ff88';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  /* ----- Grid Lines ----- */
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.03)';
    ctx.lineWidth   = 1;
    var spacing = 80;
    for (var x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  /* ----- Glow Orbs ----- */
  var orbs = [
    { x: 0.15, y: 0.3,  r: 350, c: 'rgba(0,255,136,0.04)' },
    { x: 0.85, y: 0.7,  r: 400, c: 'rgba(0,255,136,0.03)' },
    { x: 0.5,  y: 0.1,  r: 250, c: 'rgba(0,255,136,0.03)' }
  ];
  var orbTime = 0;

  function drawOrbs() {
    orbTime += 0.003;
    orbs.forEach(function (o, i) {
      var px   = W * o.x + Math.sin(orbTime + i * 1.5) * 60;
      var py   = H * o.y + Math.cos(orbTime + i * 1.2) * 40;
      var grad = ctx.createRadialGradient(px, py, 0, px, py, o.r);
      grad.addColorStop(0, o.c);
      grad.addColorStop(1, 'transparent');
      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /* ----- Connection Lines ----- */
  function drawConnections() {
    ctx.save();
    ctx.lineWidth = 0.5;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = '#00ff88';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  /* ----- Shooting Stars ----- */
  var stars     = [];
  var starTimer = 0;

  function ShootingStar() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H * 0.5;
    this.len   = Math.random() * 120 + 60;
    this.speed = Math.random() * 6 + 4;
    this.angle = (Math.random() * 30 + 15) * Math.PI / 180;
    this.alpha = 1;
    this.done  = false;
  }

  ShootingStar.prototype.update = function () {
    this.x    += Math.cos(this.angle) * this.speed;
    this.y    += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.015;
    if (this.alpha <= 0) this.done = true;
  };

  ShootingStar.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha * 0.6;
    var grad = ctx.createLinearGradient(
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len,
      this.x, this.y
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, '#00ff88');
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  };

  /* ----- Main Animation Loop ----- */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawOrbs();
    drawConnections();

    particles.forEach(function (p) { p.update(); p.draw(); });

    starTimer++;
    if (starTimer > 180 && Math.random() < 0.025) {
      stars.push(new ShootingStar());
      starTimer = 0;
    }
    for (var i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].draw();
      if (stars[i].done) stars.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();


/* =====================================================
   2. TYPED TEXT ANIMATION
   ===================================================== */
(function () {
  var texts = [
    'Web Developer',
    'Software Engineer',
    'AI Enggineer',
    'Problem Solver'
  ];
  var textIndex  = 0;
  var charIndex  = 0;
  var isDeleting = false;
  var el         = document.getElementById('typed');

  function type() {
    var current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      delay      = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex  = (textIndex + 1) % texts.length;
      delay      = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
})();


/* =====================================================
   3. NAVBAR — SCROLL BEHAVIOR
   ===================================================== */
(function () {
  var nav = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();


/* =====================================================
   4. HAMBURGER MOBILE MENU
   ===================================================== */
(function () {
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
    });
  });
})();


/* =====================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ===================================================== */
(function () {
  /* General reveal elements */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Timeline items */
  var timelineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.timeline-item').forEach(function (el) {
    timelineObserver.observe(el);
  });
})();


/* =====================================================
   6. ACTIVE NAV LINK ON SCROLL
   ===================================================== */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    var current = '';

    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--green)';
      }
    });
  });
})();


/* =====================================================
   7. CONTACT FORM SUBMISSION
   ===================================================== */
function handleSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-kirim-pesan');
  btn.textContent = 'Mengirim...';
  btn.disabled    = true;

  setTimeout(function () {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1500);
}


/* =====================================================
   8. CURSOR GLOW EFFECT
   ===================================================== */
(function () {
  var glow = document.createElement('div');
  glow.style.cssText = [
    'position: fixed',
    'width: 300px',
    'height: 300px',
    'border-radius: 50%',
    'background: radial-gradient(circle, rgba(0,255,136,0.04), transparent 70%)',
    'pointer-events: none',
    'z-index: 1',
    'transform: translate(-50%, -50%)',
    'transition: left 0.1s ease, top 0.1s ease'
  ].join(';');
  document.body.appendChild(glow);

  window.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* =====================================================
   9. CARD SHINE ON HOVER
   ===================================================== */
document.querySelectorAll('.skill-card, .project-card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var rect = card.getBoundingClientRect();
    var x    = ((e.clientX - rect.left) / rect.width)  * 100;
    var y    = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background =
      'radial-gradient(circle at ' + x + '% ' + y + '%, ' +
      'rgba(0,255,136,0.05) 0%, var(--black-3) 60%)';
  });

  card.addEventListener('mouseleave', function () {
    card.style.background = '';
  });
});


/* =====================================================
   10. STAT BADGE COUNTER ANIMATION
   ===================================================== */
(function () {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var current = 0;
        var step    = target / 40;

        var timer = setInterval(function () {
          current += step;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + '+';
          }
        }, 40);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(function (el) {
    el.dataset.target = parseInt(el.textContent, 10);
    counterObserver.observe(el);
  });
})();
