
const abrir = document.getElementById('chat-abrir');
const cerrar = document.getElementById('chat-cerrar');
const panel = document.getElementById('chat-panel');
const formularioChat = document.getElementById('chat-formulario');
const pregunta = document.getElementById('chat-pregunta');
const mensajes = document.getElementById('chat-mensajes');

// Preguntas rápidas
const sugerencias = document.getElementById('chat-sugerencias');
const botonesSugeridos = document.querySelectorAll('.chat-sugerencia');

let enviando = false;

// Abrir el chat
abrir.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  abrir.setAttribute('aria-expanded', String(!panel.hidden));

  if (!panel.hidden) pregunta.focus();
});

// Cerrar el chat
cerrar.addEventListener('click', () => {
  panel.hidden = true;
  abrir.setAttribute('aria-expanded', 'false');
  abrir.focus();
});

// Agregar mensajes de forma segura
function agregarMensaje(texto, tipo) {
  const burbuja = document.createElement('p');
  burbuja.className = `chat-burbuja ${tipo}`;
  burbuja.textContent = texto;

  mensajes.appendChild(burbuja);
  mensajes.scrollTop = mensajes.scrollHeight;

  return burbuja;
}

// Enviar preguntas al asistente
async function enviarMensaje(texto) {
  texto = texto.trim();

  if (!texto || enviando) return;

  enviando = true;

  agregarMensaje(texto, 'usuario');

  pregunta.value = '';
  pregunta.disabled = true;

  const botonEnviar = formularioChat.querySelector('button');
  botonEnviar.disabled = true;

  // Desactivar las preguntas rápidas durante el envío
  botonesSugeridos.forEach((boton) => {
    boton.disabled = true;
  });

  // Ocultar sugerencias después de elegir una pregunta
  if (sugerencias) {
    sugerencias.hidden = true;
  }

  const espera = agregarMensaje('Escribiendo...', 'bot');

  try {
    const respuesta = await fetch('/api/agente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mensaje: texto
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.error || 'Error del asistente'
      );
    }

    espera.textContent =
      datos.respuesta || 'No pude responder en este momento.';

  } catch (error) {
    espera.textContent =
      error.message === 'Failed to fetch'
        ? 'No se pudo conectar con el asistente. Intenta nuevamente.'
        : error.message || 'El asistente no está disponible.';

  } finally {
    enviando = false;

    pregunta.disabled = false;
    botonEnviar.disabled = false;

    botonesSugeridos.forEach((boton) => {
      boton.disabled = false;
    });

    pregunta.focus();
  }
}

// Enviar preguntas escritas
formularioChat.addEventListener('submit', (evento) => {
  evento.preventDefault();
  enviarMensaje(pregunta.value);
});

// Enviar preguntas rápidas con un clic
botonesSugeridos.forEach((boton) => {
  boton.addEventListener('click', () => {
    enviarMensaje(boton.textContent.trim());
  });
});
