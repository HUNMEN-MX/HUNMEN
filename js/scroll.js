/* ======================== CONTROL DE SCROLL SUAVE ======================== */
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

/* ======================== SCROLL ANIMADO ======================== */
function scrollSuaveA(seccion, duracion = 800, callback) {
  const destino = seccion.offsetTop;
  const inicio = window.scrollY;
  const distancia = destino - inicio;
  let startTime = null;

  function animacion(currentTime) {
    if (!startTime) startTime = currentTime;
    const tiempoPasado = currentTime - startTime;
    const progreso = Math.min(tiempoPasado / duracion, 1);

    const ease = progreso < 0.5
      ? 2 * progreso * progreso
      : -1 + (4 - 2 * progreso) * progreso;

    window.scrollTo(0, inicio + distancia * ease);

    if (progreso < 1) {
      requestAnimationFrame(animacion);
    } else {
      if (callback) callback();
    }
  }

  requestAnimationFrame(animacion);
}

/* ======================== IR A SECCIÓN ======================== */
function irASeccion(i, callback) {
  if (i < 0 || i >= secciones.length) return;
  if (scrolling) return;

  if (menuAbierto()) {
    document.getElementById('menu-lateral')?.classList.remove('activo');
    document.getElementById('overlay')?.classList.remove('activo');
    document.body.style.overflow = "";
    document.documentElement.dataset.menuAbierto = "false";
  }

  scrolling = true;
  indice = i;
  scrollSuaveA(secciones[i], 800, () => {
    scrolling = false;
    if (callback) callback();
  });
}

/* ======================== SCROLL CON MOUSE ======================== */
window.addEventListener('wheel', e => {
  if (scrolling) return;
  if (menuAbierto()) return;

  if (e.deltaY > 0) {
    irASeccion(indice + 1);
  } else if (e.deltaY < 0) {
    irASeccion(indice - 1);
  }
});

/* ======================== SCROLL CON TECLAS ======================== */
window.addEventListener('keydown', e => {
  if (scrolling) return;
  if (menuAbierto()) return;

  if (e.key === 'ArrowDown') {
    irASeccion(indice + 1);
  } else if (e.key === 'ArrowUp') {
    irASeccion(indice - 1);
  }
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
let scrollingTouch = false; // bloquea scroll hasta terminar animación

document.addEventListener('touchstart', e => {
  if (scrollingTouch) return;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
  if (scrollingTouch) return;
  if (menuAbierto()) return;

  touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  const SWIPE_THRESHOLD = 30; // mínima distancia para considerar swipe

  if (diff > SWIPE_THRESHOLD) {
    scrollingTouch = true;
    irASeccion(indice + 1, () => scrollingTouch = false);
  } else if (diff < -SWIPE_THRESHOLD) {
    scrollingTouch = true;
    irASeccion(indice - 1, () => scrollingTouch = false);
  }
});
