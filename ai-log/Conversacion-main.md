
<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Bertolli Pro 900 · Cocina Profesional</title> <meta name="description" content="Cocina a gas profesional de 5 hornillas. Potencia de re

pasted

Tengo una landing page premium para una cocina profesional. Ya tengo el HTML completo y el tokens.css con mis variables. Ahora necesito el main.css con los estilos base globales: reset, body, contenedor, títulos h1 h2 h3, botones, navegación y footer. El diseño es mobile-first. Fondo crema var(--color-crema), texto negro var(--color-negro), tipografía DM Sans para cuerpo y Playfair Display para títulos. Sin frameworks, CSS puro con variables. Aquí están mi HTML y mi tokens.css

:root {

  --negro:       #1a1a18;
  --crema:       #f5f0e8;
  --lino:        #e8e2d8;
  --dorado:      #c8b99a;
  --dorado-claro:#ddd0b8;
  --gris:        #8a8278;
  --rojo:        #a8392a;   
  --blanco:      #fdfaf5; 

  --fuente-titulo: 'Playfair Display', Georgia, serif;
  --fuente-cuerpo: 'DM Sans', 'Helvetica Neue', sans-serif;

  --texto-sm:   0.875rem;   
  --texto-base: 1rem;       
  --texto-lg:   1.5rem;     
  --texto-xl:   2rem;       
  --texto-2xl:  3.5rem;    

  --espacio-xs:  0.5rem;    
  --espacio-sm:  1rem;      
  --espacio-md:  2rem;     
  --espacio-lg:  4rem;     
  --espacio-xl:  6rem;     


  --sombra-sm:   0 2px 8px  rgba(26, 26, 24, 0.08);
  --sombra-md:   0 6px 20px rgba(26, 26, 24, 0.12);
  --sombra-foco: 0 0 0 3px  rgba(200, 185, 154, 0.45);


  --transicion: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

}
Mostrar más
10:06 p.m.

Archivo visualizado, creó un archivo, archivo leído
Archivo visualizado, creó un archivo, archivo leído
Aquí tienes el main.css completo. Algunas decisiones de diseño que tomé:

Reset — usa el patrón moderno (box-sizing, margin/padding a cero, img como bloque), más solo-lectores que ya usas en el <caption> de la tabla y skip-link por si lo agregas después.

Tipografía — clamp() en todos los tamaños de heading para que escalen fluidamente sin media queries adicionales. El .titulo-seccion lleva una línea de 2.5rem en --dorado como único ornamento, coherente con el tono premium sin excederse.

Botones — los cuatro variantes (primario, secundario, cotizar, whatsapp) comparten una base común y solo sobreescriben color/padding. El hover del primario invierte el relleno (fondo transparente + borde negro), que es un gesto muy característico de marcas de lujo.

Navegación — sticky con backdrop-filter: blur sutil. El menú está display: none en mobile y aparece en 768px. Los links llevan un subrayado que crece desde la izquierda al hover.

Footer — grid de 1 → 2 → 3 columnas. Fondo --negro, textos en --gris, con los encabezados de columna en --dorado para crear jerarquía cromática dentro del área oscura.

El siguiente archivo natural sería components.css para las tarjetas, tabla de specs, FAQ y galería — avísame cuando quieras seguir.


Main
Código · CSS 
se que me falta el logo para que cuando se haga responsive el tema del menu queda en casita vamos a añadirlo,

10:10 p.m.
Entendido. Necesitas un botón de hamburguesa para mobile que abra/cierre el menú. Voy a añadir:

El botón en el HTML (dentro de .navegacion)
Los estilos en main.css
El JS en main.js
Pero antes — ¿tienes ya un main.js con lógica existente que deba respetar, o está vacío?

esta vacio

10:10 p.m.
Perfecto. Aquí van los tres cambios:

1. HTML — agrega el botón dentro de .navegacion, justo antes de .boton-cotizar:

html
<button class="menu-toggle" aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menú">
  <span class="hamburguesa"></span>
</button>
Y agrega id="menu-principal" al <ul class="menu">:

html
<ul class="menu" id="menu-principal" role="list">
2. CSS — agrega al final de main.css:

css
/* ----------------------------------------------------------------
   MENÚ MOBILE — hamburguesa
   ---------------------------------------------------------------- */

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.4rem;
  border-radius: 2px;
  transition: var(--transicion);
  flex-shrink: 0;
}

.menu-toggle:focus-visible {
  outline: none;
  box-shadow: var(--sombra-foco);
}

.menu-toggle:hover .hamburguesa,
.menu-toggle:hover .hamburguesa::before,
.menu-toggle:hover .hamburguesa::after {
  background-color: var(--dorado);
}

/* Las tres líneas */
.hamburguesa,
.hamburguesa::before,
.hamburguesa::after {
  display: block;
  width: 1.4rem;
  height: 1.5px;
  background-color: var(--negro);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity   200ms ease;
}

