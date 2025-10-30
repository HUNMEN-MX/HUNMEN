/* ======================== CARGA DE COMPONENTES ======================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ======================== CARGAR HEADER ======================== */
  fetch('componentes/header-principal.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-principal').innerHTML = data;

      // Activar funciones del header (por ejemplo animaciones o estilos)
      if (typeof activarScrollHeader === 'function') {
        activarScrollHeader();
      }

      // Inicializar menú lateral (menu.js)
      intentarInicializarMenu();
    });

  /* ======================== CARGAR FOOTER ======================== */
  fetch('componentes/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-general').innerHTML = data;
    });
});


/* ============================================================
   FUNCIÓN DE SEGURIDAD PARA ESPERAR A QUE menu.js TERMINE DE CARGAR
   ============================================================ */
function intentarInicializarMenu(intentos = 0) {

  // Si la función existe, ejecutarla
  if (typeof window.initMenu === 'function') {
    window.initMenu();
    return;
  }

  // Evita bucles infinitos (10 intentos ≈ 2 segundos)
  if (intentos >= 10) {
    console.warn('⚠️ No fue posible inicializar el menú (initMenu no encontrado).');
    return;
  }

  // Reintentar después de un pequeño retraso
  setTimeout(() => intentarInicializarMenu(intentos + 1), 200);
}
