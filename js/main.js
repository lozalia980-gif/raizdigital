/* =========================================================
   Raíz Digital - JavaScript
   Aquí está todo lo interactivo de la página.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tieneMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. Menú para celular ---------- */
  var btnMenu = document.querySelector(".btn-menu");
  var menu = document.querySelector(".menu");

  if (btnMenu && menu) {
    btnMenu.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto);
      btnMenu.querySelector("i").className = abierto ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });
    // si se toca un enlace, se cierra el menú
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("abierto");
        btnMenu.querySelector("i").className = "fa-solid fa-bars";
      });
    });
  }

  /* ---------- 2. Imágenes que no cargan ---------- */
  // si una foto falla, se pinta el cuadro con un degradado para que no se vea roto
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.parentElement) img.parentElement.classList.add("sin-imagen");
    });
  });

  /* ---------- 3. Aparecer elementos al hacer scroll ---------- */
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal, .destapar").forEach(function (el, i) {
    // un pequeño retraso para las tarjetas que están en fila
    if (el.classList.contains("reveal")) el.style.transitionDelay = (i % 3) * 0.1 + "s";
    observador.observe(el);
  });

  // respaldo: si por alguna razón algo no se activó, se muestra igual a los 4 segundos
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.visible), .destapar:not(.visible)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("visible");
    });
  }, 4000);

  /* ---------- 4. Barra de progreso, sombra del header y parallax ---------- */
  var barra = document.querySelector(".progreso-lectura");
  var header = document.querySelector(".encabezado");
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  var esperando = false;

  function alHacerScroll() {
    var scroll = window.scrollY;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    if (barra && alto > 0) barra.style.width = (scroll / alto) * 100 + "%";
    if (header) header.classList.toggle("sombra", scroll > 10);

    if (!reducirMovimiento) {
      parallaxEls.forEach(function (el) {
        var caja = el.parentElement.getBoundingClientRect();
        // solo se mueve si está visible en pantalla
        if (caja.bottom > 0 && caja.top < window.innerHeight) {
          var velocidad = parseFloat(el.getAttribute("data-parallax"));
          var centro = caja.top + caja.height / 2 - window.innerHeight / 2;
          el.style.transform = "translateY(" + (centro * velocidad * -1) + "px)";
        }
      });
    }
    esperando = false;
  }

  window.addEventListener("scroll", function () {
    if (!esperando) {
      esperando = true;
      requestAnimationFrame(alHacerScroll);
    }
  }, { passive: true });
  alHacerScroll();

  /* ---------- 5. Cursor personalizado ---------- */
  if (tieneMouse && !reducirMovimiento) {
    var punto = document.createElement("div");
    var aro = document.createElement("div");
    punto.className = "cursor-punto";
    aro.className = "cursor-aro";
    document.body.appendChild(punto);
    document.body.appendChild(aro);
    document.body.classList.add("con-cursor");

    var mx = 0, my = 0, ax = 0, ay = 0;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      punto.style.transform = "translate(" + mx + "px," + my + "px)";
    });

    // el aro va un poquito atrasado para que se vea suave
    function seguir() {
      ax += (mx - ax) * 0.15;
      ay += (my - ay) * 0.15;
      aro.style.transform = "translate(" + ax + "px," + ay + "px)";
      requestAnimationFrame(seguir);
    }
    seguir();

    // el aro cambia según lo que tenga debajo
    document.querySelectorAll("a, button, label, .filtro").forEach(function (el) {
      el.addEventListener("mouseenter", function () { aro.classList.add("sobre-link"); });
      el.addEventListener("mouseleave", function () { aro.classList.remove("sobre-link"); });
    });
    document.querySelectorAll(".foto, .hero-foto .marco, .dividido-img").forEach(function (el) {
      el.addEventListener("mouseenter", function () { aro.classList.add("sobre-foto"); });
      el.addEventListener("mouseleave", function () { aro.classList.remove("sobre-foto"); });
    });
  }

  /* ---------- 6. Imágenes que se inclinan con el mouse ---------- */
  if (tieneMouse && !reducirMovimiento) {
    document.querySelectorAll(".inclinar").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(800px) rotateY(" + (x * 10) + "deg) rotateX(" + (y * -10) + "deg) scale(1.02)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- 7. Datos curiosos (página de inicio) ---------- */
  var textoDato = document.getElementById("texto-dato");
  var btnDato = document.getElementById("btn-dato");

  if (textoDato && btnDato) {
    var datos = [
      "El Día de la Tierra se celebra cada 22 de abril y la primera jornada fue en 1970.",
      "La Agenda 2030 de la ONU tiene 17 Objetivos de Desarrollo Sostenible (ODS), y varios son ambientales.",
      "El Acuerdo de París (2015) busca mantener el aumento de la temperatura global muy por debajo de 2 °C.",
      "El Acuerdo de Escazú (2018) es el primer tratado ambiental de América Latina y el Caribe. Habla de acceso a la información, participación y justicia en temas ambientales.",
      "Con iNaturalist cualquier persona puede subir fotos de plantas y animales y la comunidad ayuda a identificarlos.",
      "Global Forest Watch usa imágenes de satélite para que cualquiera pueda ver cómo cambian los bosques del mundo."
    ];
    var actual = 0;

    btnDato.addEventListener("click", function () {
      actual = (actual + 1) % datos.length;
      textoDato.style.opacity = 0;
      setTimeout(function () {
        textoDato.textContent = datos[actual];
        textoDato.style.opacity = 1;
      }, 250);
    });
  }

  /* ---------- 8. Acordeón (preguntas frecuentes) ---------- */
  document.querySelectorAll(".acordeon-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var cuerpo = item.querySelector(".acordeon-cuerpo");
      var abrir = !item.classList.contains("abierto");

      // se cierran los demás
      document.querySelectorAll(".acordeon-item.abierto").forEach(function (otro) {
        otro.classList.remove("abierto");
        otro.querySelector(".acordeon-cuerpo").style.maxHeight = null;
        otro.querySelector(".acordeon-btn").setAttribute("aria-expanded", "false");
      });

      if (abrir) {
        item.classList.add("abierto");
        cuerpo.style.maxHeight = cuerpo.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 9. Filtro de tecnologías ---------- */
  var botonesFiltro = document.querySelectorAll(".filtro");
  var tarjetasTec = document.querySelectorAll("[data-categoria]");

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
      var cat = boton.getAttribute("data-filtro");
      botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");

      tarjetasTec.forEach(function (t) {
        var coincide = cat === "todas" || t.getAttribute("data-categoria") === cat;
        t.classList.toggle("oculta", !coincide);
        if (coincide) {
          t.classList.remove("aparece");
          void t.offsetWidth; // reinicia la animación
          t.classList.add("aparece");
        }
      });
    });
  });

  /* ---------- 10. Lista de acciones con progreso ---------- */
  var checks = document.querySelectorAll(".accion input");
  var barraAcc = document.getElementById("barra-acciones");
  var textoAcc = document.getElementById("texto-acciones");

  if (checks.length && barraAcc) {
    // se intenta recuperar lo que marcó antes
    var guardado = [];
    try { guardado = JSON.parse(localStorage.getItem("raiz-acciones")) || []; } catch (e) { guardado = []; }

    checks.forEach(function (c, i) {
      c.checked = guardado.indexOf(i) !== -1;
      c.addEventListener("change", actualizar);
    });

    function actualizar() {
      var marcados = [];
      checks.forEach(function (c, i) { if (c.checked) marcados.push(i); });
      try { localStorage.setItem("raiz-acciones", JSON.stringify(marcados)); } catch (e) {}

      var porcentaje = Math.round((marcados.length / checks.length) * 100);
      barraAcc.style.width = porcentaje + "%";

      var mensaje = "Aún no marcas ninguna acción. Empieza por la que te parezca más fácil.";
      if (marcados.length > 0 && marcados.length < checks.length) {
        mensaje = "Llevas " + marcados.length + " de " + checks.length + " acciones. ¡Sigue así!";
      }
      if (marcados.length === checks.length) {
        mensaje = "Completaste las " + checks.length + " acciones. Ahora compártelo con tu familia y amigos.";
      }
      textoAcc.textContent = mensaje;
    }
    actualizar();
  }

  /* ---------- 11. Generador de compromiso ---------- */
  var formCompromiso = document.getElementById("form-compromiso");
  var carta = document.getElementById("carta-compromiso");

  if (formCompromiso && carta) {
    formCompromiso.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = document.getElementById("nombre").value.trim();
      var accion = document.getElementById("accion").value;

      if (nombre === "") {
        document.getElementById("nombre").focus();
        return;
      }

      document.getElementById("carta-nombre").textContent = nombre;
      document.getElementById("carta-accion").textContent = accion;
      var hoy = new Date().toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" });
      document.getElementById("carta-fecha").textContent = hoy;

      carta.classList.remove("visible");
      void carta.offsetWidth;
      carta.classList.add("visible");
      carta.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "center" });
    });
  }

  /* ---------- 12. Año automático en el pie ---------- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

});