.hamburguesa {
  position: relative;
}

.hamburguesa::before,
.hamburguesa::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburguesa::before { top: -6px; }
.hamburguesa::after  { top:  6px; }

/* Estado abierto — se convierte en X */
.menu-toggle[aria-expanded="true"] .hamburguesa {
  background-color: transparent;
}

.menu-toggle[aria-expanded="true"] .hamburguesa::before {
  transform: translateY(6px) rotate(45deg);
}

.menu-toggle[aria-expanded="true"] .hamburguesa::after {
  transform: translateY(-6px) rotate(-45deg);
}

/* Menú desplegado en mobile */
.menu.abierto {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--espacio-sm);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--crema);
  border-bottom: 1px solid var(--lino);
  padding: var(--espacio-md);
  box-shadow: var(--sombra-md);
  animation: menu-entra 200ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes menu-entra {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu.abierto a {
  font-size: var(--texto-base);
}

/* En desktop el toggle desaparece */
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
}
3. JS — contenido completo de main.js:

js
// ── Menú mobile ──────────────────────────────────────────────
const toggle = document.querySelector('.menu-toggle');
const menu   = document.querySelector('#menu-principal');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const abierto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!abierto));
    menu.classList.toggle('abierto');
  });

  // Cierra al hacer clic en cualquier enlace del menú
  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
    });
  });

  // Cierra con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
      toggle.focus();
    }
  });
}
Lo que hace cada pieza:

El botón usa aria-expanded para comunicar el estado a lectores de pantalla
Las tres líneas se animan a una X con pura transformación CSS, sin cambiar el DOM
El menú cae con una animación sutil de opacidad + desplazamiento
El JS cierra automáticamente al tocar un enlace (importante para el scroll a secciones) y al presionar Escape, devolviendo el foco al botón
para empezar solo el header quedo sin paddin, es por lo que esta fuera del main, entonces hagamosle eso al header, otra cosa no quiero quede con 4rem de pading si no con 2rem

10:32 p.m.
En main.css, busca esta regla de .navegacion:

css
@media (min-width: 1024px) {
  .navegacion {
    padding-inline: var(--espacio-lg);
  }
}
Cámbiala por:

css
@media (min-width: 1024px) {
  .navegacion {
    padding-inline: var(--espacio-md);
  }
}
--espacio-md es 2rem, que es exactamente lo que buscas. El header usa .navegacion como contenedor propio (no .contenedor), así que ese es el único punto a tocar. Los breakpoints de 640px y 768px ya usan --espacio-sm y --espacio-md respectivamente, así que en mobile y tablet queda igual.

1779939285584_image.png
no cambia

10:34 p.m.
Veo el problema — el main tiene el padding pero la sección .inicio no lo hereda porque el texto está directamente en .inicio-texto sin pasar por .contenedor. Hay dos problemas visibles en la captura:

El hero no tiene padding lateral
Las secciones tampoco usan bien el contenedor aún (eso es components.css, pero el hero es main.css)
Agrega esto al final de main.css:

css
/* ----------------------------------------------------------------
   SECCIÓN INICIO — padding base hasta tener components.css
   ---------------------------------------------------------------- */

.inicio {
  padding-inline: var(--espacio-sm);
}

@media (min-width: 640px) {
  .inicio {
    padding-inline: var(--espacio-md);
  }
}

@media (min-width: 1024px) {
  .inicio {
    padding-inline: var(--espacio-md);
  }
}
Pero la solución limpia es envolver el contenido del hero en .contenedor igual que el resto de secciones. En el HTML, dentro de <section class="inicio">, envuelve todo con:

html
<section class="inicio" aria-label="Presentación del producto">
  <div class="contenedor">        <!-- ← añade este div -->
    <div class="inicio-texto">
      ...
    </div>
    <div class="inicio-imagen">
      ...
    </div>
  </div>                          <!-- ← y ciérralo aquí -->
</section>
Así usa exactamente el mismo sistema de padding que todas las demás secciones y no necesitas CSS extra. Es la opción que te recomiendo para mantener consistencia.







Claude es IA y puede cometer errores. Por favor, verifica nuevamente las respuestas.
Main · CSS
/* ============================================================
   BERTOLLI PRO 900 — main.css
   Mobile-first · CSS puro · Sin frameworks
   Orden: reset → base → layout → tipografía → botones → nav → footer
   ============================================================ */
 
 
/* ----------------------------------------------------------------
   1. RESET MODERNO
   ---------------------------------------------------------------- */
 
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
 
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}
 
