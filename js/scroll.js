/* ======================== SCROLL SUAVE Y CONTROLADO ======================== */

const secciones = document.querySelectorAll('.diapositiva');
let indice = 0;
let scrolling = false;  // Bloquea scroll mientras se mueve

// --- Si el menú está abierto, no permitir scroll entre secciones ---
function menuAbierto() {
  return document.documentElement.dataset.menuAbierto === "true"
         || document.getElementById('menu-lateral')?.classList.contains('activo');
}

/* ======================== ANIMACIONES Y INDICADORES ======================== */
const opciones = { threshold: 0.5 };
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');

      const id = entrada.target.id;
      document.querySelectorAll('.punto').forEach(p => p.classList.remove('activo'));
      document.querySelector(`.punto[data-seccion="${id}"]`)?.classList.add('activo');
    }
  });
}, opciones);

secciones.forEach(sec => observer.observe(sec));

/* ======================== ANIMACIÓN DE SCROLL ======================== */
function scrollSuaveA(seccion, duracion = 800) {
  const destino = seccion.offsetTop;
  const inicio = window.scrollY;
  const distancia = destino - inicio;
  let startTime = null;

  function animacion(currentTime) {
    if (!startTime) startTime = currentTime;
    const tiempoPasado = currentTime - startTime;
    const progreso = Math.min(tiempoPasado / duracion, 1);

    // Función de easing: easeInOutQuad
    const ease = progreso < 0.5
      ? 2 * progreso * progreso
      : -1 + (4 - 2 * progreso) * progreso;

    window.scrollTo(0, inicio + distancia * ease);

    if (progreso < 1) {
      requestAnimationFrame(animacion);
    } else {
      scrolling = false;
    }
  }

  requestAnimationFrame(animacion);
}

/* ======================== IR A SECCIÓN ======================== */
function irASeccion(i, duracion = 800) {
  if (i < 0 || i >= secciones.length) return;
  if (scrolling) return;

  // cerrar menú si abierto
  if (menuAbierto()) {
    document.getElementById('menu-lateral')?.classList.remove('activo');
    document.getElementById('overlay')?.classList.remove('activo');
    document.body.style.overflow = "";
    document.documentElement.dataset.menuAbierto = "false";
  }

  scrolling = true;
  indice = i;
  scrollSuaveA(secciones[i], duracion);
}

/* ======================== SCROLL CON MOUSE ======================== */
window.addEventListener('wheel', e => {
  if (scrolling || menuAbierto()) return;

  // ignorar micro-scrolls muy pequeños
  if (Math.abs(e.deltaY) < 50) return;

  const duracion = 1200; // más lento que teclado para suavizar
  if (e.deltaY > 0) irASeccion(indice + 1, duracion);
  else if (e.deltaY < 0) irASeccion(indice - 1, duracion);
});

/* ======================== SCROLL CON TECLAS ======================== */
window.addEventListener('keydown', e => {
  if (scrolling || menuAbierto()) return;

  const duracion = 800; // normal
  if (e.key === 'ArrowDown') irASeccion(indice + 1, duracion);
  else if (e.key === 'ArrowUp') irASeccion(indice - 1, duracion);
});

/* ======================== SCROLL CON INDICADORES LATERALES ======================== */
document.querySelectorAll('.punto').forEach(punto => {
  punto.addEventListener('click', () => {
    const id = punto.getAttribute('data-seccion');
    const seccion = document.getElementById(id);
    const idx = Array.from(secciones).indexOf(seccion);
    irASeccion(idx);
  });
});

/* ======================== SCROLL EN TOUCH (MÓVILES) ======================== */
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
  if (scrolling || menuAbierto()) return;

  touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  // solo pasar una diapositiva por swipe, mínimo 50px
  if (diff > 50) {
    irASeccion(indice + 1, 1200);
  } else if (diff < -50) {
    irASeccion(indice - 1, 1200);
  }
});
