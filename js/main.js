/* ======================== CARGA DE COMPONENTES ======================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ======================== CARGAR HEADER ======================== */
  fetch('/componentes/header-principal.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-principal').innerHTML = data;

      if (typeof activarScrollHeader === 'function') {
        activarScrollHeader();
      }

      intentarInicializarMenu();
    });

  /* ======================== CARGAR FOOTER ======================== */
  fetch('/componentes/footer.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('footer-general').innerHTML = data;
    });
});


/* ============================================================
   REINTENTO PARA ESPERAR A menu.js
   ============================================================ */
function intentarInicializarMenu(intentos = 0) {

  if (typeof window.initMenu === 'function') {
    window.initMenu();
    return;
  }

  if (intentos >= 10) {
    console.warn('⚠️ No fue posible inicializar el menú (initMenu no encontrado).');
    return;
  }

  setTimeout(() => intentarInicializarMenu(intentos + 1), 200);
}