body {
  min-height: 100dvh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
 
img, video, svg {
  display: block;
  max-width: 100%;
  height: auto;
}
 
input, button, textarea, select {
  font: inherit;
}
 
button {
  cursor: pointer;
  border: none;
  background: none;
}
 
a {
  color: inherit;
  text-decoration: none;
}
 
ul, ol {
  list-style: none;
}
 
table {
  border-collapse: collapse;
  width: 100%;
}
 
/* Accesibilidad: skip-link */
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--espacio-sm);
  z-index: 9999;
  padding: var(--espacio-xs) var(--espacio-sm);
  background: var(--negro);
  color: var(--crema);
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-sm);
  border-radius: 0 0 4px 4px;
  transition: var(--transicion);
}
 
.skip-link:focus {
  top: 0;
}
 
/* Clase de accesibilidad para texto solo lectores de pantalla */
.solo-lectores {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
 
 
/* ----------------------------------------------------------------
   2. BASE — body y variables de contexto
   ---------------------------------------------------------------- */
 
body {
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-base);
  font-weight: 400;
  color: var(--negro);
  background-color: var(--crema);
}
 
 
/* ----------------------------------------------------------------
   3. LAYOUT — contenedor centrado
   ---------------------------------------------------------------- */
 
.contenedor {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--espacio-sm);
}
 
@media (min-width: 640px) {
  .contenedor {
    padding-inline: var(--espacio-md);
  }
}
 
@media (min-width: 1024px) {
  .contenedor {
    padding-inline: var(--espacio-lg);
  }
}
 
 
/* ----------------------------------------------------------------
   4. TIPOGRAFÍA — h1 h2 h3 y cuerpo
   ---------------------------------------------------------------- */
 
h1, h2, h3, h4, h5, h6 {
  font-family: var(--fuente-titulo);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--negro);
}
 
/* H1 — título hero */
h1,
.titulo-principal {
  font-size: clamp(2.25rem, 6vw + 1rem, var(--texto-2xl));
  line-height: 1.08;
  letter-spacing: -0.025em;
}
 
/* H2 — títulos de sección */
h2,
.titulo-seccion {
  font-size: clamp(1.75rem, 3.5vw + 0.5rem, 2.5rem);
  margin-bottom: var(--espacio-md);
  position: relative;
  display: inline-block;
}
 
/* Línea decorativa bajo los títulos de sección */
.titulo-seccion::after {
  content: '';
  display: block;
  width: 2.5rem;
  height: 2px;
  background: var(--dorado);
  margin-top: 0.6rem;
}
 
/* H3 — subtítulos de tarjetas y componentes */
h3 {
  font-size: clamp(1.05rem, 1.5vw + 0.25rem, 1.3rem);
  font-family: var(--fuente-cuerpo);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.3;
}
 
p {
  font-size: var(--texto-base);
  line-height: 1.7;
  color: var(--gris);
}
 
/* Subtítulo hero con texto más amplio */
.subtitulo {
  font-size: clamp(1rem, 1.5vw + 0.25rem, var(--texto-lg));
  line-height: 1.55;
  color: var(--gris);
  max-width: 50ch;
}
 
/* Precio hero */
.precio {
  font-family: var(--fuente-titulo);
  font-size: clamp(1.5rem, 3vw + 0.5rem, var(--texto-xl));
  font-weight: 500;
  color: var(--negro);
  letter-spacing: -0.02em;
}
 
strong {
  font-weight: 500;
  color: var(--negro);
}
 
small {
  font-size: var(--texto-sm);
}
 
 
/* ----------------------------------------------------------------
   5. BOTONES
   ---------------------------------------------------------------- */
 
/* Base compartida */
.boton-primario,
.boton-secundario,
.boton-cotizar,
.boton-whatsapp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--espacio-xs);
  padding: 0.8rem 1.75rem;
  border-radius: 2px;
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-sm);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  transition: var(--transicion);
  cursor: pointer;
  text-decoration: none;
}
 
/* Foco accesible global para botones y enlaces */
.boton-primario:focus-visible,
.boton-secundario:focus-visible,
.boton-cotizar:focus-visible,
.boton-whatsapp:focus-visible {
  outline: none;
  box-shadow: var(--sombra-foco);
}
 
/* Primario — fondo negro */
.boton-primario {
  background-color: var(--negro);
  color: var(--crema);
  border: 1.5px solid var(--negro);
}
 
.boton-primario:hover {
  background-color: transparent;
  color: var(--negro);
}
 
/* Secundario — contorno */
.boton-secundario {
  background-color: transparent;
  color: var(--negro);
  border: 1.5px solid var(--dorado);
}
 
.boton-secundario:hover {
  background-color: var(--dorado-claro);
  border-color: var(--dorado);
}
 
/* CTA nav — versión compacta */
.boton-cotizar {
  background-color: var(--negro);
  color: var(--crema);
  border: 1.5px solid var(--negro);
  padding: 0.6rem 1.25rem;
  font-size: 0.8rem;
}
 
