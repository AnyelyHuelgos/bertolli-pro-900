const toggle = document.querySelector('.menu-toggle');
const menu   = document.querySelector('#menu-principal');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const abierto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!abierto));
    menu.classList.toggle('abierto');
  });

  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
      toggle.focus();
    }
  });
}


function alVerlo(selector, fn) {
  const el = document.querySelector(selector);
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fn();
      obs.disconnect();
    }
  }, { rootMargin: '200px' });
  obs.observe(el);
}


alVerlo('.galeria', function () {
  const fotos    = document.querySelectorAll('.galeria-foto');
  const visor    = document.getElementById('visor');
  const visorImg = visor.querySelector('.visor-imagen');
  let indiceActual = 0;

  function abrirVisor(indice) {
    indiceActual = indice;
    const img = fotos[indiceActual].querySelector('img');
    visorImg.classList.add('cambiando');
    setTimeout(function () {
      visorImg.src = img.src;
      visorImg.alt = img.alt;
      visorImg.classList.remove('cambiando');
    }, 200);
    visor.classList.add('activo');
    document.body.style.overflow = 'hidden';
    visor.focus();
  }

  function cerrarVisor() {
    visor.classList.remove('activo');
    document.body.style.overflow = '';
    fotos[indiceActual].focus();
  }

  fotos.forEach(function (foto, i) {
    foto.addEventListener('click', function () { abrirVisor(i); });
  });

  document.querySelector('.visor-cerrar').addEventListener('click', function (e) {
    e.stopPropagation();
    cerrarVisor();
  });
  document.querySelector('.visor-anterior').addEventListener('click', function () {
    abrirVisor((indiceActual - 1 + fotos.length) % fotos.length);
  });
  document.querySelector('.visor-siguiente').addEventListener('click', function () {
    abrirVisor((indiceActual + 1) % fotos.length);
  });

  visor.addEventListener('click', function (e) {
    if (e.target === visor) cerrarVisor();
  });

  document.addEventListener('keydown', function (e) {
    if (!visor.classList.contains('activo')) return;
    if (e.key === 'Escape')     cerrarVisor();
    if (e.key === 'ArrowLeft')  document.querySelector('.visor-anterior').click();
    if (e.key === 'ArrowRight') document.querySelector('.visor-siguiente').click();
  });
});


// HUMAN ONLY: escribí el acordeón del FAQ a mano.

alVerlo('#faq', function () {
  const preguntas = document.querySelectorAll('.pregunta-titulo');

  preguntas.forEach(function (boton) {
    boton.addEventListener('click', function () {
      const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
      const respuesta   = document.getElementById(boton.getAttribute('aria-controls'));

      preguntas.forEach(function (otroBoton) {
        otroBoton.setAttribute('aria-expanded', 'false');
        document.getElementById(otroBoton.getAttribute('aria-controls')).hidden = true;
      });

      if (!estaAbierto) {
        boton.setAttribute('aria-expanded', 'true');
        respuesta.hidden = false;
      }
    });
  });
});


alVerlo('#contacto', function () {
  const formulario = document.querySelector('.formulario');
  if (!formulario) return;

  function mostrarError(campo, mensaje) {
    campo.classList.add('error');
    campo.querySelector('.campo-error').textContent = mensaje;
  }

  function limpiarError(campo) {
    campo.classList.remove('error');
    campo.querySelector('.campo-error').textContent = '';
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formulario.querySelectorAll('.campo').forEach(campo => {
    campo.querySelector('input, textarea')?.addEventListener('input', () => {
      limpiarError(campo);
    });
  });

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const campoCampos = {
      nombre:  formulario.querySelector('[name="nombre"]').closest('.campo'),
      email:   formulario.querySelector('[name="email"]').closest('.campo'),
      mensaje: formulario.querySelector('[name="mensaje"]').closest('.campo'),
    };

    Object.values(campoCampos).forEach(limpiarError);

    const nombre  = formulario.querySelector('[name="nombre"]').value.trim();
    const email   = formulario.querySelector('[name="email"]').value.trim();
    const mensaje = formulario.querySelector('[name="mensaje"]').value.trim();

    let valido = true;

    if (!nombre) { mostrarError(campoCampos.nombre, 'El nombre no puede estar vacío.'); valido = false; }
    if (!email)  { mostrarError(campoCampos.email,  'El email no puede estar vacío.');  valido = false; }
    else if (!validarEmail(email)) { mostrarError(campoCampos.email, 'Ingresa un email con formato válido.'); valido = false; }
    if (!mensaje) { mostrarError(campoCampos.mensaje, 'El mensaje no puede estar vacío.'); valido = false; }

    if (valido) {
      const existente = formulario.querySelector('.mensaje-exito');
      if (existente) existente.remove();
      const exito = document.createElement('p');
      exito.className = 'mensaje-exito';
      exito.textContent = '¡Mensaje enviado con éxito!';
      formulario.querySelector('[type="submit"]').insertAdjacentElement('beforebegin', exito);
      formulario.reset();
    }
  });
});


(function () {

  var PRECIO = 4299000;
  var CUOTAS = [3, 6, 12, 24, 36];

  function formatearCOP(numero) {
    return Math.round(numero).toLocaleString('es-CO');
  }

  function calcularCuota(numeroCuotas) {
    return PRECIO / numeroCuotas;
  }

  var numeroResultado   = document.getElementById('numero-resultado');
  var descripcionCuotas = document.getElementById('descripcion-cuotas');
  var radios            = document.querySelectorAll('input[name="cuotas"]');
  var opciones          = document.querySelectorAll('.opcion-cuota');

  CUOTAS.forEach(function (n) {
    var preview = document.getElementById('prev-' + n);
    if (preview) {
      preview.textContent = '$' + formatearCOP(calcularCuota(n)) + '/mes';
    }
  });

  if (numeroResultado) {
    numeroResultado.textContent = formatearCOP(calcularCuota(3));
  }

  radios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      var n = parseInt(this.value, 10);
      opciones.forEach(function (opcion) {
        opcion.classList.remove('activa');
      });
      this.closest('.opcion-cuota').classList.add('activa');
      if (numeroResultado) {
        numeroResultado.textContent = formatearCOP(calcularCuota(n));
      }
      if (descripcionCuotas) {
        descripcionCuotas.textContent =
          'En ' + n + ' cuota' + (n > 1 ? 's' : '') + ' sin intereses';
      }
    });
  });

  opciones.forEach(function (opcion) {
    opcion.addEventListener('click', function () {
      var radio = this.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    });
  });

})();