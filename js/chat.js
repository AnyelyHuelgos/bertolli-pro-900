

const abrir = document.getElementById('chat-abrir');
const cerrar = document.getElementById('chat-cerrar');
const panel = document.getElementById('chat-panel');
const formularioChat = document.getElementById('chat-formulario');
const pregunta = document.getElementById('chat-pregunta');
const mensajes = document.getElementById('chat-mensajes');

abrir.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  abrir.setAttribute('aria-expanded', String(!panel.hidden));
  if (!panel.hidden) pregunta.focus();
});

cerrar.addEventListener('click', () => {
  panel.hidden = true;
  abrir.setAttribute('aria-expanded', 'false');
  abrir.focus();
});

function agregarMensaje(texto, tipo) {
  const burbuja = document.createElement('p');
  burbuja.className = `chat-burbuja ${tipo}`;
  burbuja.textContent = texto;
  mensajes.appendChild(burbuja);
  mensajes.scrollTop = mensajes.scrollHeight;
  return burbuja;
}

formularioChat.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const texto = pregunta.value.trim();
  if (!texto) return;

  agregarMensaje(texto, 'usuario');
  pregunta.value = '';
  pregunta.disabled = true;

  const boton = formularioChat.querySelector('button');
  boton.disabled = true;

  const espera = agregarMensaje('Escribiendo...', 'bot');

  try {
    const respuesta = await fetch('/api/agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: texto })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error('Error del asistente');
    }

    espera.textContent = datos.respuesta || 'No pude responder.';
  } catch {
    espera.textContent =
      'El asistente no está disponible en este momento.';
  } finally {
    pregunta.disabled = false;
    boton.disabled = false;
    pregunta.focus();
  }
});
