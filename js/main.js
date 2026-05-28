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







const fotos = document.querySelectorAll('.galeria-foto');
const visor = document.getElementById('visor');
const visorImg = visor.querySelector('.visor-imagen');
let indiceActual = 0;

function abrirVisor(indice) {
  indiceActual = indice;
  const img = fotos[indiceActual].querySelector('img');

  visorImg.classList.add('cambiando');

  setTimeout(function() {
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

fotos.forEach(function(foto, i) {
  foto.addEventListener('click', function() {
    abrirVisor(i);
  });
});

document.querySelector('.visor-cerrar').addEventListener('click', function(e) {
  e.stopPropagation();
  cerrarVisor();
});

document.querySelector('.visor-anterior').addEventListener('click', function() {
  const nuevoIndice = (indiceActual - 1 + fotos.length) % fotos.length;
  abrirVisor(nuevoIndice);
});

document.querySelector('.visor-siguiente').addEventListener('click', function() {
  const nuevoIndice = (indiceActual + 1) % fotos.length;
  abrirVisor(nuevoIndice);
});

visor.addEventListener('click', function(e) {
  if (e.target === visor) cerrarVisor();
});

document.addEventListener('keydown', function(e) {
  if (!visor.classList.contains('activo')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') document.querySelector('.visor-anterior').click();
  if (e.key === 'ArrowRight') document.querySelector('.visor-siguiente').click();
});







// HUMAN ONLY: escribí el acordeón del FAQ a mano.

const preguntas = document.querySelectorAll('.pregunta-titulo');

preguntas.forEach(function(boton) {
  boton.addEventListener('click', function() {
    const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
    const respuesta = document.getElementById(boton.getAttribute('aria-controls'));

    preguntas.forEach(function(otroBoton) {
      otroBoton.setAttribute('aria-expanded', 'false');
      document.getElementById(otroBoton.getAttribute('aria-controls')).hidden = true;
    });

    if (!estaAbierto) {
      boton.setAttribute('aria-expanded', 'true');
      respuesta.hidden = false;
    }
  });
});





const formulario = document.querySelector('.formulario');

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

  if (!nombre) {
    mostrarError(campoCampos.nombre, 'El nombre no puede estar vacío.');
    valido = false;
  }

  if (!email) {
    mostrarError(campoCampos.email, 'El email no puede estar vacío.');
    valido = false;
  } else if (!validarEmail(email)) {
    mostrarError(campoCampos.email, 'Ingresa un email con formato válido.');
    valido = false;
  }

  if (!mensaje) {
    mostrarError(campoCampos.mensaje, 'El mensaje no puede estar vacío.');
    valido = false;
  }

  if (valido) {
  const existente = formulario.querySelector('.mensaje-exito');
  if (existente) existente.remove();

  const exito = document.createElement('p');
  exito.className = 'mensaje-exito';
  exito.textContent = '¡Mensaje enviado con éxito!';

  const boton = formulario.querySelector('[type="submit"]');
  boton.insertAdjacentElement('beforebegin', exito);

  formulario.reset();
}
});