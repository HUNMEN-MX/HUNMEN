/* ======================== MENÚ LATERAL FLOTANTE ======================== */
(function () {

  function initMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const menuLateral = document.getElementById("menu-lateral");
    const cerrarMenu = document.getElementById("cerrar-menu");
    const overlay = document.getElementById("overlay");

    // Evitar fallos si el header aún no está cargado
    if (!btnMenu || !menuLateral || !cerrarMenu || !overlay) return;

    // Evitar doble inicialización
    if (btnMenu.dataset.inited === "true") return;
    btnMenu.dataset.inited = "true";

    // --- Abrir menú ---
    btnMenu.addEventListener("click", () => {
      menuLateral.classList.add("activo");
      overlay.classList.add("activo");

      // Bloquear scroll (más compatible en móviles)
      document.body.style.overflow = "hidden";
      document.documentElement.dataset.menuAbierto = "true";
    });

    // --- Función para cerrar menú ---
    function cerrar() {
      menuLateral.classList.remove("activo");
      overlay.classList.remove("activo");

      // Restaurar scroll
      document.body.style.overflow = "";
      document.documentElement.dataset.menuAbierto = "false";
    }

    cerrarMenu.addEventListener("click", cerrar);
    overlay.addEventListener("click", cerrar);
  }

  // Disponible para cuando el header ya esté cargado
  window.initMenu = initMenu;

})();
(function () {
  function initMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const menuLateral = document.getElementById("menu-lateral");
    const cerrarMenu = document.getElementById("cerrar-menu");
    const overlay = document.getElementById("overlay");

    if (!btnMenu || !menuLateral || !cerrarMenu || !overlay) return;
    if (btnMenu.dataset.inited === "true") return;
    btnMenu.dataset.inited = "true";

    btnMenu.addEventListener("click", () => {
      menuLateral.classList.add("activo");
      overlay.classList.add("activo");
      document.body.style.overflow = "hidden";
    });

    function cerrar() {
      menuLateral.classList.remove("activo");
      overlay.classList.remove("activo");
      document.body.style.overflow = "";
    }

    cerrarMenu.addEventListener("click", cerrar);
    overlay.addEventListener("click", cerrar);
  }

  window.initMenu = initMenu;

  // Autoejecutar si el header ya estaba cargado antes
  if (document.readyState === "complete") {
    initMenu();
  }
})();
