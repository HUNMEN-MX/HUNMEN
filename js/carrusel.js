// =========================================================
// js/carrusel.js — Carrusel por slide (multi-instancia)
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
  const carousels = Array.from(document.querySelectorAll('.carrusel'));

  carousels.forEach((carrusel) => {
    const track = carrusel.querySelector('.carrusel-track');
    const items = Array.from(carrusel.querySelectorAll('.carrusel-slide'));
    const btnPrev = carrusel.querySelector('.prev');
    const btnNext = carrusel.querySelector('.next');

    if (!track || items.length === 0) return;

    let idx = 0;
    let autoPlay = false;
    let autoTimer = null;
    let inactivityTimer = null;

    // Inicial: marcar visibilidad
    function refreshVisibility() {
      items.forEach((it, i) => it.classList.toggle('is-active', i === idx));
      // mostrar/ocultar botones si hay más de 1 imagen
      if (items.length <= 1) {
        if (btnPrev) btnPrev.classList.add('hidden');
        if (btnNext) btnNext.classList.add('hidden');
      } else {
        if (btnPrev) btnPrev.classList.remove('hidden');
        if (btnNext) btnNext.classList.remove('hidden');
      }
    }

    // Cambiar a slide i
    function goTo(i) {
      idx = (i + items.length) % items.length;
      refreshVisibility();
    }

    // Prev / Next
    function prev() {
      goTo(idx - 1);
      stopAuto();
      resetInactivityTimer();
    }
    function next() {
      goTo(idx + 1);
      stopAuto();
      resetInactivityTimer();
    }

    // Autoplay (opcional)
    function startAuto() {
      stopAuto();
      autoPlay = true;
      autoTimer = setInterval(() => {
        idx = (idx + 1) % items.length;
        refreshVisibility();
      }, 3000);
    }
    function stopAuto() {
      autoPlay = false;
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Inactividad (vuelve a autoplay si hay interacción nula)
    function resetInactivityTimer() {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!autoPlay && items.length > 1) startAuto();
      }, 3500);
    }

    // Eventos
    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    // Soporte swipe simple en móvil (touch)
    let touchStartX = null;
    track.addEventListener('touchstart', (e) => {
      stopAuto();
      touchStartX = e.changedTouches[0].clientX;
    }, {passive: true});
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - (touchStartX || 0);
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      touchStartX = null;
      resetInactivityTimer();
    });

    // keyboard navigation cuando el carrusel está en viewport (opcional)
    carrusel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // inicializar
    refreshVisibility();
    resetInactivityTimer();

    // start autoplay solo si hay más de 1 imagen
    if (items.length > 1) {
      // pequeña espera para no iniciar instantáneo en caso de interacción inmediata
      inactivityTimer = setTimeout(() => startAuto(), 2500);
    }
  });
});
