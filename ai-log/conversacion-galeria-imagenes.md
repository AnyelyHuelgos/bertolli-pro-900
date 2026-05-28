
Claude terminó la respuesta
Estoy construyendo una landing page premium para una cocina profesional y me bloqueé con la galería. Tengo un grid de 4 imágenes y quiero que al hacer clic en cualquiera se abra un visor a pantalla completa con la imagen amplia. El visor debe tener botones de anterior y siguiente para navegar entre imágenes y un botón para cerrar. Intenté hacerlo pero solo logré que el visor se abra y se cierre — no sé cómo pasarle la imagen correcta al visor ni cómo manejar la navegación. Este es el JavaScript que llevo

const fotos = document.querySelectorAll('.galeria-foto');
const visor = document.getElementById('visor');

fotos.forEach(function(foto) {
  foto.addEventListener('click', function() {
    visor.hidden = false;
  });
});

document.querySelector('.visor-cerrar').addEventListener('click', function() {
  visor.hidden = true;
});
Y este es el CSS que tengo hasta ahora

.galeria-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacio-sm);
}

.galeria-foto img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.visor {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}


        <section class="galeria" id="galeria" aria-label="Galería de imágenes del producto">
            <div class="contenedor">
                <h2 class="titulo-seccion">Galeria - Cada detalle importa</h2>
                <div class="galeria-grid">

                <button class="galeria-foto" aria-label="Ver imagen: vista frontal completa">
                    <img src="assets/images/galeria-1.webp" alt="Vista frontal de la cocina Bertolli Pro 900" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: hornillas encendidas">
                    <img src="assets/images/galeria-2.webp" alt="Detalle de las 5 hornillas encendidas" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: panel de control">
                    <img src="assets/images/galeria-3.webp" alt="Panel de control con perillas de acero inoxidable" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: parrillas de hierro fundido">
                    <img src="assets/images/galeria-4.webp" alt="Parrillas de hierro fundido vistas desde arriba" loading="lazy" width="600" height="400" />
                </button>

                </div>
            </div>

            <div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Imagen ampliada" hidden>
                <button class="visor-cerrar" aria-label="Cerrar imagen">&times;</button>
                <button class="visor-anterior" aria-label="Imagen anterior">&#8249;</button>
                <img class="visor-imagen" src="" alt="" />
                <button class="visor-siguiente" aria-label="Imagen siguiente">&#8250;</button>
            </div>
        </section>
Mostrar menos
11:41 p.m.
El problema central es que tu listener de clic no sabe qué imagen se clickeó. La solución tiene tres partes:

Guardar el índice de cada foto en el forEach y usarlo cuando se abre el visor
Actualizar la imagen del visor con el src y alt de la foto correspondiente
Navegación: los botones anterior/siguiente modifican ese índice y llaman a la misma función de actualización
Aquí el JavaScript completo y corregido:

javascript
const fotos = document.querySelectorAll('.galeria-foto');
const visor = document.getElementById('visor');
const visorImg = visor.querySelector('.visor-imagen');
let indiceActual = 0;

function abrirVisor(indice) {
  indiceActual = indice;
  const img = fotos[indiceActual].querySelector('img');
  visorImg.src = img.src;
  visorImg.alt = img.alt;
  visor.hidden = false;
  document.body.style.overflow = 'hidden';
  visor.focus();
}

function cerrarVisor() {
  visor.hidden = true;
  document.body.style.overflow = '';
  fotos[indiceActual].focus();
}

fotos.forEach(function(foto, i) {
  foto.addEventListener('click', function() {
    abrirVisor(i);
  });
});

document.querySelector('.visor-cerrar').addEventListener('click', cerrarVisor);

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
  if (visor.hidden) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') document.querySelector('.visor-anterior').click();
  if (e.key === 'ArrowRight') document.querySelector('.visor-siguiente').click();
});
Los puntos clave:

