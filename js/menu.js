/* ======================== MENÚ LATERAL FLOTANTE ======================== */
(function () {
  function initMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const menuLateral = document.getElementById("menu-lateral");
    const cerrarMenu = document.getElementById("cerrar-menu");
    const overlay = document.getElementById("overlay");

    // Si no existen aún (porque el header no está cargado), salir
    if (!btnMenu || !menuLateral || !cerrarMenu || !overlay) return;

    // Evitar reinicializar si ya fue configurado
    if (btnMenu.dataset.inited === "true") return;
    btnMenu.dataset.inited = "true";

    // --- Abrir menú ---
    btnMenu.addEventListener("click", () => {
      menuLateral.classList.add("activo");
      overlay.classList.add("activo");
      document.body.style.overflow = "hidden"; // Bloquear scroll
      document.documentElement.dataset.menuAbierto = "true";
    });

    // --- Cerrar menú ---
    function cerrar() {
      menuLateral.classList.remove("activo");
      overlay.classList.remove("activo");
      document.body.style.overflow = "";
      document.documentElement.dataset.menuAbierto = "false";
    }

    cerrarMenu.addEventListener("click", cerrar);
    overlay.addEventListener("click", cerrar);
  }

  // Hacer disponible globalmente
  window.initMenu = initMenu;
})();
