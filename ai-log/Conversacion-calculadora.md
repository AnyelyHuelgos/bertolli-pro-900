
Claude terminó la respuesta
Tengo una landing page premium para una cocina profesional llamada Bertolli Pro 900 que cuesta $4.299.000. Quiero agregar una sección extra con una calculadora de cuotas. El usuario elige el número de cuotas (3, 6, 12, 24, 36) y ve cuánto pagaría por mes. Sin intereses por ahora, solo división simple. La sección debe verse premium y coherente con el resto de la página — paleta negro #1a1a18, crema #f5f0e8, dorado #c8b99a, fuentes Playfair Display para títulos y DM Sans para cuerpo. Necesito el HTML de la sección, el CSS y el JavaScript. Sin librerías externas.

8:18 a.m.
Aquí tienes la sección completa con HTML, CSS y JavaScript listos para insertar en tu landing page.



Y aquí tienes el código limpio, listo para pegar directamente en tu landing:


Creó un archivo, archivo leído
Creó un archivo, archivo leído
El archivo está listo. Un resumen de lo que incluye:

Diseño: línea dorada decorativa en el borde superior, grid de dos columnas (opciones a la izquierda, resultado a la derecha sobre fondo 
#111110 para contraste), tipografía exactamente con tus especificaciones.

Interacción: al seleccionar una opción, el número grande de la derecha se actualiza instantáneamente. Cada fila también muestra el valor mensual como preview para facilitar la comparación visual.

Para integrarlo:

Añade el <link> de Google Fonts en tu <head> si aún no tienes Playfair Display y DM Sans cargadas.
Pega el bloque donde quieras la sección dentro del <body>.
Para cambiar el precio, solo modifica var PRECIO = 4299000; en el script.
El enlace "términos y condiciones" apunta a # — cámbialo por tu URL real.
La sección es responsive: en móviles las columnas se apilan verticalmente.


Bertolli calculadora cuotas
Código · HTML 
yo tengo cada archivo por separado asi que separa los codigos por aparte y pon las clases en español sencillo que estoy trabajando todo el proyecto asi

8:23 a.m.

Se crearon 3 archivos, archivo visualizado, ejecutó un comando
Se crearon 3 archivos, archivo visualizado, ejecutó un comando
Tres archivos listos. Para conectarlos en tu proyecto:

En el <head> enlaza el CSS y las fuentes:

html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="calculadora-cuotas.css">
Al final del <body> enlaza el JS:

html
<script src="calculadora-cuotas.js"></script>
Resumen de las clases en español que se usaron, por si necesitas modificar algo rápido:

Clase	Qué es
.seccion-calculadora	Bloque principal negro
.contenedor-calculadora	Ancho máximo centrado
.cuerpo-calculadora	El grid de dos columnas
.columna-opciones	Lado izquierdo con los radios
.columna-resultado	Lado derecho con el número grande
.opcion-cuota	Cada fila de cuotas
.opcion-cuota.activa	La opción seleccionada
.preview-opcion	El valor pequeño a la derecha de cada fila
.monto-resultado	El número grande del resultado
.nota-legal	El texto pequeño de abajo

Calculadora cuotas
Código · HTML 

Calculadora cuotas
Código · CSS 

Calculadora cuotas
JS 
no me gusta que el fondo sea negro

8:27 a.m.
¿Cómo prefieres que quede?

P: ¿Qué fondo quieres para la sección?
R: Crema claro (
#f5f0e8)

8:28 a.m.
Perfecto. Actualizo los tres archivos con fondo crema, ajustando todos los textos y bordes para que contrasten bien sobre claro.


Leer CSS actual
Leer CSS actual
La respuesta de Claude fue interrumpida.
actualiza solo el css

8:28 a.m.

Se ejecutaron 2 comandos, archivo leído
Se ejecutaron 2 comandos, archivo leído
CSS actualizado. Los cambios principales:

Sección: fondo 
#f5f0e8, texto 
#1a1a18
Columna derecha: fondo 
#ede7da (crema un tono más oscuro para mantener el contraste entre columnas)
Dorados: ligeramente más oscuros (
#a89070) para que se lean bien sobre crema, en vez del 
#c8b99a que estaba pensado para fondo negro
Todos los textos secundarios: opacidades sobre 
#1a1a18 en vez de sobre blanco
El HTML y el JS no cambian, solo el CSS.


Calculadora cuotas
Código · CSS 
listo, gracias

8:31 a.m.
Con gusto. Cualquier cosa que necesites ajustar del proyecto me avisas.






Claude es IA y puede cometer errores. Por favor, verifica nuevamente las respuestas.
Calculadora cuotas · CSS
/* ============================================================
   BERTOLLI PRO 900 — Calculadora de Cuotas — Estilos
   Añade este <link> en el <head> si aún no tienes las fuentes:
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
============================================================ */
 
/* ── Sección principal ── */
.seccion-calculadora {
  background: #f5f0e8;
  padding: 96px 48px;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a18;
  position: relative;
  overflow: hidden;
}
 
.seccion-calculadora::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c8b99a, transparent);
}
 
.contenedor-calculadora {
  max-width: 840px;
  margin: 0 auto;
}
 
/* ── Encabezado ── */
.encabezado-calculadora {
  text-align: center;
  margin-bottom: 56px;
}
 
.etiqueta-superior {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #a89070;
  margin: 0 0 16px;
}
 
.titulo-calculadora {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 500;
  color: #1a1a18;
  margin: 0 0 16px;
  line-height: 1.2;
}
 
.subtitulo-calculadora {
  font-size: 15px;
  color: rgba(26, 26, 24, 0.55);
  font-weight: 300;
  margin: 0;
  line-height: 1.6;
}
 
/* ── Cuerpo: grid dos columnas ── */
.cuerpo-calculadora {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background: rgba(168, 144, 112, 0.25);
  border: 1px solid rgba(168, 144, 112, 0.35);
}
 
/* ── Columna izquierda ── */
.columna-opciones {
  background: #f5f0e8;
  padding: 40px;
}
 
.etiqueta-campo {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(26, 26, 24, 0.45);
  margin: 0 0 8px;
}
 
.precio-equipo {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #a89070;
  margin: 0 0 36px;
}
 
.lista-opciones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}
 