forEach(foto, i) — el segundo parámetro i es el índice que necesitabas. Se captura en el closure del listener.
abrirVisor(indice) — centraliza toda la lógica de abrir. Tanto el clic en la foto como los botones anterior/siguiente llaman a esta misma función.
% fotos.length — el módulo hace que la navegación sea circular: desde la última foto, siguiente lleva a la primera, y viceversa.
document.body.style.overflow = 'hidden' — evita el scroll del fondo mientras el visor está abierto.
Clic en el fondo — si el usuario hace clic en el overlay oscuro (fuera de la imagen), también cierra el visor.
Teclado — Escape cierra, las flechas navegan. Importante para accesibilidad.
También agrega esto al CSS para que la imagen dentro del visor no se salga de la pantalla:

css
.visor-imagen {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  display: block;
}
sirve pero solo cuando lo manejo con el teclado, con el mause no funciona ademas no salen las lineas de anterior ni siguiente y no sale la x para salir y quiero que al hacersen grandeslas imagenes midan lo musmo

11:45 p.m.
Hay tres problemas separados que resolver:

El clic con mouse no funciona — los botones de navegación y cierre probablemente están siendo tapados por la imagen o por el overlay. Hay que revisar el z-index y el layout del visor.
Los botones no son visibles — les falta estilo CSS.
Tamaño uniforme de imágenes — hay que fijar dimensiones en el visor.
Muéstrame el CSS completo del visor (los estilos de .visor-cerrar, .visor-anterior, .visor-siguiente) y si tienes algo en el z-index del .visor. Con eso te digo exactamente qué está fallando.

Dicho eso, lo más probable es que el problema sea este: tu .visor tiene display: flex con align-items: center; justify-content: center, pero los botones de cerrar/anterior/siguiente no están posicionados con position: absolute, entonces el flexbox los pone en fila junto a la imagen y quedan aplastados o fuera del área clickeable.

Este CSS lo resuelve todo:

css
/* Overlay */
.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Imagen siempre del mismo tamaño */
.visor-imagen {
  width: 600px;
  height: 400px;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}

/* Botón cerrar — esquina superior derecha */
.visor-cerrar {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.visor-cerrar:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* Botones anterior y siguiente */
.visor-anterior,
.visor-siguiente {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.visor-anterior {
  left: 1.5rem;
}

.visor-siguiente {
  right: 1.5rem;
}

.visor-anterior:hover,
.visor-siguiente:hover {
  background: rgba(255, 255, 255, 0.28);
}
El cambio estructural clave es que los tres botones pasan a position: absolute dentro del visor que ya tiene position: fixed. Eso los saca del flujo del flexbox y los ubica exactamente donde deben estar, sin que la imagen los tape ni los empuje.

Para el tamaño uniforme, width: 600px; height: 400px; object-fit: cover fuerza que todas las imágenes ocupen exactamente el mismo espacio independientemente de sus dimensiones originales. Ajusta esos valores a lo que necesites — si quieres que aproveche más pantalla puedes usar width: min(600px, 90vw) para que también funcione bien en móvil.

solo no sirve el boton de cerrar la imagen

11:47 p.m.
El botón de cerrar está dentro del .visor que tiene el listener e.target === visor para cerrar al hacer clic en el fondo. El problema es que el clic en el botón burbujea hasta el overlay, pero antes de eso, el botón está siendo tapado por la imagen o hay un conflicto de z-index.

Hay dos causas probables — prueba primero la más común:

1. La imagen está encima del botón

Agrega esto:

css
.visor-imagen {
  position: relative;
  z-index: 5;
}

.visor-cerrar {
  z-index: 20; /* ya lo tienes en 10, súbelo por encima de la imagen */
}
2. El evento del overlay está cancelando el clic del botón

Cambia el listener del overlay para que ignore clics en los botones hijos:

javascript
visor.addEventListener('click', function(e) {
  if (e.target === visor) cerrarVisor();
});
Ese código ya lo tienes, así que si aun así no cierra, el problema es que el clic nunca llega al botón — lo está interceptando el overlay primero. Agrega e.stopPropagation() en el botón cerrar:

javascript
document.querySelector('.visor-cerrar').addEventListener('click', function(e) {
  e.stopPropagation();
  cerrarVisor();
});
Prueba esas dos cosas. Si me compartes qué z-index tienen actualmente .visor-imagen y .visor-cerrar en tu CSS lo confirmo.

const fotos = document.querySelectorAll('.galeria-foto');
const visor = document.getElementById('visor');
const visorImg = visor.querySelector('.visor-imagen');
let indiceActual = 0;

function abrirVisor(indice) {
  indiceActual = indice;
  const img = fotos[indiceActual].querySelector('img');
  visorImg.src = img.src;
  visorImg.alt = img.alt;
  visor.hidden = false;
  document.body.style.overflow = 'hidden';
  visor.focus();
}

function cerrarVisor() {
  visor.hidden = true;
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
  if (visor.hidden) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') document.querySelector('.visor-anterior').click();
  if (e.key === 'ArrowRight') document.querySelector('.visor-siguiente').click();
});/*Galeria de Imagenes*/
.galeria-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacio-sm);
}

