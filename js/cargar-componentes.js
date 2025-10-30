/* ======================== CARGA DE COMPONENTES ======================== */
document.addEventListener('DOMContentLoaded', () => {

  // Cargar HEADER
  fetch('../componentes/header-general.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-general').innerHTML = data;

      // Activar funciones del header (por ejemplo animaciones o estilos)
      if (typeof activarScrollHeader === 'function') {
        activarScrollHeader();
      }

      // Inicializar menú lateral (definido en menu.js)
      if (typeof window.initMenu === 'function') {
        window.initMenu();
      } else {
        // Si menu.js aún no se ha cargado, intentar de nuevo
        setTimeout(() => {
          if (typeof window.initMenu === 'function') window.initMenu();
        }, 200);
      }
    });

  // Cargar FOOTER
  fetch('../componentes/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-general').innerHTML = data;
    });
});

