/* =========================================================
   navegador.js — Control global de transiciones tipo diapositiva
   =========================================================
   Este script aplica el comportamiento de desplazamiento vertical
   entre diapositivas (scroll y swipe) a cualquier página del sitio
   que contenga un contenedor con clase .slides-container y secciones
   .slide de altura completa.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const slidesContainer = document.querySelector(".slides-container");
  const slides = document.querySelectorAll(".slide, .slidef");
  const dotsContainer = document.querySelector(".dots");

  // Verifica que existan diapositivas en la página
  if (!slidesContainer || slides.length === 0) return;

  let currentSlide = 0;
  let isScrolling = false;
  let startY = 0;

  // Crear los indicadores (dots)
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll(".dot");

  // Ir a una diapositiva específica
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;
    slidesContainer.scrollTo({
      top: slides[index].offsetTop,
      behavior: "smooth",
    });
    updateDots();
  }

  // Actualizar los indicadores visuales
  function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  }

  // Desplazamiento con rueda del ratón
  slidesContainer.addEventListener("wheel", (event) => {
    if (isScrolling) return;
    isScrolling = true;
    setTimeout(() => (isScrolling = false), 800); // control del tiempo entre scrolls

    if (event.deltaY > 0) goToSlide(currentSlide + 1);
    else if (event.deltaY < 0) goToSlide(currentSlide - 1);
  });

// Control táctil (swipe mejorado tipo Instagram)
let isSwiping = false;

slidesContainer.addEventListener("touchstart", (e) => {
  if (isScrolling || isSwiping) return;
  startY = e.touches[0].clientY;
});

slidesContainer.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });

slidesContainer.addEventListener("touchend", (e) => {
  if (isScrolling || isSwiping) return;

  const endY = e.changedTouches[0].clientY;
  const diff = startY - endY;

  if (Math.abs(diff) < 50) return;

  isSwiping = true;
  if (diff > 0) goToSlide(currentSlide + 1);
  else goToSlide(currentSlide - 1);

  setTimeout(() => { isSwiping = false; }, 800);
});

  // ⬇⬇ AGREGADO — Actualizar dots en scroll con teclado, rueda o arrastre manual
  slidesContainer.addEventListener("scroll", () => {
    let index = 0;

    slides.forEach((slide, i) => {
      const slideTop = slide.offsetTop;
      if (slidesContainer.scrollTop >= slideTop - window.innerHeight / 2) {
        index = i;
      }
    });

    if (index !== currentSlide) {
      currentSlide = index;
      updateDots();
    }
  });
  // ⬆⬆ FIN DE LO AGREGADO
  // Navegación con teclado (solo en escritorio)
  document.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    // Evita repetir la acción si se deja presionada la tecla
    if (e.repeat) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    }

    if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

});