.galeria-foto img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.visor-imagen {
  width: 600px;
  height: 400px;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}

.visor-cerrar {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.visor-cerrar:hover {
  background: rgba(255, 255, 255, 0.28);
}

.visor-anterior,
.visor-siguiente {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.visor-anterior {
  left: 1.5rem;
}

.visor-siguiente {
  right: 1.5rem;
}

.visor-anterior:hover,
.visor-siguiente:hover {
  background: rgba(255, 255, 255, 0.28);
}
Mostrar más
11:50 p.m.
El problema es claro: el .visor tiene display: flex pero no tiene position: relative. Los botones con position: absolute se posicionan respecto al ancestro posicionado más cercano — y como .visor no tiene position: relative, los botones se escapan a otro contenedor y el z-index no funciona correctamente.

Un solo cambio en el CSS lo resuelve:

css
.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  position: relative; /* ← esto falta */
}
Espera — position: fixed ya establece un contexto de posicionamiento, así que los absolute hijos sí deberían funcionar. El verdadero culpable es otro: el hidden del visor.

Cuando el visor tiene hidden, el navegador le aplica display: none. Pero cuando lo quitas con visor.hidden = false, el CSS de .visor tiene display: flex — eso está bien. Sin embargo, el atributo hidden en HTML tiene mayor especificidad que una clase en algunos navegadores si no está explícitamente contrarrestado.

Agrega esto al CSS:

css
.visor:not([hidden]) {
  display: flex;
}
Y el problema del botón cerrar específicamente: el &times; (×) es un carácter de texto, y con font-size: 1.5rem el área de texto puede desbordar el botón e interceptar el clic antes de que llegue al button. Reemplaza el contenido del botón en el HTML:

html
<button class="visor-cerrar" aria-label="Cerrar imagen">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="1" x2="17" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <line x1="17" y1="1" x2="1" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>
Y ajusta el CSS del cerrar:

css
.visor-cerrar {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1010; /* por encima del visor (1000) */
  pointer-events: all; /* fuerza que reciba clics */
}
El cambio importante es z-index: 1010 — tiene que ser mayor que el z-index: 1000 del .visor para que el botón quede inequívocamente encima de todo. El z-index: 10 que tenías es relativo al contexto del visor, pero con position: fixed el contexto de apilamiento cambia y ese 10 no garantizaba nada.

1779943863334_image.png
no, esta todo mal, mira como esta saliendo de feo

11:51 p.m.
Veo el problema claramente en la captura. El visor está empujando el contenido de la página hacia arriba en lugar de cubrirlo, la imagen no está centrada, y los botones están flotando en las esquinas del viewport sin relación visual con la imagen.

El problema raíz es que el position: fixed no está funcionando como debería — probablemente el visor está dentro de un contenedor con transform, filter, o will-change, lo que rompe el fixed positioning en CSS.

Dame el HTML del contenedor padre del visor (el <section> o lo que lo envuelva) y también dime si algún ancestro tiene alguna de estas propiedades en su CSS:

css
transform: ...
filter: ...
will-change: ...
perspective: ...
Mientras tanto, una solución que funciona independientemente del contexto es mover el visor fuera de la sección completamente. Cambia el HTML así:

html
<section class="galeria" id="galeria">
  <div class="contenedor">
    <!-- grid de fotos aquí -->
  </div>
</section>

<!-- El visor va FUERA de cualquier sección, justo antes de </body> -->
<div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Imagen ampliada" hidden>
  <button class="visor-cerrar" aria-label="Cerrar imagen">...</button>
  <button class="visor-anterior" aria-label="Imagen anterior">‹</button>
  <img class="visor-imagen" src="" alt="" />
  <button class="visor-siguiente" aria-label="Imagen siguiente">›</button>
</div>
Cuando el visor está dentro de una sección con estilos, hereda sus restricciones de apilamiento. Fuera del <body> directo, el position: fixed funciona limpio contra el viewport real.

  <section class="galeria" id="galeria" aria-label="Galería de imágenes del producto">
            <div class="contenedor">
                <h2 class="titulo-seccion">Galeria - Cada detalle importa</h2>
                <div class="galeria-grid">

                <button class="galeria-foto" aria-label="Ver imagen: vista frontal completa">
                    <img src="assets/images/galeria-1.webp" alt="Vista frontal de la cocina Bertolli Pro 900" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: hornillas encendidas">
                    <img src="assets/images/galeria-2.webp" alt="Detalle de las 5 hornillas encendidas" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: panel de control">
                    <img src="assets/images/galeria-3.webp" alt="Panel de control con perillas de acero inoxidable" loading="lazy" width="600" height="400" />
                </button>

                <button class="galeria-foto" aria-label="Ver imagen: parrillas de hierro fundido">
                    <img src="assets/images/galeria-4.webp" alt="Parrillas de hierro fundido vistas desde arriba" loading="lazy" width="600" height="400" />
                </button>

                </div>
            </div>

            
        </section>
        <div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Imagen ampliada" hidden>
                <button class="visor-cerrar" aria-label="Cerrar imagen">&times;</button>
                <button class="visor-anterior" aria-label="Imagen anterior">&#8249;</button>
                <img class="visor-imagen" src="" alt="" />
                <button class="visor-siguiente" aria-label="Imagen siguiente">&#8250;</button>
        </div>

lo puse asi pero sigue igual
Mostrar más
11:53 p.m.
La estructura HTML está bien ahora. El problema es puramente CSS — el visor necesita un rediseño completo para que se vea profesional. Dame todo el CSS del visor que tienes actualmente y lo reescribo de cero para que quede bien.

Mientras tanto, reemplaza todo el CSS del visor con esto:

css
/* ── Visor ─────────────────────────────── */
[hidden] { display: none !important; }

.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.93);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visor-imagen {
  display: block;
  width: min(700px, 85vw);
  height: min(520px, 75vh);
  object-fit: cover;
  border-radius: 2px;
}

