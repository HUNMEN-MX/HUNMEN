/* =========================================================
   navegador.js — Control tipo Instagram para diapositivas
   =========================================================
   - Un solo gesto de deslizamiento (sin importar longitud)
     cambia de slide completa.
   - Evita rebotes, scroll parcial y depende solo de la dirección.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const slidesContainer = document.querySelector(".slides-container");
  const slides = document.querySelectorAll(".slide, .slidef");
  const dotsContainer = document.querySelector(".dots");

  if (!slidesContainer || slides.length === 0) return;

  let currentSlide = 0;
  let isTransitioning = false;
  let startY = 0;
  let currentY = 0;

  // Crear los indicadores (dots)
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll(".dot");

  // Función central de cambio de diapositiva
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    if (isTransitioning) return;

    isTransitioning = true;
    currentSlide = index;

    slides[index].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    updateDots();
    setTimeout(() => (isTransitioning = false), 800);
  }

  function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  }

  /* =========================
     CONTROL CON RUEDA (PC)
  ========================= */
  slidesContainer.addEventListener("wheel", (e) => {
    if (isTransitioning) return;
    e.preventDefault();
    if (e.deltaY > 0) goToSlide(currentSlide + 1);
    else if (e.deltaY < 0) goToSlide(currentSlide - 1);
  }, { passive: false });

  /* =========================
     CONTROL TÁCTIL (INSTAGRAM)
  ========================= */
  slidesContainer.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    currentY = startY;
  }, { passive: true });

  slidesContainer.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY;
  }, { passive: true });

  slidesContainer.addEventListener("touchend", () => {
    const deltaY = startY - currentY;

    // Sin importar longitud del swipe → cambia una sola diapositiva
    if (Math.abs(deltaY) > 10) {
      if (deltaY > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  /* =========================
     ACTUALIZAR DOTS EN SCROLL
  ========================= */
  slidesContainer.addEventListener("scroll", () => {
    clearTimeout(slidesContainer._scrollTimer);
    slidesContainer._scrollTimer = setTimeout(() => {
      const index = Math.round(slidesContainer.scrollTop / window.innerHeight);
      if (index !== currentSlide) {
        currentSlide = index;
        updateDots();
      }
    }, 100);
  });
});