.boton-cotizar:hover {
  background-color: var(--dorado);
  border-color: var(--dorado);
  color: var(--negro);
}
 
/* WhatsApp — acento dorado */
.boton-whatsapp {
  background-color: var(--dorado);
  color: var(--negro);
  border: 1.5px solid var(--dorado);
  width: fit-content;
}
 
.boton-whatsapp:hover {
  background-color: var(--negro);
  color: var(--crema);
  border-color: var(--negro);
}
 
/* Grupo de botones hero */
.botones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espacio-sm);
  margin-top: var(--espacio-md);
}
 
 
/* ----------------------------------------------------------------
   6. NAVEGACIÓN
   ---------------------------------------------------------------- */
 
.encabezado {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--crema);
  border-bottom: 1px solid var(--lino);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
 
.navegacion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--espacio-sm);
  padding-block: 1rem;
  gap: var(--espacio-sm);
}
 
/* Logo */
.logo {
  font-family: var(--fuente-titulo);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--negro);
  text-transform: uppercase;
  flex-shrink: 0;
}
 
.logo:hover {
  color: var(--gris);
}
 
/* Menú — oculto en mobile, visible en desktop */
.menu {
  display: none;
  align-items: center;
  gap: var(--espacio-md);
}
 
.menu a {
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-sm);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--gris);
  transition: var(--transicion);
  position: relative;
  padding-bottom: 2px;
}
 
/* Subrayado animado en hover */
.menu a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--dorado);
  transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
 
.menu a:hover {
  color: var(--negro);
}
 
.menu a:hover::after {
  width: 100%;
}
 
.menu a:focus-visible {
  outline: none;
  box-shadow: var(--sombra-foco);
  border-radius: 2px;
}
 
@media (min-width: 768px) {
  .menu {
    display: flex;
  }
 
  .navegacion {
    padding-inline: var(--espacio-md);
  }
}
 
@media (min-width: 1024px) {
  .navegacion {
    padding-inline: var(--espacio-lg);
  }
}
 
 
/* ----------------------------------------------------------------
   7. FOOTER
   ---------------------------------------------------------------- */
 
.site-footer {
  background-color: var(--negro);
  color: var(--crema);
  padding-block: var(--espacio-lg) var(--espacio-md);
  margin-top: var(--espacio-xl);
}
 
/* Contenedor del footer reutiliza .container del HTML */
.site-footer .container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--espacio-sm);
}
 
@media (min-width: 640px) {
  .site-footer .container {
    padding-inline: var(--espacio-md);
  }
}
 
@media (min-width: 1024px) {
  .site-footer .container {
    padding-inline: var(--espacio-lg);
  }
}
 
/* Grid de columnas */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--espacio-md);
  margin-bottom: var(--espacio-lg);
}
 
@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}
 
@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}
 
/* Columna de marca */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--espacio-xs);
}
 
.footer-logo {
  font-family: var(--fuente-titulo);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--crema);
  line-height: 1;
  margin-bottom: 0.25rem;
}
 
.footer-brand p:not(.footer-logo) {
  font-size: var(--texto-sm);
  color: var(--gris);
  max-width: 26ch;
  line-height: 1.6;
}
 
/* Columnas de nav y contacto */
.site-footer nav h3,
.footer-contact h3 {
  font-family: var(--fuente-cuerpo);
  font-size: var(--texto-sm);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dorado);
  margin-bottom: var(--espacio-sm);
}
 
.site-footer nav ul {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
 
.site-footer nav a {
  font-size: var(--texto-sm);
  color: var(--gris);
  transition: var(--transicion);
}
 
.site-footer nav a:hover {
  color: var(--crema);
}
 
.site-footer nav a:focus-visible {
  outline: none;
  box-shadow: var(--sombra-foco);
  border-radius: 2px;
}
 
/* Contacto */
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
 
.footer-contact p {
  font-size: var(--texto-sm);
  color: var(--gris);
  line-height: 1.5;
}
 
/* Redes sociales */
.social-links {
  display: flex;
  gap: var(--espacio-sm);
  margin-top: var(--espacio-xs);
}
 
.social-links a {
  font-size: var(--texto-sm);
  color: var(--gris);
  letter-spacing: 0.03em;
  transition: var(--transicion);
  position: relative;
  padding-bottom: 1px;
}
 
.social-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--dorado);
  transition: width 250ms ease;
}
 
.social-links a:hover {
  color: var(--crema);
}
 
.social-links a:hover::after {
  width: 100%;
}
 
.social-links a:focus-visible {
  outline: none;
  box-shadow: var(--sombra-foco);
  border-radius: 2px;
}
 
/* Línea divisoria y copyright */
.footer-copy {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: var(--espacio-md);
  font-size: var(--texto-sm);
  color: var(--gris);
  text-align: center;
  letter-spacing: 0.02em;
}
 