/* Botón cerrar */
.visor-cerrar {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: background 0.2s;
}

.visor-cerrar:hover { background: rgba(255,255,255,0.25); }

/* Botones anterior / siguiente */
.visor-anterior,
.visor-siguiente {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: background 0.2s;
}

.visor-anterior { left: 1.5rem; }
.visor-siguiente { right: 1.5rem; }

.visor-anterior:hover,
.visor-siguiente:hover { background: rgba(255,255,255,0.25); }
Los dos cambios críticos respecto a lo que tenías:

[hidden] { display: none !important; } — sin esto, cuando el visor tiene el atributo hidden, algunos navegadores dejan que el display: flex del CSS lo sobreescriba parcialmente y el visor se renderiza de forma rota.
position: fixed en los botones — en lugar de absolute. Como el visor ya es fixed, los botones con absolute se posicionan dentro de él y pueden quedar fuera si la imagen es más grande. Con fixed se anclan directo al viewport, siempre visibles.
no debo poner etiquetas de important

11:54 p.m.
Tienes razón, !important es mala práctica. El problema es que el atributo hidden tiene su propio estilo del navegador (display: none) pero tu CSS de .visor con display: flex lo sobreescribe en algunos navegadores.

La solución limpia es no usar el atributo hidden — en cambio maneja la visibilidad con una clase:

HTML — quita el hidden del visor:

html
<div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
CSS — controla visibilidad con una clase:

css
.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.93);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.visor.activo {
  opacity: 1;
  pointer-events: all;
}
JavaScript — reemplaza todos los visor.hidden por toggle de clase:

javascript
function abrirVisor(indice) {
  indiceActual = indice;
  const img = fotos[indiceActual].querySelector('img');
  visorImg.src = img.src;
  visorImg.alt = img.alt;
  visor.classList.add('activo');
  document.body.style.overflow = 'hidden';
  visor.focus();
}

