/* =========================================================
   Rubrik AI · Main JS
   Animaciones del mockup + interacciones del hero
   ========================================================= */

(() => {
  // --- 1. Aparición secuencial de items del panel IA ---
  const aiItems = document.querySelectorAll('.ai-item');

  const revealItems = () => {
    aiItems.forEach((item) => {
      const delay = parseInt(item.dataset.delay || '0', 10);
      setTimeout(() => item.classList.add('is-visible'), delay);
    });
  };

  // --- 2. Animación del progress bar ---
  const aiFill = document.getElementById('aiFill');
  const aiPct = document.getElementById('aiPct');

  const animateProgress = (target = 84, duration = 2200) => {
    if (!aiFill || !aiPct) return;
    aiFill.style.width = '0%';
    aiPct.textContent = '0%';

    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = Math.round(eased * target);
      aiFill.style.width = val + '%';
      aiPct.textContent = val + '%';
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // --- 3. Disparar al cargar ---
  const startMockupAnimation = () => {
    revealItems();
    setTimeout(() => animateProgress(84), 100);
  };

  if (document.readyState === 'complete') {
    startMockupAnimation();
  } else {
    window.addEventListener('load', startMockupAnimation);
  }

  // --- 4. Reciclar animación cada cierto tiempo (efecto "vivo") ---
  setInterval(() => {
    aiItems.forEach((i) => i.classList.remove('is-visible'));
    setTimeout(startMockupAnimation, 400);
  }, 10000);

  // --- 5. Header con sombra al hacer scroll ---
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 8px 30px -10px rgba(0,0,0,0.6)';
      } else {
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- 6. Parallax sutil de glows del fondo con mouse ---
  const glows = document.querySelectorAll('.hero__glow');
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetX = x * 30;
    targetY = y * 30;
  });

  const animateGlows = () => {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    glows.forEach((g, i) => {
      const factor = (i + 1) * 0.6;
      g.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
    });

    requestAnimationFrame(animateGlows);
  };
  animateGlows();

  // --- 7. Tilt + flotación del mockup combinados ---
  const mockup = document.getElementById('appMockup');
  const stage = document.querySelector('.visual__stage');
  if (mockup && stage) {
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;
    let isHovering = false;
    const t0 = performance.now();

    stage.addEventListener('mousemove', (e) => {
      isHovering = true;
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tx = py * -6;
      ty = px * 12;
    });
    stage.addEventListener('mouseleave', () => {
      isHovering = false;
      tx = 0; ty = 0;
    });

    // Desactivamos la animación CSS porque la maneja el JS
    mockup.style.animation = 'none';

    const loop = (now) => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;

      // flotación vertical sutil cuando no hay hover
      const floatY = Math.sin((now - t0) / 1500) * 6;

      mockup.style.transform =
        `perspective(2200px) rotateY(${-10 + cy}deg) rotateX(${3 + cx}deg) translateY(${floatY}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
})();
