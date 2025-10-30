/* js/main.js - carga header/footer con fallback y normaliza rutas */
document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    try {
      const headerHtml = await fetchAny([
        '/componentes/header-principal.html',
        '/componentes/header-principal.html'.trim(),
      ], 'header-principal.html');

      if (headerHtml) {
        document.getElementById('header-principal').innerHTML = headerHtml;
        normalizeAssetsIn(document.getElementById('header-principal'));
      } else {
        console.error('No se encontró header-principal.html en ninguna ruta probada.');
      }

      // activar funciones del header si existen
      if (typeof activarScrollHeader === 'function') activarScrollHeader();

      // intentar inicializar menú
      intentarInicializarMenu();

      const footerHtml = await fetchAny([
        '/componentes/footer.html',
        'componentes/footer.html',
        '../componentes/footer.html'
      ], 'footer.html');

      if (footerHtml) {
        document.getElementById('footer-general').innerHTML = footerHtml;
        normalizeAssetsIn(document.getElementById('footer-general'));
      } else {
        console.error('No se encontró footer.html en ninguna ruta probada.');
      }

    } catch (err) {
      console.error('Error en carga de componentes:', err);
    }
  })();
});

/** Intenta varias rutas hasta obtener respuesta ok. Devuelve texto o null */
async function fetchAny(paths, label = '') {
  for (const p of paths) {
    try {
      const res = await fetch(p, {cache: "no-store"});
      if (res.ok) {
        console.log(`fetch ${label}: cargado desde -> ${p}`);
        return await res.text();
      } else {
        console.warn(`fetch ${label}: ${p} -> ${res.status}`);
      }
    } catch (err) {
      console.warn(`fetch ${label}: fallo petición a ${p}`, err);
    }
  }
  return null;
}

/** Normaliza src/href dentro de un contenedor: hace rutas absolutas desde la raíz */
function normalizeAssetsIn(container) {
  if (!container) return;

  // normaliza imágenes
  const imgs = container.querySelectorAll('img');
  imgs.forEach(img => {
    const original = img.getAttribute('src') || '';
    const normalized = normalizePathToRoot(original);
    if (normalized !== original) {
      img.setAttribute('src', normalized);
      // si existe srcset u otros atributos, podríamos normalizarlos también
    }
  });

  // normaliza enlaces (href) que apunten a recursos locales
  const anchors = container.querySelectorAll('a[href]');
  anchors.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // no tocar enlaces externos (http, mailto, tel)
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return;
    const normalized = normalizePathToRoot(href);
    if (normalized !== href) {
      a.setAttribute('href', normalized);
    }
  });

  // normaliza background images inline (style attribute)
  const elems = container.querySelectorAll('[style]');
  elems.forEach(el => {
    const style = el.getAttribute('style');
    if (!style) return;
    const newStyle = style.replace(/url\((['"]?)(?!https?:|\/)(.*?)\1\)/g, (m, q, path) => {
      // path might start with ../ or ./ or simple name
      return `url(${normalizePathToRoot(path)})`;
    });
    if (newStyle !== style) el.setAttribute('style', newStyle);
  });
}

/** Convierte rutas relativas en rutas absolutas desde la raíz del sitio
 * ejemplos:
 *   ../imagenes/x.svg -> /imagenes/x.svg
 *   ./imagenes/x.svg  -> /imagenes/x.svg
 *   imagenes/x.svg    -> /imagenes/x.svg
 *   /imagenes/x.svg   -> /imagenes/x.svg (se deja)
 */
function normalizePathToRoot(path) {
  if (!path) return path;
  // deja intactas rutas absolutas y externas
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('/')) return path;

  // quita todos los prefijos ../ o ./
  let p = path;
  while (p.startsWith('../')) p = p.substring(3);
  if (p.startsWith('./')) p = p.substring(2);

  // ahora p es algo como imagenes/..., componentes/..., index.html, etc.
  // lo convertimos a / + p
  return '/' + p;
}

/* ============================================================
   Reintentos para esperar a que menu.js defina window.initMenu
   ============================================================ */
function intentarInicializarMenu(intentos = 0) {
  if (typeof window.initMenu === 'function') {
    try {
      window.initMenu();
    } catch (err) {
      console.warn('initMenu() lanzó excepción:', err);
    }
    return;
  }

  if (intentos >= 15) {
    console.warn('No fue posible inicializar el menú (initMenu no encontrado tras varios intentos).');
    return;
  }

  setTimeout(() => intentarInicializarMenu(intentos + 1), 200);
}