function cerrarVisor() {
  visor.classList.remove('activo');
  document.body.style.overflow = '';
  fotos[indiceActual].focus();
}

// La verificación del teclado también cambia:
document.addEventListener('keydown', function(e) {
  if (!visor.classList.contains('activo')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') document.querySelector('.visor-anterior').click();
  if (e.key === 'ArrowRight') document.querySelector('.visor-siguiente').click();
});
Esto además te da una transición suave de opacidad al abrir y cerrar, que queda bien en una landing premium.

dame todo el css de galeria y el js

11:55 p.m.
Aquí tienes todo junto, limpio y sin repetir nada de conversaciones anteriores:

CSS completo de galería y visor:

css
/* ── Galería ─────────────────────────────── */
.galeria-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--espacio-sm);
}

.galeria-foto {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  overflow: hidden;
  display: block;
}

.galeria-foto img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.galeria-foto:hover img {
  transform: scale(1.04);
}

/* ── Visor ─────────────────────────────── */
.visor {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.93);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.visor.activo {
  opacity: 1;
  pointer-events: all;
}

.visor-imagen {
  display: block;
  width: min(700px, 85vw);
  height: min(520px, 75vh);
  object-fit: cover;
  border-radius: 2px;
}

.visor-cerrar {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: background 0.2s;
}

.visor-cerrar:hover {
  background: rgba(255, 255, 255, 0.25);
}

.visor-anterior,
.visor-siguiente {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: background 0.2s;
}

.visor-anterior {
  left: 1.5rem;
}

.visor-siguiente {
  right: 1.5rem;
}

.visor-anterior:hover,
.visor-siguiente:hover {
  background: rgba(255, 255, 255, 0.25);
}
JS completo:

javascript
const fotos = document.querySelectorAll('.galeria-foto');
const visor = document.getElementById('visor');
const visorImg = visor.querySelector('.visor-imagen');
let indiceActual = 0;

function abrirVisor(indice) {
  indiceActual = indice;
  const img = fotos[indiceActual].querySelector('img');
  visorImg.src = img.src;
  visorImg.alt = img.alt;
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
Y recuerda que el HTML del visor ya no lleva el atributo hidden:

html
<div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
  <button class="visor-cerrar" aria-label="Cerrar imagen">&times;</button>
  <button class="visor-anterior" aria-label="Imagen anterior">&#8249;</button>
  <img class="visor-imagen" src="" alt="" />
  <button class="visor-siguiente" aria-label="Imagen siguiente">&#8250;</button>
</div>
perfectoya qudo super muchas gracias

12:01 a.m.
Me alegra que quedó bien. Tu galería tiene buena estructura — los button semánticos, los aria-label, el manejo de foco al cerrar — eso es trabajo sólido.

Si en algún momento quieres mejorarlo más, las ideas más naturales para ese tipo de landing serían agregar un contador de posición (2 / 4) debajo de la imagen en el visor, o un efecto de transición entre imágenes al navegar. Cualquier cosa, aquí estoy.

seria buena agrgarle una transcision con css sencilla

12:02 a.m.
Sí, queda muy bien y es poco código. Solo hay que hacer que la imagen haga fade al cambiar:

CSS — agrega esto a .visor-imagen:

css
.visor-imagen {
  /* lo que ya tienes... */
  transition: opacity 0.2s ease;
}

.visor-imagen.cambiando {
  opacity: 0;
}
JS — modifica solo la función abrirVisor:

javascript
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
La lógica es simple: agrega la clase cambiando que baja la opacidad a 0, espera 200ms a que termine el fade out, cambia el src, y quita la clase para que vuelva a aparecer con fade in. Los 200ms coinciden con la duración del transition.

me encanta muchas gracias

12:04 a.m.
De nada, quedó elegante y con muy poco código. Eso es lo mejor de las transiciones CSS — un par de líneas y se siente mucho más premium.

Mucho éxito con la landing de Bertolli, se ve muy bien lo que estás construyendo.






Claude es IA y puede cometer errores. Por favor, verifica nuevamente las respuestas.
