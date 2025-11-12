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

  // Desplaza suavemente la diapositiva al centro de la vista
setTimeout(() => {
  slides[index].scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}, 50);

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

// Swipe control tipo Instagram — siempre una diapositiva por gesto (sin bloquear scroll nativo)
let isSwiping = false;


slidesContainer.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
  isSwiping = false;
}, { passive: true });

slidesContainer.addEventListener("touchmove", (e) => {
  const deltaY = startY - e.touches[0].clientY;
  if (Math.abs(deltaY) > 50 && !isSwiping) {
    isSwiping = true;
    if (deltaY > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
}, { passive: true });

slidesContainer.addEventListener("touchend", () => {
  isSwiping = false;
});

// Evitar rebote y actualizar dots al hacer scroll
slidesContainer.addEventListener("scroll", () => {
  const maxScroll = slidesContainer.scrollHeight - window.innerHeight;

  if (slidesContainer.scrollTop <= 0) {
    slidesContainer.scrollTop = 0;
  } else if (slidesContainer.scrollTop >= maxScroll) {
    slidesContainer.scrollTop = maxScroll;
  }

  const index = Math.round(slidesContainer.scrollTop / window.innerHeight);
  if (index !== currentSlide) {
    currentSlide = index;
    updateDots();
  }
});
