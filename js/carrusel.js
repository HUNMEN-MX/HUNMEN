// >>> js/carrusel.js (opcional, ligero y seguro)
// Coloca este archivo en /js y enlázalo con: <script src="js/carrusel.js" defer></script>

document.addEventListener('DOMContentLoaded', function () {
  // Para cada carrusel en la página (permite reutilizar el componente)
  document.querySelectorAll('.carrusel').forEach(carrusel => {
    const slides = Array.from(carrusel.querySelectorAll('.slide'));
    const prev = carrusel.querySelector('.prev');
    const next = carrusel.querySelector('.next');
    let index = slides.findIndex(s => s.classList.contains('active'));
    if (index === -1) index = 0; // si no hay .active, empezamos en 0

    // Si solo hay una slide: no mostramos controles y dejamos esa imagen fija
    if (slides.length <= 1) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      // aseguramos que al menos una slide esté visible
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      return;
    }

    // Si hay más de una slide: mostramos controles
    if (prev) prev.style.display = 'block';
    if (next) next.style.display = 'block';

    function show(i) {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    }

    // eventos de flechas (si existen)
    if (prev) prev.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      show(index);
    });

    if (next) next.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      show(index);
    });

    // inicializa mostrando la slide actual
    show(index);
  });
});


