/* ==========================================================================
   Raíz — comportamiento base
   1) Excavación arrastrable (la "línea del suelo")
   1b) Menú móvil (cortina ink de pantalla completa, bajo 840px)
   1c) Video del hero: carga diferida + play/pausa por visibilidad
   2) Revelado al hacer scroll (hook para animaciones)
   Sin dependencias. Todo el estado visual vive en la variable CSS --suelo
   y en la clase .is-visible, así que puedes reemplazar/animar con GSAP,
   Motion One, Framer Motion, etc. sin tocar el HTML.
   ========================================================================== */

(function () {
  "use strict";

  /* --- 1. Excavación ---------------------------------------------------- */
  const MIN = 14;   // % mínimo de superficie
  const MAX = 86;   // % máximo
  const PASO = 5;   // % por pulsación de flecha

  document.querySelectorAll("[data-excavacion]").forEach(function (modulo) {
    const tirador = modulo.querySelector("[data-tirador]");
    if (!tirador) return;

    let nivel = parseFloat(modulo.dataset.suelo || "38");
    let arrastrando = false;

    function pintar() {
      modulo.style.setProperty("--suelo", nivel.toFixed(2) + "%");
      tirador.setAttribute("aria-valuenow", Math.round(nivel));
    }

    function fijar(v) {
      nivel = Math.max(MIN, Math.min(MAX, v));
      pintar();
    }

    function desdeEvento(e) {
      const r = modulo.getBoundingClientRect();
      fijar(((e.clientY - r.top) / r.height) * 100);
    }

    tirador.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      arrastrando = true;
      modulo.classList.add("is-dragging");
      tirador.focus();
    });

    window.addEventListener("pointermove", function (e) {
      if (arrastrando) desdeEvento(e);
    });

    ["pointerup", "pointercancel"].forEach(function (ev) {
      window.addEventListener(ev, function () {
        arrastrando = false;
        modulo.classList.remove("is-dragging");
      });
    });

    // Accesibilidad: flechas del teclado
    tirador.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); fijar(nivel + PASO); }
      if (e.key === "ArrowUp")   { e.preventDefault(); fijar(nivel - PASO); }
    });

    // Clic en cualquier punto del módulo: mueve el suelo hasta ahí
    modulo.addEventListener("click", function (e) {
      if (e.target.closest("[data-tirador]")) return;
      desdeEvento(e);
    });

    pintar();
  });

  /* --- 1b. Menú móvil ---------------------------------------------------- */
  const botonMenu = document.querySelector("[data-menu-boton]");
  const menuMovil = document.querySelector("[data-menu-movil]");
  if (botonMenu && menuMovil) {
    let focoPrevio = null;

    function cerrarMenu() {
      botonMenu.setAttribute("aria-expanded", "false");
      menuMovil.classList.remove("is-open");
      document.body.classList.remove("menu-abierto");
      if (focoPrevio) focoPrevio.focus();
    }
    function abrirMenu() {
      focoPrevio = document.activeElement;
      botonMenu.setAttribute("aria-expanded", "true");
      menuMovil.classList.add("is-open");
      document.body.classList.add("menu-abierto");
      const primero = menuMovil.querySelector("a");
      if (primero) primero.focus();
    }
    botonMenu.addEventListener("click", function () {
      const abierto = botonMenu.getAttribute("aria-expanded") === "true";
      if (abierto) cerrarMenu(); else abrirMenu();
    });
    menuMovil.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", cerrarMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { cerrarMenu(); return; }
      // Atrapa el foco dentro del menú mientras está abierto — sin esto,
      // Tab se escapa hacia el contenido de fondo, que sigue en el DOM.
      if (e.key === "Tab" && botonMenu.getAttribute("aria-expanded") === "true") {
        const focoables = [].slice.call(menuMovil.querySelectorAll("a, button"));
        if (!focoables.length) return;
        const primero = focoables[0];
        const ultimo = focoables[focoables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primero.focus();
        }
      }
    });
  }

  /* --- 1c. Video del hero -------------------------------------------------
     preload="none": el video no compite con el LCP. Arranca solo cuando el
     hero entra en pantalla (IntersectionObserver) y solo si el usuario no
     pidió menos movimiento. Se pausa al salir de vista y al ocultar la
     pestaña; retoma si vuelve a estar visible. El placeholder rayado
     (.hero__video-wrap, ver raiz.css) desaparece con .is-cargado, que se
     añade en el evento canplay. -------------------------------------------- */
  const heroVideoWrap = document.querySelector("[data-hero-video-wrap]");
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideoWrap && heroVideo) {
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    heroVideo.addEventListener("canplay", function () {
      heroVideo.classList.add("is-cargado");
    });

    if (sinMovimiento) {
      // Sin animación: se queda en el póster: nunca se pide ni se reproduce el video.
      heroVideo.classList.add("is-cargado");
    } else if ("IntersectionObserver" in window) {
      let enVista = false;

      // Si el navegador bloquea el autoplay (política de Safari, modo de bajo
      // consumo, etc.), .play() rechaza la promesa y canplay nunca llega —
      // sin este respaldo el placeholder rayado se quedaría para siempre.
      // Mejor mostrar el póster fijo que dejar el rayado roto.
      function reproducir() {
        heroVideo.play().catch(function () {
          heroVideo.classList.add("is-cargado");
        });
      }

      const observadorVideo = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          enVista = entrada.isIntersecting;
          if (enVista) reproducir();
          else heroVideo.pause();
        });
      }, { threshold: 0.25 });
      observadorVideo.observe(heroVideoWrap);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) heroVideo.pause();
        else if (enVista) reproducir();
      });
    }
  }

  /* --- 2. Revelado al entrar en pantalla -------------------------------- */
  const objetivos = document.querySelectorAll(".reveal, .banda-raices");
  if (!("IntersectionObserver" in window)) {
    objetivos.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("is-visible");
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  objetivos.forEach(function (el) { observador.observe(el); });
})();