/* ── Opción individual ── */
.opcion-cuota {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(168, 144, 112, 0.3);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: transparent;
}
 
.opcion-cuota:hover {
  border-color: rgba(168, 144, 112, 0.65);
  background: rgba(168, 144, 112, 0.07);
}
 
.opcion-cuota.activa {
  border-color: #a89070;
  background: rgba(168, 144, 112, 0.12);
}
 
.opcion-cuota input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid rgba(168, 144, 112, 0.5);
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;
}
 
.opcion-cuota input[type="radio"]:checked {
  border-color: #a89070;
}
 
.opcion-cuota input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #a89070;
}
 
.texto-opcion {
  flex: 1;
  font-size: 14px;
  color: #1a1a18;
  font-weight: 400;
}
 
.preview-opcion {
  font-size: 13px;
  color: rgba(26, 26, 24, 0.4);
  font-weight: 300;
}
 
.opcion-cuota.activa .preview-opcion {
  color: #a89070;
}
 
/* ── Columna derecha: resultado ── */
.columna-resultado {
  background: #ede7da;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
 
.etiqueta-resultado {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(26, 26, 24, 0.45);
  margin: 0 0 8px;
}
 
.descripcion-resultado {
  font-size: 13px;
  color: rgba(26, 26, 24, 0.5);
  margin: 0 0 12px;
  font-weight: 300;
}
 
.monto-resultado {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 500;
  color: #1a1a18;
  line-height: 1;
  margin: 0;
  letter-spacing: -0.02em;
}
 
.simbolo-moneda {
  font-size: 22px;
  font-weight: 400;
  color: #a89070;
  vertical-align: super;
  font-family: 'DM Sans', sans-serif;
}
 
.periodo-resultado {
  font-size: 13px;
  color: rgba(26, 26, 24, 0.45);
  margin: 12px 0 0;
  font-weight: 300;
}
 
.divisor-resultado {
  width: 40px;
  height: 1px;
  background: rgba(168, 144, 112, 0.4);
  margin: 24px auto;
}
 
.fila-total {
  font-size: 12px;
  color: rgba(26, 26, 24, 0.4);
  font-weight: 300;
}
 
.fila-total span {
  color: rgba(26, 26, 24, 0.6);
}
 
/* ── Nota legal ── */
.nota-legal {
  text-align: center;
  margin-top: 28px;
  font-size: 11px;
  color: rgba(26, 26, 24, 0.35);
  letter-spacing: 0.06em;
}
 
.nota-legal a {
  color: #a89070;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
 
.nota-legal a:hover {
  color: #8a7255;
  border-color: rgba(168, 144, 112, 0.5);
}
 
/* ── Responsive móvil ── */
@media (max-width: 640px) {
  .seccion-calculadora {
    padding: 64px 24px;
  }
 
  .cuerpo-calculadora {
    grid-template-columns: 1fr;
  }
 
  .columna-resultado {
    padding: 36px 24px;
    border-top: 1px solid rgba(168, 144, 112, 0.25);
  }
 
  .titulo-calculadora {
    font-size: 28px;
  }
 
  .monto-resultado {
    font-size: 44px;
  }
}
 
